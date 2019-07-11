import DS from 'ember-data';
import { inject as service } from '@ember/service';

export default DS.Model.extend({
  session: service(),
  uid: DS.attr('string'),
  username: DS.attr('string'),
  email: DS.attr('string'),

  avatar: DS.attr('string'),

  // avatar: computed('avatar', {
  //   get() {
  //     let sessionPhoto = this.get('session.currentUser.photoURL');
  //     let userModelAvatar = this.get('session.currentUserModel.avatar');
  //     return userModelAvatar || sessionPhoto;
  //   }
  // }),

  projects: DS.hasMany('project', {
    inverse: 'creator'
  }),

  comments: DS.hasMany('comment'),

  online: DS.attr('boolean'),
  activeProject: DS.belongsTo('project')
});
