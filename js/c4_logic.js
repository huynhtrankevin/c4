

// variable used to store bit index of first row in each column
var base = Array(numCols).fill(0);
for(var i = 0; i < numCols; i++) {
  base[i] = i*(numRows+1);
}

// keeps track of current player
var player = 1;

// each player gets 2 x 32-bit integers representing their respective boards
// board[player][0] - holds information about positions 0-31
// board[player][1] - holds information about positions 32-64

var arr = {
  0: new Uint32Array(2).fill(0),
  1: new Uint32Array(2).fill(0),
  2: new Uint32Array(2).fill(0),
  3: new Uint32Array(2).fill(0)
};


var board = {
  1: new Uint32Array(2).fill(0),
  2: new Uint32Array(2).fill(0),
  "heights": Array(numCols).fill(0)	// variable used to store row availability of column
};


function scoreState(board) {
 	var p1Score = 0;	// minimizer
 	var p2Score = 0;	// maximizer

 	// check number of alignments of 3 in a row
 	p1Score = -checkAlignment(board,1,3);
 	p2Score = checkAlignment(board,2,3);

 	var score = p1Score + p2Score;

 	return score;
}

function minimax(board, depth, player) {
	var bboard = JSON.parse(JSON.stringify(board));
	if(player == 1) {
		var nextPlayer = 2;
	} else {
		var nextPlayer = 1;
	}

	

	// if at terminal depth, score state
	if(depth == 0) {
		// score state
		// return val
		var actionScoreArr = Array(1).fill(0);
		var score = scoreState(bboard);
		actionScoreArr[0] = score;
		return actionScoreArr;

	} else {
		var actionScoreArr = Array(numCols).fill(0);
		// recurse on child nodes
		for(var col = 0; col < numCols; col++) {
			// create a clone so that we don't modify the original
			let mboard = JSON.parse(JSON.stringify(bboard));
			let row = findRow(mboard,col);

			if(row != -1) {
				// valid row, continue
				updateBoard(mboard,row,col);
				var Varray = minimax(mboard, depth-1, nextPlayer);
				
				// minimizer
				if(nextPlayer == 1) {
					actionScoreArr[col] = Math.min(Varray);
				} else {
					actionScoreArr[col] = Math.max(Varray);
				}
			} else {
				if(player == 1) {
					actionScoreArr[col] = 10000;
				} else {
					actionScoreArr[col] = -10000;
				}				
			}
		}

		return actionScoreArr;
	}
}


function updateBoard(bboard, col, row) {

  // get bit index of token position
  let bidx = base[col] + row;

  // get the correct bitstring idx into mboard
  // divide bit index by 32 (size of elements of mboard)
  let bsidx = Math.floor(bidx/32);
  var bs = bboard[player][bsidx];

  // find number of times to shift into this bitstring
  let shift = bidx%32;
  bs = bs | (1 << shift);
  bboard[player][bsidx] = bs;
}


// param player: current player
// param n: number of tokens in a row to check for
// returns number of alignments of n tokens
function checkAlignment(board, player, n) {
	var mboard = board[player];
	var bs0 = mboard[0];
	var bs1 = mboard[1];
	var isAligned = new Uint32Array(1).fill(0);
	var alignments = 0;

	
	
	// check horizontal (shifts of 7)
	arr[0][0] = bs0;
	arr[0][1] = bs1;

	var tmp1 =  bs0;
	var tmp2 =  bs1;

	var shift = 7;
	for(var i = 1; i < n; i++) {
		arr[i][0] = (arr[i-1][0] >> shift) | ((arr[i-1][1] & 0x7F) << (32-shift));
		arr[i][1] = arr[i-1][1] >> shift;
		tmp1 &= arr[i][0];
		tmp2 &= arr[i][1];
	}
	isAligned = tmp1 | tmp2;
	alignments += getNumberOfOnes(isAligned);

	// check vertical
	// shift by 1
	tmp1 =  bs0;
	tmp2 =  bs1;
	shift = 1;
	for(var i = 1; i < n; i++) {
		arr[i][0] = (arr[i-1][0] >> shift) | ((arr[i-1][1] & 0x01) << (32-shift));
		arr[i][1] = arr[i-1][1] >> shift;
		tmp1 &= arr[i][0];
		tmp2 &= arr[i][1];
	}

	isAligned = tmp1 | tmp2;
	alignments += getNumberOfOnes(isAligned);

	// check diag /
	// shift by 8
	tmp1 =  bs0;
	tmp2 =  bs1;
	shift = 8;
	for(var i = 1; i < n; i++) {
	  arr[i][0] = (arr[i-1][0] >> shift) | ((arr[i-1][1] & 0xFF) << (32-shift));
	  arr[i][1] = arr[i-1][1] >> shift;
	  tmp1 &= arr[i][0];
		tmp2 &= arr[i][1];
	}

	isAligned = tmp1 | tmp2;
	alignments += getNumberOfOnes(isAligned);

	// check diag \
	// shift by 6
	tmp1 =  bs0;
	tmp2 =  bs1;
	shift = 6;
	for(var i = 1; i < n; i++) {
	  arr[i][0] = (arr[i-1][0] >> shift) | ((arr[i-1][1] & 0xFF) << (32-shift));
	  arr[i][1] = arr[i-1][1] >> shift;
	  tmp1 &= arr[i][0];
	  tmp2 &= arr[i][1];
	}

	isAligned = tmp1 | tmp2;
	alignments += getNumberOfOnes(isAligned);

	return alignments;
}

// returns 1 if player won
function checkWon(board, player) {
  var isWon = new Uint32Array(1).fill(0);
  var mboard = board[player];

  var bs0 = mboard[0];
  var bs1 = mboard[1];

  // this array stores bit shifted versions of the board
  // used in the computation of a winner in checkWon

  // check horizontal (shifts of 7)
  arr[0][0] = bs0;
  arr[0][1] = bs1;

  // check horizontal
  // shift bs0 dowwn by 7 bits
  // place bottom 7 bits of bs1 into top 7 bits of bs0

  var shift = 7;
  for(var i = 1; i <= 3; i++) {
    arr[i][0] = (arr[i-1][0] >> shift) | ((arr[i-1][1] & 0x7F) << (32-shift));
    arr[i][1] = arr[i-1][1] >> shift;
  }

  isWon |= (arr[0][0] & arr[1][0] & arr[2][0] & arr[3][0]) | (arr[0][1] & arr[1][1] & arr[2][1] & arr[3][1]);

  // check vertical
  // shift by 1
  shift = 1;
  for(var i = 1; i <= 3; i++) {
      arr[i][0] = (arr[i-1][0] >> shift) | ((arr[i-1][1] & 0x01) << (32-shift));
      arr[i][1] = arr[i-1][1] >> shift;
  }

  isWon |= (arr[0][0] & arr[1][0] & arr[2][0] & arr[3][0]) | (arr[0][1] & arr[1][1] & arr[2][1] & arr[3][1]);

  // check diag /
  // shift by 8
  shift = 8;
  for(var i = 1; i <= 3; i++) {
      arr[i][0] = (arr[i-1][0] >> shift) | ((arr[i-1][1] & 0xFF) << (32-shift));
      arr[i][1] = arr[i-1][1] >> shift;
  }

  isWon |= (arr[0][0] & arr[1][0] & arr[2][0] & arr[3][0]) | (arr[0][1] & arr[1][1] & arr[2][1] & arr[3][1]);

  // check diag \
  // shift by 6
  shift = 6;
  for(var i = 1; i <= 3; i++) {
      arr[i][0] = (arr[i-1][0] >> shift) | ((arr[i-1][1] & 0xFF) << (32-shift));
      arr[i][1] = arr[i-1][1] >> shift;
  }

  isWon |= (arr[0][0] & arr[1][0] & arr[2][0] & arr[3][0]) | (arr[0][1] & arr[1][1] & arr[2][1] & arr[3][1]);

  if(isWon != 0) {
    isWon = 1;
  }

  return isWon;
}


// util functions
//**************************************************************************************

function findRow(board, column) {
	var row = board["heights"][column];
	if(row >= numRows) {
		row = -1;
	} else {
		board["heights"][column]++;
	}

	return row;
}

function restartGame(ctx) {
    board[1][0] = 0;
    board[1][1] = 0;
    board[2][0] = 0;
    board[1][1] = 0;

    heights = Array(numCols).fill(0);
    initBoard(ctx);
}

function printBoard() {
  console.log(board[player][0].toString(2));
  console.log(board[player][0].toString(2).length);
  console.log(board[player][1].toString(2));
}

function printArr() {
  for(var i = 0; i < 4; i++) {
    console.log(i);
    for(var j = 0; j < 2; j++) {
      console.log(arr[i][j].toString(2));
    }
  }
}

// takes in an unsigned 32-bit integer n
// returns the number of ones in the number's binary form
function getNumberOfOnes(n) {
	var res = 0;
	for(var i = 0; i < 32; i++) {
		res += ((n >> i) & 0x01);
	}

	return res;
}