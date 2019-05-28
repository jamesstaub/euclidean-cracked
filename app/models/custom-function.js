import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  projectCreatorUid: DS.attr('string'),

  // the text of the function string as the user types
  // (not ever loaded into an actual javascript function)
  editorContent: DS.attr('string', {
    defaultValue() {
      return '';
    }
  }),

  // copied from editorContent when user clicks load function
  functionPreCheck: DS.attr('string'),

  // always copied from functionPreCheck in cloud function
  // after submitted and checked for forbidden tokens
  function: DS.attr('string', { readOnly: true }),

  // unsafe javascript keywords returned from cloud function
  illegalTokens: DS.attr('string', { readOnly: true }),

  scope: computed('track.{samplerId,gainId,lowpassId}', {
    get() {
      // variables available for user defined track functions
      return {
        sampler: `${this.get('track.samplerSelector')}`,
        gain: `${this.get('track.gainOnstepSelector')}`,
        lowpass: `${this.get('track.lowpassSelector')}`
      };
    }
  }),
});
