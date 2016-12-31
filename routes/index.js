var express = require('express');
var router = express.Router();

router.post('/', xmlparser(), function(req, res, next) {
  console.log(req.body);
  res.send("SUCCESS");
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
