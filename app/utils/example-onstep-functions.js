const tutorial = [
  {
    name: 'sequencer variables',
    code: `
/*
  This script gets called as a callback function on 
  every beat of the current track. 

  The following step sequencer variables are available to your script
    data  :  the value (0 or 1) of the current step
    index :  the position of the current step
    array :  the contents of the step sequencer as an array

    1 press play, 
    2 open your debug console 
    3 click Euclidean rhythm and notice how these values update
      on every step of the sequener
*/

console.log('data', data);
console.log('index', index);
console.log('array', array);
`
  },
];

const filters = [
  {
    name: 'filter sweep',
    code: `
/*
  First select the lowpass filter example in the SETUP function

  Use the cracked library's __.scale() to convert the current step index
  into a frequency value for the lowpass filter
*/
// only run if there is a beat on this step of the sequencer
if (data) {
  var inMin = 0;
  var inMax = array.length;
  var outMin = 200;
  var outMax = 2000;
  var type = 'logarithmic';

  var f = __.scale(index, inMin, inMax, outMin, outMax, type);
  __('lowpass').attr({ frequency: f, q: 30 });
}
`
  },
];

const sampler = [
  {
    name: 'pitch: chromatic scale',
    code: `
/*
  This script will multiply the sample playback speed by intervalic ratios to tune a sample
  to the notes of a chromatic scale. Try a cowbell or other pitched drum for best effect.

  In the euclidean rhythm menu, set both the hits and steps
  to 12.
*/

var semitoneRatios = [1/1, 16/15, 9/8, 6/5, 5/4, 4/3, 3/2, 8/5, 5/3, 16/9, 15/8, 2/1];
var speed = semitoneRatios[index];
__(this.sampler).attr({speed: speed});

/*

  The variable "index" is the current step in the sequence.
  
  1:1   unison
  16:15 minor seconrd
  9:8   major second
  6:5   minor third
  5:4   major third
  4:3   fourth
  3:2   fifth
  8:5   minor sixth
  5:3   major sixth
  5:3   minor seventh
  16:9  major seventh
  15:8  octave
*/
`
  },
  {
    name: 'reverse',
    code: `
var reverseSpeed = index % 2 ? -1 : 1; // reverseSpeed is -1 on every other step. 
__(this.sampler).attr({speed: reverseSpeed});
`
  },

];

export default [
  {
    sectionName: 'tutorial',
    examples: tutorial
  },

  {
    sectionName: 'sampler',
    examples: sampler
  },
  {
    sectionName: 'filters',
    examples: filters
  }
];
