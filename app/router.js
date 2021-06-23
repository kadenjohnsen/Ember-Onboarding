import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
});

Router.map(function() {
    this.route("sign-in");
    this.route("library");
});

export default Router;