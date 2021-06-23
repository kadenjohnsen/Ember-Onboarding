module.exports = function(environment) {
    const ENV = {
        environment,
        locationType: [ 'deploy' ].includes(process.argv[2]) && ![ 'production', 'content-tools-qa', 'access-dev' ].includes(environment) ?
            'hash' : // Hash needed for revision urls
            'auto',
        modulePrefix: 'onboarding',
        rootURL: [ 'deploy' ].includes(process.argv[2]) && ![ 'production', 'content-tools-qa', 'access-dev' ].includes(environment) ?
            process.env.ZYBOOKS_URL : // Explicit url needed for router to resolve revision urls
            '/',

        EmberENV: {
            FEATURES: {

                // Here you can enable experimental features on an ember canary build
                // e.g. 'with-controller': true
            },
        },

        APP: {
            ACCESS_DEV: process.env.ACCESS_DEV === 'true',
            ADMIN_URL: process.env.ADMIN_URL,
            ANALYTICS_URL: process.env.ANALYTICS_URL,
            API_HOST: process.env.API_HOST,
            AUTHOR_URL: process.env.AUTHOR_URL,
            AUTHORS_ONLY: process.env.AUTHORS_ONLY === 'true',
            BUILDKEY: process.env.BUILDKEY || '',
            CLOUDSEARCH_ENDPOINT: process.env.CLOUDSEARCH_ENDPOINT,
            DISABLE_EVENTS: process.env.DISABLE_EVENTS === 'true',
            ENABLE_ZYANALYTICS_WEB: process.env.ENABLE_ZYANALYTICS_WEB,
            EVENTS_API_HOST: process.env.EVENTS_API_HOST,
            EVENTS_API_TARGET: process.env.EVENTS_API_TARGET,
            ROUTE_IF_ALREADY_AUTHENTICATED: process.env.ROUTE_IF_ALREADY_AUTHENTICATED,
            SALES_URL: process.env.SALES_URL,
            SESSION_KEY_SUFFIX: '5', // Used to build the key that stores user session credentials.
            TERMINAL_SOCKET_URL: process.env.TERMINAL_SOCKET_URL,
            WEBINAR_URL: process.env.WEBINAR_URL,
            WHAT_IS_ZYBOOK_VIDEO_URL: process.env.WHAT_IS_ZYBOOK_VIDEO_URL,
            ZYBOOKS_URL: process.env.ZYBOOKS_URL,
            ZYSERVER2_API_HOST: process.env.ZYSERVER2_API_HOST,
            ZYSERVER2_DR_API_HOST: process.env.ZYSERVER2_DR_API_HOST,
            ZYEXAM_SERVER_API_HOST: process.env.ZYEXAM_SERVER_API_HOST,
        },

        /* eslint-disable quotes */
        contentSecurityPolicy: {
            'connect-src': "'self' www.google-analytics.com https://fonts.googleapis.com https://*.nr-data.net",
            'default-src': "'none'",
            'font-src': "'self' fonts.gstatic.com ",
            'img-src': "'self' http://upload.wikimedia.org.com/ https://*.nr-data.net",
            'media-src': "'self'",
            'script-src': "'self' 'unsafe-inline' 'unsafe-eval' www.google-analytics.com http://*.newrelic.com https://*.nr-data.net http://*.nr-data.net",
            'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com", // Allow inline styles and loaded CSS from https://fonts.googleapis.com
        },
        /* eslint-enable quotes */

        moment: {
            includeTimezone: 'subset', // 'subset' specifies all years 2012-2022
        },
    };

    if (environment === 'test') {
        // Testem prefers this...
        ENV.locationType = 'none';
        ENV.rootURL = '/';

        // Keep test console output quieter
        ENV.APP.LOG_ACTIVE_GENERATION = false;
        ENV.APP.LOG_VIEW_LOOKUPS = false;

        // Comment this out to manually use test env; don't forget to undo or this will break cci.
        ENV.APP.rootElement = '#ember-testing';

        // Fixes the `You cannot use the same root element (DIV) multiple times in an Ember Application`
        ENV.APP.autoboot = false;
    }

    ENV.contentSecurityPolicy['connect-src'] += ` ${ENV.APP.API_HOST}`;
    return ENV;
};