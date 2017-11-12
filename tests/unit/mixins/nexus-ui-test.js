import Ember from 'ember';
import NexusUiMixin from 'euclidean-cracked/mixins/nexus-ui';
import { module, test } from 'qunit';

module('Unit | Mixin | nexus ui');

// Replace this with your real tests.
test('it works', function(assert) {
  let NexusUiObject = Ember.Object.extend(NexusUiMixin);
  let subject = NexusUiObject.create();
  assert.ok(subject);
});
