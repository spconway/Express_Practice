var express =     require('express');
var log =         require('../logger');
var dbActions =   require('../dbActions');
var router =      express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  if(req.session && req.session.user){
    res.redirect('/home');
  }else{
    res.render('index', {
      title: 'Express' ,
      developer: 'Stephen Conway',
      message: ''
    });
  }

});

/* POST login. */
router.post('/', function(req, res){
  //wrap everything below in a find user call
  dbActions.getUser(req.body.login, function(err, user){
    if(!user){
      // render a user not found page?
      return res.render('index', {
        title: 'Express' ,
        developer: 'Stephen Conway',
        message: 'User not found'
      });
    }else{
      user.validatePassword(user.user_name, req.body.password, function(bool){
        if(bool){
          req.user = user;
          delete req.user.password;
          req.session.user = user;
          res.locals.user = user;
          res.redirect('/home');
        }else{
          return res.render('index', {
            title: 'Express' ,
            developer: 'Stephen Conway',
            message: 'Username and password both required'
          });
        }
      });
    }
  });
});

module.exports = router;
