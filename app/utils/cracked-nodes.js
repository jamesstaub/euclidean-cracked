/* eslint-disable complexity */
const crackedNodes = {
  selectNodes(selector) {
    const nodeLookup = __._getNodeLookup();
    const uuids = nodeLookup[selector];
    if (uuids.length) {
      return uuids.map((uuid) => {
        return __._getNodeStore()[uuid];
      });
    }
  },
  

  // eslint-disable-next-line complexity
  attrsForNode(node) {
    const type = node.getType();
    switch (type) {
      case 'gain':
        return [node, ['gain']];
      case 'sampler':
        return [node, ['speed']];
      case ('lowpass' || 'highpass' || 'bandpass' || 'allpasss', 'notch'):
        return [node, ['frequency', 'q']];
      case ('lowshelf' || 'highshelf' || 'peaking'):
        return [node, ['frequency', 'q', 'gain']];
      case 'reverb':
        return [node, ['seconds','decay']];
      case 'delay':
        return [node, ['delay', 'damping', 'feedback', 'cutoff', 'frequency']];
      case 'bitcrusher':
        return [node, ['frequency', 'bits']];
      case 'overdrive':
        return [node, ['drive', 'color', 'postCut']];
      case 'ring':
        return [node, ['distortion', 'frequency']];
      case 'comb':
        return [node, ['delay', 'damping', 'cutoff', 'feedback']];
      default:
        return [node, []];
    }
  },

  defaultForAttr(node, attrs) {
    return attrs.map((attr)=> {
      const type = node.getType();
      const paramDefaults = { nodeName: type, nodeAttr: attr};
      // TODO maybe just uuid always?
      let id = node.getID();
      if (id) {
        paramDefaults.nodeSelector = `#${id}`;
      } else {
        paramDefaults.nodeUUID = node.getUUID();
      }

      switch (attr) {
        case 'bits':
          paramDefaults.min = 1;
          paramDefaults.max = 16;
          paramDefaults.default = 6;
          break;
        case 'color':
          paramDefaults.min = 0;
          paramDefaults.max = 1000;
          paramDefaults.default = 800;
          break;
        case 'cutoff':
          paramDefaults.min = 0;
          paramDefaults.max = 4000;
          paramDefaults.default = 1500;
          break;
        case 'damping':
          paramDefaults.min = 0;
          paramDefaults.max = 0;
          paramDefaults.default = 0.84;
          break;
        case 'decay':
          paramDefaults.min = 0;
          paramDefaults.max = 4;
          paramDefaults.default = 0;
          break;
        case 'delay':
          paramDefaults.min = 0;
          paramDefaults.max = 0;
          paramDefaults.default = 2;
          break;
        case 'distortion':
          paramDefaults.min = 0;
          paramDefaults.max = 3;
          paramDefaults.default = 1;
          break;
        case 'drive':
          paramDefaults.min = 0;
          paramDefaults.max = 2;
          paramDefaults.default = .5;
          break;
        case 'feedback':
          paramDefaults.min = 0;
          paramDefaults.max = 1;
          paramDefaults.default = 0.84;
          break;
        case 'frequency':
          paramDefaults.min = 0;
          paramDefaults.max = 10000;
          paramDefaults.default = 300;
          break;
        case 'gain':
          paramDefaults.min = 0;
          paramDefaults.max = 1;
          paramDefaults.default = 1;
          break;
        case 'postCut':
          paramDefaults.min = 0;
          paramDefaults.max = 5000;
          paramDefaults.default = 3000;
          break;
        case 'q':
          paramDefaults.min = 0;
          paramDefaults.max = 20;
          paramDefaults.default = 0;
          break;
        case 'seconds':
          paramDefaults.min = 0;
          paramDefaults.max = 6;
          paramDefaults.default = 0;
          break;
        case 'speed':
          paramDefaults.min = .125;
          paramDefaults.max = 2;
          paramDefaults.default = 1;  
      }
      return paramDefaults;
    });
  }
};
export default crackedNodes; 
