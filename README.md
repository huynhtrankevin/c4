# Connect 4
A connect 4 game replica with a minimax search-based AI implemented in javascript. 

# How to use it
1. Clone the repository
```
 cd /path/to/desired/directory
 git clone https://github.come/huynhtrankevin/c4.git
```
2. Open `index.html` in your browser


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
are three ways in which we could achieve a horizontal alignment of four tokens. Notice that in each of the three bit strings above, the succeeding bit index is always 6 greater than the previous (`05 11`, `31 37`, etc). How could we leverage this?

Let's remind ourselves briefly of several bitwise operations.
#### Bit Shift Operator 

##### Left Shift Operator (A << B)
```
(1 << 0) = (0b0001)
(1 << 1) = (0b0010)
(1 << 2) = (0b0100)
(1 << 3) = (0b1000)
```
This is effectively multiplying the integer by 2! That is, `1 << 2` is `1*2*2 = 4 = 0b0100`.

##### Right Shift Operator (A >> B)
```
(8 >> 0) = (0b1000 >> 0) = (0b1000)
(8 >> 1) = (0b1000 >> 1) = (0b0100)
(8 >> 2) = (0b1000 >> 2) = (0b0010)
(8 >> 3) = (0b1000 >> 3) = (0b0001)
```
This is simply dividing an integer by 2. That is, `8 >> 2` is equivalent to dividing the number 8 by 2, 2 times! This results in `(8 >> 2) = (0b1000 >> 2) = (0b0010) = 2`.  

#### Bitwise AND Operator (A & B)

```
(6 & 1) = (0b0110 & 0b0001) = (0b0000) = 0
(6 & 2) = (0b0110 & 0b0010) = (0b0010) = 2
(6 & 3) = (0b0110 & 0b0011) = (0b0010) = 2
(6 & 4) = (0b0110 & 0b0100) = (0b0100) = 4
```

The bitwise AND operator allows you to select the bits of interest within your bitstring. For example, if we were interested in the values of the bottom 3 bits of our bitstring `0b0010` were equal to 1 or if there were any bits equal to 1 at all, then we would peform `0b0010 & 0b0111`. 

#### Bitwise OR Operator (A | B)
```
(6 | 1) = (0b0110 | 0b0001) = (0b0111) = 7
(6 | 2) = (0b0110 | 0b0010) = (0b1000) = 8
(6 | 3) = (0b0110 | 0b0011) = (0b1001) = 9
(6 | 4) = (0b0110 | 0b0100) = (0b1010) = 10
```
The bitwise OR operator can allow you to set bits. For example:
```
(0b0000 0010 | 0b1111 0000) = (0b1111 0010) 
```
We set the upper four bits of our bitstring to `11111`!

There are more operations, but those four are all we need to put the bitboard data structure to use. Back to token alignments, remember that our game board is simply one long bit string with 36 places for either a 1 or a 0:
```
05 11 17 23 29 35 41
04 10 16 22 28 34 40
03 09 15 21 27 33 39
02 08 14 20 26 32 38
01 07 13 19 25 31 37
00 06 12 18 24 30 36 
```

We'll assume that a 1 in a given bit index that we have a token there and a 0 means that we don't have a token there. So,
```
0b00000000 00000000 00000000 00000000 0000000 00000001 (There are 40 bit indices here) 
```
means we have a token in the bottom left corner and
```
0b00000000 00000000 00000000 00000000 0000000 00000010 (There are 40 bit indices here) 
```
means that we have a token one above the bottom left corner.

One problem we've run into is how do we handle where the other player's tokens are? Simple-- we will have two bit strings! One will encode where one player's tokens are located and the other bit string will acount for the other player's tokens. So if we want to see if player 1 have a horizontal alignment of four tokens, we take player 1's bit string, call it `bs_1` and apply a combination of bitshifts and bitwise AND operations!

```
(bs_1 >> 0) & (bs_1 >> 6) & (bs_1 >> 12) & (bs_1 >> 18)
```
If the result of the operation above is greater than 0, then we have at least one horizontal alignment! Apply the same idea to the remaining directions. 

## Minimax Algorithm
