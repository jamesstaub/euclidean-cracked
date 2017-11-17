import Ember from 'ember';
import { set, get } from "@ember/object";

export default Ember.Component.extend({
  classNames: 'new',
  actions: {
    save(title, body) {
      get(this, 'onSave')(title, body)

      set(this, 'title', '');
      set(this, 'body', '');

      set(this, 'interval', 200);
    }
  }
});
