import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | audio track sampler', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{audio-track-sampler}}`);

    assert.dom('*').hasText('');

    // Template block usage:
    await render(hbs`
      {{#audio-track-sampler}}
        template block text
      {{/audio-track-sampler}}
    `);

    assert.dom('*').hasText('template block text');
  });
});
