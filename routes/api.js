'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      if (/[^1-9.]/g.test(puzzle)) {
        return res.json({ error: 'Invalid characters in puzzle' });
      }

      if (puzzle.length !== 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' });
      }

      // if (!/^[A-I][1-9]$/i.test(coordinate.trim())) {
      //   return res.json({ error: 'Invalid coordinate' });
      // }

      if (/[^1-9]/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      const validation = solver.isValidPlacement(puzzle, coordinate, value);

      if (!validation) {
        return res.json({ error: 'Invalid coordinate' });
      }

      console.log(validation)

      return res.json(validation);
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body

      if (!puzzle) {
        return res.json({ error: 'Required field missing' })
      }

      if (/[^1-9.]/g.test(puzzle)) {
        return res.json({ error: 'Invalid characters in puzzle' })
      }

      if (solver.validate(puzzle)) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' })
      }

      const solved = solver.solve(puzzle)
      console.log(solved)
      if (!solved) {
        return res.json({ error: 'Puzzle cannot be solved' })
      }

      res.json({ solution: solved })
    });
};
