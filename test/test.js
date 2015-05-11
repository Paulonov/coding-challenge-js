/**st
 * test.js
 *
 * A file containing some Mocha tests for the application.
 */
"use strict";

var chai = require("chai");
var assert = chai.assert;

var InstructionReader = require("../src/instructionreader.js");
var Robot = require("../src/robot.js");
var Planet = require("../src/planet.js");

var instructions = "5 3\n 1 1 E\n RFRFRFRF"

// A stubbed version of grid information, we're not testing canvas-y things here
var stubbedGridInformation = {
    xDifference: 0,
    yDifference: 0,
    width: 0,
    height: 0,
    margin: 0
}

var reader = new InstructionReader(instructions);
var emptyReader = new InstructionReader("4 3");

describe("InstructionReader", function() {

    describe("#empty()", function() {

        it("Should return true when there are no instructions in the stack", function() {
            assert.equal(emptyReader.empty(), true);
        })

        it("Should return false when there are instructions in the stack", function() {
            assert.equal(reader.empty(), false);
        })

    })

});

describe("Planet", function() {

    describe("#getSmellFromCoordinates()", function() {

        it("Should find a smell at 5, 4", function() {

            var planet = new Planet(5, 5);
            planet.scentMap[5][5] = true;

            assert(planet.getSmellFromCoordinates(5, 5), true);

        })


    })

});

describe("Robot", function() {

    describe("#stringToHeading()", function() {

        it("Should return Robot.NORTH when N is given", function() {
            assert.equal(Robot.NORTH, Robot.stringToHeading("N"));
        })

        it("Should return Robot.EAST when E is given", function() {
            assert.equal(Robot.EAST, Robot.stringToHeading("E"));
        })

        it("Should return Robot.SOUTH when S is given", function() {
            assert.equal(Robot.SOUTH, Robot.stringToHeading("S"));
        })

        it("Should return Robot.WEST when W is given", function() {
            assert.equal(Robot.WEST, Robot.stringToHeading("W"));
        })

        it("Should return ? when an unknown heading is given", function() {
            assert.equal("?", Robot.stringToHeading("A"));
        })

    })

    describe("#headingToString()", function() {

        it("Should ", function() {
            assert.equal(true, true);
        })

    })

});
