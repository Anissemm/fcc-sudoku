const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('Solve a puzzle', () => {
        test('With valid puzzle string', (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }

                    const expectedSolution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
                    assert.isObject(res.body, 'response type must be an object');
                    assert.property(res.body, 'solution', 'response must have a solution property');
                    assert.equal(res.body.solution, expectedSolution);
                    done();
                });
        });

        test('With missing puzzle string', (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: '' })
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }

                    assert.isObject(res.body, 'response type must be an object');
                    assert.property(res.body, 'error', 'response must have an error property');
                    assert.equal(res.body.error, 'Required field missing');
                    done();
                });
        });

        test('with invalid characters', (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: '1.5..2.8A..63.10.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }

                    assert.isObject(res.body, 'response type must be an object');
                    assert.property(res.body, 'error', 'response must have an error property');
                    assert.equal(res.body.error, 'Invalid characters in puzzle');
                    done();
                });
        });

        test('with incorrect length', (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.8952' })
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }

                    assert.isObject(res.body, 'response type must be an object');
                    assert.property(res.body, 'error', 'response must have an error property');
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                    done();
                });
        });

        test('that cannot be solved', (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: '1.5555584..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }

                    assert.isObject(res.body, 'response type must be an object');
                    assert.property(res.body, 'error', 'response must have an error property');
                    assert.equal(res.body.error, 'Puzzle cannot be solved');
                    done();
                });
        });

    });

    suite('Check a puzzle placement', () => {
        test('With all fields', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                    coordinate: 'A2',
                    value: '3'
                })
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }

                    assert.isObject(res.body, 'response type must be an object');
                    assert.property(res.body, 'valid', 'response object must have a property \'valid\'');
                    assert.isBoolean(res.body.valid, '\'valid\' property must be of type boolean');
                    assert.equal(res.body.valid, true, 'valid property must be equal to true');
                    done();
                });
        });

        test('with single placement conflict', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                    coordinate: 'A2',
                    value: '8'
                })
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }

                    const expectedConfilict = ['row'];
                    assert.isObject(res.body, 'response type must be an object');
                    assert.property(res.body, 'valid', 'response object must have a property \'valid\'');
                    assert.isBoolean(res.body.valid, '\'valid\' property must be of type boolean');
                    assert.property(res.body, 'conflict', 'response object must have a property \'conflict\'');
                    assert.isArray(res.body.conflict, '\'conflict\' property must be of type array');
                    assert.deepEqual(res.body.conflict, expectedConfilict, `conflict property must be equal to ${expectedConfilict}`);
                    assert.equal(res.body.valid, false, 'valid property must be equal to false');
                    done();
                });
        });

        test('with multiple placement conflicts', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                    coordinate: 'A2',
                    value: '1'
                })
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }

                    const expectedConfilict = ['row', 'region'];
                    assert.isObject(res.body, 'response type must be an object');
                    assert.property(res.body, 'valid', 'response object must have a property \'valid\'');
                    assert.isBoolean(res.body.valid, '\'valid\' property must be of type boolean');
                    assert.property(res.body, 'conflict', 'response object must have a property \'conflict\'');
                    assert.isArray(res.body.conflict, '\'conflict\' property must be of type array');
                    assert.deepEqual(res.body.conflict, expectedConfilict, `conflict property must be equal to ${expectedConfilict}`);
                    assert.equal(res.body.valid, false, 'valid property must be equal to false');
                    done();
                });
        });

        test('with all placement conflicts', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                    coordinate: 'A2',
                    value: '2'
                })
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }

                    const expectedConfilict = ['row', 'column', 'region'];
                    assert.isObject(res.body, 'response type must be an object');
                    assert.property(res.body, 'valid', 'response object must have a property \'valid\'');
                    assert.isBoolean(res.body.valid, '\'valid\' property must be of type boolean');
                    assert.property(res.body, 'conflict', 'response object must have a property \'conflict\'');
                    assert.isArray(res.body.conflict, '\'conflict\' property must be of type array');
                    assert.deepEqual(res.body.conflict, expectedConfilict, `conflict property must be equal to ${expectedConfilict}`);
                    assert.equal(res.body.valid, false, 'valid property must be equal to false');
                    done();
                });
        });

        test('with missing required fields', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                    coordinate: '',
                    value: '2'
                })
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }

                    assert.isObject(res.body, 'response type must be an object');
                    assert.property(res.body, 'error', 'response object must have a property \'error\'');
                    assert.isString(res.body.error, '\'error\' property must be of type string');
                    assert.equal(res.body.error, 'Required field(s) missing');
                    done();
                });
        });

        test('with invalid characters', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.BC3674.3.7.2..9.47...8..1..16....926914.37.',
                    coordinate: 'A2',
                    value: '2'
                })
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }

                    assert.isObject(res.body, 'response type must be an object');
                    assert.property(res.body, 'error', 'response object must have a property \'error\'');
                    assert.isString(res.body.error, '\'error\' property must be of type string');
                    assert.equal(res.body.error, 'Invalid characters in puzzle');
                    done();
                });
        });

        test('with incorrect length', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.54866',
                    coordinate: 'A2',
                    value: '2'
                })
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }

                    assert.isObject(res.body, 'response type must be an object');
                    assert.property(res.body, 'error', 'response object must have a property \'error\'');
                    assert.isString(res.body.error, '\'error\' property must be of type string');
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                    done();
                });
        });

        test('with invalid placement coordinate', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                    coordinate: 'J2',
                    value: '2'
                })
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }

                    assert.isObject(res.body, 'response type must be an object');
                    assert.property(res.body, 'error', 'response object must have a property \'error\'');
                    assert.isString(res.body.error, '\'error\' property must be of type string');
                    assert.equal(res.body.error, 'Invalid coordinate');
                    done();
                });
        });

        test('with invalid placement value', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                    coordinate: 'A2',
                    value: '11'
                })
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }

                    assert.isObject(res.body, 'response type must be an object');
                    assert.property(res.body, 'error', 'response object must have a property \'error\'');
                    assert.isString(res.body.error, '\'error\' property must be of type string');
                    assert.equal(res.body.error, 'Invalid value');
                    done();
                });
        });
    });
});


