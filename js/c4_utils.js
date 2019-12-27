// variable game size
var numRows = 5;
var numCols = 6;

// board size
var boardWidth_px = 700;
var boardHeight_px = 500;

// top-left pixel location of board
var boardx = 1000/2-boardWidth_px/2;
var boardy = 120;

/*
	dx - horizontal space in pixels between tokens 
	boardWidth_px = numCols*tokenD + (numCols+1)*dx
	dx/tokenD = 0.20
	2 equations - 2 unknowns
*/

var tokenD = boardWidth_px/(numCols +(numCols+1)*0.20);
var tokenR = tokenD/2;
var dx = 0.20*tokenD;
var dy = (boardHeight_px - numRows*tokenD)/(numRows+1);

function initBoard(ctx) {
	// drawing board
	ctx.beginPath();
	ctx.rect(boardx, boardy, boardWidth_px, boardHeight_px);
	ctx.fillStyle = "#0000FF";
	ctx.fill();
	ctx.closePath();

	// draw space
	for(var i = 0; i < numRows; i++) {
		for(var j = 0; j < numCols; j++) {
			ctx.beginPath();
			ctx.arc(boardx + tokenR + dx + (dx+tokenD)*j, boardy + tokenR + dy + (dy+tokenD)*i, tokenR, 0, Math.PI*2, false);
			ctx.fillStyle = "white";
			ctx.fill();
			ctx.closePath();
		}
	}
}

// converts mouse click position to board column selection
function px2Col(px) {
	var offset = window.innerWidth/2 - 1000/2 + boardx; 
	var colWidth = dx + tokenD;
	px -= offset;
	var col = Math.floor(px/colWidth);
	
	if(col < 0) col = 0;
	if(col >= numCols) col = numCols-1;
	return col;
}

function findRow(column) {
	
	var row = heights[column];
	if(row >= numRows) {
		row = -1;
	} else {
		heights[column]++;
	}
	
	return row;
}

// param player - indicates color of token
// param column - indicates the column in which to draw token
// param row 	- indicates the row in which to draw token
function drawToken(player, column, row) {
	if (player == 1) {
		color = "red";
	}
	else {
		color = "yellow";
	}

	ctx.beginPath();
	ctx.arc(boardx + tokenR + dx + (dx+tokenD)*column, boardy + boardHeight_px - (tokenR + dy + (dy+tokenD)*row), tokenR, 0, Math.PI*2, false);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.closePath();
}
