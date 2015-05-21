/**
 * robot.js
 *
 * Contains the executeInstruction function required to update a robot's position and some fancy output formatters.
 */
"use strict";

export const Robot = {
  NUMBER_OF_DIRECTIONS: 4,
  NORTH: 0,
  EAST: 1,
  SOUTH: 2,
  WEST: 3
};

/**
 * Convert a heading string into its numerical equivalent.
 * @param  {string} heading A string containing the heading character to convert.
 * @return {int}            A numerical value corresponding to the heading passed in or a question mark if the value
 *                          cannot be converted.
 */
export function stringToHeading(heading) {

  switch (heading) {
    case "N":
      return Robot.NORTH;
    case "E":
      return Robot.EAST;
    case "S":
      return Robot.SOUTH;
    case "W":
      return Robot.WEST;
    default:
      return "?";
  }

}

/**
 * Convert a (numerical) heading value back into its string form.
 * TODO: Refactor using an enum maybe?
 * @param  {int}    heading A numerical value representing the current heading.
 * @return {String}         The String form of that value.
 */
export function headingToString(heading) {

  switch (heading) {
    case Robot.NORTH:
      return "N";
    case Robot.EAST:
      return "E";
    case Robot.SOUTH:
      return "S";
    case Robot.WEST:
      return "W";
    default:
      return "?";
  }

}

/**
 * Execute the instruction given to the robot and update its internal state.
 * @param  {Object} robot  The robot to execute the instruction on.
 * @param  {Object} planet The planet that the robot is moving around.
 * @param  {char}   instruction A character representing the instruction to execute.
 * @return {A new robot object with an updated internal state}
 */
export function executeInstruction(robot, planet, instruction) {

  // Save values that get accessed a lot early on so that we don't have to keep accessing the getter method
  let heading = stringToHeading(robot.heading);
  let xPosition = robot.x;
  let yPosition = robot.y;
  let lost = robot.lost;

  let smell = planet.scents[`${robot.x},${robot.y}`];

  if (typeof smell === "undefined") {
    smell = false;
  }

  let currentPlanetXBoundary = planet.cols;
  let currentPlanetYBoundary = planet.rows;

  if (robot.lost) {
    return robot;
  }

  switch (instruction) {

      // Using mod n allows us to add (n - 1) to the heading to get the next heading the left
      case "L":
      heading = (heading + (Robot.NUMBER_OF_DIRECTIONS - 1)) % Robot.NUMBER_OF_DIRECTIONS;
      break;

      // Same again but we add 1 to get the next heading to the right
      case "R":
      heading = (heading + 1) % Robot.NUMBER_OF_DIRECTIONS;
      break;

      case "F":

        switch (heading) {

          case Robot.NORTH:

            if ((yPosition + 1) > currentPlanetYBoundary && !smell) {
              lost = true;
            } else if ((yPosition + 1) > currentPlanetYBoundary && smell) {
              // Do nothing if we're about to leave the grid but we can smell lost robots
            } else {
              yPosition = (yPosition + 1);
            }

            break;

          case Robot.EAST:

            if ((xPosition + 1) > currentPlanetXBoundary && !smell) {
              lost = true;
            } else if ((xPosition + 1) > currentPlanetXBoundary && smell) {
              // Do nothing if we're about to leave the grid but we can smell lost robots
            } else {
              xPosition = (xPosition + 1);
            }

            break;

          case Robot.SOUTH:

            if ((yPosition - 1) < 0 && !smell) {
              lost = true;
            } else if ((yPosition - 1) < 0 && smell) {
              // Do nothing if we're about to leave the grid but we can smell lost robots
            } else {
              yPosition = (yPosition - 1);
            }

            break;

          case Robot.WEST:

            if ((xPosition - 1) < 0 && !smell) {
              lost = true;
            } else if ((xPosition - 1) < 0 && smell) {
              // Do nothing if we're about to leave the grid but we can smell lost robots
            } else {
              xPosition = (xPosition - 1);
            }

            break;

          }

          break;

      default:
        // Just in case the instruction is unimplemented
        break;

    }

    return {
      id: robot.id,
      heading: headingToString(heading),
      instructions: robot.instructions,
      x: xPosition,
      y: yPosition,
      lost: lost
    };

}

/**
 * Get some information about the robot that can be added to the output box.
 * @return {String} A nicely formatted string that can be added to the output box.
 */
export function getFancyPositionInformation(robot) {

  if (robot.lost) {
    return "<b>Robot " + robot.id + "</b>" + ": " + robot.x + " " + robot.y + " " + robot.heading + " " + "<b>LOST</b>";
  } else {
    return "<b>Robot " + robot.id + "</b>" + ": " + robot.x + " " + robot.y + " " + robot.heading;
  }

}
