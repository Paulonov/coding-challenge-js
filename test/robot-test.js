/**
 * robot-test.js
 */
"use strict";

import chai from "chai";
var assert = chai.assert;
var expect = chai.expect;

/*eslint-disable no-unused-vars*/
var should = chai.should();

import coverloader from "coverjs-loader";

import Robot from "../src/robot.js";
import Planet from "../src/planet.js";

after(function() {
    coverloader.reportHtml();
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
            expect(new Robot(0, 0, "N", stubbedGridInformation)).to.be.an.instanceof(Robot);
        });

        it("should not create a robot with an x position greater than the planet's x boundary", function() {
            var errorMessage = "<b>Robot Placement Out of Bounds: </b>" + (planet.x + 1) + ", " + planet.y;
            expect( robot => new Robot((planet.x + 1), planet.y) ).to.throw(errorMessage);
        });

        it("should not create a robot with a y position greater than the planet's y boundary", function() {
            var errorMessage = "<b>Robot Placement Out of Bounds: </b>" + planet.x + ", " + (planet.y + 1);
            expect( robot => new Robot(planet.x, (planet.y + 1) )).to.throw(errorMessage);
        });


        it("should not create a robot with an x position less than 0", function() {
            var errorMessage = "<b>Robot Placement Out of Bounds: </b>" + (-1) + ", " + 0;
            expect( robot => new Robot(-1, 0) ).to.throw(errorMessage);
        });

        it("should not create a robot with a y position less than 0", function() {
            var errorMessage = "<b>Robot Placement Out of Bounds: </b>" + 0 + ", " + (-1);
            expect( robot => new Robot(0, -1) ).to.throw(errorMessage);
        });

        it("should not create a robot with an undefined x position", function() {
            var errorMessage = "<b>Robot Placement Out of Bounds: </b>" + null + ", " + 0;
            expect( robot => new Robot(null, 0) ).to.throw(errorMessage);
        });

        it("should not create a robot with an undefined y position", function() {
            var errorMessage = "<b>Robot Placement Out of Bounds: </b>" + 0 + ", " + null;
            expect( robot => new Robot(0, null) ).to.throw(errorMessage);
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
