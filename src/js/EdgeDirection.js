// @flow

import {OppositeEdge} from './OppositeEdge';
import {Grid} from './Grid';
import {Tile} from './Tile';
import {GridPosition} from './GridPosition';
import {EdgeDirections} from './EdgeDirections';

class EdgeDirection {
	_allDirections: Array<string> = [EdgeDirections.TOP, EdgeDirections.RIGHT, EdgeDirections.BOTTOM, EdgeDirections.LEFT];
	_grid: Grid;

	constructor(grid: Grid) {
		this._grid = grid;
	}

	isNot(nextTilePositionDirection: string, existingTilePositionDirection: string) : boolean {
		return this._allDirections
			.filter((iteratedEdgeDirection) => iteratedEdgeDirection !== nextTilePositionDirection)
			.includes(existingTilePositionDirection);
	}

	getOpposite(originalEdge: string) : OppositeEdge {
		switch (originalEdge) {
			case EdgeDirections.TOP: {
				return new OppositeEdge(EdgeDirections.BOTTOM, +1, 0);
			}
			case EdgeDirections.RIGHT: {
				return new OppositeEdge(EdgeDirections.LEFT, 0, -1);
			}
			case EdgeDirections.BOTTOM: {
				return new OppositeEdge(EdgeDirections.TOP, -1, 0);
			}
			case EdgeDirections.LEFT: {
				return new OppositeEdge(EdgeDirections.RIGHT, 0, +1);
			}
			default: {
				throw 'Invalid Edge Direction';
			}
		}
	}

	matchesAllNeighbors (attemptedNewPosition: GridPosition, attemptedNewTile: Tile): boolean {
		return this._matchesOppositeNeighbor(attemptedNewPosition, attemptedNewTile, EdgeDirections.BOTTOM) &&
			this._matchesOppositeNeighbor(attemptedNewPosition, attemptedNewTile, EdgeDirections.LEFT) &&
			this._matchesOppositeNeighbor(attemptedNewPosition, attemptedNewTile, EdgeDirections.TOP) &&
			this._matchesOppositeNeighbor(attemptedNewPosition, attemptedNewTile, EdgeDirections.RIGHT);
	}

	_matchesOppositeNeighbor(attemptedNewPosition: GridPosition, attemptedNewTile: Tile, firstEdgeMatchDirection: string) : boolean {
		const oppositeEdge: OppositeEdge = this.getOpposite(firstEdgeMatchDirection);

		if (this._grid.positionContainsNonNullTile(attemptedNewPosition.getRowIndex() + oppositeEdge.getRowOffset(),
				attemptedNewPosition.getColumnIndex() + oppositeEdge.getColumnOffset())) {
			let attemptedMatchTile: Tile = this._grid.getTileAtPosition(attemptedNewPosition.getRowIndex() +
				oppositeEdge.getRowOffset(), attemptedNewPosition.getColumnIndex() + oppositeEdge.getColumnOffset());

			if (attemptedMatchTile.getEdgeValueByDirection(firstEdgeMatchDirection) !== attemptedNewTile.getEdgeValueByDirection(oppositeEdge.getDirection())) {
				return false;
			}
		}

		return true;
	}
}

export {EdgeDirection}
