class OppositeEdge {
	_direction: string;
	_rowOffset: number;
	_columnOffset: number;

	constructor(direction, rowOffset, columnOffset) {
		this._direction = direction;
		this._rowOffset = rowOffset;
		this._columnOffset = columnOffset;
	}

	getDirection() {
		return this._direction;
	}

	getRowOffset() {
		return this._rowOffset;
	}

	getColumnOffset() {
		return this._columnOffset;
	}
}

export {OppositeEdge}
