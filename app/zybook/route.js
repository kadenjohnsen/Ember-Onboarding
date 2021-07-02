/* eslint-disable ember/no-controller-access-in-routes */
import { Promise } from 'rsvp';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'onboarding/authenticated/route';
import { hash } from 'rsvp';
/**
    Zybook base route.
    @class ZybookRoute
    @extends {AuthenticatedRoute}
    @uses {NavigationMixin}
*/
export default AuthenticatedRoute.extend({


    /**
        Current ember auth session.
        @property session
        @type {Session}
    */
    session: service(),

    /**
        Hook provided by Ember to provide route with model.
        @method model
        @param {Object} params The query params to send along.
        @return {RSVP.Promise}
    */
    model: function(params) {
        const findParams = {
            zybooks: JSON.stringify([ params.zybook_code ]),
        };
        
        const zybook = new Promise((resolve, reject) => {
            this.get('zyServer').find('zybooks', findParams, true).then(zybook => {
                resolve(zybook);
            }, reject);
        }, 'zyBook:model');
        
        return hash({
            zybook: zybook,
        });
    },
});
