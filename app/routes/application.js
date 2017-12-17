// app/features/application/route.js
import Ember from 'ember';
const {
  get,
  set,
  debug,
  inject: { service },
} = Ember;

export default Ember.Route.extend({
  session: service(),

  beforeModel() {
    return get(this, 'session').fetch()
    .catch((er)=> {
      console.error(er.message);
      return this.openSession('anonymous');
    });
  },
  model() {
    return this.store.findAll('post');
  },

  openSession(provider) {
    return get(this, 'session').open('firebase', {
      provider
    }).then(()=> {
      debug(`logged in with ${provider}`);
    })
    .catch((er)=>{
      console.error(er);
    });
  },

  actions: {
    login() {
      this.openSession('google');
    },
    logout() {
      get(this, 'session').close();
      set(this, 'session.currentUserModel.online', false);
    }
  }
});
