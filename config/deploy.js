module.exports = function(deployTarget) { // eslint-disable-line no-undef
    const ENV = {
        build: {
            environment: deployTarget || 'development',
        },
        s3: {
            accessKeyId: process.env.AWS_KEY,
            bucket: process.env.S3_BUCKET_HOST,
            fileIgnorePattern: '**/*.map',
            region: 'us-west-2',
            secretAccessKey: process.env.AWS_SECRET,
        },
        's3-index': {
            accessKeyId: process.env.AWS_KEY,
            allowOverwrite: true,
            bucket: process.env.S3_BUCKET_HOST,
            region: 'us-west-2',
            secretAccessKey: process.env.AWS_SECRET,
        },
        'new-relic-sourcemap': {
            applicationId: process.env.NEW_RELIC_APP_ID,
            nrAdminKey: process.env.NEW_RELIC_ADMIN_KEY,
            prefix: process.env.ZYBOOKS_URL,
            sourceMapPattern: '**/!(ace|snippets|zipjs)/*.map',
        },
        gzip: {
            ignorePattern: '*.map',
        },
        // This is needed to upload the build key for our checksum to work.
        webhooks: {
            services: {
                zyserver2: {
                    url: function() {
                        return `${process.env.ZYSERVER2_API_HOST}build`;
                    },
                    body: function() {
                        return {
                            build_key: process.env.BUILDKEY,
                            secret: 'these-paws-uphold-the-laws',
                            app_name: 'learn',
                        };
                    },
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    critical: true,
                    willUpload: true,
                },
            },
        },
    };
    // This ensures the DR will also have the build key in the event of a cut over
    if (ENV.build.environment === 'production') {
        ENV.webhooks.services.zyserver2_dr = {
            url: function() {
                return `${process.env.ZYSERVER2_DR_API_HOST}build`;
            },
            body: function() {
                return {
                    build_key: process.env.BUILDKEY,
                    secret: 'these-paws-uphold-the-laws',
                    app_name: 'learn',
                };
            },
            headers: {
                'Content-Type': 'application/json',
            },
            critical: true,
            willUpload: true,
        };
    }
    return ENV;
};