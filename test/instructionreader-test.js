/**
 * instructionreader-test.js
 */
"use strict";

import chai from "chai";
var expect = chai.expect;

/*eslint-disable no-unused-vars*/
var should = chai.should();

import { prepareRobots, parseInstructions } from "../src/instructionreader.js";

describe("InstructionReader", function() {

    var instructions;
    var testData;

    var testStack;

    var testRobots;

    before(function() {

        instructions = "5 3\n1 1 E\nRFRFRFRF";
        testData = "5 3\n1 1 E\nRFRFRFRF\n\n3 2 N\nFRRFLLFFRRFLL\n\n0 3 W\nLLFFFLFLFL\n\n6 4 W\nRFLRFLRF\n\n1 1 E\n" +
            "RFRFRFRF";

        testStack = ["RFRFRFRF", "1 1 E", "RFLRFLRF", "6 4 W", "LLFFFLFLFL", "0 3 W", "FRRFLLFFRRFLL", "3 2 N",
                    "RFRFRFRF", "1 1 E"];

        testRobots = [
        {
            id: 1,
            heading: "E",
            instructions: ["F", "R", "F", "R", "F", "R", "F", "R"],
            x: 1,
            y: 1,
            lost: false
        },

        {
            id: 2,
            heading: "N",
            instructions: ["L", "L", "F", "R", "R", "F", "F", "L", "L", "F", "R", "R", "F"],
            x: 3,
            y: 2,
            lost: false
        },

        {
            id: 3,
            heading: "W",
            instructions: ["L", "F", "L", "F", "L", "F", "F", "F", "L", "L"],
            x: 0,
            y: 3,
            lost: false
        },

        {
            id: 4,
            heading: "E",
            instructions: ["F", "R", "F", "R", "F", "R", "F", "R"],
            x: 1,
            y: 1,
            lost: false
        }];

    });

    describe("#prepareRobots()", function() {

        it("should produce an array of robots from a valid input stack", function() {
            var result = prepareRobots(testStack, [5, 3]);
            expect(result).to.deep.equal(testRobots);
        });

    });

    describe("#parseInstructions()", function() {

        describe("with a standard input string", function() {

            it("should parse the input string into a stack of instructions", function() {
                var result = ["RFRFRFRF", "1 1 E", "RFLRFLRF", "6 4 W", "LLFFFLFLFL", "0 3 W", "FRRFLLFFRRFLL", "3 2 N",
                    "RFRFRFRF", "1 1 E", "5 3"];

                // Deep equal so that each value in the array is compared
                expect(result).to.deep.equal(parseInstructions(testData));
            });

        });

        it("should expect the first line of the input to be the planet's boundaries", function() {
            var errorMessage = "<b>Syntax Error: </b>" + "The first line should be the planet's boundaries!";
            expect( r => parseInstructions("3 4 N\n") ).to.throw(errorMessage);
        });

        it("should detect a syntax error on the robot position line", function() {

            var invalidInput = "4 3\n3A 4 N\nFFFFFFF";
            var errorMessage = "<b>Syntax Error on Line: </b>" + "3A 4 N";

            expect( err => parseInstructions(invalidInput) ).to.throw(errorMessage);

        });

        it("should detect a syntax error on the robot position line", function() {

            var invalidInput = "4 3\n3 4 N\nFRFLFR4N";
            var errorMessage = "<b>Syntax Error on Line: </b>" + "FRFLFR4N";

            expect( err => parseInstructions(invalidInput) ).to.throw(errorMessage);

        });

    });

});
