import Ember from 'ember';
import DS from 'ember-data';

const {
  get,
  set,
  computed,
} = Ember;

export default Ember.Component.extend({
  isEditing: false,
  classNames: 'edit-post',

  isAllowed: computed('model.firstObject.user.uid', 'session.currentUser.uid',{
    get() {
      const currentUser = get(this, 'session.currentUser.uid');

      const creatorPromise = get(this, 'model.firstObject.user').then((creator)=>{
        return get(creator, 'uid') === currentUser;
      });

      return DS.PromiseObject.create({promise: creatorPromise});

    }
  }),

  actions: {
    save(post) {
      let sessionName = get(this, 'session.currentUser.uid');
      if (sessionName === post.get('user.uid')) {
        set(this, 'isEditing', false);
        get(this, 'onSavePost')(post);

      } else {
        alert('Sorry not authorized');
      }

    },
    edit() {
      set(this, 'isEditing', true);
    },

    updatePost(post) {


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
