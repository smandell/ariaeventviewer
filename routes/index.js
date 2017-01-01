var express = require('express');
var router = express.Router();
const util = require('util');
var xml4js = require('xml4js');

router.post('/', function(req, res, next) {

  var options = {};
  var parser = new xml4js.Parser(options);

/* 
  // Default is to not download schemas automatically, so we should add it manually 
  var schema = fs.readFileSync('schema.xsd', {encoding: 'utf-8'});
  parser.addSchema('http://www.w3.org/2001/XMLSchema', schema, function (err, importsAndIncludes) {
    // importsAndIncludes contains schemas to be added as well to satisfy all imports and includes found in schema.xsd 
    parser.parseString(xml, function (err, result) {
        console.log(util.inspect(result, false, null));
    });
});
*/
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
