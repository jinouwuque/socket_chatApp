var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('index');
});
router.post('/adduser', function(req, res, next) {
    res.redirect('/chat');
});


module.exports = router;
