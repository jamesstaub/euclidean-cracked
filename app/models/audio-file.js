import DS from 'ember-data';

export default DS.Model.extend({
  track: DS.belongsTo('track'),
  path: DS.attr('string'),
});
