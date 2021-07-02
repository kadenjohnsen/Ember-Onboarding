import { bind, next } from '@ember/runloop';
import { computed, observer } from '@ember/object';
import { equal } from '@ember/object/computed';
import { getOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import { loginStateKey, loginStateNamespace } from 'zycommon-web/utils/login-state-constants';
import Controller from '@ember/controller';

/**
    Main application controller for zybooks-web.
    @class {ApplicationController}
    @extends {EmberController}
    @uses {EnableCatalogMixin}
*/
export default Controller.extend({

    /**
        The local storage service.
        @propety localStore
        @type {localStore}
    */
    localStore: service(),

    /**
        Reference to router session.
        @property router.
        @type {Router}
    */
    router: service(),

    /**
        True if the profile dropdown is expanded.
        @property profileDropdownExpanded
        @type {Boolean}
        @default false
    */
    profileDropdownExpanded: false,

    /**
        Route names that will define their own main element.
        @property routesWithOwnMain
        @type {Array} of {String}
        @default [ 'zybook.chapter.section' ]
        @readonly
    */
    routesWithOwnMain: Object.freeze([ 'zybook.chapter.section' ]),

    /**
        Reference to app session.
        @property session
        @type {Session}
    */
    session: service(),

    /**
        Service that provides the capability to display notifications to the user.
        @property notifications
        @type {Notifications}
    */
    notifications: service(),

    /**
        The query parameters for this route. The modal_name query parameter displays the specified modal.
        @property queryParams
        @type {Object}
        @default [ 'modal_name', 'refresh_token' ]
        @readOnly
    */
    queryParams: [ 'modal_name', 'refresh_token' ],

    /**
        The name of the routable modal to display.
        @property modal_name
        @type {String}
        @default null
    */
    modal_name: null,

    /**
        The refresh token passed into application.
        @property refresh_token
        @type {String}
        @default null
    */
    refresh_token: null,

    /**
        True if the user's browser is supported.
        @property isBrowserSupported
        @type {Boolean}
        @default true
    */
    isBrowserSupported: true,

    /**
        True if the user's browser is supported but potentially not full-featured.
        @property isDesiredBrowserVersion
        @type {Boolean}
        @default true
    */
    isDesiredBrowserVersion: true,

    /**
        Name of the browser the user is on.
        @property browserName
        @type {String}
        @default null
    */
    browserName: null,

    
    /**
        True if we are in the print sub-route.
        @event printMode
        @param {String} router.currentRouteName The current route name.
        @return {Boolean}
    */
    printMode: equal('router.currentRouteName', 'zybook.chapter.print'),

    /**
        Computed property set to true when the profile modal should be shown.
        @event showProfileModal
        @param {User} session.currentUser The currently logged in user.
        @param {String} modal_name The name of the modal to display.
        @return {Boolean}
    */
    showProfileModal: computed('session.currentUser', 'modal_name', function() {
        return this.get('session.currentUser') &&
            (this.get('modal_name') === 'profile');
    }),

    /**
        Reference to app reachability status.
        @property reachability
        @type {Reachability}
        @default {ReachabilityService}
    */
    reachability: service(),

    /**
        Boolean indicating if we should disable (gray out) the main application toolbar.
        @property disableToolbar
        @type {Boolean}
        @default false
    */
    disableToolbar: false,

    /**
        Title on main toolbar. Should not be set directly by other objects.
        @property title
        @type {String}
        @default ''
    */
    toolbarTitle: '',

    /**
        True if the menu items should be collapsed to allow more room for the toolbar on smaller screens.
        @property collapseMenuItems
        @type {Boolean}
        @default true
    */
    collapseMenuItems: true,

    /**
        True if the toolbar button text should be hidden to provide more room.
        @property hideToolbarButtonText
        @type {Boolean}
        @default false
    */
    hideToolbarButtonText: false,

    /**
        Observer that clears refresh token if it exists as a query parameter.
        @event clearRefreshToken
        @param {String} refresh_token An optional refresh token passed to application.
        @return {void}
    */
    clearRefreshToken: observer('refresh_token', function() {
        if (this.get('refresh_token')) {
            next(() => {
                this.set('refresh_token', null);
            });
        }
    }),

    /**
        An array of breadcrumbs to show in top menu bar.
        @property _breadCrumbs
        @type {Array} of {BreadCrumbs}
        @default null
    */
    _breadCrumbs: null,

    /**
        An array of navMenu items to show in slide in drawer on left.
        @property _navMenu
        @type {Array} of {NavMenu}
        @default null
    */
    _navMenu: null,

    /**
        Indicates that the navMenu is closed.
        @property _navMenuClosed
        @type {Boolean}
        @default true
    */
    _navMenuClosed: true,

    /**
        Updates the toolbar title when the route changes.
        @event currentRouteChanged
        @param {String} router.currentRouteName Injected into controller by Ember.
        @return {void}
    */
    currentRouteChanged: observer('router.currentRouteName', function() {
        const routeName = this.router.currentRouteName;
        const route = getOwner(this).lookup(`route:${routeName}`);
        const title = (route && route.get('title')) ? route.get('title') : '';

        this.set('toolbarTitle', title);
    }),

    /**
        Name for the unauthenticated route button.
        'Create an account' for sign in page, otherwise is 'Sign in'.
        @event loggedOutButtonTitle
        @param {String} router.currentRouteName Injected into controller by Ember.
        @return {String}
    */
    loggedOutButtonTitle: computed('router.currentRouteName', function() {
        return this.router.currentRouteName === 'sign-in' ? 'Create account' : 'Sign in';
    }),

    actions: {

        /**
            Action to invalidate session and credentials.
            @method signoutClicked
            @return {void}
        */
        signoutClicked: function() {
            this.session.invalidate().then(
                () => {
                    // Update local storage to indicate that the user has signed out
                    this.localStore.setValue(loginStateNamespace, loginStateKey, false);
                },
            );
        },

        /**
            Proxy method for transitioning to a route.
            @method transitionToClicked
            @param {String} route The name of the route to transition to. E.g 'zybookrequests'.
            @return {void}
        */
        transitionToClicked: function(route) {
            this.transitionToRoute(route);
        },

        /**
            Action method to open new tab with discourse forum.
            @method discourseClicked
            @return {void}
        */
        discourseClicked: function() {
            window.open('https://discourse.zybooks.com/', '_blank');
        },
    },
});
