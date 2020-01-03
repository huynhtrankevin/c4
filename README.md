# c4
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

## Minimax Algorithm
