/**
 * instructionreader.js
 *
 * Used to handle input data from text box. Parses data naively using regular expressions; this is explained in more
 * detail in the parse function.
 */

/**
 * Constructor for an InstructionReader object.
 * @param {String} instructions The block of instructions to process.
 */
var InstructionReader = function(instructions) {

	var planetBoundaries;
	var currentRobotStartingInformation;
	var currentRobotInstructions;

	// Split first item on stack into two boundary numbers
	var instructionStack;

	try {
		instructionStack = parse(instructions);
	} catch (error) {
		throw error;
	}

	planetBoundaries = instructionStack.pop().trim().split(" ");

	this.getPlanetBoundaries = function() {
		return planetBoundaries;
	};

	this.getInstructionStack = function() {
		return instructionStack;
	};

	this.getCurrentRobotInstructions = function() {
		return currentRobotInstructions;
	};

	this.getCurrentRobotStartingInformation = function() {
		return currentRobotStartingInformation;
	};

	this.setInstructionStack = function(updatedStack) {
		instructionStack = updatedStack;
	};

	this.setCurrentRobotInstructions = function(instructions) {
		currentRobotInstructions = instructions;
	};

	this.setCurrentRobotStartingInformation = function(startingInformation) {
		currentRobotStartingInformation = startingInformation;
	};

	// If the top of the stack contains nothing, return true
	this.empty = function() {
		return (typeof instructionStack[instructionStack.length - 1] === "undefined") ? true : false;
	};

};

/**
 * Prepare a robot for use if there is one available.
 * @return {boolean} True if a robot has been initialised, false otherwise.
 */
InstructionReader.prototype.initialiseRobot = function() {

	var instructionStack = this.getInstructionStack();

	// If the current stack isn't empty, it's time to initialise a robot!
	if (typeof instructionStack[instructionStack.length - 1] !== "undefined") {

		// Get the next robot's starting position from the top of the list
		this.setCurrentRobotStartingInformation(instructionStack.pop().trim().split(" "));

		// Get the list of instructions for that robot from the top of the list, split on empty string to get chars
		this.setCurrentRobotInstructions(instructionStack.pop().trim().split(""));

		// If we've found a blank line, remove it
		if (typeof instructionStack[instructionStack.length - 1] !== "undefined" &&
			instructionStack[instructionStack.length - 1].trim().length === 0) {
				instructionStack.pop();
		}

		this.setInstructionStack(instructionStack);
		return true;

	} else {
		console.log("Instruction stack empty...");
		return false;
	}

};

/**
 * Parse a string of instructions into a stack ready to be processed.
 * @param  {String} instructions A String containing the input data straight from a file or editor box.
 * @return {Array (Stack)}       An Array containing the parsed input data. Should be used as a stack.
 */
function parse(instructions) {

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
	var planetBoundaries;

	if (/^\d+ \d+\s*$/.test(splitInstructions[0])) {
		planetBoundaries = splitInstructions[0];
	} else {
		throw "Syntax Error: " + "The first line should be the planet's boundaries!";
	}

	// Flip our separated instructions round so we can use it as a stack
	splitInstructions = splitInstructions.reverse();

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
		var robotPosition = splitInstructions[i];
		var robotInstructions = splitInstructions[i+1];

		if (/^[a-zA-Z]+ \d+ \d+ [a-zA-Z]\s*$/.test(robotPosition + " " + robotInstructions)) {
			instructionStack.push(robotPosition);
			instructionStack.push(robotInstructions);
		}  else {

			/*
			 * If the position part of the robot statement has a syntax error, report it otherwise the error has to be
			 * in the instruction part so we don't need to test for it (but we do anyway).
			 */
			if (!/^[a-zA-Z]+\s*$/.test(robotPosition)) {
				console.log("Syntax Error on Line: " + robotPosition);
				throw "Syntax error on line: " + robotPosition;
			} else if (!/^\d+ \d+ [a-zA-Z]\s*$/.test(robotInstructions)) {
				console.log("Syntax Error on Line: " + robotInstructions);
				throw "Syntax Error on Line: " + robotInstructions;
			} else {
				console.log("Syntax Error on Line");
				throw "Unexplained Syntax Error: " + robotPosition + " or " + robotInstructions;
			}


		}

	}

	instructionStack.push(planetBoundaries);
	console.log("Instruction stack is: " + instructionStack.toString());
	return instructionStack;

}
