import EmberObject from '@ember/object';
import SequenceHelperMixin from 'euclidean-cracked/mixins/sequence-helper';
import { module, test } from 'qunit';

module('Unit | Mixin | sequence helper', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let SequenceHelperObject = EmberObject.extend(SequenceHelperMixin);
    let subject = SequenceHelperObject.create();
    assert.ok(subject);
  });
});
