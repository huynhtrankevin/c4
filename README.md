# Connect 4
A connect 4 game replica with a minimax search-based AI implemented in javascript. 

# How It Works

## Bitboard Data Structure
source: http://blog.gamesolver.org/solving-connect-four/06-bitboard/

Suppose that we indexed or enumerated each token position within our connect 4 board as such:

```
05 11 17 23 29 35 41
04 10 16 22 28 34 40
03 09 15 21 27 33 39
02 08 14 20 26 32 38
01 07 13 19 25 31 37
00 06 12 18 24 30 36 
```

then we could represent the game state with a 36+ bit integer! We would want to do this for two main reasons:
1. it simplifies alignment checks (checking for 4 or 3 in a row)
2. bitwise operators are faster than looping

Let's take a look at how token alignment checks and updating the game state works using this structure.

### Token Alignment
What are the possible horizontal alignments of four tokens? 
```
00 06 12 18
```
```
19 25 31 37
```
and
```
05 11 17 23
```
are three ways in which we could achieve a horizontal alignment of four tokens. Notice that in each of the three bit strings above, the succeeding bit index is always 6 greater than the current (`05 11`, `31 37`, etc).


## Minimax Algorithm
