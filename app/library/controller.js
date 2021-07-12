import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';




/**
    Library controller for onboarding.
    @class {LibraryController}
    @extends {EmberController}
    @uses {EnableCatalogMixin}
*/
export default Controller.extend({

    zybookItems: alias('model.zybookItems'),

     /**
        Returns a sorted list of zyBooks by expiration date and filters out unsubscribed books, and How to use zyBook.
        @event sortedBooks
        @param {Array} zybookItems Array of zyBooks.
        @return {Array}
    */
    sortedZybooks: computed('zybookItems', 'zybookItems.[]', function() {
        return this.get('zybookItems') && this.get('zybookItems').length ?
            this.get('zybookItems')
                .rejectBy('user_zybook_role', 'Unsubscribed')
                .rejectBy('zybook_code', 'HowToUseZyBooks')
                .sortBy('subscription_end_date').reverseObjects() :
            [];
    }),

    /**
        Active zyBooks owned by the user.
        @event activeZybooks
        @param {Array} sortedZybooks Array of zybooks owned by the user.
        @return {Array} of {Zybook}
    */
    activeZybooks: computed('sortedZybooks', function() {
        if (!this.get('sortedZybooks')) {
            return [];
        }

        const books = this.get('sortedZybooks').filter(
            zybook => !zybook.get('expired') && !zybook.get('upcoming') && zybook.get('public') &&
                !zybook.get('development') && !zybook.get('autosubscribe'),
        );

        // The auto subscribe zybook(s) should be the last item in the active book list.
        // We explicitly want to remove v1 of HowToUseZyBooks
        const autoSubscribeBooks = this.get('sortedZybooks').filter(
            zybook => zybook.get('autosubscribe') && zybook.get('zybook_code') !== 'HowToUseZyBooks',
        );

        autoSubscribeBooks.forEach(autoSubscribeBook => books.pushObject(autoSubscribeBook));

        return books;
    }),

    /**
        Evaluation zyBooks owned by the user.
        @event evaluationZybooks
        @param {Array} sortedZybooks Array of zybooks owned by the user.
        @return {Array} of {Zybook}
    */
    evaluationZybooks: computed('sortedZybooks', function() {
        return this.get('sortedZybooks').filter(
            zybook =>
                !zybook.get('public') && !zybook.get('development'),
        );
    }),
});
