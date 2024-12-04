# Modern Conway's Game of Life

A JavaScript implementation of Conway's Game of Life using jQuery, featuring an interactive grid where users can create and watch cellular patterns evolve.

## Features
- Interactive grid with click/drag to draw cells 
- Adjustable grid size
- Zoom functionality
- Variable simulation speed
- Example patterns showcase
- Grid wrapping (cells on edges connect to opposite side)

## How It Works
Conway's Game of Life is a zero-player cell simulation where cells live or die based on four simple rules:

1. Cells with fewer than 2 neighbors die from isolation
2. Cells with 2 or 3 neighbors survive 
3. Cells with more than 3 neighbors die from overcrowding
4. Dead cells with exactly 3 neighbors become alive

## Try it Out
[Link](https://psdoood.github.io/conwaysGame/)