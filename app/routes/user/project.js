import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { set, get } from "@ember/object";
import getOrCreateUser from 'euclidean-cracked/utils/get-or-create-user';

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
