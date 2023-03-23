import { DRAW, SQUARE } from './boardInfo';

type Grid = Array<null | number>;

export default class Board {
  grid: Grid;

  constructor(grid?: Grid) {
    this.grid = grid || new Array(SQUARE ** 2).fill(null);
  }

  getIndexesOfEmptyCell = (grid = this.grid) => {
    let cells: number[] = [];

    grid.forEach((cell, i) => {
      if (cell === null) {
        cells.push(i);
      }
    });
    return cells;
  }

  isBoardEmpty = (grid = this.grid) => {
    return this.getIndexesOfEmptyCell(grid).length === SQUARE ** 2;
  }

  getWinner = (grid = this.grid) => {

    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    let res: number | null = null;

    winningCombos.forEach((combo, i) => {
      if (
        grid[combo[0]] !== null &&
        grid[combo[0]] === grid[combo[1]] &&
        grid[combo[0]] === grid[combo[2]]
      ) {
        res = grid[combo[0]];
      } else if (res === null && this.getIndexesOfEmptyCell(grid).length === 0) {
        res = DRAW;
      }
    });
    return res;
  };

  makeMove = (cell: number, player: number) => {
    if (this.grid[cell] === null) {
      this.grid[cell] = player;
    }
  };

  clone = () => {
    return new Board(this.grid.concat());
  };
};