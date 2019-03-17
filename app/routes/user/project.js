import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { set, get } from "@ember/object";
import getOrCreateUser from 'euclidean-cracked/utils/get-or-create-user';
import { waitForProperty } from 'ember-concurrency';

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

  afterModel(model, transition) {
    this.addProjectActiveUser(model);
    if (!model.tracks.length) {
      this.createDefaultTrack(model, transition);
    }
  },

  setupController(controller, model) {
    this._super(...arguments);
    this.setDefaultActiveTrack(controller, model);
  },

  async setDefaultActiveTrack(controller, project) {
    await project.tracks;
    if (!this.activeTrack) {
      // tracks might not be available in this hook when new project created
      await waitForProperty(project, 'tracks.firstObject');
      controller.set('activeTrack', project.tracks.firstObject);
    }
  },

  async createDefaultTrack(project, transition) {
    await transition;
    this.controllerFor('user.project').send('createTrack', project);
  },

  addProjectActiveUser(model) {
    set(this, 'project', model);

    let user = getOrCreateUser(
      get(this, 'session.currentUser'),
      this.store
    );

    user.then((user) => {
      set(user, 'online', true);

      model.get('activeUsers').pushObject(user);

      user.save().then((user) => {
        set(this, 'session.currentUserModel', user);
        model.save();
      });
    });
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
      this.removeUser();
    }
  }
});
