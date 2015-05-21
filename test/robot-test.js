/**
 * robot-test.js
 *
 * A test suite for the Robot functions.
 */
 "use strict";

import chai from "chai";
let assert = chai.assert;
let expect = chai.expect;

let should = chai.should();

import {Robot, stringToHeading, headingToString, executeInstruction, getFancyPositionInformation}
from "../src/robot.js";

describe("Robot", function() {

  let placementOutOfBounds = "Robot Placement Out of Bounds";
  let creationError = "Robot Creation Error";

  describe("#executeInstruction()", function() {

    let robot;
    let planet;

    let updatedRobot;

    beforeEach(function() {

      robot = {
        id: 1,
        heading: "N",
        instructions: ["F"],
        x: 0,
        y: 0,
        lost: false
      };

      updatedRobot = {
        id: 1,
        heading: "N",
        instructions: ["F"],
        x: 0,
        y: 0,
        lost: false
      };

      planet = {
        scents: {},
        rows: 3,
        cols: 3
      };

    });

    describe("when the robot is lost", function() {

      it("should not affect the robot's state", function() {

        robot.lost = true;
        updatedRobot.lost = true;

        let resultingRobot = executeInstruction(robot, planet, "F");
        expect(resultingRobot).to.deep.equal(updatedRobot);

      });

    });

    describe("when the robot is not lost", function() {

      describe("an F instruction", function() {

        describe("that moves the robot off of the grid", function() {

          describe("if there is a scent", function() {

            beforeEach(function() {
              planet.scents["0,0"] = true;
              planet.scents[`${planet.rows},${planet.cols}`] = true;
            });

            describe("while facing north", function() {

              it("should not leave the grid", function() {

                robot.x = planet.rows;
                robot.y = planet.cols;
                robot.heading = "N";

                updatedRobot.x = planet.rows;
                updatedRobot.y = planet.rows;
                updatedRobot.heading = "N";

                let resultingRobot = executeInstruction(robot, planet, "F");
                expect(resultingRobot).to.deep.equal(updatedRobot);

              });

            });

            describe("while facing east", function() {

              it("should not leave the grid", function() {

                robot.x = planet.rows;
                robot.y = planet.cols;
                robot.heading = "E";

                updatedRobot.x = planet.rows;
                updatedRobot.y = planet.rows;
                updatedRobot.heading = "E";

                let resultingRobot = executeInstruction(robot, planet, "F");
                expect(resultingRobot).to.deep.equal(updatedRobot);

              });

            });

            describe("while facing south", function() {

              it("should not leave the grid", function() {

                robot.heading = "S";
                updatedRobot.heading = "S";

                let resultingRobot = executeInstruction(robot, planet, "F");
                expect(resultingRobot).to.deep.equal(updatedRobot);

              });

            });

            describe("while facing west", function() {

              it("should not leave the grid", function() {

                robot.heading = "W";
                updatedRobot.heading = "W";

                let resultingRobot = executeInstruction(robot, planet, "F");
                expect(resultingRobot).to.deep.equal(updatedRobot);

              });

            });

          });

describe("if there is not a scent", function() {

  describe("while facing north", function() {

    it("should set the robot's state to lost without changing its position", function() {

      robot.x = planet.rows;
      robot.y = planet.cols;

      updatedRobot.x = planet.rows;
      updatedRobot.y = planet.cols;
      updatedRobot.lost = true;

      let resultingRobot = executeInstruction(robot, planet, "F");
      expect(resultingRobot).to.deep.equal(updatedRobot);

    });

  });

  describe("while facing east", function() {

    it("should set the robot's state to lost without changing its position", function() {

      robot.x = planet.rows;
      robot.y = planet.cols;
      robot.heading = "E";

      updatedRobot.x = planet.rows;
      updatedRobot.y = planet.cols;
      updatedRobot.heading = "E";
      updatedRobot.lost = true;

      let resultingRobot = executeInstruction(robot, planet, "F");
      expect(resultingRobot).to.deep.equal(updatedRobot);

    });

  });


  describe("while facing south", function() {

    it("should set the robot's state to lost without changing its position", function() {

      robot.x = 0;
      robot.y = 0;
      robot.heading = "S";

      updatedRobot.x = 0;
      updatedRobot.y = 0;
      updatedRobot.heading = "S";
      updatedRobot.lost = true;

      let resultingRobot = executeInstruction(robot, planet, "F");
      expect(resultingRobot).to.deep.equal(updatedRobot);

    });

  });

  describe("while facing west", function() {

    it("should set the robot's state to lost without changing its position", function() {

      robot.x = 0;
      robot.y = 0;
      robot.heading = "W";

      updatedRobot.x = 0;
      updatedRobot.y = 0;
      updatedRobot.heading = "W";
      updatedRobot.lost = true;

      let resultingRobot = executeInstruction(robot, planet, "F");
      expect(resultingRobot).to.deep.equal(updatedRobot);

    });

  });

});

});

describe("that won't move the robot off of the grid", function() {

  describe("while facing north", function() {

    it("should increase the robot's y position by 1", function() {

      robot.x = 0;
      robot.y = 0;
      robot.heading = "N";

      updatedRobot.y += 1;

      let resultingRobot = executeInstruction(robot, planet, "F");
      expect(resultingRobot).to.deep.equal(updatedRobot);

    });

  });

  describe("while facing east", function() {

    it("should increase the robot's x position by 1", function() {

      robot.x = 0;
      robot.y = 0;
      robot.heading = "E";

      updatedRobot.x += 1;
      updatedRobot.heading = "E";

      let resultingRobot = executeInstruction(robot, planet, "F");
      expect(resultingRobot).to.deep.equal(updatedRobot);

    });

  });

  describe("while facing south", function() {

    it("should reduce the robot's y position by 1", function() {

      robot.x = 1;
      robot.y = 1;
      robot.heading = "S";

      updatedRobot.x = 1;
      updatedRobot.y = 1;
      updatedRobot.y -= 1;
      updatedRobot.heading = "S";

      let resultingRobot = executeInstruction(robot, planet, "F");
      expect(resultingRobot).to.deep.equal(updatedRobot);

    });

  });

  describe("while facing west", function() {

    it("should reduce the robot's x position by 1", function() {

      robot.x = 1;
      robot.y = 1;
      robot.heading = "W";

      updatedRobot.x = 1;
      updatedRobot.y = 1;
      updatedRobot.x -= 1;
      updatedRobot.heading = "W";

      let resultingRobot = executeInstruction(robot, planet, "F");
      expect(resultingRobot).to.deep.equal(updatedRobot);

    });

  });

});

});

describe("an L instruction", function() {

  describe("while facing north", function() {

    it("should change the robot's heading to west", function() {

      robot.heading = "N";
      updatedRobot.heading = "W";

      let resultingRobot = executeInstruction(robot, planet, "L");
      expect(resultingRobot).to.deep.equal(updatedRobot);

    });

  });

  describe("while facing east", function() {

    it("should change the robot's heading to north", function() {

      robot.heading = "E";
      updatedRobot.heading = "N";

      let resultingRobot = executeInstruction(robot, planet, "L");
      expect(resultingRobot).to.deep.equal(updatedRobot);

    });

  });

  describe("while facing south", function() {

    it("should change the robot's heading to east", function() {

      robot.heading = "S";
      updatedRobot.heading = "E";

      let resultingRobot = executeInstruction(robot, planet, "L");
      expect(resultingRobot).to.deep.equal(updatedRobot);

    });

  });

  describe("while facing west", function() {

    it("should change the robot's heading to south", function() {

      robot.heading = "W";
      updatedRobot.heading = "S";

      let resultingRobot = executeInstruction(robot, planet, "L");
      expect(resultingRobot).to.deep.equal(updatedRobot);

    });

  });

});

describe("an R instruction", function() {

  describe("while facing north", function() {

    it("should change the robot's heading to east", function() {

      robot.heading = "N";
      updatedRobot.heading = "E";

      let resultingRobot = executeInstruction(robot, planet, "R");
      expect(resultingRobot).to.deep.equal(updatedRobot);

    });

  });

  describe("while facing east", function() {

    it("should change the robot's heading to south", function() {

      robot.heading = "E";
      updatedRobot.heading = "S";

      let resultingRobot = executeInstruction(robot, planet, "R");
      expect(resultingRobot).to.deep.equal(updatedRobot);

    });

  });

  describe("while facing south", function() {

    it("should change the robot's heading to west", function() {

      robot.heading = "S";
      updatedRobot.heading = "W";

      let resultingRobot = executeInstruction(robot, planet, "R");
      expect(resultingRobot).to.deep.equal(updatedRobot);

    });

  });

  describe("while facing west", function() {

    it("should change the robot's heading to north", function() {

      robot.x = 0;
      robot.y = 0;
      robot.heading = "W";

      let resultingRobot = executeInstruction(robot, planet, "R");
      expect(resultingRobot).to.deep.equal(updatedRobot);

    });

  });

});

});

});

describe("#stringToHeading()", function() {

  it("converts a given string to the appropriate heading without error", function() {
    assert.equal(Robot.NORTH, stringToHeading("N"));
    assert.equal(Robot.EAST, stringToHeading("E"));
    assert.equal(Robot.SOUTH, stringToHeading("S"));
    assert.equal(Robot.WEST, stringToHeading("W"));
    assert.equal("?", stringToHeading("A"));
  });

});

describe("#headingToString()", function() {

  it("converts a given heading to the appropriate string without error", function() {
    assert.equal("N", headingToString(Robot.NORTH));
    assert.equal("E", headingToString(Robot.EAST));
    assert.equal("S", headingToString(Robot.SOUTH));
    assert.equal("W", headingToString(Robot.WEST));
    assert.equal("?", headingToString(99));
  });

});

describe("#getFancyPositionInformation()", function() {

  let robot;

  beforeEach(function() {

    robot = {
      id: 1,
      heading: "N",
      instructions: ["F"],
      x: 0,
      y: 0,
      lost: false
    };

  });

  it("appends LOST to the string if the robot is lost", function() {
    robot.lost = true;
    expect(getFancyPositionInformation(robot)).to.contain("LOST");
  });

  it("does not append LOST to the string if the robot is on the grid", function() {
    expect(getFancyPositionInformation(robot)).not.to.contain("LOST");
  });

});

});
