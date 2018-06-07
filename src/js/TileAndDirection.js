// @flow

import {Tile} from './Tile';

// for value of hashtable
// (edge, tuple<Tile, String> string is an edge position: top left right bottom
class TileAndDirection {
	_tile: Tile;
	_direction: string;

	constructor(tile: Tile, direction: string) {
		this._tile = tile;
		this._direction = direction;
	}

	getTile(): Tile {
		return this._tile;
	}

	getDirection(): string {
		return this._direction;
	}
}

export {TileAndDirection}
