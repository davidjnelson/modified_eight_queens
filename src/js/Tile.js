// @flow

import {GridPosition} from './GridPosition';
import {EdgeDirections} from './EdgeDirections';

class Tile {
	/*
	   ______
	   |5  1|
	   |7  2|
	   ------

	   four edges: 5, 1, 2, 7
	   top: "51"
	   left: "57"
	   right: "12"
	   bottom: "72"

	*/

	_digits: Array<number>;
	_position: GridPosition;

	constructor(digits: Array<number>) {
		this._digits = digits;
		this._position = new GridPosition(0, 0);
	}

	static buildListOfTiles(tileSet: Array<Array<number>>) : Array<Tile> {
		let outputRows = [];

		tileSet.forEach(tileRow => {
			outputRows.push(new Tile(tileRow));
		});

		return outputRows;
	}

	setPosition(position: GridPosition): void {
		this._position = position;
	}

	rotate() : void {
		let length: number = this._digits.length;
		let temp: number = this._digits[this._digits.length - 1];

		for(let i: number = this._digits.length - 1; i > 0; i--){
			this._digits[i] = this._digits[i - 1];
		}

		this._digits[0] = temp;
	}

	getPosition() : GridPosition {
		return this._position;
	}

	getDigits() : Array<number> {
		return this._digits;
	}

	getEdgeValueByDirection(edgeDirection: string) : string {
		switch(edgeDirection) {
			case EdgeDirections.TOP: {
				return this._digits[0].toString() + this._digits[1].toString();
			}
			case EdgeDirections.RIGHT: {
				return this._digits[1].toString() + this._digits[2].toString();
			}
			case EdgeDirections.BOTTOM: {
				return this._digits[3].toString() + this._digits[2].toString();
			}
			case EdgeDirections.LEFT: {
				return this._digits[0].toString() + this._digits[3].toString();
			}
			default: {
				return '';
			}
		}
	}
}

export {Tile}
