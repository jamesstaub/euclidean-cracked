import DS from 'ember-data';

export default DS.Model.extend({
  postCreatorUid: DS.attr('string'),

  // the text of the function string as the user types
  // (not ever loaded into an actual javascript function)
  editorContent: DS.attr('string'),

  // copied from editorContent when user clicks load function
  functionPreCheck: DS.attr('string'),

  // always copied from functionPreCheck in cloud function
  // after submitted and checked for forbidden tokens
  function: DS.attr('string', { readOnly: true }),

  // unsafe javascript keywords returned from cloud function
  illegalTokens: DS.attr('string', { readOnly: true })
});