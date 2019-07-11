import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  session: service(),
  tagName: '',

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
