// app/features/application/route.js
import Route from '@ember/routing/route';

import { set, get } from '@ember/object';
import { debug } from '@ember/debug';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),

  beforeModel() {
    return get(this, 'session')
      .fetch()
      .catch(er => {
        debug(er);
        return this.openSession('anonymous');
      });
  },
  model() {
    return this.store.findAll('post');
  },

  openSession(provider) {
    return get(this, 'session')
      .open('firebase', {
        provider
      })
      .then(() => {
        debug(`logged in with ${provider}`);
      })
      .catch(er => {
        debug(er);
      });
  },

  actions: {
    login() {
      this.openSession('google');
    },
    logout() {
      get(this, 'session').close();
      set(this, 'session.currentUserModel.online', false);
    },
  }
});
