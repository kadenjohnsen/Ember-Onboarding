import { computed, set, setProperties } from '@ember/object';
import { not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import Controller, { inject as controller } from '@ember/controller';
import { loginStateKey, loginStateNamespace } from 'zycommon-web/utils/login-state-constants';
import { task } from 'ember-concurrency';

/**
    Signin controller for all applications.
    @class SigninController
    @extends {EmberController}
*/
export default class SigninController extends Controller {
    // @property {Service} session - The ember-simple-auth sessions.
    @service session;

    // @property {Service} localStore - The service to access the localStorage.
    @service localStore;

    // @property {Boolean} showResetPasswordMessage - Boolean indicating the user just reset their password and should be shown the confirmation message.
    showResetPasswordMessage = false;

    // @property {String} errorMessage - Set to true to render an error message on screen.
    errorMessage = null;

    // @property {String} email - Email of the user attempting to sign in.
    email = null;

    // @property {String} password - Password of the user attempting to sign in.
    password = null;

    // @property {Boolean} forcedSignOut - True if the user was signed out due to an update to the client.
    forcedSignOut = false;

    // @property {String} appName - The name of our application.
    appName = 'onboarding';

    // @property {Boolean} localStorageDisabled - A computed property that determines if localStore or Cookies are allowed
    @not('localStore._isLocalStorageNameSupported') localStorageDisabled;

    // @property {ApplicationController} appController - Reference to app controller.
    @controller('application') appController;

    /**
        @property {String} transitionModal - The modal query param that the user is attempting to transition to. If not null, will be stored
        after entering the route and then applied to the app controller when signed in. Ember simple auth doesn't persist query params and
        add them back to the url after a successful transition sign in, so we have to handle this manually.
    */
    transitionModal = null;

    /**
        Constructor method for this component.
        @method constructor
        @return {void}
    */
    constructor() {
        super(...arguments);

        const environment = getOwner(this).resolveRegistration('config:environment');
        setProperties(this, {
            forcedSignOut: this.localStore.getValue(loginStateNamespace, loginStateKey), // Used to drive the forced sign out state message.
            appName: environment.modulePrefix,
        });
    }

    /**
        Computed property to display a message to the user that they need to sign in before accessing an authenticated route.
        @method attemptedTransitionMessage
        @param {Transition} session.attemptedTransition The transition the user is attempting to access an authenticated route.
        @return {String}
    */
    @computed('session.attemptedTransition.{intent.url,params.zybook.zybook_code,routeInfos.1.params.zybook_code,to.parent.params.zybook_code,to.queryParams.modal_name}')
    get attemptedTransitionMessage() {
        let intendedURL = this.session.attemptedTransition.intent.url || '';

        // Cleanup https://learn.zybooks.com/ into learn.zybooks.com
        const environment = getOwner(this).resolveRegistration('config:environment');
        const AppURL = environment.APP.APP_URL?.replace('https://', '')?.replace('/', '');

        // Store any modal names in the attempted transition
        if (this.session.attemptedTransition.to.queryParams.modal_name) {
            set(this, 'transitionModal', this.session.attemptedTransition.to.queryParams.modal_name); // eslint-disable-line ember/no-side-effects
            set(this, 'appController.modal_name', null); // eslint-disable-line ember/no-side-effects
        }

        // Check if /zybook/ route.
        if (intendedURL.includes('/zybook')) {
            intendedURL = 'zybook/';
        }

        let signinMessage = 'You must sign in to ';

        switch (intendedURL) {
            case '/library':
                signinMessage += 'view your zyBooks library.';
                break;
            case 'zybook/':
                signinMessage += `access your zyBook: ${this.session.attemptedTransition.routeInfos[1].params.zybook_code}`;
                break;
            default:
                signinMessage += `continue to ${AppURL}${intendedURL}`;
                break;
        }

        return signinMessage;
    }

    /**
        Task to attempt to sign in to create an authenticated session.
        @method signinTask
        @return {void}
    */
    @(task(function* () {
        set(this, 'errorMessage', null);
        try {
            yield this.session.authenticate('authenticator:zyserver', { email: this.email, password: this.password });

            if (this.transitionModal) {
                set(this, 'appController.modal_name', this.transitionModal);
            }
        }
        catch (error) {
            set(this, 'errorMessage', error.message);
        }
    }).drop()) signinTask;
}