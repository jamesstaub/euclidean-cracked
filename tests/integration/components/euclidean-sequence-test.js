import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('euclidean-sequence', 'Integration | Component | euclidean sequence', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{euclidean-sequence}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#euclidean-sequence}}
      template block text
    {{/euclidean-sequence}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
