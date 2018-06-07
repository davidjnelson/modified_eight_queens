// @flow

import {EdgeDirections} from './EdgeDirections';

/*
         negative
             |
             |
negative____0|__________column(positive)
             |
             |
             |
             row(positive)
*/

class GridPosition {
	_rowCoordinate: number;
	_columnCoordinate: number;

	constructor(rowCoordinate: number, columnCoordinate: number) {
		this._rowCoordinate = rowCoordinate;
		this._columnCoordinate = columnCoordinate;
	}

	isAtDirection(position: GridPosition, positionTileDirection: string) : boolean {
		switch(positionTileDirection) {
			case EdgeDirections.TOP: {
				return this._columnCoordinate === position.getColumnIndex() && this._rowCoordinate === position.getRowIndex() - 1;
			}
			case EdgeDirections.RIGHT: {
				return this._columnCoordinate === position.getColumnIndex() + 1 && this._rowCoordinate === position.getRowIndex();
			}
			case EdgeDirections.BOTTOM: {
				return this._columnCoordinate === position.getColumnIndex() && this.getRowIndex() === position.getRowIndex() + 1;
			}
			case EdgeDirections.LEFT: {
				return this._columnCoordinate === position.getColumnIndex() - 1 && this._rowCoordinate === position.getRowIndex();
			}
			default: {
				return false;
			}
		}
	}

	getColumnIndex(): number {
		return this._columnCoordinate;
	}

	getRowIndex(): number {
		return this._rowCoordinate;
	}
}

export {GridPosition}
