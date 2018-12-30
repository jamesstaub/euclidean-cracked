import DS from 'ember-data';

export default DS.Model.extend({
  postCreatorUid: DS.attr('string'),

  function: DS.attr('string', {
    defaultValue() {
      return '';
    }
  }),
  editorContent: DS.attr('string', {
    defaultValue() {
      return '';
    }
  }),
  // unsafe javascript keywords returned from cloud function
  illegalTokens: DS.attr('string')
});
