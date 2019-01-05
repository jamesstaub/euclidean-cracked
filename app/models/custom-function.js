import DS from 'ember-data';

export default DS.Model.extend({
  postCreatorUid: DS.attr('string'),

  // the text of the function string as the user types
  // (not ever loaded into an actual javascript function)
  editorContent: DS.attr('string', {
    defaultValue() {
      return '';
    }
  }),

  // always copied from editorContent when submitted
  function: DS.attr('string', {
    defaultValue() {
      return '';
    }
  }),

  // unsafe javascript keywords returned from cloud function
  illegalTokens: DS.attr('string'),

  // can only be set by cloud function
  isSafe: DS.attr('boolean')
});
