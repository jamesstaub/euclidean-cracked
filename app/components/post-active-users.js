import Component from '@ember/component';
import { get, computed } from '@ember/object';
export default Component.extend({
  classNames: ['post-active-users'],

  // TODO: also watch activeUsers.each.online to catch when someone closes browser window
  visible: computed('post.activeUsers.length,', {
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
