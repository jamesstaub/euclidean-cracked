import DS from 'ember-data';

export default DS.Model.extend({
  uid: DS.attr('string'),
  username: DS.attr('string'),

  avatar: DS.attr('string'),

  posts: DS.hasMany('post', {
    inverse: 'creator'
  }),
  comments: DS.hasMany('comment'),

  online: DS.attr('boolean'),
  activePost: DS.belongsTo('post')
});
