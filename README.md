# Euclip Drum Console
[Open the app](https://euclidean-cracked.firebaseapp.com)

Euclip Drum console is a real-time collaborative web audio rhythm sequencer, and a live coding environment for algorithmic electronic music. 

You can create complex euclidean rhythm patterns with a large library of drum samples and write your own custom logic and audio signal chains with javascript.

Euclip is powered by the Cracked web audio library which provides an easy syntax for creating and chaining together web audio nodes, as well as a bunch of useful helpers for creating algorithmic music.

Euclip projects are made up of tracks, each of which have 2 code editors, one that is executed once on **setup**, and another which is executed on each step of the rhythm sequence (**on-step**). 


Pre-release TODOs:
- init function is where track nodes are initialized (with this.trackSelector class on all) 
- prefill controls attrs based on track's nodes
- 
- cloud function to  delete orphan data  (moved to new repo)
- test+review permissions
    - show/hide public feed
- about / help page


Future features:

- Audio uploads
    - user can upload their own samples, expand drum file picker to show users' collection
    - cloud function (or possibly client service worker) performs beat tracking analysis, creates a track-script variable which is an array of start/end times of the beat tracking. 



### selecting Cracked audio nodes with Cracked audio syntax in javascript
the `__()` function is used to select Cracked audio nodes, which have css/jQuery style selecors for `id` and `class`.
Each Euclip track is made of Cracked node chain, so you can access the various selectors for each track like so:

```
 __(this.sampler) // this.sampler is a string like "#123-track-sampler"

 __(this.lowpass) // select the lowpass filter that this sampler is connected to

```

Once you've selected a node, you can change it's properties with `attr()` function

```
 __(this.sampler).attr({speed: .5})
```

### on-step functions

imagine a track with the following sequence:
**3 hits**, spaced between **8 steps**.

which, as a javascript array would look like:
`[1, 0, 0, 1, 0, 0, 1, 0]`

The track's **on-step** function gets called on each step with the following arguments available
```
index // the number of the current step (0-7)
data  // the value of the current step (0 or 1)
array // the entire sequence [1, 0, 0, 1, 0, 0, 1, 0]
```

we could then write an **on-step** function that randomly changes the pitch on every step that has a hit

```
var randSpeed = __.random(.5, 2); // pick a random decimal between half speed and double speed
__(this.sampler).attr({speed: randSpeed});
```




## Built with Cracked, Nexus and Ember
[Cracked](https://github.com/billorcutt/i_dropped_my_phone_the_screen_cracked)
[NeusUI](https://nexus-js.github.io/) 
[Ember](https://emberjs.com/)

## Contribute

### Cracked
- ember components prefixed with `audio-` deal with the cracked audio library.
- the audio-service handles global state of audio nodes, to allow initialization, destruction of audio nodes and bindings throughout the app.

### NexusUI
- ember components prefixed with `ui-` are [nexus ui](nexus-js.github.io/ui/) objects.
- all ui components inherit the nexus-ui-mixin, which generalizes some functionality for initialization and onChange events.
- the `.hbs` template must contain an element such as `<span id="{{nexusId}}"></span>` for the nexus object to select.


The component must also have properties `ElementName` and `ElementOptions` for configuration, which is handled in the nexus-ui-mixin. This mixin is also where initialization and destruction of the Nexus object is handled.




## Prerequisites To Run Locally
You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)
* [Ember CLI](https://ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* `cd euclidean-cracked`
* `npm install`

## Running / Development

* `ember serve`
[http://localhost:4200](http://localhost:4200).

### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `npm run lint:hbs`
* `npm run lint:js`
* `npm run lint:js -- --fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)
