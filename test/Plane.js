// @flow

import {describe, it} from 'mocha';
import {Plane} from '../src/js/Plane';
import {OutputMatrix} from '../src/js/OutputMatrix';
import {Grid} from '../src/js/Grid';
import {PlaceTilesResult} from '../src/js/PlaceTilesResult';
import {Tile} from '../src/js/Tile';
import {EdgeDirection} from '../src/js/EdgeDirection';

const assert = require('assert');

process.on('uncaughtException', function (err) {
	console.error(err.stack);
	process.exit(1);
});

const executeTestWithEvents = (inputMatrix, expectedOutputMatrix, expectedSolvable) => {
	const grid = Grid.buildTileMatrix(inputMatrix);
	const edgeDirection = new EdgeDirection(grid);
	const outputMatrix: OutputMatrix = new OutputMatrix((outputGridTileMatrix: Array<Array<Tile>>, complete: boolean) => {
		if(complete && expectedSolvable) {
			assert.deepEqual(outputMatrix._trimOutputMatrix(), expectedOutputMatrix);
		}
	}, grid, 0);
	const plane: Plane = new Plane(outputMatrix, grid, edgeDirection, true);

	const placeTilesResult: PlaceTilesResult = plane.placeTiles(inputMatrix);

	assert.equal(placeTilesResult.isSolvable(), expectedSolvable);
};

const executeTest = (inputMatrix, expectedOutputMatrix, expectedSolvable) => {
	const grid = Grid.buildTileMatrix(inputMatrix);
	const edgeDirection = new EdgeDirection(grid);
	const outputMatrix: OutputMatrix = new OutputMatrix((outputMatrix: Array<Array<Tile>>, complete: boolean) => {}, grid, 0);
	const plane: Plane = new Plane(outputMatrix, grid, edgeDirection, true);

	const placeTilesResult: PlaceTilesResult = plane.placeTiles(inputMatrix);

	assert.deepEqual(placeTilesResult.getOutputMatrix(), expectedOutputMatrix);
	assert.equal(placeTilesResult.isSolvable(), expectedSolvable);
};

describe('Plane', () => {
	describe('a solvable input matrix', () => {
		describe('with one row', () => {
			it('should output an expected solved matrix', () => {
				executeTest(
					[
						[1, 1, 3, 2]
					],
					[
						[1, 1],
						[2, 3]
					],
					true
				);
			});
		});

		describe('with two rows', () => {
			it('should output an expected solved matrix', () => {
				executeTest(
					[
						[1, 1, 3, 2],
						[4, 4, 1, 1]
					],
					[
						[4, 4],
						[1, 1],
						[1, 1],
						[2, 3]
					],
					true
				);
			});
		});

		describe('with two identical rows with different values', () => {
			it('should output an expected solved matrix', () => {
				executeTest(
					[
						[1, 1, 3, 2],
						[1, 1, 3, 2]
					],
					[
						[3, 2],
						[1, 1],
						[1, 1],
						[2, 3]
					],
					true
				);
			});
		});

		describe('with three identical rows with the same values', () => {
			it('should output an expected solved matrix', () => {
				executeTest(
					[
						[1, 1, 1, 1],
						[1, 1, 1, 1],
						[1, 1, 1, 1]
					],
					[
						[1, 1],
						[1, 1],
						[1, 1],
						[1, 1],
						[1, 1],
						[1, 1]
					],
					true
				);
			});
		});

		describe('with six rows', () => {
			it('should output an expected solved matrix', () => {
				executeTest(
					[
						[1, 1, 3, 2],
						[4, 4, 1, 1],
						[1, 6, 6, 3],
						[5, 1, 2, 7],
						[4, 6, 6, 2],
						[1, 4, 8, 6]
					],
					[
						[-1, -1, 4, 4, 4, 8, -1, -1],
						[-1, -1, 1, 1, 1, 6, -1, -1],
						[ 5,  1, 1, 1, 1, 6,  6,  2],
						[ 7,  2, 2, 3, 3, 6,  6,  4]
					],
					true
				);
			});
		});

		describe('with rotating previously placed tiles while backtracking', () => {
			it('should output an expected solved matrix', () => {
				executeTest(
					[
						[0, 8, 1, 1],
						[1, 0, 1, 1],
						[1, 0, 8, 8],
						[1, 4, 8, 8],
						[0, 1, 1, 8],
						[8, 1, 1, 8]
					],
					[
						[ -1, -1, 0, 8, -1, -1 ],
						[ -1, -1, 1, 1, -1, -1 ],
						[ 8,   1, 1, 1, -1, -1 ],
						[ 8,   1, 1, 0, -1, -1 ],
						[ -1, -1, 1, 0,  0,  1 ],
						[ -1, -1, 8, 8,  8,  1 ],
						[ -1, -1, 8, 8, -1, -1 ],
						[ -1, -1, 4, 1, -1, -1 ]
					],
					true
				);
			});
		});

		describe('with a square shape of tiles and a hole in the middle', () => {
			it('should output an expected solved matrix', () => {
				executeTest(
					[
						[1, 2, 4, 3],
						[2, 8, 7, 4],
						[8, 1, 1, 7],
						[7, 1, 0, 0],
						[0, 0, 3, 9],
						[4, 0, 9, 6],
						[1, 4, 6, 8],
						[3, 4, 4, 1]
					],
					[
						[ 1, 2,  2,  8, 8, 1 ],
						[ 3, 4,  4,  7, 7, 1 ],
						[ 3, 4, -1, -1, 7, 1 ],
						[ 1, 4, -1, -1, 0, 0 ],
						[ 1, 4,  4,  0, 0, 0 ],
						[ 8, 6,  6,  9, 9, 3 ]
					],
					true
				);
			});
		});

		describe('with a square shape of tiles fitting a tile not needing rotation in the middle', () => {
			it('should output an expected solved matrix', () => {
				executeTest(
					[
						[1, 2, 4, 3],
						[2, 8, 7, 4],
						[8, 1, 1, 7],
						[7, 1, 0, 0],
						[0, 0, 3, 9],
						[4, 0, 9, 6],
						[1, 4, 6, 8],
						[3, 4, 4, 1],
						[4, 7, 0, 4]
					],
					[
						[ 1, 2,  2, 8, 8, 1 ],
						[ 3, 4,  4, 7, 7, 1 ],
						[ 3, 4,  4, 7, 7, 1 ],
						[ 1, 4,  4, 0, 0, 0 ],
						[ 1, 4,  4, 0, 0, 0 ],
						[ 8, 6,  6, 9, 9, 3 ]
					],
					true
				);
			});
		});

		describe('with a square shape of tiles fitting a tile needing rotation in the middle', () => {
			it('should output an expected solved matrix', () => {
				executeTest(
					[
						[1, 2, 4, 3],
						[2, 8, 7, 4],
						[8, 1, 1, 7],
						[7, 1, 0, 0],
						[0, 0, 3, 9],
						[4, 0, 9, 6],
						[1, 4, 6, 8],
						[3, 4, 4, 1],
						[7, 0, 4, 4]
					],
					[
						[ 1, 2,  2, 8, 8, 1 ],
						[ 3, 4,  4, 7, 7, 1 ],
						[ 3, 4,  4, 7, 7, 1 ],
						[ 1, 4,  4, 0, 0, 0 ],
						[ 1, 4,  4, 0, 0, 0 ],
						[ 8, 6,  6, 9, 9, 3 ]
					],
					true
				);
			});
		});
	});

	describe('an unsolvable input matrix', () => {
		describe('with three identical rows with different values', () => {
			it('should return not solvable', () => {
				executeTest(
					[
						[1, 1, 3, 2],
						[1, 1, 3, 2],
						[1, 1, 3, 2]
					],
					[],
					false
				);
			});
		});

		describe('with rotating previously placed tiles while backtracking', () => {
			it('should return not solvable', () => {
				executeTest(
					[
						[1, 2, 3, 4],
						[2, 3, 4, 5]
					],
					[],
					false
				);
			});
		});

		describe('with a square shape of tiles fitting a tile needing rotation in the middle that does not match one edge', () => {
			it('should return not solvable', () => {
				executeTest(
					[
						[1, 2, 4, 3],
						[2, 8, 7, 4],
						[8, 1, 1, 7],
						[7, 1, 0, 0],
						[0, 0, 3, 9],
						[4, 0, 9, 6],
						[1, 4, 6, 8],
						[3, 4, 4, 1],
						[7, 0, 4, 5]
					],
					[],
					false
				);
			});
		});

		describe('with 10 rows', () => {
			it('should return not solvable', () => {
				executeTest(
					[
						[1, 1, 2, 1],
						[1, 2, 3, 9],
						[9, 3, 9, 9],
						[3, 9, 8, 9],
						[9, 5, 6, 8],
						[5, 7, 6, 6],
						[7, 7, 7, 5],
						[1, 3, 4, 2],
						[4, 5, 7, 4],
						[2, 4, 9, 3]
					],
					[],
					false
				);
			});
		});
	});

	describe('raised events', () => {
		describe('with solvable input', () => {
			it('should return solvable', () => {
				executeTestWithEvents(
					[
						[1, 1, 3, 2],
						[4, 4, 1, 1]
					],
					[
						[4, 4],
						[1, 1],
						[1, 1],
						[2, 3]
					],
					true
				);
			});
		});

		describe('with unsolvable input', () => {
			it('should return unsolvable', () => {
				executeTestWithEvents(
					[
						[1, 1, 2, 1],
						[1, 2, 3, 9],
						[9, 3, 9, 9],
						[3, 9, 8, 9],
						[9, 5, 6, 8],
						[5, 7, 6, 6],
						[7, 7, 7, 5],
						[1, 3, 4, 2],
						[4, 5, 7, 4],
						[2, 4, 9, 3]
					],
					[],
					false
				);
			});
		});
	});
});
