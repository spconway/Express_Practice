var express =       require('express');
var dbActions =     require('../dbActions');
var log =           require('../logger');
var router =        express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('register', {
        title: 'Register',
        message: ''
    });
});

/* POST */
router.post('/', function(req, res, next){
    newUser(req, function(user){
        req.user = user;
        delete req.user.password;
        req.session.user = user;
        res.locals.user = user;
        res.redirect('/home');
    });
});

/**
 *
 * @param req
 * @param callback
 */
function newUser(req, callback){
    var body = req.body;

    var user = {
        first_name: body.first_name,
        last_name: body.last_name,
        user_name: body.user_name,
        email_addr: body.email_addr || null,
        password: body.password
    };

    dbActions.setUser(user, function(err, user){
        if (!err) {
            log.info('Successfully registered user');
            return callback(user);
        }

        log.info('Error registering user: ', err);
    });
}

module.exports = router;
