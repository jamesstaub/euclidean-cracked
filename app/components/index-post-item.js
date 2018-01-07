import Component from '@ember/component';
import { get } from "@ember/object";
import { computed } from "@ember/object";
import { inject as service } from '@ember/service';

export default Component.extend({
  session: service(),
  classNames: ['index-post-item'],
  classNameBindings: ['post.publicVisible:public:private'],

  visible: computed('post.publicVisible', 'post.creator.uid', {
    get() {
      let creator = get(this, 'post.creator.uid');
      let currentUser = get(this, 'session.currentUser.uid');

      let permission = get(this, 'post.publicVisible')

      return permission || creator === currentUser;
    }
  }),
});
