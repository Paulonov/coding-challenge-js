/**
 * instructionreader.js
 *
 * Used to handle input data from text box. Parses data naively using regular expressions; this is explained in more
 * detail in the parse function.
 *
 * Properties: planetBoundaries, instructionStack, currentRobotInstructions, currentRobotStartingInformation
 */
"use strict";

/**
 * Prepare a robot for use if there is one available.
 * @return {Robot} A simple robot object containing the initial state
 */
export function prepareRobots(instructionStack) {

    // If the current stack is empty, bail!
    if (typeof instructionStack[instructionStack.length - 1] === "undefined") {
        return false;
    }

    var robots = [];

    while(typeof instructionStack[instructionStack.length - 1] !== "undefined") {

        // Get the next robot's starting position from the top of the list
        var startingInformation = instructionStack.pop().trim().split(" ");

        // Get the list of instructions for that robot from the top of the list, split on empty string to get chars
        // TODO: We could always do this later and save the string as a whole first
        var startingInstructions = instructionStack.pop().trim().split("");

        // If we've found a blank line, remove it
        if (typeof instructionStack[instructionStack.length - 1] !== "undefined" &&
            instructionStack[instructionStack.length - 1].trim().length === 0) {
                instructionStack.pop();
        }

        var robot = {
            heading: startingInformation[2],
            instructions: startingInstructions,
            x: startingInformation[0],
            y: startingInformation[1],
            lost: false
        };

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
    var instructionStack = [];
    var splitInstructions = instructions.trim().split(/\r?\n/);

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

    var planetBoundaries;

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
    for (var i = 0; i < splitInstructions.length - 1; i += 2) {

        // Variable accesses appear to be quicker than array accesses (6.1ms vs 5.1ms per run)
        var robotInstructions = splitInstructions[i].trim();
        var robotPosition = splitInstructions[i + 1].trim();

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
