const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
    test('Logic handles a valid puzzle string of 81 characters', (done) => {
        const puzzleStringp = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        const validation = solver.validate(puzzleStringp);
        assert.isObject(validation, 'returned type must be an object');
        assert.property(validation, 'valid', 'missing valid property');
        assert.isBoolean(validation.valid, 'valid property must be of type boolean');
        assert.equal(validation.valid, true);
        done();
    });

    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', (done) => {
        const invalidPuzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3604.3.7.2..9.47...8..1..16....926914.37.';
        const validation = solver.validate(invalidPuzzleString);
        assert.isObject(validation, 'returned type must be an object');
        assert.property(validation, 'message', 'missing message property');
        assert.isString(validation.message, 'message property must be of type string');
        assert.property(validation, 'valid', 'missing valid property');
        assert.isBoolean(validation.valid, 'valid property must be of type boolean');
        assert.equal(validation.valid, false);
        assert.equal(validation.message, 'Invalid characters in puzzle');
        done();
    });

    test('Logic handles a puzzle string that is not 81 characters in length', (done) => {
        const invalidPuzzleStringLength = '1.5..2.84..63.12.7.2..5.....9..1....8555.2.3674.3.7.2..9.47...8..1..16....926914.37.';

        const validation = solver.validate(invalidPuzzleStringLength);
        assert.isObject(validation, 'returned type must be an object');
        assert.property(validation, 'message', 'missing message property');
        assert.isString(validation.message, 'message property must be of type string');
        assert.property(validation, 'valid', 'missing valid property');
        assert.isBoolean(validation.valid, 'valid property must be of type boolean');
        assert.equal(validation.valid, false);
        assert.equal(validation.message, 'Expected puzzle to be 81 characters long');
        done();
    });

    test('Logic handles a valid row placement', (done) => {
        const puzzleGrid = solver.transformToGrid('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.');

        const validRowPlacement = solver.checkRowPlacement(puzzleGrid, 0, 1, 3);
        assert.isBoolean(validRowPlacement, 'return type must be of type boolean');
        assert.equal(validRowPlacement, true, 'response must be equal to true');
        done();
    });

    test('Logic handles an invalid row placement', (done) => {
        const puzzleGrid = solver.transformToGrid('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.');

        const invalidRowPlacement = solver.checkRowPlacement(puzzleGrid, 0, 1, 5);
        assert.isBoolean(invalidRowPlacement, 'return type must be of type boolean');
        assert.equal(invalidRowPlacement, false, 'response must be equal to false');
        done();
    });

    test('Logic handles a valid col placement', (done) => {
        const puzzleGrid = solver.transformToGrid('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.');

        const validColPlacement = solver.checkColPlacement(puzzleGrid, 0, 1, 3);
        assert.isBoolean(validColPlacement, 'return type must be of type boolean');
        assert.equal(validColPlacement, true, 'response must be equal to true');
        done();
    });

    test('Logic handles an invalid col placement', (done) => {
        const puzzleGrid = solver.transformToGrid('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.');

        const invalidColPlacement = solver.checkColPlacement(puzzleGrid, 0, 1, 2);
        assert.isBoolean(invalidColPlacement, 'return type must be of type boolean');
        assert.equal(invalidColPlacement, false, 'response must be equal to false');
        done();
    });

    test('Logic handles a valid region placement', (done) => {
        const puzzleGrid = solver.transformToGrid('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.');

        const validRegionPlacement = solver.checkRegionPlacement(puzzleGrid, 0, 1, 3);
        assert.isBoolean(validRegionPlacement, 'return type must be of type boolean');
        assert.equal(validRegionPlacement, true, 'response must be equal to true');
        done();
    });

    test('Logic handles an invalid region placement', (done) => {
        const puzzleGrid = solver.transformToGrid('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.');

        const invalidRegionPlacement = solver.checkRegionPlacement(puzzleGrid, 0, 1, 5);
        assert.isBoolean(invalidRegionPlacement, 'return type must be of type boolean');
        assert.equal(invalidRegionPlacement, false, 'response must be equal to false');
        done();
    });

    test('Valid puzzle string pass the solver', (done) => {
        const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        const solved = solver.solve(puzzleString);

        assert.isString(solved, 'return type must be of type string');
        assert.lengthOf(solved, 81, 'response length must be equal to 81');
        assert.notInclude(solved, '.', 'grid musn\'t contain empty cells');
        done();
    });

    test('Invalid puzzle string fail the solver', (done) => {
        const puzzleString = '15555567555.63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        const solved = solver.solve(puzzleString);
        assert.isBoolean(solved, 'return type must be of type boolean');
        assert.equal(solved, false, 'return must equal false');
        done();
    });

    test('Solver returns the expected solution for an incomplete puzzle', (done) => {
        const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        const expected = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
        const solved = solver.solve(puzzleString);

        assert.isString(solved, 'return type must be of type string');
        assert.lengthOf(solved, 81, 'response length must be equal to 81');
        assert.notInclude(solved, '.', 'grid musn\'t contain empty cells');
        assert.equal(solved, expected);
        done();
    });


});
