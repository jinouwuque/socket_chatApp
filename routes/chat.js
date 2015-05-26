var express = require('express');
var router = express.Router();
var sio = require('../middlewares/online_status');
/* GET chat page. */
router.get('/', function(req, res, next) {
    res.render('chat', {
        users: sio.onlineusers
    });
});

module.exports = router;
