import DS from 'ember-data';
import { computed } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
export default DS.Model.extend({
  title: DS.attr('string'),
  body: DS.attr('string'),
  slug: DS.attr('string'),
  date: DS.attr('date'),
  creator: DS.belongsTo('user'),
  bpm: DS.attr('number', {
    defaultValue() {
      return 100;
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
    this.set('masterCompressorSelector', '#master-compressor');
  },

  saveTask: task(function* () {
    yield this.save();
    yield timeout(300);
  }).keepLatest(),
  
  async eachTrackAsync(asyncFn) {
    const tracks = await this.get('tracks');
    for (const track of tracks.toArray()) {
      await asyncFn(track);
    }
  },

  // TODO: move to project controller?
  async initializeTrackSamplers() {
    return this.eachTrackAsync((track) => {
      track.set('stepIndex', 1);
      track.initializeSampler.perform();
    });  
  },

  sequenceMatrix:computed('tracks.@each.sequence',{
    get() {
      const tracks = this.get('tracks');
      if (tracks.length) {          
        const matrix = new Nexus.Matrix(tracks.length, 16);
        tracks.forEach((track, idx)=> {
          matrix.set.row(idx, track.get('sequence'));
        });

        return matrix;
      }
    }
  }),
});
