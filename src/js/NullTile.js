// @flow

import {Tile} from './Tile';

class NullTile extends Tile {
	constructor() {
		super([]);
	}
}

export {NullTile}
