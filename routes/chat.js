var express = require('express');
var router = express.Router();
var sio = require('../middlewares/socket_app');
/* GET chat page. */
router.get('/', function(req, res, next) {
    res.render('chat', {
        users: sio.onlineusers
    });
});

module.exports = router;
