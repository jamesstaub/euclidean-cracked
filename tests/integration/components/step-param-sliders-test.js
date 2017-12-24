import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('step-param-sliders', 'Integration | Component | step param sliders', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{step-param-sliders}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#step-param-sliders}}
      template block text
    {{/step-param-sliders}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
