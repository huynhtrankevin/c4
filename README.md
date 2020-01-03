# c4
A connect 4 game replica with a minimax search-based AI implemented in javascript. 

# How It Works

## Bitboard Data Structure
source: http://blog.gamesolver.org/solving-connect-four/06-bitboard/

Suppose that we indexed or enumerated each token position within our connect 4 board as such:

```
5 11 17 23 29 35 41
4 10 16 22 28 34 40
3  9 15 21 27 33 39
2  8 14 20 26 32 38
1  7 13 19 25 31 37
0  6 12 18 24 30 36 
```

## Minimax Algorithm
