var express = require('express');
var router = express.Router();
const util = require('util');

router.post('/', function(req, res, next) {

  console.log(util.inspect(req.body, false, null));
  res.send("SUCCESS");
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
