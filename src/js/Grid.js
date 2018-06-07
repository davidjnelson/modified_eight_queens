// @flow

import {NullTile} from './NullTile';
import {GridPosition} from './GridPosition';
import {Tile} from './Tile';

class Grid {
	_tileMatrix: Array<Array<Tile>>;
	_tileMatrixLength: number;
	_inputMatrixLength: number;

	constructor(tileMatrixLength: number, tileMatrix: Array<Array<Tile>>, inputMatrixLength: number) {
		this._tileMatrixLength = tileMatrixLength;
		this._tileMatrix = tileMatrix;
		this._inputMatrixLength = inputMatrixLength;
	}

	static buildTileMatrix(inputMatrix: Array<Array<number>>): Grid {
		const gridSize: number = inputMatrix.length * 2 + 1;
		let tileMatrix: Array<Array<Tile>> = [];

		for (let rowCount = 0; rowCount < gridSize; rowCount++) {
			tileMatrix.push([]);
			for(let columnCount = 0; columnCount < gridSize; columnCount++) {
				tileMatrix[rowCount].push(new NullTile());
			}
		}

		return new Grid(gridSize, tileMatrix, inputMatrix.length);
	}

	placeTileInCenter(tile: Tile) : void {
		tile.setPosition(new GridPosition(this._inputMatrixLength, this._inputMatrixLength));
		this._tileMatrix[this._inputMatrixLength][this._inputMatrixLength] = tile;
	}

	positionContainsNonNullTile(rowIndex: number, columnIndex: number) : boolean {
		return this._tileMatrix[rowIndex][columnIndex].constructor.name !== 'NullTile';
	}

	getTileAtPosition(rowIndex: number, columnIndex: number) : Tile {
		return this._tileMatrix[rowIndex][columnIndex];
	}

	placeTileAtPosition(tile: Tile, rowIndex: number, columnIndex: number) : void {
		this._tileMatrix[rowIndex][columnIndex] = tile;
	}

	getTileMatrixLength() : number {
		return this._tileMatrixLength;
	}

	getRowLengthByIndex(rowIndex: number) : number {
		return this._tileMatrix[rowIndex].length;
	}

	getTileMatrix(): Array<Array<Tile>> {
		return this._tileMatrix;
	}

	deepCopy(): Grid {
		const gridSize: number = this._tileMatrix.length;
		let tileMatrix: Array<Array<Tile>> = [];

		for (let rowCount = 0; rowCount < gridSize; rowCount++) {
			tileMatrix.push([]);
			for(let columnCount = 0; columnCount < gridSize; columnCount++) {
				tileMatrix[rowCount].push(this._tileMatrix[rowCount][columnCount]);
			}
		}

		return new Grid(gridSize, tileMatrix, gridSize);
	}
}

export {Grid}
