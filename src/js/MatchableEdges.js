// @flow

import {Tile} from './Tile';
import {TileAndDirection} from './TileAndDirection';
import {GridPosition} from './GridPosition';
import {EdgeDirection} from './EdgeDirection';
import {Grid} from './Grid';

class MatchableEdges {
	_mapOfStringToListOfTileAndDirection: Map<string, Array<TileAndDirection>>;
	_edgeDirection: EdgeDirection;

	constructor(edgeDirection: EdgeDirection, mapOfStringToListOfTileAndDirection: Map<string, Array<TileAndDirection>>) {
		this._mapOfStringToListOfTileAndDirection = mapOfStringToListOfTileAndDirection;
		this._edgeDirection = edgeDirection;
	}

	static buildMatchableEdges(edgeDirection: EdgeDirection, mapOfStringToListOfTileAndDirection: Map<string, Array<TileAndDirection>> = new Map()) : MatchableEdges {
		if(mapOfStringToListOfTileAndDirection.size === 0) {
			return new MatchableEdges(edgeDirection, new Map());
		}

		return new MatchableEdges(edgeDirection, mapOfStringToListOfTileAndDirection);
	}

	add(tile: Tile, edgeDirection: string) : void {
		const edgeValues = tile.getEdgeValueByDirection(edgeDirection);

		if (this._mapOfStringToListOfTileAndDirection.has(edgeValues)) {
			let listOfTileAndDirection: Array<TileAndDirection> | void = this._mapOfStringToListOfTileAndDirection.get(edgeValues);

			if (typeof listOfTileAndDirection !== 'undefined') {
				listOfTileAndDirection.push(new TileAndDirection(tile, edgeDirection));
				this._mapOfStringToListOfTileAndDirection.set(edgeValues, listOfTileAndDirection);
			}
		} else {
			this._mapOfStringToListOfTileAndDirection.set(edgeValues, this._buildListOfTileAndDirection(tile, edgeDirection));
		}
	}

	deepCopy(): MatchableEdges {
		let copyOfMatchableEdges: Map<string, Array<TileAndDirection>> = new Map();

		for(let [key, value] of this._mapOfStringToListOfTileAndDirection.entries()) {
			let copyOfListOfTileAndDirection: Array<TileAndDirection> = [];

			value.forEach((tileAndDirection: TileAndDirection) => {
				let copyOfTileAndDirection: TileAndDirection = new TileAndDirection(tileAndDirection.getTile(), tileAndDirection.getDirection());
				copyOfListOfTileAndDirection.push(copyOfTileAndDirection);
			});

			copyOfMatchableEdges.set(key, copyOfListOfTileAndDirection);
		}

		return MatchableEdges.buildMatchableEdges(this._edgeDirection, copyOfMatchableEdges);
	}

	hasEdgeValue(edgeValue: string) : boolean {
		return this._mapOfStringToListOfTileAndDirection.has(edgeValue);
	}

	removeByPosition(edgeValuesAtDirection: string, attemptedNextTilePosition: GridPosition,
					 nextTilePositionDirection: string, existingTilePositionDirection: string): void {
		let listOfTileAndDirectionAtDirection: Array<TileAndDirection> | void = this._mapOfStringToListOfTileAndDirection.get(edgeValuesAtDirection);

		if(typeof listOfTileAndDirectionAtDirection === 'undefined') {
			listOfTileAndDirectionAtDirection = [];
		}

		for(let tileAndDirectionAtDirectionIndex = 0; tileAndDirectionAtDirectionIndex < listOfTileAndDirectionAtDirection.length; tileAndDirectionAtDirectionIndex++) {
			let tileAndDirectionAtDirection: TileAndDirection = listOfTileAndDirectionAtDirection[tileAndDirectionAtDirectionIndex];

			if (tileAndDirectionAtDirection.getTile().getPosition().isAtDirection(attemptedNextTilePosition, nextTilePositionDirection) &&
				tileAndDirectionAtDirection.getDirection() === existingTilePositionDirection) {
				listOfTileAndDirectionAtDirection.splice(tileAndDirectionAtDirectionIndex);
				break;
			}
		}
		if (listOfTileAndDirectionAtDirection.length === 0){
			this._mapOfStringToListOfTileAndDirection.delete(edgeValuesAtDirection);
		}
	}

	updateTileByEdgeDirection(grid: Grid, nextTilePositionDirection: string, existingTilePositionDirection: string, tileBeingPlaced: Tile,
							  attemptedNextTilePosition: GridPosition, rowOffset: number, columnOffset: number): void {
		if(this._edgeDirection.isNot(nextTilePositionDirection, existingTilePositionDirection)) {
			if(grid.positionContainsNonNullTile(attemptedNextTilePosition.getRowIndex() + rowOffset, attemptedNextTilePosition.getColumnIndex() + columnOffset)) {
				this.removeByPosition(tileBeingPlaced.getEdgeValueByDirection(nextTilePositionDirection),
					attemptedNextTilePosition, nextTilePositionDirection, this._edgeDirection.getOpposite(nextTilePositionDirection));
			} else {
				this.add(tileBeingPlaced, nextTilePositionDirection);
			}
		}
	}

	removeByEdgeValue(edgeValue: string): void {
		this._mapOfStringToListOfTileAndDirection.delete(edgeValue);
	}

	getListOfTilesAndDirectionsByEdgeValue(edgeValue: string) : Array<TileAndDirection> {
		const listOfTilesAndDirectionsByEdgeValue = this._mapOfStringToListOfTileAndDirection.get(edgeValue);

		if(typeof listOfTilesAndDirectionsByEdgeValue === 'undefined') {
			return [];
		}

		return listOfTilesAndDirectionsByEdgeValue;
	}

	_buildListOfTileAndDirection(t: Tile, position: string): Array<TileAndDirection> {
		let listOfTileAndDirection: Array<TileAndDirection> = [];
		let tileAndDirection: TileAndDirection = new TileAndDirection(t, position);

		listOfTileAndDirection.push(tileAndDirection);

		return listOfTileAndDirection;
	}
}

export {MatchableEdges}
