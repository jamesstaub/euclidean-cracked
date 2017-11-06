// app/features/application/route.js
import Ember from 'ember';
const {
  get,
  inject: { service },
} = Ember;

export default Ember.Route.extend({
  session: service(),

  beforeModel() {
    return get(this, 'session').fetch()
    .catch((er)=> {
      console.error(er.message);
    });
  },
  model() {
    return this.store.findAll('post');
  },
  actions: {
    login() {
      get(this, 'session').open('firebase', {
        provider: 'google'
      }).then((data)=> {
        console.log(data);
      })
      .catch((er)=>{
        console.error(er);
      });
    },
    logout() {
      get(this, 'session').close();
    }
  }
});
