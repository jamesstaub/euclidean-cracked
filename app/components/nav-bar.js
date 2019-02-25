import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { set, computed, get } from "@ember/object";
import { equal } from '@ember/object/computed';
export default Component.extend({
  isCollapsed: true,

  session: service(),

// FIXME: Why doesnt this update when projects route sets user on session?
  avatar: computed('session.currentUserModel.avatar', {
    get() {
      let sessionPhoto = get(this, 'session.currentUser.photoURL');
      let userModelAvatar = get(this, 'session.currentUserModel.avatar');
      return userModelAvatar || sessionPhoto;
    }
  }),

  isAnonymous: equal('session.provider', 'anonymous'),

  didInsertElement() {
    this._super(...arguments);
    this.$('.navbar-toggle').on('blur', ()=>{
      // FIXME: extreme hack
      // must be simpler way to bubble the click through the menu
      // before the toggle is called
      setTimeout(()=>{
        set(this, 'isCollapsed', true);
      }, 100);
      return true;
    });
  },

  willDestroyElement() {
    this._super(...arguments);
    this.$('.navbar-toggle').off();
  },

  actions: {
    toggleCollapsed() {
      this.toggleProperty('isCollapsed');
      return true;
    }
  }
});
