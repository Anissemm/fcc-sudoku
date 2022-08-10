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

      const puzzleCheck = solver.validate(puzzle, value);

      if (!puzzleCheck.valid) {
        return res.json({ error: puzzleCheck.message });
      }

      const validation = solver.isValidPlacement(puzzle, coordinate, value);

      if (!validation) {
        return res.json({ error: 'Invalid coordinate' });
      }

      return res.json(validation);
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      const puzzleCheck = solver.validate(puzzle);

      if (!puzzleCheck.valid) {
        return res.json({ error: puzzleCheck.message });
      }

      const solved = solver.solve(puzzle);

      if (!solved) {
        return res.json({ error: 'Puzzle cannot be solved' });
      }

      res.json({ solution: solved });
    });
};
