import DS from 'ember-data';

export default DS.Model.extend({
  uid: DS.attr('string'),
  username: DS.attr('string'),

  avatar: DS.attr('string'),

  projects: DS.hasMany('project', {
    inverse: 'creator'
  }),
  comments: DS.hasMany('comment'),

  online: DS.attr('boolean'),
  activeProject: DS.belongsTo('project')
});
