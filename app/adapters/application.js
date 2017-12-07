// import firebase from 'firebase';
import Ember from 'ember';
import FirebaseAdapter from 'emberfire/adapters/firebase';

export default FirebaseAdapter.extend({
  firebase: Ember.inject.service(),
  // init() {
  //   this._super(...arguments);
  //
  //   const userListRef = firebase.database().ref("USERS_ONLINE");
  //   const myUserRef = userListRef.push();
  //
  //   firebase.database().ref(".info/connected")
  //   .on("value", function (snap) {
  //     if (snap.val()) {
  //       // if we lose network then remove this user from the list
  //       // myUserRef.onDisconnect()
  //                // .remove();
  //       // set user's online status
  //       // setUserStatus("online");
  //       console.log(userListRef);
  //     } else {
  //       // client has lost network
  //       // setUserStatus("offline");
  //     }
  //   }
  // );
  // },
});
