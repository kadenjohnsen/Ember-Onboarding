import { Promise } from 'rsvp';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Route.extend(ApplicationRouteMixin, {

    // Session for current user
    session: service(),

    // Default route after login
    routeAfterAuthentication: 'library',

    // Add to title of library page
    title: 'zyBooks',

    /**
        The query parameters for this route. The modal_name query parameter displays the specified modal.
        Setting replace prevents an additional item from being added to the browser's history when the controller changes
        the modal_name query parameter. See the following for more information:
        https://guides.emberjs.com/v2.11.0/routing/query-params/#toc_update-url-with-code-replacestate-code-instead
        @property queryParams
        @type {Object}
        @readOnly
    */
    queryParams: {
        modal_name: {
            replace: true,
        },
        refresh_token: {
            replace: true,
        },
    },

    /**
        Flag set when app is kick started with a refresh token.
        @property authenticatingViaRefreshToken
        @type {Boolean}
        @default false
    */
    authenticatingViaRefreshToken: false,

    /**
        Ember overridden method to call before model. In this case, we are looking for a passed in refresh token
        and logging them into application.
        @method beforeModel
        @param {Transition} transition Ember transition object.
        @return {RSVP.Promise}
    */
    beforeModel: function(transition) { // eslint-disable-line consistent-return
        this._super(...arguments);
        const refreshToken = transition.to.queryParams.refresh_token;

        if (refreshToken) {
            this.set('authenticatingViaRefreshToken', true);

            return new Promise((resolve, reject) => {
                this.get('session').authenticate('authenticator:refresh-token', refreshToken)
                    .then(resolve,
                            error => {
                                transition.abort();
                                this.transitionTo('sign-in');
                                reject(error);
                            }).finally(() => {
                        this.set('authenticatingViaRefreshToken', false);
                    });
            }, 'application-route:authenticator:refresh-token');
        }
    },

    /**
        Ember-simple-auth overridden method for authentication to override the use of the routeAfterAuthentication
        when using the refresh token.
        @method sessionAuthenticated
        @return {void}
    */
    sessionAuthenticated: function() {
        if (!this.get('authenticatingViaRefreshToken')) {
            this._super(...arguments);
        }

        this.set('authenticatingViaRefreshToken', false);
    },

    actions: {

        /**
            Action fired to show a routable modal by setting the associated query parameter. Controllers that need to show a routable
            modal should alias the application controller's modal_name property and use it as a query parameter.
            @method showRoutableModal
            @param {String} modalName The name of the modal to show.
            @return {void}
        */
        showRoutableModal: function(modalName) {
            this.controller.set('modal_name', modalName);
        },

        /**
            Ember action fired after leaving the route. Resets the configure query parameter.
            @method willTransition
            @return {void}
        */
        willTransition: function() {
            this.controller.set('modal_name', null);
        },
    },
});