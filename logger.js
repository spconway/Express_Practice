var winston = require('winston');
winston.emitErrs = true;

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            filename: './logs/all-logs.log',
            timestamp: function(){
                return Date();
            },
            level: 'debug',
            handleExceptions: true,
            json: true,
            colorize: true,
            maxsize: 5242880,
            maxFiles: 5
        }),
        new winston.transports.Console({
            timestamp: function(){
                return Date();
            },
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

module.exports = logger;
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};