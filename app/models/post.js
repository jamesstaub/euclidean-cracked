import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr('string'),
    body: DS.attr('string'),
    slug: DS.attr('string'),
    user: DS.belongsTo('user'),
    date: DS.attr('date'),

    comments: DS.hasMany('comment' ),
    tracks: DS.hasMany('track'),

});
