var express = require('express');
var router = express.Router();
var parseString = require('xml2js').parseString;

router.post('/', function(req, res, next) {
  var xml = req.body;
  parseString(xml, function(err, result){
    console.log(result);
  });

  res.send("SUCCESS");
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
