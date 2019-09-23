
[work in progress demo](https://euclidean-cracked.firebaseapp.com)

# Euclip Drum Console
This project is in development, the demo link may have some usability issues. 

Euclip is a hackable drum machine with a UI for composign layered euclidean rhythms and a track-based live coding editor for programming custom audio signal chains and musical logic. 


## Cracked, Nexus and ember
This app uses the web audio library [cracked](https://github.com/billorcutt/i_dropped_my_phone_the_screen_cracked) for audio along with NexusUI for interface objects.

A few notes on conventions I've established for using these in ember components.

### Cracked
- ember components prefixed with `audio-` deal with the cracked audio library.
- the audio-service handles global state of audio nodes, to allow initialization, destruction of audio nodes and bindings throughout the app.

#### track automation (aka parameter sequences)
-  stringified arrays saved on the track model, and loaded into the serviceTrackRef on initialization and track update. this allows the track to update various parameters on each step of the sequence.
  - the sequence helper mixin generalizes some functions + computed properties for getting/setting parameter sequences between the track model, interface components and the global service

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

### Linting

* `npm run lint:hbs`
* `npm run lint:js`
* `npm run lint:js -- --fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)
