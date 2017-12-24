import Ember from 'ember';
import SequenceHelperMixin from 'euclidean-cracked/mixins/sequence-helper';
import { module, test } from 'qunit';

module('Unit | Mixin | sequence helper');

// Replace this with your real tests.
test('it works', function(assert) {
  let SequenceHelperObject = Ember.Object.extend(SequenceHelperMixin);
  let subject = SequenceHelperObject.create();
  assert.ok(subject);
});
