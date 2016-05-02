var express =     require('express');
var session =       require('client-sessions');
var router =      express.Router();

/* Handle logout request. Redirect to login page */
router.get('/', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;