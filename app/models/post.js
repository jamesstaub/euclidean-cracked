import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr('string'),
    body: DS.attr('string'),
    slug: DS.attr('string'),
    date: DS.attr('date'),
    user: DS.belongsTo('user'),

    interval: DS.attr('number'),

    comments: DS.hasMany('comment' ),
    tracks: DS.hasMany('track'),


});
