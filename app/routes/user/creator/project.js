import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { set } from "@ember/object";

export default Route.extend({
  session: service(),

  model({ slug }) {
    return this.store.query('project', {
      orderBy: 'slug',
      equalTo: slug
    }).then((results) => {
      return results.firstObject;
    });
  },

  async afterModel(model, transition) {
    this.addProjectActiveUser(model);
    const tracks = await model.get('tracks');

    await Promise.all(tracks.map((track) => track.get('onstepFunction')));
    await Promise.all(tracks.map((track) => track.get('initFunction')));

      // track.get('initFunction');));
    if (!model.tracks.length) {
      this.createDefaultTrack(model, transition);
    }
  },

  setupController(controller, model) {
    this._super(...arguments);
    controller.set('tracks', model.get('tracks'));
    this.controllerFor('user').set('currentProject', model);
  },

  async createDefaultTrack(project, transition) {
    await transition;
    this.controllerFor('user.creator.project').createTrack.perform(project);
  },

  async addProjectActiveUser(model) {
    set(this, 'project', model);
    
    let user = this.session.get('currentUserModel');
    set(user, 'online', true);

    model.get('activeUsers').pushObject(user);

    await user.save();
    set(this, 'session.currentUserModel', user);
    model.save();
  },

  removeUser() {
    let project = this.project;
    let user = this.session.get('currentUserModel');
    this.project.activeUsers.then((activeUsers) => {
      activeUsers.removeObject(user);
      project.save()
        .then(() => {
          user.save();
        });
    });
  },

  actions: {
    willTransition() {
      this.controllerFor('user').set('currentProject', null);
      this.removeUser();
    }
  }
});
