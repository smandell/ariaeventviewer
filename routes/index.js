var express = require('express');
var router = express.Router();
const util = require('util');
var xmlparser = require('express-xml-bodyparser');

router.post('/', xmlparser({trim: false, explicitArray: false}), function(req, res, next) {
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
