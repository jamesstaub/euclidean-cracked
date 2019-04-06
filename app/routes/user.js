// app/features/application/route.js
import Route from '@ember/routing/route';
import { set, get } from '@ember/object';
import { debug } from '@ember/debug';
import { inject as service } from '@ember/service';
import { equal } from '@ember/object/computed';

const getAnonDefaults = function () {
  let hash = Math.random()
    .toString(36)
    .substring(7);

  let avatar = `https://api.adorable.io/avatars/100${hash}.png`;
  let username = `anonymous-${hash}`;
  return {
    avatar,
    username
  };
};

export default Route.extend({
  session: service(),
  isAnonymous: equal('session.provider', 'anonymous'),

  async beforeModel() {
    // fire a request to wake up heroku drumserver
    fetch('https://drumserver.herokuapp.com/');

    const sessionProviderUser = this.session.get('currentUser');

    if (!sessionProviderUser) {
      await this.openSession('anonymous');
    }
    return this.session.get('currentUser'); 
  },

  async model() {
    const userRecordsQuery = await this.store.query('user', {
      orderBy: 'uid',
      equalTo: this.session.get('currentUser.uid')
    });
    if (userRecordsQuery.length === 0) {
      return this.createAnonUser();
    } else {
      return userRecordsQuery.get('firstObject');
    }
  },

  afterModel(user) {
    this.session.set('currentUserModel', user);
    return user.ref()
      .child('online')
      .onDisconnect()
      .set(false);
  },

  createAnonUser() {
    // the object returned from google authenticator (not yet an ember model)
    const sessionUser = this.session.get('currentUser');

    let defaults = getAnonDefaults();
    let avatar = sessionUser.photoURL || defaults.avatar;
    let username = sessionUser.displayName || defaults.username;

    return this.store.createRecord('user', {
      uid: sessionUser.uid,
      username: username,
      avatar: avatar
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

  usernameFromEmail(email) {
    return email.split('@')[0].replace(/\W/g, '');
  },

  async saveAuthenticatedUser(userRecord) {
    const authProviderUser = this.session.get('currentUser');
    userRecord.setProperties({
      username: this.usernameFromEmail(authProviderUser.email),
      uid: authProviderUser.uid,
      avatar: authProviderUser.photoUrl
    });
    await userRecord.save();

    this.session.set('currentUserModel', userRecord);
  },

  actions: {
    async login() {
      const userRecord = this.session.get('currentUserModel');
      if (this.isAnonymous) {
        await this.session.close();
      }

      await this.openSession('google');

      this.saveAuthenticatedUser(userRecord);
    },

    async logout() {
      const userRecord = this.session.get('currentUserModel');
      if (userRecord && userRecord.online) {
        set(this, 'session.currentUserModel.online', false);
        await userRecord.save();
      }
      this.session.close();
    },
  }
});
