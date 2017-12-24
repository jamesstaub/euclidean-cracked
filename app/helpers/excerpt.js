import { helper } from '@ember/component/helper';

export function excerpt(params) {
  return params[0].substring(0,15)+'...';
}

export default helper(excerpt);  
