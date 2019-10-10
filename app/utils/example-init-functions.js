const signalChains = [{
  name: 'default',
  code: `
__()
  .sampler({
    id: this.samplerId,
    path: this.path,
    class: this.className
  })
  .gain({
    id: this.gainId, // assign gainID to connect to the track's main volume slider
  })
  .gain({ // onstep gain controlled by multislider
    class: this.className,
  })
  .connect('#master-compressor');
`
},
{
  name: 'delay',
  code: `
  __()
  .sampler({
    id: this.samplerId,
    path: this.path,
    class: this.className
  })
  .gain({ 
    id: this.gainId, // assign gainID to connect to the track's main volume slider
  })
  .delay({
    class: this.className,
    damping:.9, 
    cutoff:3000,
    feedback:0.9,
    delay:3,
  })
  .connect('#master-compressor');
  `
}];
const lfo = [{
  name: '',
  code: ``
},
{
  name: '',
  code: ``
}];
export default [
  {
    sectionName: 'signal chains',
    examples: signalChains,
  },
  {
    sectionName: 'LFO config',
    examples: lfo
  }
];
