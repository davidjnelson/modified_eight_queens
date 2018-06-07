// @flow

import 'babel-polyfill';
import {Display} from './Display';
import {Plane} from './Plane';
import {OutputMatrix} from './OutputMatrix';
import {Grid} from './Grid';
import {EdgeDirection} from './EdgeDirection';

// REALLY NICE TO HAVES, TRY TO DO BUT IF NOT THEN MENTION IN README AS WOULD DO IF MORE TIME, HIGH PRIORITY:
// TODO: split out directories for local dev and production ready build
// TODO: figure out why running webpack ordering and mangling ( turning off adds 100kb ) is breaking the production bundle
// TODO: figure out why source maps aren't lining up for es6 maps.  make them use real files instead of in memory
// TODO: add UI to run fast or slow
// TODO: add UI to show every action not just linking
// TODO: remove bootstrap and add file upload to load input as mentioned in instructions so tiles not hardcoded
// TODO: basic exception handling that tells the user what happened
// TODO: manually test in 4 major browsers latest versions on windows 10 and osx sierra
// TODO: add maximum run time before giving up
// TODO: add event listener if input worst case approaches infinity
// TODO: add eslint to buildTileMatrix
// TODO: convert various let 's to const 's
// TODO: add code coverage report with istanbul
// TODO: fix outer edges of output display grid having 1px borders where all other cells have 2px borders

// MENTION NICE TO HAVE IF SPENDING MORE TIME ON IT IN README
// TODO: make privates use symbols instead of naming convention for more protection
// TODO: add css modules
// TODO: use react and immutable.js with pure render component to avoid wasteful re-rendering of unchanged dom nodes
// TODO: add selenium tests to verify UI rendering and run them through sauce labs across a wide range of operating system and browser versions
// TODO: add a deploy step to push to an s3 bucket configured as a website with ssl and a domain
// TODO: add a hash to built assets and upload them to an s3 bucket which cloudfront reads and add ssl and a subdomain
// TODO: gzip host page and static assets as part of buildTileMatrix, and in deploy set http headers for Content-Encoding
// TODO: add ui notice for event listener if input worst case approaches infinity that it's possible this might not complete, run anyway?
// TODO: have an index-debug.html that loads source maps for debugging in production

const inputMatrix: Array<Array<number>> = [
	[0, 8, 1, 1],
	[1, 0, 1, 1],
	[1, 0, 8, 8],
	[1, 4, 8, 8],
	[0, 1, 1, 8],
	[8, 1, 1, 8]
];

const rootContainerDomNode = document.getElementById('root_container');

if(rootContainerDomNode === null) {
	throw 'Root Container Dom Node Not Found';
}

const display = new Display(rootContainerDomNode);
const grid = Grid.buildTileMatrix(inputMatrix);
const edgeDirection = new EdgeDirection(grid);
const outputMatrix: OutputMatrix = new OutputMatrix(display.render.bind(display), grid, 2000);
const plane: Plane = new Plane(outputMatrix, grid, edgeDirection);

plane.placeTiles(inputMatrix);
