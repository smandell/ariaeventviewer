var parseString = require('xml2js').parseString;
var pd = require('pretty-data').pd;
var Prism = require('prismjs');

exports.getStandardPayloadContent = function (parsedXML, req){
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
exports.parseXML = function (req){
  var parsedXML = "";
  
  parseString(req.rawBody, {trim: true, normalize: true, explicitArray: false}, function (err, result) {
    parsedXML = result;
  });

  return parsedXML;
};