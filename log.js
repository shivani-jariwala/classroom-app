var bunyan = require('bunyan');

var log = bunyan.createLogger({
    name: 'toddle',
    level: 'info',
    streams: [
        {
            level: 'debug',
            stream: process.stdout,
        },
    ],
    serializers: {
        req: bunyan.stdSerializers.req,
        err: bunyan.stdSerializers.err,
    },
});

module.exports = log;
