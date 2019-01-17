import Component from '@ember/component';
import { get } from '@ember/object';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  session: service(),
  classNames: ['index-project-item'],
  classNameBindings: ['project.publicVisible:public:private'],

  visible: computed('project.publicVisible', 'project.creator.uid', {
    get() {
      let creator = get(this, 'project.creator.uid');
      let currentUser = get(this, 'session.currentUser.uid');

      let permission = get(this, 'project.publicVisible');

      return permission || creator === currentUser;
    }
  })
});
