// app/features/application/route.js
import Route from '@ember/routing/route';

import { set, get } from '@ember/object';
import { debug } from '@ember/debug';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),

  beforeModel() {
    // fire a request to wake up heroku drumserver
    fetch('https://drumserver.herokuapp.com/');
    return get(this, 'session')
      .fetch()
      .catch(er => {
        debug(er);
        return this.openSession('anonymous');
      });
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
    async logout() {
      if (this.session.currentUserModel && this.session.currentUserModel.online) {
        set(this, 'session.currentUserModel.online', false);
        await this.session.currentUserModel.save();
      }
      this.session.close();
    },
  }
});
