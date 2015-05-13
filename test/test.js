/**
 * test.js
 *
 * A file containing some Mocha tests for the application.
 */
"use strict";

import chai from "chai";
var assert = chai.assert;
var expect = chai.expect;

/*eslint-disable no-unused-vars*/
var should = chai.should();

import InstructionReader from "../src/instructionreader.js";
import Robot from "../src/robot.js";
import Planet from "../src/planet.js";

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

describe("Planet", function() {


    /*eslint-disable no-unused-vars*/
    describe("#constructor()", function() {

        it("should return an instance of Planet", function() {
            expect(new Planet(5, 5)).to.be.an.instanceof(Planet);
        });

        it("should not create a planet with an x larger than 50", function() {

            try {
                var planet = new Planet(51, 50);
            } catch (error) {

                var errorMessage = "<b>Planet Creation Error: </b> Specified planet co-ordinates are out of bounds! " +
                    "Max planet size is 50x50";

                error.should.equal(errorMessage);

            }

        });

        it("should not create a planet with a y larger than 50", function() {

            try {
                var planet = new Planet(50, 51);
            } catch (error) {

                var errorMessage = "<b>Planet Creation Error: </b> Specified planet co-ordinates are out of bounds! " +
                    "Max planet size is 50x50";

                error.should.equal(errorMessage);

            }

        });

        it("should not create a planet with an x smaller than 0", function() {

            try {
                var planet = new Planet(-1, 0);
            } catch (error) {

                var errorMessage = "<b>Planet Creation Error: </b> Specified planet co-ordinates are out of bounds! " +
                    "Max planet size is 50x50";

                error.should.equal(errorMessage);

            }

        });

        it("should not create a planet with a y smaller than 0", function() {

            try {
                var planet = new Planet(0, -1);
            } catch (error) {

                var errorMessage = "<b>Planet Creation Error: </b> Specified planet co-ordinates are out of bounds! " +
                    "Max planet size is 50x50";

                error.should.equal(errorMessage);

            }

        });

        it("should not create a planet with an undefined x", function() {

            try {
                var planet = new Planet(null, 0);
            } catch (error) {

                var errorMessage = "<b>Planet Creation Error: </b> Specified planet co-ordinates are out of bounds! " +
                    "Max planet size is 50x50";

                error.should.equal(errorMessage);

            }

        });

        it("should not create a planet with an undefined y", function() {

            try {
                var planet = new Planet(0, null);
            } catch (error) {

                var errorMessage = "<b>Planet Creation Error: </b> Specified planet co-ordinates are out of bounds! " +
                    "Max planet size is 50x50";

                error.should.equal(errorMessage);

            }

        });

    });


    describe("#getSmellFromCoordinates()", function() {

        it("should find a smell at 5, 4", function() {

            var planet = new Planet(5, 5);
            planet.scentMap[5][5] = true;

            assert(planet.getSmellFromCoordinates(5, 5), true);

        });

    });

});

describe("Robot", function() {

    var stubbedGridInformation;

    before(function() {

        // A stubbed version of grid information, we're not testing canvas-y things here
        stubbedGridInformation = {
            xDifference: 0,
            yDifference: 0,
            width: 0,
            height: 0,
            margin: 0
        };

    });

    describe("#constructor()", function() {

        var planet;

        before(function() {
            planet = new Planet(5, 5);
            Robot.currentPlanet = planet;
        });

        it("should return an instance of Robot", function() {
            var robot = new Robot(0, 0, "N", stubbedGridInformation);
            expect(robot).to.be.an.instanceof(Robot);
        });

        it("should not create a robot with an x position greater than the planet's x boundary", function() {

            try {
                var robot = new Robot((planet.x + 1), planet.y);
            } catch (error) {
                var errorMessage = "<b>Robot Placement Out of Bounds: </b>" + (planet.x + 1) + ", " + planet.y;
                expect(error).to.equal(errorMessage);
            }

        });

        it("should not create a robot with a y position greater than the planet's y boundary", function() {

            try {
                var robot = new Robot(planet.x, (planet.y + 1));
            } catch (error) {
                var errorMessage = "<b>Robot Placement Out of Bounds: </b>" + planet.x + ", " + (planet.y + 1);
                expect(error).to.equal(errorMessage);
            }

        });


        it("should not create a robot with an x position less than 0", function() {

            try {
                var robot = new Robot(-1, 0);
            } catch (error) {
                var errorMessage = "<b>Robot Placement Out of Bounds: </b>" + (-1) + ", " + 0;
                expect(error).to.equal(errorMessage);
            }

        });

        it("should not create a robot with a y position less than 0", function() {

            try {
                var robot = new Robot(0, -1);
            } catch (error) {
                var errorMessage = "<b>Robot Placement Out of Bounds: </b>" + 0 + ", " + (-1);
                expect(error).to.equal(errorMessage);
            }

        });

        it("should not create a robot with an undefined x position", function() {

            try {
                var robot = new Robot(null, 0);
            } catch (error) {
                var errorMessage = "<b>Robot Placement Out of Bounds: </b>" + null + ", " + 0;
                expect(error).to.equal(errorMessage);
            }

        });

        it("should not create a robot with an undefined y position", function() {

            try {
                var robot = new Robot(0, null);
            } catch (error) {
                var errorMessage = "<b>Robot Placement Out of Bounds: </b>" + 0 + ", " + null;
                expect(error).to.equal(errorMessage);
            }

        });

    });

    describe("#executeInstruction()", function() {

        var planet;
        var robot;

        beforeEach(function() {
            planet = new Planet(5, 5);
            Robot.currentPlanet = planet;
            robot = new Robot(1, 1, "E", stubbedGridInformation);
        });

        describe("when the robot is lost", function() {

            it("should not affect the robot's state", function() {

                var startingX = robot.xPosition;
                var startingY = robot.yPosition;
                var startingHeading = robot.heading;

                robot.isLost = true;
                robot.executeInstruction("F");

                expect(robot.xPosition).to.equal(startingX);
                expect(robot.yPosition).to.equal(startingY);
                expect(robot.heading).to.equal(startingHeading);

            });

        });

        describe("when the robot is not lost", function() {

            describe("an F instruction", function() {

                describe("that moves the robot off of the grid", function() {

                    describe("if there is a scent", function() {

                        describe("while facing north", function() {

                            it("should not leave the grid", function() {

                                planet.scentMap[planet.x][planet.y] = true;

                                robot.xPosition = planet.x;
                                robot.yPosition = planet.y;
                                robot.heading = Robot.NORTH;

                                var startingX = robot.xPosition;
                                var startingY = robot.yPosition;
                                var startingHeading = robot.heading;

                                robot.executeInstruction("F");

                                expect(robot.xPosition).to.equal(startingX);
                                expect(robot.yPosition).to.equal(startingY);
                                expect(robot.heading).to.equal(startingHeading);
                                expect(robot.isLost).to.equal(false);

                            });

                        });

                        describe("while facing east", function() {

                            it("should not leave the grid", function() {

                                planet.scentMap[planet.x][planet.y] = true;

                                robot.xPosition = planet.x;
                                robot.yPosition = planet.y;
                                robot.heading = Robot.EAST;

                                var startingX = robot.xPosition;
                                var startingY = robot.yPosition;
                                var startingHeading = robot.heading;

                                robot.executeInstruction("F");

                                expect(robot.xPosition).to.equal(startingX);
                                expect(robot.yPosition).to.equal(startingY);
                                expect(robot.heading).to.equal(startingHeading);
                                expect(robot.isLost).to.equal(false);

                            });

                        });

                        describe("while facing south", function() {

                            it("should not leave the grid", function() {

                                planet.scentMap[0][0] = true;

                                robot.xPosition = 0;
                                robot.yPosition = 0;
                                robot.heading = Robot.SOUTH;

                                var startingX = robot.xPosition;
                                var startingY = robot.yPosition;
                                var startingHeading = robot.heading;

                                robot.executeInstruction("F");

                                expect(robot.xPosition).to.equal(startingX);
                                expect(robot.yPosition).to.equal(startingY);
                                expect(robot.heading).to.equal(startingHeading);
                                expect(robot.isLost).to.equal(false);

                            });

                        });

                        describe("while facing west", function() {

                            it("should not leave the grid", function() {

                                planet.scentMap[0][0] = true;

                                robot.xPosition = 0;
                                robot.yPosition = 0;
                                robot.heading = Robot.WEST;

                                var startingX = robot.xPosition;
                                var startingY = robot.yPosition;
                                var startingHeading = robot.heading;

                                robot.executeInstruction("F");

                                expect(robot.xPosition).to.equal(startingX);
                                expect(robot.yPosition).to.equal(startingY);
                                expect(robot.heading).to.equal(startingHeading);
                                expect(robot.isLost).to.equal(false);

                            });

                        });

                    });

                    describe("if there is not a scent", function() {

                        describe("while facing north", function() {

                            it("should set the robot's state to lost without changing its position", function() {

                                robot.xPosition = planet.x;
                                robot.yPosition = planet.y;
                                robot.heading = Robot.NORTH;

                                var startingX = robot.xPosition;
                                var startingY = robot.yPosition;
                                var startingHeading = robot.heading;

                                robot.executeInstruction("F");

                                expect(robot.xPosition).to.equal(startingX);
                                expect(robot.yPosition).to.equal(startingY);
                                expect(robot.heading).to.equal(startingHeading);
                                expect(robot.isLost).to.equal(true);

                            });

                        });

                        describe("while facing east", function() {

                            it("should set the robot's state to lost without changing its position", function() {

                                robot.xPosition = planet.x;
                                robot.yPosition = planet.y;
                                robot.heading = Robot.EAST;

                                var startingX = robot.xPosition;
                                var startingY = robot.yPosition;
                                var startingHeading = robot.heading;

                                robot.executeInstruction("F");

                                expect(robot.xPosition).to.equal(startingX);
                                expect(robot.yPosition).to.equal(startingY);
                                expect(robot.heading).to.equal(startingHeading);
                                expect(robot.isLost).to.equal(true);

                            });

                        });


                        describe("while facing south", function() {

                            it("should set the robot's state to lost without changing its position", function() {

                                robot.xPosition = 0;
                                robot.yPosition = 0;
                                robot.heading = Robot.SOUTH;

                                var startingX = robot.xPosition;
                                var startingY = robot.yPosition;
                                var startingHeading = robot.heading;

                                robot.executeInstruction("F");

                                expect(robot.xPosition).to.equal(startingX);
                                expect(robot.yPosition).to.equal(startingY);
                                expect(robot.heading).to.equal(startingHeading);
                                expect(robot.isLost).to.equal(true);

                            });

                        });

                        describe("while facing west", function() {

                            it("should set the robot's state to lost without changing its position", function() {

                                robot.xPosition = 0;
                                robot.yPosition = 0;
                                robot.heading = Robot.WEST;

                                var startingX = robot.xPosition;
                                var startingY = robot.yPosition;
                                var startingHeading = robot.heading;

                                robot.executeInstruction("F");

                                expect(robot.xPosition).to.equal(startingX);
                                expect(robot.yPosition).to.equal(startingY);
                                expect(robot.heading).to.equal(startingHeading);
                                expect(robot.isLost).to.equal(true);

                            });

                        });

                    });

                });

                describe("that won't move the robot off of the grid", function() {

                    describe("while facing north", function() {

                        it("should increase the robot's y position by 1", function() {

                            var startingX = robot.xPosition;
                            var startingY = robot.yPosition;

                            robot.heading = Robot.NORTH;

                            robot.executeInstruction("F");

                            expect(startingX).to.equal(robot.xPosition);
                            expect(startingY + 1).to.equal(robot.yPosition);

                        });

                    });

                    describe("while facing east", function() {

                        it("should increase the robot's x position by 1", function() {

                            var startingX = robot.xPosition;
                            var startingY = robot.yPosition;

                            robot.heading = Robot.EAST;

                            robot.executeInstruction("F");

                            expect(startingX + 1).to.equal(robot.xPosition);
                            expect(startingY).to.equal(robot.yPosition);


                        });

                    });

                    describe("while facing south", function() {

                        it("should reduce the robot's y position by 1", function() {

                            var startingX = robot.xPosition;
                            var startingY = robot.yPosition;

                            robot.heading = Robot.SOUTH;
                            robot.executeInstruction("F");

                            expect(startingX).to.equal(robot.xPosition);
                            expect(startingY - 1).to.equal(robot.yPosition);

                        });

                    });

                    describe("while facing west", function() {

                        it("should increase the robot's x position by 1", function() {

                            var startingX = robot.xPosition;
                            var startingY = robot.yPosition;

                            robot.heading = Robot.WEST;
                            robot.executeInstruction("F");

                            expect(startingX - 1).to.equal(robot.xPosition);
                            expect(startingY).to.equal(robot.yPosition);


                        });

                    });

                });

            });

            describe("an L instruction", function() {

                describe("while facing north", function() {

                    it("should change the robot's heading to west", function() {

                        robot.heading = Robot.NORTH;

                        robot.executeInstruction("L");
                        expect(robot.heading).to.equal(Robot.WEST);

                    });

                });

                describe("while facing east", function() {

                    it("should change the robot's heading to north", function() {

                        robot.heading = Robot.EAST;

                        robot.executeInstruction("L");
                        expect(robot.heading).to.equal(Robot.NORTH);

                    });

                });

                describe("while facing south", function() {

                    it("should change the robot's heading to east", function() {

                        robot.heading = Robot.SOUTH;

                        robot.executeInstruction("L");
                        expect(robot.heading).to.equal(Robot.EAST);

                    });

                });

                describe("while facing west", function() {

                    it("should change the robot's heading to south", function() {

                        robot.heading = Robot.WEST;

                        robot.executeInstruction("L");
                        expect(robot.heading).to.equal(Robot.SOUTH);


                    });

                });

            });

            describe("an R instruction", function() {

                describe("while facing north", function() {

                    it("should change the robot's heading to east", function() {

                        robot.heading = Robot.NORTH;

                        robot.executeInstruction("R");
                        expect(robot.heading).to.equal(Robot.EAST);

                    });

                });

                describe("while facing east", function() {

                    it("should change the robot's heading to south", function() {

                        robot.heading = Robot.EAST;

                        robot.executeInstruction("R");
                        expect(robot.heading).to.equal(Robot.SOUTH);

                    });

                });

                describe("while facing south", function() {

                    it("should change the robot's heading to west", function() {

                        robot.heading = Robot.SOUTH;

                        robot.executeInstruction("R");
                        expect(robot.heading).to.equal(Robot.WEST);

                    });

                });

                describe("while facing west", function() {

                    it("should change the robot's heading to north", function() {

                        robot.heading = Robot.WEST;

                        robot.executeInstruction("R");
                        expect(robot.heading).to.equal(Robot.NORTH);


                    });

                });

            });

        });

    });

    describe("#stringToHeading()", function() {

        it("should return Robot.NORTH when N is given", function() {
            assert.equal(Robot.NORTH, Robot.stringToHeading("N"));
        });

        it("should return Robot.EAST when E is given", function() {
            assert.equal(Robot.EAST, Robot.stringToHeading("E"));
        });

        it("should return Robot.SOUTH when S is given", function() {
            assert.equal(Robot.SOUTH, Robot.stringToHeading("S"));
        });

        it("should return Robot.WEST when W is given", function() {
            assert.equal(Robot.WEST, Robot.stringToHeading("W"));
        });

        it("should return ? when an unknown heading is given", function() {
            assert.equal("?", Robot.stringToHeading("A"));
        });

    });

    describe("#headingToString()", function() {

        it("should return N when Robot.NORTH is given", function() {
            assert.equal("N", Robot.headingToString(Robot.NORTH));
        });

        it("should return E when Robot.EAST is given", function() {
            assert.equal("E", Robot.headingToString(Robot.EAST));
        });

        it("should return S when Robot.SOUTH is given", function() {
            assert.equal("S", Robot.headingToString(Robot.SOUTH));
        });

        it("should return W when Robot.WEST is given", function() {
            assert.equal("W", Robot.headingToString(Robot.WEST));
        });

        it("should return ? when anything else is given", function() {
            assert.equal("?", Robot.headingToString(99));
        });

    });

    describe("#updateScents()", function() {

        it("should add a scent to the scent map if the given robot is lost", function() {
            var planet = new Planet(5, 5);

            var robot = new Robot(5, 4, "E", stubbedGridInformation);
            robot.isLost = true;

            planet.updateScents(robot);

            assert.equal(planet.getSmellFromCoordinates(robot.xPosition, robot.yPosition), true);

        });

        it("should not add a scent to the scent map if the given robot is not lost", function() {
            var planet = new Planet(5, 5);

            var robot = new Robot(5, 4, "E", stubbedGridInformation);
            robot.isLost = false;

            planet.updateScents(robot);

            assert.equal(planet.getSmellFromCoordinates(robot.xPosition, robot.yPosition), false);

        });

    });

});
