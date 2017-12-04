# euclidean-cracked
This project is in development.

After building a  [prototype](https://cracked-doodles.firebaseapp.com/doodles/sequencer) euclidean rhythm sequencer, the aim of this rebuild is to deal with application concerns such as authentication, and data modeling as a foundation, then to reimplement the web audio components.

## to do list
### user concurrency features
* show current users on a given beat post
* sidebar chat window
* flash of color on a given track when another user has made a change.
* option to quantize all changes until beginning of next loop (to reduce disruption of the beat)

### audio processing features
* implement a code editor for writing custom cracked audio scripts.
  - on each track, the editor's scope will be a function that is called on each step of the sequencer, and will have access to the sequence array.

  - a global level script editor will allow for other scripting outside of the sequencer events

* add a track field `custom class` (for cracked audio nodes), so users can write macro controls
  - eg. multiple tracks with class `bass-drum` can be selected in the code editor like so:  `__('.bass-drum').connect('reverb');`


### rhythm composition
* implement "bars",  a system for extending a given track's rhythm beyond a single euclidean pattern
  - ability to set the number of loops for a given bar, before advancing to the next
  - eg. `[1, 0, 1, 0], [1, 1, 0, 0](x2), [1, 0, 1]`

* ability to duplicate a track, to make iteration easier


### data authorization (to do)
users create sequence posts and can edit meta data like the name, description and audio parameters

if the user authenticates anonymously, their posts could be subject to any other user editing them \

users authenticated with email can control editing access, and invite other users to edit


## Cracked, Nexus and ember
This app uses the web audio library [cracked](https://github.com/billorcutt/i_dropped_my_phone_the_screen_cracked) for audio along with NexusUI for interface objects.

A few notes on conventions I've established for using these in ember components.

### Cracked
- ember components prefixed with `audio-` deal with the cracked audio library.
- the audio-service handles global state of audio nodes, to allow initialization, destruction of audio nodes and bindings throughout the app.


### NexusUI
- ember components prefixed with `ui-` are [nexus ui](nexus-js.github.io/ui/) objects.
- all ui components inherit the nexus-ui-mixin, which generalizes some functionality for initialization and onChange events.

- the `.hbs` template must contain an element such as `<span id="{{nexusId}}"></span>` for the nexus object to select.


The component must also have properties `ElementName` and `ElementOptions` for configuration, which is handled in the nexus-ui-mixin. This mixin is also where initialization and destruction of the Nexus object is handled.


## Prerequisites

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

### Building

* `ember build` (development)
* `ember build --environment production` (production)
