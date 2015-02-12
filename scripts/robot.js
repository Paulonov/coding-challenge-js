/**
 * robot.js
 *
 * Contains the class required to create a Robot along with the logic to handle each instruction.
 */

/*
 * Values increase going clockwise around the compass and the number of directions constant allows us to use modulo
 * arithmetic to work out the new heading.
 */
var NORTH = 0;
var EAST = 1;
var SOUTH = 2;
var WEST = 3;
var NUMBER_OF_DIRECTIONS = 4;

/**
 * Constructor for making a Robot object.
 * @param {int} initialXPosition [description]
 * @param {int} initialYPosition [description]
 * @param {char} initialHeading   [description]
 */
var Robot = function(initialXPosition, initialYPosition, initialHeading) {

	var currentXPosition;
	var currentYPosition;
	var currentHeading;
	var isLost;

	if (initialXPosition < 0 || initialYPosition < 0 || initialXPosition > Robot.currentPlanet.getXBoundary() ||
		initialYPosition > Robot.currentPlanet.getYBoundary()) {

		throw "Robot placement out of bounds: " + initialXPosition + ", " + initialYPosition;

	} else {

		currentXPosition = initialXPosition;
		currentYPosition = initialYPosition;

		if (initialHeading === "N") {
			currentHeading = NORTH;
		} else if (initialHeading === "E") {
			currentHeading = EAST;
		} else if (initialHeading === "S") {
			currentHeading = SOUTH;
		} else if (initialHeading === "W") {
			currentHeading = WEST;
		} else {
			throw "Robot Creation Error: Invalid current heading";
		}

	}

	isLost = false;
	Robot.robotCount++;

	this.getCurrentXPosition = function() {
		return currentXPosition;
	};

	this.getCurrentYPosition = function() {
		return currentYPosition;
	};

	this.getCurrentHeading = function() {
		return currentHeading;
	};

	this.isLost = function() {
		return isLost;
	};

	this.setCurrentXPosition = function(newXPosition) {
		currentXPosition = newXPosition;
	};

	this.setCurrentYPosition = function(newYPosition) {
		currentYPosition = newYPosition;
	};

	this.setCurrentHeading = function(newHeading) {
		currentHeading = newHeading;
	};

	this.setIsLost = function(newIsLost) {
		isLost = newIsLost;
	};

};

// Static variables, these are set before we call the constructor and so we can begin counting
Robot.robotCount = 0;
Robot.currentPlanet = null;

Robot.prototype.executeInstruction = function(instruction) {

	// Save values that get accessed a lot early on so that we don't have to keep accessing the getter method
	var currentHeading = this.getCurrentHeading();
	var currentXPosition = this.getCurrentXPosition();
	var currentYPosition = this.getCurrentYPosition();
	var currentPlanetXBoundary = Robot.currentPlanet.getXBoundary();
	var currentPlanetYBoundary = Robot.currentPlanet.getYBoundary();

	if (!(this.isLost())) {

		switch (instruction) {

			// Using mod 4 allows us to add 3 to the heading to get the heading 90 degrees to the left of it
			case 'L':
				this.setCurrentHeading((currentHeading + 3) % NUMBER_OF_DIRECTIONS);
				break;

			case 'R':
				this.setCurrentHeading((currentHeading + 1) % NUMBER_OF_DIRECTIONS);
				break;

			case 'F':

				switch (currentHeading) {

					case NORTH:

						if ((currentYPosition + 1) > currentPlanetYBoundary &&
							!Robot.currentPlanet.getSmellFromCoordinates(currentXPosition, currentYPosition)) {
							this.setIsLost(true);
						} else if ((currentYPosition + 1) > currentPlanetYBoundary &&
							Robot.currentPlanet.getSmellFromCoordinates(currentXPosition, currentYPosition)) {
							// Do nothing if we're about to leave the grid but we can smell lost robots
						} else {
							this.setCurrentYPosition(currentYPosition + 1);
						}

						break;

					case EAST:

						if ((currentXPosition + 1) > currentPlanetXBoundary &&
							!Robot.currentPlanet.getSmellFromCoordinates(currentXPosition, currentYPosition)) {
							this.setIsLost(true);
						} else if ((currentXPosition + 1) > currentPlanetXBoundary &&
							currentPlanet.getSmellFromCoordinates(currentXPosition, currentYPosition)) {
							// Do nothing if we're about to leave the grid but we can smell lost robots
						} else {
							this.setCurrentXPosition(currentXPosition + 1);
						}

						break;

					case SOUTH:

						if ((currentYPosition - 1) < 0 &&
							!Robot.currentPlanet.getSmellFromCoordinates(currentXPosition, currentYPosition)) {
							this.setIsLost(true);
						} else if ((currentYPosition - 1) < 0 &&
							Robot.currentPlanet.getSmellFromCoordinates(currentXPosition, currentYPosition)) {
							// Do nothing if we're about to leave the grid but we can smell lost robots
						} else {
							this.setCurrentYPosition(currentYPosition - 1);
						}

						break;

					case WEST:

						if ((currentXPosition - 1) < 0 &&
							!this.currentPlanet.getSmellFromCoordinates(currentXPosition, currentYPosition)) {
							this.setIsLost(true);
						} else if ((currentXPosition - 1) < 0 &&
							Robot.currentPlanet.getSmellFromCoordinates(currentXPosition, currentYPosition)) {
							// Do nothing if we're about to leave the grid but we can smell lost robots
						} else {
							this.setCurrentXPosition(currentXPosition - 1);
						}

						break;

				}

				break;


			default:
				// Just in case the instruction is unimplemented
				break;

		}

	}

};

Robot.prototype.getFancyPositionInformation = function() {

	var currentHeadingString;

	switch (this.getCurrentHeading()) {
		case NORTH:
			currentHeadingString = "N";
			break;
		case EAST:
			currentHeadingString = "E";
			break;
		case SOUTH:
			currentHeadingString = "S";
			break;
		case WEST:
			currentHeadingString = "W";
			break;
		default:
			currentHeadingString = "?";
			break;

	}

	if (this.isLost()) {
		return "<b>Robot " + Robot.robotCount + "</b>" + ": " + this.getCurrentXPosition() + " " + this.getCurrentYPosition() +
		" " + currentHeadingString + " " + "<b>LOST</b>";
	} else {
		return "<b>Robot " + Robot.robotCount + "</b>" + ": " + this.getCurrentXPosition() + " " + this.getCurrentYPosition() +
			" " + currentHeadingString;
	}

};

/**
 * We're giving the Robot object two methods of its own that you can call without needing an instance. These act as
 * static functions.
 */
Robot.setPlanet = function(planet) {
	Robot.currentPlanet = planet;
};

Robot.setRobotCount = function(count) {
	Robot.robotCount = count;
};