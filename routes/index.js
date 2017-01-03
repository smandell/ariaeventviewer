var express = require('express');
var router = express.Router();
var fs = require('fs');
const util = require('util');
//var xml4js = require('xml4js');
var parseString = require('xml2js').parseString;

router.post('/acctandmasterplan', function(req, res, next) {

  console.log("headers!");
  console.log(req.headers);
  
  console.log("jsonified xml");
  var parsedXML = '';
  parseString(req.rawBody, {trim: true, normalize: true, explicitArray: false}, function (err, result) {
    parsedXML = result;
  });
  console.log(util.inspect(parsedXML, false, null));

  /*
  console.log('account number:' + parsedXML.apf2doc.acct_data.acct_no);
  console.log('plan instance no:' + parsedXML.apf2doc.master_plan_instance_data.master_plan_instance.client_master_plan_instance_id);
  console.log('plan instance name:' + parsedXML.apf2doc.master_plan_instance_data.master_plan_instance.plan_name);
  

  res.json({
    "acct_no": parsedXML.apf2doc.acct_data.acct_no,
    "plan_instance_no": parsedXML.apf2doc.master_plan_instance_data.master_plan_instance.client_master_plan_instance_id,
    "plan_instance_name": parsedXML.apf2doc.master_plan_instance_data.master_plan_instance.plan_name,
    "rawBody": req.rawBody
 });
 */

  //console.log(util.inspect(req.body, false, null));
  //console.log("the inspected raw body:");
  //console.log(util.inspect(req.rawBody, false, null));
  
  res.send("SUCCESS");
});

router.post('/acctandmasterplanschema', function(req, res, next) {

  var options = {};
  var parser = new xml4js.Parser(options);


  // Default is to not download schemas automatically, so we should add it manually 
  var schema = fs.readFileSync('schema.xsd', {encoding: 'utf-8'});
  
    console.log('just schema');
    console.log(schema);

  parser.addSchema('http://www.w3.org/2001/XMLSchema', schema, function (err, importsAndIncludes) {
    // importsAndIncludes contains schemas to be added as well to satisfy all imports and includes found in schema.xsd 

    parser.parseString(req.rawBody, function (err, result) {
        console.log('the parsed xml that should be JS!');
        console.log(util.inspect(result, false, null));
    });
  });
  console.log("headers!");
  console.log(req.headers);
  console.log('cookies!');
  console.log(req.cookies);
  console.log(req.signedCookies);
  console.log(req.get('Content-Type'));
  console.log("jsonified xml");
  console.log(util.inspect(req.body, false, null));
  console.log("the inspected raw body:");
  console.log(util.inspect(req.rawBody, false, null));
  res.send("SUCCESS");
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
