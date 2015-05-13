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
            expect(reader).to.be.an.instanceof(InstructionReader);
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

            try {
                reader = new InstructionReader("3 4 N\n");
            } catch(error) {
                var errorMessage = "<b>Syntax Error: </b>" + "The first line should be the planet's boundaries!";
                error.should.equal(errorMessage);
            }

        });

    });

});
