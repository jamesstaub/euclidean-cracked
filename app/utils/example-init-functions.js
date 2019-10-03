const signalChains = [{
  name: 'default',
  code: `
__()
  .sampler({
    id: this.samplerId,
    path: this.path,
    class: this.className
  })
  .gain({ // track gain controlled by slider
    id: this.gainId,
  })
  .gain({ //onstep gain controlled by multislider
    class: this.className,
  })
  .connect('#master-compressor');
`
},
{
  name: '',
  code: ``
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
