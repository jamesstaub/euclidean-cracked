# euclidean-cracked

## Goals
rebuild from scratch a prototype web drum sequencer.

- use torii and firebase to authenticate users.
- users can save and recall drum sequences they program and view sequences made by others
  - refactor and expand cracked.js audio signalpath for each drum track. allow configuration of filters, distortion, lfos

-  create a listview of all sequences created by users with an interface to create a super-sequence, sequencing multiple sequences together at different durations




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

### Deploying

Specify what it takes to deploy your app.
