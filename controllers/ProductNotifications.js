var pd = require('pretty-data').pd;
var Prism = require('prismjs');
var parseXML = require('./Utilities').parseXML;

exports.handleEventPayload = function(req){
  
  const socketJSONPayload = {};

  const parsedXML = parseXML(req);
  const html = Prism.highlight(pd.xml(req.rawBody), Prism.languages.xml);
  socketJSONPayload.rawBody = html;

  //get current server time
  socketJSONPayload.eventTime = new Date().toLocaleTimeString(); 
  
  socketJSONPayload.eventType = {
    product: true
  };

  socketJSONPayload.objectType = parsedXML.apf2doc.object_category;

  //Action
  switch (parsedXML.apf2doc.object_action){
    case 'A':
      socketJSONPayload.objectAction = "Add";
      break;
    case 'M':
      socketJSONPayload.objectAction = "Modify";
      break;
    case 'D':
      socketJSONPayload.objectAction = "Delete";
      break;          
    }

    //Event Numbers
    const payloadEventNumbers = parsedXML.apf2doc.event_data;

    if (Array.isArray(payloadEventNumbers)){
      socketJSONPayload.events = payloadEventNumbers.map(event => {
        return event_no;
      })
    } else {
      socketJSONPayload.events = [];
      socketJSONPayload.events[0] = payloadEventNumbers.event_no;
    }

    //Product Number
    socketJSONPayload.productNumber = parsedXML.apf2doc.object_fields.object_no;

    //Product Client Defined ID
    socketJSONPayload.productClientId = parsedXML.apf2doc.object_fields.object_client_def_id;

    //Product Status
    socketJSONPayload.productStatus = parsedXML.apf2doc.object_fields.object_status;

    //Field Name/Value Pairs
    const rawProductFieldNameValues = parsedXML.apf2doc.object_fields.product_fields;
    const productFieldValues = [];

    let iterator = 0;
    for (iterator; iterator < rawProductFieldNameValues.field_name.length; iterator++){
      productFieldValues.push(
        {
          fieldName: rawProductFieldNameValues.field_name[iterator],
          fieldValue: rawProductFieldNameValues.value_text[iterator]
        }
      )
    }
    socketJSONPayload.fieldNameValues = productFieldValues;

    return socketJSONPayload;
}