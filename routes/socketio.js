/**
 *
 * @param io
 * @returns {*}
 *
 * By exporting a function which exceptions an io
 * object I can inject socket io into whatever route
 * I want.
 */
module.exports = function(io){
    var express =     require('express');
    var router =      express.Router();
    var log =         require('../logger');
    var requireLogin =  require('../requireLogin');

    /* Handle logout request. Redirect to login page */
    router.get('/', requireLogin, function(req, res) {
        res.render('socketio', {
            title: 'Socket.IO Stuff'
        });
    });

    // io handler stuff
    io.on('connection', function(socket){
        console.log('Someone connected! ');
    });

    // return router for export
    return router;
};