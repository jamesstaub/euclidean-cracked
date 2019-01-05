import { helper } from '@ember/component/helper';

export function filenameUi(params/*, hash*/) {
  return params[0].split('.')[0];
}

export default helper(filenameUi);
