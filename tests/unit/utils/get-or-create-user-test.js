import getOrCreateUser from 'euclidean-cracked/utils/get-or-create-user';
import { module, test } from 'qunit';

module('Unit | Utility | get or create user', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let result = getOrCreateUser();
    assert.ok(result);
  });
});
