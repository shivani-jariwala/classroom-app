const nconf = require('nconf');
const path = require('path');

exports.initializeConfig = () => {
    // Initialize the default config first
    nconf.file('default', { file: path.join(__dirname, './default.json') });

    // Initialize config file based on environment
    // Configs can further be defined on an instance level to override environment based configs
    // For example, if we have two stage configurations which would run with different base urls
    // Your staging config file could define the base url first
    // Your instance name could override the base url again
    // so that specific instances of stage use a different base URL from the default
    // switch (process.env.NODE_ENV) {
        switch ('shivani') {
        case 'production':
            return nconf.file('environment', {
                file: path.join(__dirname, './production.json'),
            });
        // break;
        default:
            return nconf.file('environment', {
                file: path.join(__dirname, './staging.json'),
            });
        // break;
    }
};