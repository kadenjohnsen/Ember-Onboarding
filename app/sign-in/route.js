import UnauthenticatedRoute from 'zycommon-web/unauthenticated/route';
import { getOwner } from '@ember/application';
import { set } from '@ember/object';

/**
    Signin route for zybooks-web app.
    @class SigninRoute
    @extends {UnauthenticatedRoute}
*/
export default class SigninRoute extends UnauthenticatedRoute {
    // @property {String} title - Title of route used to show in tab.
    title = 'Sign in';

    // @property {String} routeIfAlreadyAuthenticated - The route to transition to after successful authentication.
    routeIfAlreadyAuthenticated = 'library';

    /**
        Constructor method for this component.
        @method constructor
        @return {void}
    */
    constructor() {
        super(...arguments);

        const environment = getOwner(this).resolveRegistration('config:environment');
        set(this, 'routeIfAlreadyAuthenticated', environment.APP.ROUTE_IF_ALREADY_AUTHENTICATED);
    }
}
