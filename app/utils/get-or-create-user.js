import { Promise } from "rsvp";
import { debug } from "@ember/debug";

export default function getOrCreateUser(currentUser, store) {
  const getAnonDefaults = function() {
    let hash = Math.random().toString(36).substring(7);

    let avatar = `https://api.adorable.io/avatars/100${hash}.png`;
    let username = `anonymous-${hash}`;
    return {
      avatar,
      username
    };
  };

  return new Promise((resolve)=>{
    let userRecord;

    if (currentUser) {
      store.query('user', {orderBy: 'uid', equalTo: currentUser.uid }).then( (records) =>{
        if(records.get('length') === 0){
          let defaults = getAnonDefaults();
          let avatar = currentUser.photoURL || defaults.avatar;
          let username = currentUser.displayName || defaults.username;

          userRecord = store.createRecord('user',{
            uid: currentUser.uid,
            username: username,
            avatar: avatar,
          });
        } else{
          userRecord = records.get('firstObject');
        }

        userRecord.ref().child('online').onDisconnect().set(false);
        resolve(userRecord);
      });
    } else {
      debug('no current user session');
    }
  });
}
