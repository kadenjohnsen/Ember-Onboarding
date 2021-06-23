module.exports = function(env) {
    let path = `.env.${env}`;

    // For `ember deploy` commands, env will always be development.
    // So to get the correct environment, parse the deploy target out of the command.
    // We'll have to update this if the deploy target and build environment are not tied together.
    if (process.argv[2] === 'deploy') {
        path = `.env.${process.argv[3]}`;
    }

    return {
        clientAllowedKeys: [ ],
        path,
    };
};