var express = require('express');
var router = express.Router();
var fs = require('fs');
const util = require('util');
//var xml4js = require('xml4js');
var parseString = require('xml2js').parseString;
var pd = require('pretty-data').pd;
var Prism = require('prismjs');

/* rename this to be what the event class is called */
router.post('/eventendpoint', function(req, res, next) {

  var parsedXML = parseXML(req);
  var socketJSONPayload = getStandardPayloadContent(parsedXML, req);

  //Aria is not consistent with where it places the event type in the XML payload across
  //event classes. 
  if ('class_name' in parsedXML.apf2doc.request) {
    socketJSONPayload.class_name = parsedXML.apf2doc.request.class_name;
  } else if ('class' in parsedXML.apf2doc.request) {
    socketJSONPayload.class_name = parsedXML.apf2doc.request.class;
  }

  var eventType = {
    instance: false,
    order: false,
    financial: false,
    notification: false
  };

  socketJSONPayload.eventType = eventType;

  switch (socketJSONPayload.class_name) {
    case "A":
      socketJSONPayload.acct_no = parsedXML.apf2doc.acct_data.acct_no;
      socketJSONPayload.client_no = parsedXML.apf2doc.acct_data.client_no;
      socketJSONPayload.eventType.instance = true;

      //check if multiple plans are being passed in this single payload
      
      if ('master_plan_instance_data' in parsedXML.apf2doc){
        socketJSONPayload.planData = [];
        var masterPlanInstances = parsedXML.apf2doc.master_plan_instance_data.master_plan_instance;
        if (Array.isArray(masterPlanInstances)) {
          var iterator;
          for (iterator = 0; iterator < masterPlanInstances.length; iterator++) {
            socketJSONPayload.planData[iterator] = parsedXML.apf2doc.master_plan_instance_data.master_plan_instance[iterator].master_plan_instance_no + ' ' + parsedXML.apf2doc.master_plan_instance_data.master_plan_instance[iterator].plan_name;
          }
        } else {
          socketJSONPayload.planData[0] = parsedXML.apf2doc.master_plan_instance_data.master_plan_instance.master_plan_instance_no + ' ' + parsedXML.apf2doc.master_plan_instance_data.master_plan_instance.plan_name;  
        }
      }
           

      break;
    case "O":
      socketJSONPayload.eventType.order = true;
      break;
    //even though other Aria events call this event 'F', the Finanacial Transaction event calls itself 'T'
    case "T":
      //extract account number
      socketJSONPayload.acct_no = parsedXML.apf2doc.account.acct_no;
      socketJSONPayload.client_no = parsedXML.apf2doc.account.client_no;
      socketJSONPayload.eventType.financial = true;

      //extract invoice total amount
      if ('financial_transaction_groups' in parsedXML.apf2doc) {
        socketJSONPayload.total_amount = parsedXML.apf2doc.financial_transaction_groups.financial_transaction_group.total_amount;
      }
      
      break;
    case "N":
      //extract account number
      socketJSONPayload.acct_no = parsedXML.apf2doc.account.acct_no;
      socketJSONPayload.client_no = parsedXML.apf2doc.account.client_no;

      //extract message details 
      socketJSONPayload.messageSubject = parsedXML.apf2doc.message.msg_subject;
      socketJSONPayload.messageRecipient = parsedXML.apf2doc.message.msg_recipient_email_address;

      socketJSONPayload.eventType.notification = true;
      break;
  }

  send(socketJSONPayload, res);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index');
  res.setHeader('Access-Control-Allow-Origin','*');
  res.sendFile(__dirname + '/index.html');
});

function getStandardPayloadContent(parsedXML, req){
  var socketJSONPayload = {};
  socketJSONPayload.transaction_id = parsedXML.apf2doc.request.transaction_id;

  //check if multiple events are being passed in this single payload
  socketJSONPayload.event = [];
  var payloadEventNameData = parsedXML.apf2doc.event_data.event;
  if (Array.isArray(payloadEventNameData)) {
    var iterator;
    for (iterator = 0; iterator < payloadEventNameData.length; iterator++) {
      socketJSONPayload.event[iterator] = parsedXML.apf2doc.event_data.event[iterator].event_id + ' ' + parsedXML.apf2doc.event_data.event[iterator].event_label;
    }
  } else {
    socketJSONPayload.event[0] = parsedXML.apf2doc.event_data.event.event_id + ' ' + parsedXML.apf2doc.event_data.event.event_label;  
  }

  var html = Prism.highlight(pd.xml(req.rawBody), Prism.languages.xml);
  socketJSONPayload.rawBody = html;

  //get current server time
  socketJSONPayload.eventTime = new Date().toLocaleTimeString();
  
  return socketJSONPayload;
};

//parses out the XML from the event payload and turns it into a JSON object 
function parseXML(req){
  var parsedXML = "";
  
  parseString(req.rawBody, {trim: true, normalize: true, explicitArray: false}, function (err, result) {
    parsedXML = result;
  });

  return parsedXML;
};

/* send the JSON payload to the clients and send a response to Aria */
function send(socketJSONPayload, res) {

  var clientNumber = socketJSONPayload.client_no;
  if (clientNumber in socketList) {
    socketList[clientNumber].forEach(function(socket) {
        socket.emit('eventPayload', socketJSONPayload);
        console.log('fired off message to socket');
    });
  };
  
  res.send("SUCCESS");
};


module.exports = router;
