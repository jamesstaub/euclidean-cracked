import Component from '@ember/component';
import { get, computed } from '@ember/object';
export default Component.extend({
  classNames: ['post-active-users'],

  visible: computed('post.activeUsers.length', 'post.activeUsers.@each.online', {
    get() {
      let online = get(this, 'post.activeUsers').filter(user => {
        if (user) {
          return get(user, 'online');
        }
      });
      return get(online, 'length') > 1;
    }
  })
});
