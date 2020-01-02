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
 	let p1Score = 0;	// minimizer
 	let p2Score = 0;	// maximizer

 	// check number of alignments of 3 in a row
 	p1Score = -checkAlignment1(board,1,connect-1);
 	p2Score = checkAlignment1(board,2,connect-1);

 	p1Score = -0.25*checkAlignment1(board,1,2);
 	p2Score = 0.25*checkAlignment1(board,2,2);
 	
 	let score = p1Score + p2Score;

 	//score = score + p1Score + p2Score;
 	return score;
}


function minimax(board, depth, player) {
	
	var nextPlayer = 2;
	if(player != 1) {nextPlayer = 1;}

	if(depth >= maxDepth) {
		let score = scoreState(board);
		let move = 0;
		return [score, move];

	} else {
		var bestScore = 0;
		var move = 0;

		// minimzer init
		if(player == 1) {bestScore = numCols*numRows/2;}
		else {bestScore = -numCols*numRows/2;}


		// check for win in this current config
		for(var col = 0; col < numCols; col++) {
			let mboard = JSON.parse(JSON.stringify(board));
			let row = findRow(mboard,col);

			if(row != -1) {
				updateBoard1(mboard,player,col,row);

				let isWon = checkAlignment1(mboard,player,connect);

				if(isWon != 0) {
					if(player == 1) {
						//bestScore = (-numCols*numRows + depth)/2;
						bestScore = -25;
						move = col;
						return [bestScore, move];
					} else {
						//bestScore = (numCols*numRows - depth)/2;
						bestScore = 25;
						move = col;
						return [bestScore, move];
					}
				}
			}	
		}
		

		// iterate through each child node
		for(var col = 0; col < numCols; col++) {
			let bboard = JSON.parse(JSON.stringify(board));
			let row = findRow(bboard,col);
			updateBoard1(bboard,player, col, row);

			var res = minimax(bboard, depth+1, nextPlayer);
			var score = res[0];
			if(player == 1) {
				if(score <= bestScore) {
					bestScore = score;
					move = col;
				}
			} else {
				if(score >= bestScore) {
					bestScore = score;
					move = col;
				}
			}
		}

		return [bestScore,move];
	}	
}

function updateBoard1(bboard, player, col, row) {

  // get bit index of token position
  let bidx = base[col] + row;

  // get the correct bitstring idx into mboard
  // divide bit index by 32 (size of elements of mboard)
  let bsidx = Math.floor(bidx/31);
  var bs = bboard[player][bsidx];
  

  // find number of times to shift into this bitstring
  let shift = bidx%31;

  bs = bs | (1 << shift);
  bboard[player][bsidx] = bs;
}


function checkAlignment1(board, player, n) {
	var mboard = board[player];
	var bs0 = mboard[0];
	var bs1 = mboard[1];
	var alignments = 0;
	
	// check horizontal (shifts of 7)
	arr[0][0] = bs0;
	arr[0][1] = bs1;

	var tmp1 =  new Uint32Array(1).fill(bs0);
	var tmp2 =  new Uint32Array(1).fill(bs1);

	var shift = numRows+1;
	for(var i = 1; i < n; i++) {
		arr[i][0] = ((arr[i-1][0] >> shift)) | (((arr[i-1][1] & 0x7F) << (31-shift)));
		arr[i][1] = arr[i-1][1] >> shift;
		tmp1 &= (arr[i][0]);
		tmp2 &= (arr[i][1]);
	}

	alignments += getNumberOfOnes(tmp1);
	alignments += getNumberOfOnes(tmp2);

	// check vertical
	// shift by 1
	var tmp1 =  new Uint32Array(1).fill(bs0);
	var tmp2 =  new Uint32Array(1).fill(bs1);
	shift = 1;
	for(var i = 1; i < n; i++) {
		arr[i][0] = (arr[i-1][0] >> shift) | ((arr[i-1][1] & 0x01) << (31-shift));
		arr[i][1] = arr[i-1][1] >> shift;
		tmp1 &= (arr[i][0]);
		tmp2 &= (arr[i][1]);
	}

	alignments += getNumberOfOnes(tmp1);
	alignments += getNumberOfOnes(tmp2);

	// check diag /
	// shift by 8
	var tmp1 =  new Uint32Array(1).fill(bs0);
	var tmp2 =  new Uint32Array(1).fill(bs1);
	shift = numRows+2;
	for(var i = 1; i < n; i++) {
	  arr[i][0] = (arr[i-1][0] >> shift) | ((arr[i-1][1] & 0xFF) << (31-shift));
	  arr[i][1] = arr[i-1][1] >> shift;
	  tmp1 &= (arr[i][0]);
		tmp2 &= (arr[i][1]);
	}

	alignments += getNumberOfOnes(tmp1);
	alignments += getNumberOfOnes(tmp2);

	// check diag \
	// shift by 6
	var tmp1 =  new Uint32Array(1).fill(bs0);
	var tmp2 =  new Uint32Array(1).fill(bs1);
	shift = numRows;
	for(var i = 1; i < n; i++) {
	  arr[i][0] = (arr[i-1][0] >> shift) | ((arr[i-1][1] & 0x3F) << (31-shift));
	  arr[i][1] = arr[i-1][1] >> shift;
	  tmp1 &= (arr[i][0]);
	  tmp2 &= (arr[i][1]);
	}

	alignments += getNumberOfOnes(tmp1);
	alignments += getNumberOfOnes(tmp2);

	return alignments;
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