import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { equal } from '@ember/object/computed';

export default Component.extend({
  tagName: '',
  session: service(),

  isAnonymous: equal('session.provider', 'anonymous'),

  actions: {
    toggleMenu() {
      this.toggleProperty('isOpen');
    }, 
    async save(record) {
      record.save();
      this.set('isEditingTitle', false);
    }
  }
});
