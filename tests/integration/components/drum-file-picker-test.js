import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('drum-file-picker', 'Integration | Component | drum file picker', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{drum-file-picker}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#drum-file-picker}}
      template block text
    {{/drum-file-picker}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
