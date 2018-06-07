class PlaceTilesResult {
	_isSolvable: boolean;
	_outputMatrix: Array<Array<number>>;

	constructor(isSolvable, outputMatrix) {
		this._isSolvable = isSolvable;
		this._outputMatrix = outputMatrix;
	}

	isSolvable() {
		return this._isSolvable;
	}

	getOutputMatrix() {
		return this._outputMatrix;
	}
}

export {PlaceTilesResult}
