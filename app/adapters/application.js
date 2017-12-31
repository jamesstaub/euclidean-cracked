// import firebase from 'firebase';
import { inject as service } from '@ember/service';
import FirebaseAdapter from 'emberfire/adapters/firebase';

export default FirebaseAdapter.extend({
  firebase: service(),
});
