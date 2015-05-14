/**
 * robot-test.js
 */
"use strict";

import chai from "chai";
var assert = chai.assert;
var expect = chai.expect;

/*eslint-disable no-unused-vars*/
var should = chai.should();

import Robot from "../src/robot.js";
import Planet from "../src/planet.js";

describe("Robot", function() {

    // A stubbed version of grid information, we're not testing canvas-y things here
    var stubbedGridInformation = {
            xDifference: 0,
            yDifference: 0,
            width: 0,
            height: 0,
            margin: 0
    };

    var placementOutOfBounds = "Robot Placement Out of Bounds";
    var creationError = "Robot Creation Error";

    describe("#constructor()", function() {

        var planet;

        before(function() {
            planet = new Planet(5, 5);
            Robot.currentPlanet = planet;
        });

        it("should return an instance of Robot", function() {
            expect(new Robot(0, 0, "N", stubbedGridInformation)).to.be.an.instanceof(Robot);
        });

        it("should not create a robot with an x position greater than the planet's x boundary", function() {
            expect( robot => new Robot((planet.x + 1), planet.y) ).to.throw(placementOutOfBounds);
        });

        it("should not create a robot with a y position greater than the planet's y boundary", function() {
            expect( robot => new Robot(planet.x, (planet.y + 1) )).to.throw(placementOutOfBounds);
        });

        it("should not create a robot with an x position less than 0", function() {
            expect( robot => new Robot(-1, 0) ).to.throw(placementOutOfBounds);
        });

        it("should not create a robot with a y position less than 0", function() {
            expect( robot => new Robot(0, -1) ).to.throw(placementOutOfBounds);
        });

        it("should not create a robot with an undefined x position", function() {
            expect( robot => new Robot(null, 0) ).to.throw(placementOutOfBounds);
        });

        it("should not create a robot with an undefined y position", function() {
            expect( robot => new Robot(0, null) ).to.throw(placementOutOfBounds);
        });

        it("should not create a robot with an invalid initial heading", function() {
            expect( robot => new Robot(0, 0, "A") ).to.throw(creationError);
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

        it("converts a given string to the appropriate heading without error", function() {
            assert.equal(Robot.NORTH, Robot.stringToHeading("N"));
            assert.equal(Robot.EAST, Robot.stringToHeading("E"));
            assert.equal(Robot.SOUTH, Robot.stringToHeading("S"));
            assert.equal(Robot.WEST, Robot.stringToHeading("W"));
            assert.equal("?", Robot.stringToHeading("A"));
        });

    });

    describe("#headingToString()", function() {

        it("converts a given heading to the appropriate string without error", function() {
            assert.equal("N", Robot.headingToString(Robot.NORTH));
            assert.equal("E", Robot.headingToString(Robot.EAST));
            assert.equal("S", Robot.headingToString(Robot.SOUTH));
            assert.equal("W", Robot.headingToString(Robot.WEST));
            assert.equal("?", Robot.headingToString(99));
        });

    });

    describe("#getFancyPositionInformation()", function() {

        it("appends LOST to the string if the robot is lost", function() {
            var robot = new Robot(3, 3, "E", stubbedGridInformation);
            robot.isLost = true;
            expect(robot.getFancyPositionInformation()).to.contain("LOST");
        });

        it("does not append LOST to the string if the robot is on the grid", function() {
            var robot = new Robot(3, 3, "E", stubbedGridInformation);
            expect(robot.getFancyPositionInformation()).not.to.contain("LOST");
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
