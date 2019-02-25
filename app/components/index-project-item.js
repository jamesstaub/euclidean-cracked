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
  }),

  canDelete: computed('session.currentUser.uid', 'project.creator.uid', {
    get() {
      return this.session.get('currentUser.uid') === this.project.get('creator.uid');
    }
  }),

  actions: {
    async deleteProject(project) {
      let tracks = await project.tracks.toArray();
      for (const track of tracks) {
        await track.destroyRecord();
      }
      await project.destroyRecord();
    }
  }
});
