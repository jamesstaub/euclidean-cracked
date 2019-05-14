import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | ui slider', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{ui-slider}}`);

    assert.dom('*').hasText('');

    // Template block usage:
    await render(hbs`
      {{#ui-slider}}
        template block text
      {{/ui-slider}}
    `);

    assert.dom('*').hasText('template block text');
  });
});
