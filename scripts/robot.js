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
 * @param {int} initialXPosition The robot's starting X position.
 * @param {int} initialYPosition The robot's starting Y position.
 * @param {char} initialHeading  The direction the robot is facing.
 */
var Robot = function(initialXPosition, initialYPosition, initialHeading, gridInformation) {

	var id;
	var xPosition;
	var yPosition;
	var heading;
	var isLost;

	// Graphics variables used when drawing the robot on the screen
	var length;
	var width;
	var canvasXPosition;
	var canvasYPosition;

	if (initialXPosition < 0 || initialYPosition < 0 || initialXPosition > Robot.currentPlanet.getXBoundary() ||
		initialYPosition > Robot.currentPlanet.getYBoundary()) {

		throw "Robot placement out of bounds: " + initialXPosition + ", " + initialYPosition;

	} else {

		xPosition = initialXPosition;
		yPosition = initialYPosition;

		canvasXPosition = (gridInformation.xDifference * xPosition) + gridInformation.margin;
		canvasYPosition = translateOrigin((gridInformation.yDifference * yPosition) + gridInformation.margin, gridInformation);

		// Set up the size of the robot in canvas co-ordinates, scales with the size of the grid
		if ((Robot.currentPlanet.getXBoundary() + Robot.currentPlanet.getYBoundary()) < 25) {
			length = 50;
			width = 50;
		} else {
			length = 30;
			width = 30;
		}

		if (initialHeading === "N") {
			heading = NORTH;
		} else if (initialHeading === "E") {
			heading = EAST;
		} else if (initialHeading === "S") {
			heading = SOUTH;
		} else if (initialHeading === "W") {
			heading = WEST;
		} else {
			throw "Robot Creation Error: Invalid current heading";
		}

		// Robot has been successfully created so increase the count
		Robot.robotCount++;
		id = Robot.robotCount;

	}

	isLost = false;

	/**
	 * Draw a robot onto a selected canvas.
	 * @param  {Object} gridInformation An object whose properties are various useful information about the created
	 *                                  grid.
	 * @param  {String} canvasId        A String containing the ID of the canvas to draw to.
	 */
	this.draw = function(gridInformation, canvasId) {

		var canvas = document.getElementById(canvasId);
		var context = canvas.getContext("2d");

		context.beginPath();

		// Draw the rectangle centred on the grid point
		context.rect(canvasXPosition - (width/2), canvasYPosition - (length/2), width, length);

		context.closePath();

		context.fillStyle = '#EFEFEF';
		context.fill();

		context.strokeStyle = '#BFBFBF';
		context.lineWidth = 5;
		context.stroke();

		// Draw the robot's number on it
		context.lineWidth = 1;
		context.strokeStyle = "#BFBFBF";
		context.textAlign = 'center';
  		context.strokeText(id + " " + headingToString(heading), canvasXPosition, canvasYPosition);

	};

	this.getXPosition = function() {
		return xPosition;
	};

	this.getYPosition = function() {
		return yPosition;
	};

	this.getHeading = function() {
		return heading;
	};

	this.isLost = function() {
		return isLost;
	};

	this.getWidth = function() {
		return width;
	};

	this.getLength = function() {
		return length;
	};

	this.getCanvasXPosition = function() {
		return canvasXPosition;
	};

	this.getCanvasYPosition = function() {
		return canvasYPosition;
	};

	this.setXPosition = function(newXPosition) {
		xPosition = newXPosition;
	};

	this.setYPosition = function(newYPosition) {
		yPosition = newYPosition;
	};

	this.setHeading = function(newHeading) {
		heading = newHeading;
	};

	this.setIsLost = function(newIsLost) {
		isLost = newIsLost;
	};

	this.setCanvasXPosition = function(newCanvasXPosition) {
		canvasXPosition = newCanvasXPosition;
	};

	this.setCanvasYPosition = function(newCanvasYPosition) {
		canvasYPosition = newCanvasYPosition;
	};

};

// Static variables, these are set before we call the constructor and so we can begin counting
Robot.robotCount = 0;
Robot.currentPlanet = null;

/**
 * Execute the instruction given to the robot. Logic is updated along with graphics.
 * @param  {char} instruction A character representing the instruction to execute.
 */
Robot.prototype.executeInstruction = function(instruction, gridInformation) {

	// Save values that get accessed a lot early on so that we don't have to keep accessing the getter method
	var heading = this.getHeading();
	var xPosition = this.getXPosition();
	var yPosition = this.getYPosition();

	var currentPlanetXBoundary = Robot.currentPlanet.getXBoundary();
	var currentPlanetYBoundary = Robot.currentPlanet.getYBoundary();

	if (!(this.isLost())) {

		switch (instruction) {

			// Using mod 4 allows us to add 3 to the heading to get the heading 90 degrees to the left of it
			case 'L':
				this.setHeading((heading + 3) % NUMBER_OF_DIRECTIONS);
				break;

			case 'R':
				this.setHeading((heading + 1) % NUMBER_OF_DIRECTIONS);
				break;

			case 'F':

				switch (heading) {

					case NORTH:

						if ((yPosition + 1) > currentPlanetYBoundary &&
							!Robot.currentPlanet.getSmellFromCoordinates(xPosition, yPosition)) {
								this.setIsLost(true);
						} else if ((yPosition + 1) > currentPlanetYBoundary &&
							Robot.currentPlanet.getSmellFromCoordinates(xPosition, yPosition)) {
							// Do nothing if we're about to leave the grid but we can smell lost robots
						} else {
							robot.setYPosition(yPosition + 1);
						}

						break;

					case EAST:

						if ((xPosition + 1) > currentPlanetXBoundary &&
							!Robot.currentPlanet.getSmellFromCoordinates(xPosition, yPosition)) {
								this.setIsLost(true);
						} else if ((xPosition + 1) > currentPlanetXBoundary &&
							currentPlanet.getSmellFromCoordinates(xPosition, yPosition)) {
								// Do nothing if we're about to leave the grid but we can smell lost robots
						} else {
							robot.setXPosition(xPosition + 1);
						}

						break;

					case SOUTH:

						if ((yPosition - 1) < 0 &&
							!Robot.currentPlanet.getSmellFromCoordinates(xPosition, yPosition)) {
								this.setIsLost(true);
						} else if ((yPosition - 1) < 0 &&
							Robot.currentPlanet.getSmellFromCoordinates(xPosition, yPosition)) {
							// Do nothing if we're about to leave the grid but we can smell lost robots
						} else {
							this.setYPosition(yPosition - 1);
						}

						break;

					case WEST:

						if ((xPosition - 1) < 0 &&
							!Robot.currentPlanet.getSmellFromCoordinates(xPosition, yPosition)) {
								this.setIsLost(true);
						} else if ((xPosition - 1) < 0 &&
							Robot.currentPlanet.getSmellFromCoordinates(xPosition, yPosition)) {
							// Do nothing if we're about to leave the grid but we can smell lost robots
						} else {
							this.setXPosition(xPosition - 1);
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

/**
 * Get some information about the robot with added HTML tags.
 * @return {String} A string containing useful information about the robot.
 */
Robot.prototype.getFancyPositionInformation = function() {

	if (this.isLost()) {
		return "<b>Robot " + Robot.robotCount + "</b>" + ": " + this.getXPosition() + " " + this.getYPosition() +
		" " + headingToString(this.getHeading()) + " " + "<b>LOST</b>";
	} else {
		return "<b>Robot " + Robot.robotCount + "</b>" + ": " + this.getXPosition() + " " + this.getYPosition() +
			" " + headingToString(this.getHeading());
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

// Utility function for converting heading values into characters
function headingToString(heading) {

	switch (heading) {
		case NORTH:
			return "N";
		case EAST:
			return "E";
		case SOUTH:
			return "S";
		case WEST:
			return "W";
		default:
			return"?";

	}

}
