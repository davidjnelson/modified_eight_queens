// @flow

import {Tile} from './Tile';
import {NullTile} from './NullTile';
import {TileAndDirection} from './TileAndDirection';
import {GridPosition} from './GridPosition';
import {EdgeDirection} from './EdgeDirection';
import {Grid} from './Grid';
import {OutputMatrix} from './OutputMatrix';
import {MatchableEdges} from './MatchableEdges';
import {PlaceTilesResult} from './PlaceTilesResult';
import {OppositeEdge} from './OppositeEdge';
import {EdgeDirections} from './EdgeDirections';

class Plane {
	_verbose: boolean;
	_outputMatrix: OutputMatrix;
	_grid: Grid;
	_edgeDirection: EdgeDirection;

	constructor(outputMatrix: OutputMatrix, grid: Grid, edgeDirection: EdgeDirection, verbose: boolean = false) {
		this._outputMatrix = outputMatrix;
		this._grid = grid;
		this._edgeDirection = edgeDirection;
		this._verbose = verbose;
	}

	placeTiles(inputMatrix: Array<Array<number>>): boolean {
		if(this._verbose) {
			console.log('began algorithm:');
			console.log('----------------');
		}

		const tileIndex: number = 0;
		const tileSetSize: number = inputMatrix.length;
		const listOfTiles = Tile.buildListOfTiles(inputMatrix);

		for (let rotationCount: number = 0; rotationCount < 4; rotationCount++) {
			const firstTile: Tile = listOfTiles[tileIndex];

			this._grid.placeTileInCenter(firstTile);

			if(this._verbose) {
				if (rotationCount === 0) {
					console.log('Tile ' + (tileIndex + 1) + ' - no rotation');
				} else {
					console.log('Tile ' + (tileIndex + 1) + ' - rotated ' + rotationCount * 90 + ' degrees clockwise');
				}
			}

			this._outputMatrix.raiseStateChanged(tileIndex);

			const matchableEdges = MatchableEdges.buildMatchableEdges(this._edgeDirection);

			matchableEdges.add(firstTile, EdgeDirections.TOP);
			matchableEdges.add(firstTile, EdgeDirections.RIGHT);
			matchableEdges.add(firstTile, EdgeDirections.BOTTOM);
			matchableEdges.add(firstTile, EdgeDirections.LEFT);

			if (this._depthFirstSearch(listOfTiles, tileIndex + 1, matchableEdges)) {
				if(this._verbose) {
					console.log('solved.');
				}

				this._outputMatrix.raiseStateChanged(tileIndex, true);

				return new PlaceTilesResult(true, this._outputMatrix.getOutputMatrix());
			}

			firstTile.rotate();
		}

		// after 4 rotations, still no solution

		if(this._verbose) {
			console.log('no solution');
		}

		this._outputMatrix.raiseStateChanged(tileIndex, true);

		return new PlaceTilesResult(false, []);
	}

	_depthFirstSearch (tileSet: Array<Tile>, tileIndex: number, matchableEdges: MatchableEdges): boolean {
		if(this._verbose) {
			console.log('began recursion');
		}

		// base case
		if (tileIndex >= tileSet.length) {
			return true;
		}

		// try four possible rotations, if any match, keep going
		for(let rotationCount: number = 0; rotationCount < 4; rotationCount++) {
			let tileBeingPlaced: Tile = tileSet[tileIndex];
			let exploredPosition: Set<GridPosition> = new Set();

			if(this._exploreEdge(matchableEdges, tileBeingPlaced, exploredPosition, rotationCount, tileIndex, tileSet, EdgeDirections.TOP) ||
				this._exploreEdge(matchableEdges, tileBeingPlaced, exploredPosition, rotationCount, tileIndex, tileSet, EdgeDirections.LEFT) ||
				this._exploreEdge(matchableEdges, tileBeingPlaced, exploredPosition, rotationCount, tileIndex, tileSet, EdgeDirections.RIGHT) ||
				this._exploreEdge(matchableEdges, tileBeingPlaced, exploredPosition, rotationCount, tileIndex, tileSet, EdgeDirections.BOTTOM)) {
				return true;
			}

			//if four edges are the same, break the loop, no need to rotate
			if (tileBeingPlaced.getEdgeValueByDirection(EdgeDirections.TOP) === tileBeingPlaced.getEdgeValueByDirection(EdgeDirections.BOTTOM) &&
				tileBeingPlaced.getEdgeValueByDirection(EdgeDirections.LEFT) === tileBeingPlaced.getEdgeValueByDirection(EdgeDirections.RIGHT)) {
				break;
			}

			tileBeingPlaced.rotate();
		}

		// no solution found for current tile, so unwind stack frame and backtrack
		if(this._verbose) {
			console.log('begin backtracking');
		}

		return false;
	}

	_exploreEdge(matchableEdges: MatchableEdges, tileBeingPlaced: Tile, exploredPosition: Set<GridPosition>,
				 rotationCount: number, tileIndex: number, tileSet: Array<Tile>, edgeDirection: string) : boolean | void {
		if (matchableEdges.hasEdgeValue(tileBeingPlaced.getEdgeValueByDirection(edgeDirection))) {
			const copyOfMatchableEdgesForThisStackFrame: MatchableEdges = matchableEdges.deepCopy();
			let listOfTileAndDirection: Array<TileAndDirection> | void =
				copyOfMatchableEdgesForThisStackFrame.getListOfTilesAndDirectionsByEdgeValue(tileBeingPlaced.getEdgeValueByDirection(edgeDirection));
			const oppositeEdge: OppositeEdge = this._edgeDirection.getOpposite(edgeDirection);

			if(typeof listOfTileAndDirection === 'undefined') {
				listOfTileAndDirection = [];
			}

			for(let tileAndDirectionIndex = 0; tileAndDirectionIndex < listOfTileAndDirection.length; tileAndDirectionIndex++) {
				let tileAndDirection = listOfTileAndDirection[tileAndDirectionIndex];

				if (tileAndDirection.getDirection() === oppositeEdge.getDirection()) {
					let existingTile: Tile = tileAndDirection.getTile();
					let existingTilePosition: GridPosition = existingTile.getPosition();
					let attemptedNextTilePosition: GridPosition = new GridPosition(existingTilePosition.getRowIndex() +
						oppositeEdge.getRowOffset(), existingTilePosition.getColumnIndex() + oppositeEdge.getColumnOffset());
					tileBeingPlaced.setPosition(attemptedNextTilePosition);

					if (!exploredPosition.has(attemptedNextTilePosition) && this._edgeDirection.matchesAllNeighbors(attemptedNextTilePosition, tileBeingPlaced) ) {
						this._grid.placeTileAtPosition(tileBeingPlaced, attemptedNextTilePosition.getRowIndex(), attemptedNextTilePosition.getColumnIndex());
						exploredPosition.add(attemptedNextTilePosition);
					} else {
						continue;
					}

					//remove matched edge
					if (listOfTileAndDirection.length > 1) {
						listOfTileAndDirection.splice(tileAndDirectionIndex);
					} else {
						copyOfMatchableEdgesForThisStackFrame.removeByEdgeValue(tileBeingPlaced.getEdgeValueByDirection(edgeDirection));
					}

					copyOfMatchableEdgesForThisStackFrame.updateTileByEdgeDirection(this._grid, EdgeDirections.TOP, edgeDirection, tileBeingPlaced, attemptedNextTilePosition, -1, 0);
					copyOfMatchableEdgesForThisStackFrame.updateTileByEdgeDirection(this._grid, EdgeDirections.LEFT, edgeDirection, tileBeingPlaced, attemptedNextTilePosition, 0, -1);
					copyOfMatchableEdgesForThisStackFrame.updateTileByEdgeDirection(this._grid, EdgeDirections.RIGHT, edgeDirection, tileBeingPlaced, attemptedNextTilePosition, 0, +1);
					copyOfMatchableEdgesForThisStackFrame.updateTileByEdgeDirection(this._grid, EdgeDirections.BOTTOM, edgeDirection, tileBeingPlaced, attemptedNextTilePosition, +1, 0);

					if(this._verbose) {
						if (rotationCount === 0) {
							console.log("Tile " + (tileIndex + 1) + " - no rotation");
						} else {
							console.log('Tile ' + (tileIndex + 1) + ' - rotated ' + rotationCount * 90 + ' degrees clockwise');
						}
					}

					this._outputMatrix.raiseStateChanged(tileIndex);

					if (this._depthFirstSearch(tileSet, tileIndex + 1, copyOfMatchableEdgesForThisStackFrame)) {
						return true;
					} else {
						this._grid.placeTileAtPosition(new NullTile(), attemptedNextTilePosition.getRowIndex(), attemptedNextTilePosition.getColumnIndex());
						break;
					}
				}
			}
		}
	}
}

export {Plane}
