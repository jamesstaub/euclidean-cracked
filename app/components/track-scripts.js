import Component from '@ember/component';
import { computed } from '@ember/object';
import exampleInitFunctions from '../utils/example-init-functions';
import exampleOnstepFunctions from '../utils/example-onstep-functions';

export default Component.extend({
  init() {
    this._super(...arguments);
    this.set('functionType', 'onstep');
  },
  // eslint-disable-next-line complexity
  async didReceiveAttrs() {
    this._super(...arguments);
    if (this.track && this.functionType) {
      const onstepFunctionRecord = await this.track.get('onstepFunction');
      const initFunctionRecord = await this.track.get('initFunction');
      if (!onstepFunctionRecord || !initFunctionRecord) {
        throw `${this.functionType}Function is null, Cloud function should enforce this never happens`;
      }

      this.set('onstepFunctionRecord', onstepFunctionRecord);
      this.set('initFunctionRecord', initFunctionRecord);
    }
  },

  customFunctionRef: computed('functionType', {
    get() {
      // returns either onstepFunctionRef or initFunctionRef
      return this.track.get(`${this.functionType}FunctionRef`);
    }
  }),
  exampleFunctions: computed('functionType', {
    get() {
      switch (this.functionType) {
        case 'init':
          return exampleInitFunctions;
        case 'onstep':
          return exampleOnstepFunctions;
      }
    }
  }),

  customFunctionRecord: computed('initFunctionRecord', 'onstepFunctionRecord', 'functionType', {
    get() {
      if(this.functionType === 'init') {
        return this.initFunctionRecord;
      } else if (this.functionType === 'onstep') {
        return this.onstepFunctionRecord;
      }
    }
  }),
});
