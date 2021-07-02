import AuthenticatedRoute from 'onboarding/routes/authenticated'
import NavigationMixin from 'zycommon-web/mixins/navigation';
import ScrollTopRoute from 'zycommon-web/mixins/scroll-top-route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default AuthenticatedRoute.extend(NavigationMixin, ScrollTopRoute, {

    session: service(),

    title: 'zyBooks My library',

    setupController: function(controller) {
        this._super(...arguments);
    },

    /**
        Hook provided by Ember to provide route with model.
        @method model
        @return {RSVP.Promise} A promise which resolves to the user's zyBook list.
    */
    model: function() {
        return hash({
            zybookItems: this.session.currentUser.retrieveMyItems([ 'zybooks' ]),
        });
    },
});
