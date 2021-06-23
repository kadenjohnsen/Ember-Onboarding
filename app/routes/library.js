import AuthenticatedRoute from 'onboarding/routes/authenticated'
import NavigationMixin from 'zycommon-web/mixins/navigation';
import ScrollTopRoute from 'zycommon-web/mixins/scroll-top-route';

export default AuthenticatedRoute.extend(NavigationMixin, ScrollTopRoute, {

    title: 'zyBooks My library',

    setupController: function(controller) {
        this._super(...arguments);
    },

    // /**
    //     If breadCrumbs is provided in the presence of NavigationMixin it will be consumed to create a bread crumb entry that is pop/pushed
    //     as the route is entered/exited respectively.
    //     @method breadCrumbs
    //     @return {Array} of {Objects}
    // */
    // breadCrumbs: function() {
    //     return [
    //         {
    //             title: 'My library',
    //             route: 'library',
    //         },
    //     ];
    // },
});