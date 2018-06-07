// @flow

import {Tile} from './Tile';

class Display {
	_containerDomNode: Element;

	constructor(containerDomNode: Element) {
		this._containerDomNode = containerDomNode;
	}

	render = function (outputMatrix: Array<Array<Tile>>, complete: boolean): void {
		if(complete) {
			return;
		}

		let rowDomNode;
		let rowId = 0;
		let rowCount = outputMatrix.length;
		let columnCount = outputMatrix[0].length;
		let rowHeightPercentage = 100 / rowCount;
		let columnWidthPercentage = 100 / columnCount;

		while (this._containerDomNode.hasChildNodes()) {
			this._containerDomNode.removeChild(this._containerDomNode.lastChild);
		}

		for (let row = 0; row < rowCount; row++) {
			rowId = 'row' + row.toString();

			if (document.getElementById(rowId) === null) {
				rowDomNode = document.createElement('div');
				rowDomNode.id = rowId;
				rowDomNode.className = 'row';
				rowDomNode.setAttribute('style', 'height: ' + rowHeightPercentage.toString() + '%;');
				this._containerDomNode.appendChild(rowDomNode);
			} else {
				rowDomNode = document.getElementById(rowId);
			}

			for (let column = 0; columnCount; column++) {
				let columnDomNode = document.createElement('div');
				let tile: Tile = outputMatrix[row][column];

				columnDomNode.id = 'column' + column.toString();
				columnDomNode.className = 'column';
				columnDomNode.setAttribute('style', 'width: ' + columnWidthPercentage.toString() + '%;');

				this._renderTile(tile, columnDomNode);

				if(rowDomNode !== null) {
					rowDomNode.appendChild(columnDomNode);
				}

				if (column !== 0 && column % (columnCount - 1) === 0) {
					break;
				}
			}
		}
	}

	_renderTile(tile: Tile, columnDomNode: Element) : void {
		let columnDomNodeQuadrantHorizontalDividerLeft = document.createElement('div');
		columnDomNodeQuadrantHorizontalDividerLeft.className = 'column_dom_node_quadrant_horizontal_divider column_dom_node_quadrant_horizontal_divider_left';

		let columnDomNodeQuadrantHorizontalDividerLeftVerticalDividerLeftTop = document.createElement('div');
		columnDomNodeQuadrantHorizontalDividerLeftVerticalDividerLeftTop.className = 'column_dom_node_quadrant_vertical_divider column_dom_node_quadrant_vertical_divider_top';

		if(tile.constructor.name === 'NullTile') {
			columnDomNodeQuadrantHorizontalDividerLeftVerticalDividerLeftTop.innerHTML = '';
		} else {
			columnDomNodeQuadrantHorizontalDividerLeftVerticalDividerLeftTop.innerHTML = tile.getDigits()[0].toString();
		}

		let columnDomNodeQuadrantHorizontalDividerLeftVerticalDividerLeftBottom = document.createElement('div');
		columnDomNodeQuadrantHorizontalDividerLeftVerticalDividerLeftBottom.className = 'column_dom_node_quadrant_vertical_divider column_dom_node_quadrant_vertical_divider_bottom';

		if(tile.constructor.name === 'NullTile') {
			columnDomNodeQuadrantHorizontalDividerLeftVerticalDividerLeftBottom.innerHTML = '';
		} else {
			columnDomNodeQuadrantHorizontalDividerLeftVerticalDividerLeftBottom.innerHTML = tile.getDigits()[3].toString();
		}

		columnDomNodeQuadrantHorizontalDividerLeft.appendChild(columnDomNodeQuadrantHorizontalDividerLeftVerticalDividerLeftTop);
		columnDomNodeQuadrantHorizontalDividerLeft.appendChild(columnDomNodeQuadrantHorizontalDividerLeftVerticalDividerLeftBottom);


		let columnDomNodeQuadrantHorizontalDividerRight = document.createElement('div');
		columnDomNodeQuadrantHorizontalDividerRight.className = 'column_dom_node_quadrant_horizontal_divider column_dom_node_quadrant_horizontal_divider_right';

		let columnDomNodeQuadrantHorizontalDividerRightVerticalDividerRightTop = document.createElement('div');
		columnDomNodeQuadrantHorizontalDividerRightVerticalDividerRightTop.className = 'column_dom_node_quadrant_vertical_divider column_dom_node_quadrant_vertical_divider_top';

		if(tile.constructor.name === 'NullTile') {
			columnDomNodeQuadrantHorizontalDividerRightVerticalDividerRightTop.innerHTML = '';
		} else {
			columnDomNodeQuadrantHorizontalDividerRightVerticalDividerRightTop.innerHTML = tile.getDigits()[1].toString();
		}

		let columnDomNodeQuadrantHorizontalDividerRightVerticalDividerRightBottom = document.createElement('div');
		columnDomNodeQuadrantHorizontalDividerRightVerticalDividerRightBottom.className = 'column_dom_node_quadrant_vertical_divider column_dom_node_quadrant_vertical_divider_bottom';

		if(tile.constructor.name === 'NullTile') {
			columnDomNodeQuadrantHorizontalDividerRightVerticalDividerRightBottom.innerHTML = '';
		} else {
			columnDomNodeQuadrantHorizontalDividerRightVerticalDividerRightBottom.innerHTML = tile.getDigits()[2].toString();
		}

		columnDomNodeQuadrantHorizontalDividerRight.appendChild(columnDomNodeQuadrantHorizontalDividerRightVerticalDividerRightTop);
		columnDomNodeQuadrantHorizontalDividerRight.appendChild(columnDomNodeQuadrantHorizontalDividerRightVerticalDividerRightBottom);


		columnDomNodeQuadrantHorizontalDividerLeft.appendChild(columnDomNodeQuadrantHorizontalDividerLeftVerticalDividerLeftTop);
		columnDomNodeQuadrantHorizontalDividerLeft.appendChild(columnDomNodeQuadrantHorizontalDividerLeftVerticalDividerLeftBottom);


		columnDomNode.appendChild(columnDomNodeQuadrantHorizontalDividerLeft);
		columnDomNode.appendChild(columnDomNodeQuadrantHorizontalDividerRight);
	}
}

export {Display}

