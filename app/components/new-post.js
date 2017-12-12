import Ember from 'ember';
import { set, get } from "@ember/object";

export default Ember.Component.extend({
  classNames: 'new-post',

  init() {
    this._super(...arguments);
    set(this, 'publicVisible', true);
    set(this, 'publicEditable', true);
  },

  actions: {
    save() {
      let {
        title,
        publicEditable,
        publicVisible
      } = this.getProperties('title', 'publicEditable', 'publicVisible');
      debugger
      get(this, 'onSave')(title, publicEditable, publicVisible)
      set(this, 'interval', 200);
    }
  }
});
