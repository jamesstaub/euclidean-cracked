import Component from '@ember/component';
import { get, computed } from '@ember/object';
export default Component.extend({
  classNames: ['project-active-users'],

  visible: computed('project.activeUsers.length', 'project.activeUsers.@each.online', {
    get() {
      let online = get(this, 'project.activeUsers').filter(user => {
        if (user) {
          return get(user, 'online');
        }
      });
      return get(online, 'length') > 1;
    }
  })
});
