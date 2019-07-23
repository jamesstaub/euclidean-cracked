import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  init() {
    this._super(...arguments);
    this.set('functionType', 'onstep');
  },
  customFunctionRef: computed('functionType', {
    get() {
      return `${this.functionType}Ref`;
    }
  }),
  customFunctionModel: computed('functionType', {
    get() {
      return `${this.functionType}Model`;
    }
  }),
});
