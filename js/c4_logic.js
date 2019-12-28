
// variable used to store row availability of column
var heights = Array(numCols).fill(0);

// variable to keep track of base bit index of each column
var base = Array(numCols).fill(0); 

for(var i = 0; i < numCols; i++) {
	base[i] = i*(numRows+1);
}

// keeps track of current player
var player = 1;

// each player gets 2 x 32-bit integers representing their respective boards
// board[player][0] - holds information about positions 0-31
// board[player][1] - holds information about positions 32-64

var board = {
	1: new Array(2).fill(0), // string 1
	2: new Array(2).fill(0) // string 2
};


function updateBoard(player,col,row) {

	board[player]
}

function checkWon(player) {

}