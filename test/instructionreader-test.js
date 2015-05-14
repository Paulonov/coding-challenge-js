/**
 * instructionreader-test.js
 */
"use strict";

import chai from "chai";
var assert = chai.assert;
var expect = chai.expect;

/*eslint-disable no-unused-vars*/
var should = chai.should();

import InstructionReader from "../src/instructionreader.js";

describe("InstructionReader", function() {

    var instructions;
    var testData;

    var reader;
    var emptyReader;

    before(function() {

        instructions = "5 3\n1 1 E\nRFRFRFRF";
        testData = "5 3\n1 1 E\nRFRFRFRF\n\n3 2 N\nFRRFLLFFRRFLL\n\n0 3 W\nLLFFFLFLFL\n\n6 4 W\nRFLRFLRF\n\n1 1 E\n" +
            "RFRFRFRF";

        reader = new InstructionReader(instructions);
        emptyReader = new InstructionReader("4 3");

    });

    describe("#constructor()", function() {

        it("should return an instance of InstructionReader", function() {
            expect(new InstructionReader(testData)).to.be.an.instanceof(InstructionReader);
        });

    });

    describe("#empty()", function() {

        it("should return true when there are no instructions in the stack", function() {
            assert.equal(emptyReader.empty(), true);
        });

        it("should return false when there are instructions in the stack", function() {
            assert.equal(reader.empty(), false);
        });

    });

    describe("#initialiseRobot()", function() {

        it("should return true and correctly set internal state on valid input", function() {
            /*eslint-disable no-unused-expressions*/
            expect(reader.initialiseRobot()).to.be.true;
            expect(reader.currentRobotStartingInformation).to.deep.equal(["1", "1", "E"]);
            expect(reader.currentRobotInstructions).to.deep.equal(["R", "F", "R", "F", "R", "F", "R", "F"]);
        });

        it("should return false if unable to initialise a robot", function() {
            expect(emptyReader.initialiseRobot()).to.be.false;
        });

    });

    describe("#parse()", function() {

        describe("with a standard input string", function() {

            it("should parse the input string into a stack of instructions", function() {
                var result = ["RFRFRFRF", "1 1 E", "RFLRFLRF", "6 4 W", "LLFFFLFLFL", "0 3 W", "FRRFLLFFRRFLL", "3 2 N",
                    "RFRFRFRF", "1 1 E", "5 3"];

                // Deep equal so that each value in the array is compared
                expect(result).to.deep.equal(InstructionReader.parse(testData));
            });

        });

        it("should expect the first line of the input to be the planet's boundaries", function() {
            var errorMessage = "<b>Syntax Error: </b>" + "The first line should be the planet's boundaries!";
            expect( r => new InstructionReader("3 4 N\n") ).to.throw(errorMessage);
        });

        it("should detect a syntax error on the robot position line", function() {

            var invalidInput = "4 3\n3A 4 N\nFFFFFFF";
            var errorMessage = "<b>Syntax Error on Line: </b>" + "3A 4 N";

            expect( err => InstructionReader.parse(invalidInput) ).to.throw(errorMessage);

        });

        it("should detect a syntax error on the robot position line", function() {

            var invalidInput = "4 3\n3 4 N\nFRFLFR4N";
            var errorMessage = "<b>Syntax Error on Line: </b>" + "FRFLFR4N";

            expect( err => InstructionReader.parse(invalidInput) ).to.throw(errorMessage);

        });

    });

});
