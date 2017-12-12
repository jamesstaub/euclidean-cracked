import Ember from 'ember';
import { set, get } from "@ember/object";

export default Ember.Component.extend({
  classNames: 'new-post',
  actions: {
    save(title, publicEditable, publicVisible) {
      get(this, 'onSave')(title, publicEditable, publicVisible)

      set(this, 'interval', 200);
    }
  }
});
