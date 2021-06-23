import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

/**
    Authenticated route to use across our applications.
    @class AuthenticatedRoute
    @extends {EmberRoute}
*/
export default class AuthenticatedRoute extends Route {
    // @property {Session} session Reference to the session service.
    @service session;

    /**
        Ember overridden method to call before model. In this case, we are looking for a passed in refresh token
        and logging them into application. This ensures that the user is authenticated before they get access to a specific
        route. If the user is not authenticated, we will redirect them to the signin route to sign in.
        @method beforeModel
        @param {Transition} transition Ember transition object.
        @return {RSVP.Promise}
    */
    beforeModel(transition) {
        this.session.requireAuthentication(transition, 'sign-in');
    }
}