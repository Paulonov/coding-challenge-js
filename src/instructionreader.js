/**
 * instructionreader.js
 *
 * Used to handle input data from text box. Parses data naively using regular expressions; this is explained in more
 * detail in the parse function.
 *
 * Properties: planetBoundaries, instructionStack, currentRobotInstructions, currentRobotStartingInformation
 */
"use strict";

import {stringToHeading} from "./robot.js";

/**
 * Prepare a robot for use if there is one available.
 * @return {Robot} A simple robot object containing the initial state
 */
export function prepareRobots(instructionStack, planetBoundaries) {

  // If the current stack is empty, bail!
  if (typeof instructionStack[instructionStack.length - 1] === "undefined") {
    return false;
  }

  let robots = [];
  let robotId = 1;

  while(typeof instructionStack[instructionStack.length - 1] !== "undefined") {

    // Get the next robot's starting position from the top of the list
    let startingInformation = instructionStack.pop().trim().split(" ");

    let x = parseInt(startingInformation[0], 10);
    let y = parseInt(startingInformation[1], 10);
    let heading = startingInformation[2];

    // Save the robot's instructions as a stack
    // TODO: We could always do this later and save the string as a whole first
    let startingInstructions = instructionStack.pop().trim().split("").reverse();

    // If we've found a blank line, remove it
    if (typeof instructionStack[instructionStack.length - 1] !== "undefined" &&
      instructionStack[instructionStack.length - 1].trim().length === 0) {
      instructionStack.pop();
    }

    if (x < 0 || y < 0 || x > planetBoundaries[0] || y > planetBoundaries[1] || typeof x === "undefined"
        || typeof y === "undefined" || x === null || y === null) {

      //throw "<b>Robot Placement Out of Bounds: </b>" + robot.x + ", " + robot.y;
      continue;

    }

    // If the given heading is unknown, skip this robot
    if (stringToHeading(startingInformation[2]) === "?") {
        //throw "<b>Robot Creation Error:</b> Invalid initial heading!";
        continue;
    }

    // We reverse the startingInstructions so we can use it as a stack later
    let robot = {
      id: robotId,
      heading: heading,
      instructions: startingInstructions,
      x: x,
      y: y,
      lost: false
    };

    robotId++;
    robots.push(robot);

  }

  return robots;

}

/**
 * Parse a string of instructions into a stack ready to be processed.
 * @param  {String} instructions A String containing the input data straight from a file or editor box.
 * @return {Array (Stack)}       An Array containing the parsed input data. Should be used as a stack.
 */
export function parseInstructions(instructions) {

  // Trim trailing whitespace and split the user's input on a new line character
  let instructionStack = [];
  let splitInstructions = instructions.trim().split(/\r?\n/);

  /*
   * Filter out the blank lines. The regex tests for a line containing nothing or a line containing nothing but
   * whitespace characters. Test returns true when a line matching the regex is found so we need to negate it to get
   * the actual lines that we want.
   */
   splitInstructions = splitInstructions.filter(function(line) {
    return !/^$|^\s+$/.test(line);
  });

  /*
   * Pre-parse setup: Check the first line of the user's input to see if it contains the planet's boundaries. If it
   * does, the planet boundaries are saved ready to be pushed on to the stack last. This is how file structure can
   * be embedded in to the parser; the regexes work a line at a time and so will not know that the planet boundaries
   * need to be at the top of the input.
   */

  // Flip our separated instructions round so we can use it as a stack
  splitInstructions = splitInstructions.reverse();

  let planetBoundaries;

  if (/^\d+ \d+\s*$/.test(splitInstructions[splitInstructions.length - 1])) {
    planetBoundaries = splitInstructions.pop();
  } else {
    throw "<b>Syntax Error: </b>" + "The first line should be the planet's boundaries!";
  }

  /*
   * Parse loop
   *
   * If a block of two instructions (a robot's starting position and its instructions) can be parsed properly,
   * push each of them on to the stack. As we've manipulated the input data into a list of robot statements, each
   * without
   *
   * A slight bit of weirdness here; as we've processed the input data into lines without any separator characters, we
   * can concatenate them with a space character of our own and parse the block as a whole. A statement such as
   * YERGFTGHFIUASH 23 45 B is tested as the array is reversed. The regex matches a string of 1 or more characters, a
   * digit, another digit and then one final character all separated by spaces. Trailing whitespace is included
   * because why not?
   */
  for (let i = 0; i < splitInstructions.length - 1; i += 2) {

    // letiable accesses appear to be quicker than array accesses (6.1ms vs 5.1ms per run)
    let robotInstructions = splitInstructions[i].trim();
    let robotPosition = splitInstructions[i + 1].trim();

    if (/^[a-zA-Z]+ \d+ \d+ [a-zA-Z]\s*$/.test(robotInstructions + " " + robotPosition)) {
      instructionStack.push(robotInstructions);
      instructionStack.push(robotPosition);
    } else {

      /*
       * If the position part of the robot statement has a syntax error, report it otherwise the error has to be
       * in the instruction part so we don't need to test for it (but we do anyway).
       */
      if (!/^\d+ \d+ [a-zA-Z]\s*$/.test(robotPosition)) {
        throw "<b>Syntax Error on Line: </b>" + robotPosition;
      } else if (!/^[a-zA-Z]+\s*$/.test(robotInstructions)) {
        throw "<b>Syntax Error on Line: </b>" + robotInstructions;
      } else {
        throw "<b>Unexplained Syntax Error: </b>" + robotPosition + " or " + robotInstructions;
      }

    }

  }

  instructionStack.push(planetBoundaries);
  return instructionStack;

}
