import Component from '@ember/component';
import { computed, set, get } from '@ember/object';
import DS from 'ember-data';

export default Component.extend({
  isEditing: false,
  classNames: 'edit-post',

  isAllowed: computed('post.creator.uid', 'session.currentUser.uid',{
    get() {
      const currentUser = get(this, 'session.currentUser.uid');

      const creatorPromise = get(this, 'post.creator').then((creator)=>{
        if (creator) {
          return get(creator, 'uid') === currentUser;
        } else {
          return false;
        }
      });

      return DS.PromiseObject.create({promise: creatorPromise});

    }
  }),

  actions: {
    save(post) {
      let sessionName = get(this, 'session.currentUser.uid');

      if (sessionName === post.get('creator.uid')) {
        set(this, 'isEditing', false);
        get(this, 'onSavePost')(post)

      } else {
        alert('Sorry not authorized');
      }

    },
    edit() {
      set(this, 'isEditing', true);
    },

    delete(post) {
      this.sendAction('delete', post);
      set(this, 'isEditing', false);
    },

    createComment(author, body, post) {
      this.sendAction('createComment', author, body, post);
    },
  }
});
