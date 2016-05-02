/**
*
* @param req
* @param res
* @param next
*/
function requireLogin(req, res, next) {
  if (!req.user) {
    res.redirect('/');
  } else {
    next();
  }
}

module.exports = requireLogin;