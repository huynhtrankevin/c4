
// variable used to store row availability of column
var heights = Array(numCols).fill(0);

// variable used to store bit index of first row in each column
var base = Array(numCols).fill(0);
for(var i = 0; i < numCols; i++) {
  base[i] = i*(numRows+1);
}

// keeps track of current player
var player = 1;

var board = {
  1: new Uint32Array(2).fill(0),
  2: new Uint32Array(2).fill(0)
};

function updateBoard(player, col, row) {

// get the player board
  let mboard = board[player];

  // get bit index of token position
  let bidx = base[col] + row;

  // get the correct bitstring idx into mboard
  // divide bit index by 32 (size of elements of mboard)
  let bsidx = Math.floor(bidx/32);
  let bs = mboard[bsidx];

  // find number of times to shift into this bitstring
  let shift = bidx%32;
  bs = bs | (1 << shift);

  // assign
  mboard[bsidx] = bs;
  board[player] = mboard;

  // debug print
  console.log(player);
  console.log(mboard[0]);
  console.log(mboard[0].toString(2));
  console.log(mboard[1].toString(2));
}
