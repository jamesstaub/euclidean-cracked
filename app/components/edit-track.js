import Component from '@ember/component';

export default Component.extend({
  classNames: ['edit-track border'],
  
  didInsertElement() {
    this._super(...arguments);
    this.send('switchInterface', 'filePicker');
  },

});
