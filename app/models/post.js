import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr('string'),
    body: DS.attr('string'),
    slug: DS.attr('string'),
    date: DS.attr('date'),
    creator: DS.belongsTo('user'),

    interval: DS.attr('number', {
      defaultValue() { return 200 }
    }),

    comments: DS.hasMany('comment' ),
    tracks: DS.hasMany('track'),
    activeUsers: DS.hasMany('user',  {
      inverse: 'activePost'
    }),

});
