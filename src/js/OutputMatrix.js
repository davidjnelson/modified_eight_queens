// @flow

import {Grid} from './Grid';
import {Tile} from './Tile';

class OutputMatrix {
	_stateChangedHandler: (outputMatrix: Array<Array<Tile>>, complete: boolean) => void;
	_delayMilliseconds: number;
	_grid: Grid;

	constructor(stateChangedHandlerToRegister: (outputMatrix: Array<Array<Tile>>, complete: boolean) => void,
				grid: Grid, delayMilliseconds: number = 0) {

		this._stateChangedHandler = stateChangedHandlerToRegister;
		this._grid = grid;
		this._delayMilliseconds = delayMilliseconds;
	}

	raiseStateChanged(placedTileIndex: number, complete: boolean = false) {
		const gridDeepCopy: Grid = this._grid.deepCopy();
		const outputMatrix: Array<Array<Tile>> = gridDeepCopy.getTileMatrix();

		setTimeout(this._onStateChanged.bind(this), this._delayMilliseconds * (placedTileIndex), outputMatrix, complete);
	}

	getOutputMatrix(): Array<Array<number>> {
		return this._trimOutputMatrix();
	}

	_trimOutputMatrix(): Array<Array<number>> {
		let outputMatrix = [];

		let startingRowIndex: number = Number.MAX_VALUE;
		let endingRowIndex: number = Number.MIN_VALUE;
		let startingColumnIndex: number = Number.MAX_VALUE;
		let endColumnIndex: number = Number.MIN_VALUE;

		//don't print the empty area
		for (let rowWithEmptyCellsIndex = 0; rowWithEmptyCellsIndex < this._grid.getTileMatrixLength(); rowWithEmptyCellsIndex++) {
			for (let columnWithEmptyCellsIndex = 0; columnWithEmptyCellsIndex < this._grid.getRowLengthByIndex(rowWithEmptyCellsIndex); columnWithEmptyCellsIndex++) {
				if (this._grid.positionContainsNonNullTile(rowWithEmptyCellsIndex, columnWithEmptyCellsIndex)) {
					startingRowIndex = Math.min(startingRowIndex, rowWithEmptyCellsIndex);
					startingColumnIndex = Math.min(startingColumnIndex, columnWithEmptyCellsIndex);
					endingRowIndex = Math.max(endingRowIndex, rowWithEmptyCellsIndex);
					endColumnIndex = Math.max(endColumnIndex, columnWithEmptyCellsIndex);
				}
			}
		}

		let rowIndex = 0;

		for (let rowIndexWithOffset = startingRowIndex; rowIndexWithOffset <= endingRowIndex; rowIndexWithOffset++) {
			let columnIndex = 0;

			outputMatrix.push([]);

			for (let columnTopEdgeIndexWithOffset = startingColumnIndex; columnTopEdgeIndexWithOffset <= endColumnIndex; columnTopEdgeIndexWithOffset++) {
				if (this._grid.positionContainsNonNullTile(rowIndexWithOffset, columnTopEdgeIndexWithOffset)) {
					const digits: Array<number> = this._grid.getTileAtPosition(rowIndexWithOffset, columnTopEdgeIndexWithOffset).getDigits();

					outputMatrix[rowIndex][columnIndex] = digits[0];
					outputMatrix[rowIndex][columnIndex + 1] = digits[1];
				} else {
					outputMatrix[rowIndex][columnIndex] = -1;
					outputMatrix[rowIndex][columnIndex + 1] = -1;
				}

				columnIndex += 2;
			}

			rowIndex++;
			columnIndex = 0;

			outputMatrix.push([]);

			for (let columnBottomEdgeIndexWithOffset = startingColumnIndex; columnBottomEdgeIndexWithOffset <= endColumnIndex; columnBottomEdgeIndexWithOffset++) {
				if (this._grid.positionContainsNonNullTile(rowIndexWithOffset, columnBottomEdgeIndexWithOffset)) {
					const digits: Array<number> = this._grid.getTileAtPosition(rowIndexWithOffset, columnBottomEdgeIndexWithOffset).getDigits();

					outputMatrix[rowIndex][columnIndex] = digits[3];
					outputMatrix[rowIndex][columnIndex + 1] = digits[2];
				} else {
					outputMatrix[rowIndex][columnIndex] = -1;
					outputMatrix[rowIndex][columnIndex + 1] = -1;
				}

				columnIndex += 2;
			}

			rowIndex++;
		}

		return outputMatrix;
	}

	_onStateChanged(outputMatrix: Array<Array<Tile>>, complete: boolean): void {
		if (typeof this._stateChangedHandler !== 'undefined') {
			this._stateChangedHandler(outputMatrix, complete);
		}
	}
}

export {OutputMatrix}
