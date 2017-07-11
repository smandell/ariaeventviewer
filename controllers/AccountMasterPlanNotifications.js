var pd = require('pretty-data').pd;
var Prism = require('prismjs');
var parseXML = require('./Utilities').parseXML;

exports.handleEventPayload = function(req){
  
  const parsedXML = parseXML(req);
  const socketJSONPayload = getStandardPayloadContent(parsedXML, req);            

  socketJSONPayload.class_name = parsedXML.apf2doc.request.class_name;
  socketJSONPayload.eventType = {instance:true};
  socketJSONPayload.acct_no = parsedXML.apf2doc.acct_data.acct_no;
  socketJSONPayload.client_no = parsedXML.apf2doc.acct_data.client_no;  

  if ('master_plan_instance_data' in parsedXML.apf2doc){
    socketJSONPayload.planData = [];
    const masterPlanInstances = parsedXML.apf2doc.master_plan_instance_data.master_plan_instance;
    if (Array.isArray(masterPlanInstances)) {
        let iterator;
        for (iterator = 0; iterator < masterPlanInstances.length; iterator++) {
        socketJSONPayload.planData[iterator] = parsedXML.apf2doc.master_plan_instance_data.master_plan_instance[iterator].master_plan_instance_no + ' ' + parsedXML.apf2doc.master_plan_instance_data.master_plan_instance[iterator].plan_name;
        }
    } else {
        socketJSONPayload.planData[0] = parsedXML.apf2doc.master_plan_instance_data.master_plan_instance.master_plan_instance_no + ' ' + parsedXML.apf2doc.master_plan_instance_data.master_plan_instance.plan_name;  
    }
  }  
}