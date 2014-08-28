var logger = null;

if (!logger) {
    logger = require('log4js').getLogger('test-device-agent');
}

module.exports = logger;