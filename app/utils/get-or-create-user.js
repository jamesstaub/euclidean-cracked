import { Promise } from "rsvp";

export default function getOrCreateUser(currentUser, store) {

  return new Promise((resolve)=>{
    if (currentUser) {
      store.query('user', {orderBy: 'uid', equalTo: currentUser.uid }).then( (records) =>{
        if(records.get('length') === 0){
          resolve(store.createRecord('user',{
            uid: currentUser.uid,
            username: currentUser.displayName,
            avatar: currentUser.photoURL,
          }));
        }
        else{
          resolve(records.get('firstObject'));
        }
      });
    } else {
      console.error('no current user session');
    }
  });

}
