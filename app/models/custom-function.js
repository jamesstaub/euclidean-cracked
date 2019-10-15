import DS from 'ember-data';

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
  // never settable by the client
  function: DS.attr('string', { readOnly: true }),

  // unsafe javascript keywords returned from cloud function
  illegalTokens: DS.attr('string', { readOnly: true }),

  // create the function referecne and bind it's scope
  createRef(track, ...args){
    let functionRef;
    if (this.function) {
      try {
        functionRef = new Function(...[this.function, ...args])
          .bind(track.get('customFunctionScope'));
        return functionRef;
      } catch (e) {
        alert('problem with function', e.message);
      }
    }
  },

});
