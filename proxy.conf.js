const PROXY_CONFIG = [
    {
        context:['/api'],
        target: 'https://papiro-spring-api.herokuapp.com/',
        secure:false,
        logLevel : 'debug'
    }
];

module.exports = PROXY_CONFIG;