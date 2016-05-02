var db = require('mongoose');
var log =  require('./logger');

var url = 'mongodb://localhost/express_practice_mongodb_db';

// connect to database and log success/failure to logs
db.connect(url, function(err, db){
    if(err){
        log.debug('Unable to connect to the mongoDB server. Error: ', err);
    } else {
        //HURRAY!! We are connected. :)
        log.info('Connection established to: ', url);

        // do some work here with the database.

        //Close connection
        //db.close();
    }
});



module.exports = db;