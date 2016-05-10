/**
 *
 * @param io
 * @returns {*}
 *
 * By exporting a function which exceptions an io
 * object I can inject socket io into whatever route
 * I want.
 */

// globals for caching information when users navigate
// away from the chat page but try to come back
var people = {};
var rooms = {};
var sockets = [];
var chatHistory = {};

module.exports = function(io){
    var express =     require('express');
    var router =      express.Router();
    var requireLogin =  require('../requireLogin');
    // require room create new room objects
    var room = require('../room');
    var user;

    /* Handle logout request. Redirect to login page */
    router.get('/', requireLogin, function(req, res) {
        // assign user when accessing chat page
        user = req.session.user;
        user.password = null;
        // add user to people. Set to user name for now
        people[user.user_name] = user.user_name;
        res.render('socketio', {
            title: 'Socket.IO Stuff',
            user: user
        });
    });

    io.on('connection', function (socket) {
        //socket.emit('user joined', {message: (user.user_name + ' has joined.')});

        socket.on('global', function (data) {
            io.emit('global', {message: data.message, user: data.user});
        });
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });
    });

    // return router for export
    return router;
};