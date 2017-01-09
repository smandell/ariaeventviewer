var express = require('express');
var router = express.Router();
var fs = require('fs');
const util = require('util');
//var xml4js = require('xml4js');
var parseString = require('xml2js').parseString;
var pd = require('pretty-data').pd;

router.post('/acctandmasterplan', function(req, res, next) {

  // console.log("headers!");
  // console.log(req.headers);
  
  // console.log("jsonified xml");
  var parsedXML = '';
  parseString(req.rawBody, {trim: true, normalize: true, explicitArray: false}, function (err, result) {
    parsedXML = result;
  });
  // console.log(util.inspect(parsedXML, false, null));

  // console.log('account number:' + parsedXML.apf2doc.acct_data.acct_no);
  // console.log('plan instance no:' + parsedXML.apf2doc.master_plan_instance_data.master_plan_instance.client_master_plan_instance_id);
  // console.log('plan instance name:' + parsedXML.apf2doc.master_plan_instance_data.master_plan_instance.plan_name);
  // console.log('event: ' + parsedXML.apf2doc.event_data.event.event_id + ' ' + parsedXML.apf2doc.event_data.event.event_label);
  //console.log(pd.xml(req.rawBody));
  
  var socketJSONPayload = {};
  socketJSONPayload.transaction_id = parsedXML.apf2doc.request.transaction_id;
  socketJSONPayload.event = parsedXML.apf2doc.event_data.event.event_id + ' ' + parsedXML.apf2doc.event_data.event.event_label;
  socketJSONPayload.rawBody = pd.xml(req.rawBody);

  if (parsedXML.apf2doc.acct_data.acct_no != null) {
    socketJSONPayload.acct_no = parsedXML.apf2doc.acct_data.acct_no;
  }
  if (parsedXML.apf2doc.master_plan_instance_data.master_plan_instance.client_master_plan_instance_id != null) {
    socketJSONPayload.plan_instance_no = parsedXML.apf2doc.master_plan_instance_data.master_plan_instance.client_master_plan_instance_id;
  }
  if (parsedXML.apf2doc.master_plan_instance_data.master_plan_instance.plan_name != null) {
    socketJSONPayload.plan_instance_name = parsedXML.apf2doc.master_plan_instance_data.master_plan_instance.plan_name;
  }


  socketList.forEach(function(socket) {
      socket.emit('acctandmasterplan', socketJSONPayload);
        
        // "transaction_id": parsedXML.apf2doc.request.transaction_id,
        // "event": parsedXML.apf2doc.event_data.event.event_id + ' ' + parsedXML.apf2doc.event_data.event.event_label,
        // "acct_no": parsedXML.apf2doc.acct_data.acct_no,
        // "plan_instance_no": parsedXML.apf2doc.master_plan_instance_data.master_plan_instance.client_master_plan_instance_id,
        // "plan_instance_name": parsedXML.apf2doc.master_plan_instance_data.master_plan_instance.plan_name,
        // "rawBody": pd.xml(req.rawBody)


      console.log('fired off message to socket');
  });
  
  res.send("SUCCESS");
});

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index');
  res.sendFile(__dirname + '/index.html');
});

module.exports = router;
