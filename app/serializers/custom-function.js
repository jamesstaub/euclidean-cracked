import FirebaseSerializer from 'emberfire/serializers/firebase';

// tood: is checking for isSafe in the client actually safe?
// can it be ensured that the incoming code will never get executed?
// firebase rules 
// ".validate": "null || data.parent().child('isSafe').val() == true"
export default FirebaseSerializer.extend({
  serializeAttribute(snapshot, json, key, attribute) {
    // do not serialize readOnly properties in payload
    // firebase will throw permission denied
    if (attribute.options && attribute.options.readOnly) {
      return;
    }
    this._super(...arguments);
  }

});