class Grid extends Array {
  constructor(size, valueFn) {
    super();

    for (let i = 0; i < size; i++) {
      this[i] = [];

      for (let j = 0; j < size; j++) {
        this[i][j] = valueFn(i, j);
      }
    }
  }

  static random(grid) {
    let x = Math.floor(Math.random() * grid.length);
    let y = Math.floor(Math.random() * grid[x].length);

    return grid[x][y];
  }
}

export default Grid;
