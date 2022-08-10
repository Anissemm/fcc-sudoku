const rowsMap = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
  I: 8
};

class SudokuSolver {

  validate(puzzleString, value = null) {
    if (/[^1-9.]/g.test(puzzleString)) {
      return { valid: false, message: 'Invalid characters in puzzle' };
    }

    if (puzzleString.length !== 81) {
      return { valid: false, message: 'Expected puzzle to be 81 characters long' };
    }

    if (value && (value.length !== 1 || /[^1-9]/g.test(value))) {
      return { valid: false, message: 'Invalid value' };
    }

    return { valid: true }

  }

  getCoordinates(coordinateString) {
    const coordinates = coordinateString.match(/^(?<row>[A-I])(?<col>[1-9])$/i);

    if (coordinates) {
      return {
        row: rowsMap[coordinates.groups.row],
        column: parseInt(coordinates.groups.col) - 1
      }
    }
    return false;
  }

  isValidPlacement(puzzleString, coordinate, value) {
    const grid = this.transformToGrid(puzzleString);
    const coordinates = this.getCoordinates(coordinate);
    const parsedValue = parseInt(value);

    if (!coordinates) {
      return false;
    }

    const validRowPlacement = this.checkRowPlacement(grid, coordinates.row, coordinates.column, parsedValue);
    const validColPlacement = this.checkColPlacement(grid, coordinates.row, coordinates.column, parsedValue);
    const validRegionPlacement = this.checkRegionPlacement(grid, coordinates.row, coordinates.column, parsedValue);

    if (!validRowPlacement || !validColPlacement || !validRegionPlacement) {
      const result = { valid: false, conflict: [] };

      if (!validRowPlacement) {
        result.conflict.push('row');
      }

      if (!validColPlacement) {
        result.conflict.push('column');
      }

      if (!validRegionPlacement) {
        result.conflict.push('region');
      }

      return result;
    }

    return { valid: true }
  }

  checkRowPlacement(grid, row, column, value) {
    for (let x = 0; x <= 8; x++) {
      if (grid[row][x] == value) {
        if (grid[row][column] === value) return true;
        return false;
      }
    }

    return true;
  }

  checkColPlacement(grid, row, column, value) {
    for (let x = 0; x <= 8; x++) {
      if (grid[x][column] == value) {
        if (grid[row][column] === value) return true;
        return false;
      }
    }

    return true;
  }

  checkRegionPlacement(grid, row, column, value) {
    let startRow = row - row % 3,
      startCol = column - column % 3;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i + startRow][j + startCol] == value) {
          if (grid[row][column] === value) return true;
          return false;
        }
      }
    }
    return true;
  }

  solveSudoku(grid, row, col) {
    if (row == 9 - 1 && col == 9)
      return true;

    if (col == 9) {
      row++;
      col = 0;
    }

    if (grid[row][col] != 0)
      return this.solveSudoku(grid, row, col + 1);

    for (let num = 1; num < 10; num++) {

      if (this.isSafe(grid, row, col, num)) {

        grid[row][col] = num;

        if (this.solveSudoku(grid, row, col + 1))
          return true;
      }

      grid[row][col] = 0;
    }
    return false;
  }

  isSafe(grid, row, col, num) {
    const validRowPlacement = this.checkRowPlacement(grid, row, col, num);
    const validColPlacement = this.checkColPlacement(grid, row, col, num);
    const validRegionPlacement = this.checkRegionPlacement(grid, row, col, num);

    if (!validRowPlacement || !validColPlacement || !validRegionPlacement) {
      return false;
    }

    return true;
  }

  transformToGrid(string) {
    const emptyGrid = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    let grid = emptyGrid.slice();

    try {
      let col = 0;
      let row = -1;

      for (let i = 0; i < string.length; i++) {
        if (i % 9 === 0) {
          row++;
        }

        if (col % 9 === 0) {
          col = 0;
        }

        grid[row][col] = string[i] === '.' ? 0 : parseInt(string[i]);
        col++;
      }
      return grid;
      
    } catch (err) {
      return null;
    }

  }

  transformToString(grid) {
    return grid.flat().join('')
  }

  solve(puzzleString) {
    const grid = this.transformToGrid(puzzleString);

    if (!grid) {
      return false;
    }

    const solved = this.solveSudoku(grid, 0, 0);
    return solved ? this.transformToString(grid) : false;
  }
}

module.exports = SudokuSolver;

