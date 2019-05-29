import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr('string'),
    body: DS.attr('string'),
    slug: DS.attr('string'),
    date: DS.attr('date'),
    creator: DS.belongsTo('user'),

    interval: DS.attr('number', {
      defaultValue() {
        return 200;
      }
    }),

    tracks: DS.hasMany('track'),
    comments: DS.hasMany('comment' ),
    activeUsers: DS.hasMany('user',  {
      inverse: 'activeProject',
      defaultValue() {
        return [];
      }
    }),

    publicVisible: DS.attr('boolean'),
    publicEditable: DS.attr('boolean'),

    init() {
      this._super(...arguments);
      this.set('outputNodeSelector', '#master-compressor');
    },

    // TODO: move to project controller
    async bindTrackSamplers() {
      const tracks = await this.get('tracks');
      for (const track of tracks.toArray()) {
        track.bindTrackSampler();
      }
    },

});
