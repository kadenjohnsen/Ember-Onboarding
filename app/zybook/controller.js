import { alias } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';

/**
    Zybook controller. 
    @class ZybookController
    @extends {EmberController}
*/
export default Controller.extend({

    chapters: alias('model.zybook.chapters'),

    /**
        Ember overridden method to initialize controller and call observers.
        @method init
        @return {void}
    */
    init: function() {
        this._super(...arguments);
    },
});
