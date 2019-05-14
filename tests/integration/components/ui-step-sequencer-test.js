import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | ui step sequencer', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{ui-step-sequencer}}`);

    assert.dom('*').hasText('');

    // Template block usage:
    await render(hbs`
      {{#ui-step-sequencer}}
        template block text
      {{/ui-step-sequencer}}
    `);

    assert.dom('*').hasText('template block text');
  });
});
