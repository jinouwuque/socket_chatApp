var express = require('express');
var router = express.Router();

/* GET chat page. */
router.get('/', function(req, res, next) {
    res.render('chat');
});

module.exports = router;
