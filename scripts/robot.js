/**
 * robot.js
 *
 * Contains the constructor required to create a Robot along with the logic to handle each instruction.
 */
var MartianRobots = MartianRobots || {};
MartianRobots.Robot = MartianRobots.Robot || {};

/**
 * Constructor for making a Robot object.
 * @param {int}  initialXPosition The robot's starting X position.
 * @param {int}  initialYPosition The robot's starting Y position.
 * @param {char} initialHeading  The direction the robot is facing.
 */
MartianRobots.Robot = function(initialXPosition, initialYPosition, initialHeading, gridInformation) {

	// Namespace aliases
	var Robot = MartianRobots.Robot;
	var Core = MartianRobots.Core;
	var Graphics = MartianRobots.Graphics;

	// Logic variables used when executing instructions
	var id;
	var xPosition;
	var yPosition;
	var heading;
	var isLost;

	// Graphics variables used when drawing the robot on the screen
	var speed;
	var length;
	var width;
	var canvasXPosition;
	var canvasYPosition;

	if (initialXPosition < 0 || initialYPosition < 0 || initialXPosition > Robot.currentPlanet.getXBoundary() ||
		initialYPosition > Robot.currentPlanet.getYBoundary()) {

		throw "<b>Robot Placement Out of Bounds: </b>" + initialXPosition + ", " + initialYPosition;

	} else {

		xPosition = initialXPosition;
		yPosition = initialYPosition;

		canvasXPosition = (gridInformation.xDifference * xPosition) + gridInformation.margin;
		canvasYPosition = Graphics.translateOrigin((gridInformation.yDifference * yPosition) + gridInformation.margin,
			gridInformation);

		// Use the size of the planet to establish a suitable speed for the robots - Totally arbitrary!
		speed = (1/(Core.planet.getXBoundary() + Core.planet.getYBoundary())) * 1.5;

		// Set up the size of the robot in canvas co-ordinates, scales with the size of the grid
		if ((Robot.currentPlanet.getXBoundary() + Robot.currentPlanet.getYBoundary()) < 25) {
			length = 50;
			width = 50;
		} else {
			length = 30;
			width = 30;
		}

		// Headings are represented internally as numbers so we need to do a conversion
		if (initialHeading === "N") {
			heading = Robot.NORTH;
		} else if (initialHeading === "E") {
			heading = Robot.EAST;
		} else if (initialHeading === "S") {
			heading = Robot.SOUTH;
		} else if (initialHeading === "W") {
			heading = Robot.WEST;
		} else {
			throw "Robot Creation Error: Invalid current heading";
		}

		// Robot has been successfully created so increase the count
		Robot.robotCount++;
		id = Robot.robotCount;
		isLost = false;

	}

	/**
	 * Draw a robot (currently a grey square...) onto a selected canvas.
	 * @param  {Object} gridInformation An object whose properties are various useful information about the created
	 *                                  grid.
	 * @param  {Object} context         The canvas context to draw to.
	 */
	this.draw = function(gridInformation, context) {

		// Draw the robot centred on the grid point
		context.beginPath();
		context.rect(canvasXPosition - (width/2), canvasYPosition - (length/2), width, length);
		context.fillStyle = '#EFEFEF';
		context.fill();

		// Add an outline to the robot
		context.strokeStyle = '#BFBFBF';
		context.lineWidth = 5;
		context.stroke();

		// Draw the robot's number on it
		context.beginPath();
		context.lineWidth = 1;
		context.strokeStyle = "#BFBFBF";
		context.textAlign = 'center';
  		context.strokeText(id + " " + MartianRobots.Robot.headingToString(heading), canvasXPosition, canvasYPosition);

	};

	// TODO: These give us encapsulation but do we really need it?
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

	this.getSpeed = function() {
		return speed;
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

	this.setSpeed = function(newSpeed) {
		speed = newSpeed;
	};

};

/*
 * Static variables, these are set before we call the constructor and so we can begin counting. Defined here so that
 * MartianRobots.Robot is defined before we add some properties to it.
 */
MartianRobots.Robot.robotCount = 0;
MartianRobots.Robot.currentPlanet = null;

// Internal heading values: Counted clockwise from north
MartianRobots.Robot.NUMBER_OF_DIRECTIONS = 4;
MartianRobots.Robot.NORTH = 0;
MartianRobots.Robot.EAST = 1;
MartianRobots.Robot.SOUTH = 2;
MartianRobots.Robot.WEST = 3;

/**
 * Execute the instruction given to the robot and update its internal state.
 * @param  {char} instruction A character representing the instruction to execute.
 */
MartianRobots.Robot.prototype.executeInstruction = function(instruction, gridInformation) {

	var Robot = MartianRobots.Robot;

	// Save values that get accessed a lot early on so that we don't have to keep accessing the getter method
	var heading = this.getHeading();
	var xPosition = this.getXPosition();
	var yPosition = this.getYPosition();

	var smell = Robot.currentPlanet.getSmellFromCoordinates(xPosition, yPosition);
	var currentPlanetXBoundary = Robot.currentPlanet.getXBoundary();
	var currentPlanetYBoundary = Robot.currentPlanet.getYBoundary();

	if (!(this.isLost())) {

		switch (instruction) {

			// Using mod 4 allows us to add 3 to the heading to get the heading 90 degrees to the left of it
			case 'L':
				this.setHeading((heading + 3) % Robot.NUMBER_OF_DIRECTIONS);
				break;

			case 'R':
				this.setHeading((heading + 1) % Robot.NUMBER_OF_DIRECTIONS);
				break;

			case 'F':

				switch (heading) {

					case Robot.NORTH:

						if ((yPosition + 1) > currentPlanetYBoundary && !smell) {
							this.setIsLost(true);
						} else if ((yPosition + 1) > currentPlanetYBoundary && smell) {
							// Do nothing if we're about to leave the grid but we can smell lost robots
						} else {
							this.setYPosition(yPosition + 1);
						}

						break;

					case Robot.EAST:

						if ((xPosition + 1) > currentPlanetXBoundary && !smell) {
							this.setIsLost(true);
						} else if ((xPosition + 1) > currentPlanetXBoundary && smell) {
								// Do nothing if we're about to leave the grid but we can smell lost robots
						} else {
							this.setXPosition(xPosition + 1);
						}

						break;

					case Robot.SOUTH:

						if ((yPosition - 1) < 0 && !smell) {
							this.setIsLost(true);
						} else if ((yPosition - 1) < 0 && smell) {
							// Do nothing if we're about to leave the grid but we can smell lost robots
						} else {
							this.setYPosition(yPosition - 1);
						}

						break;

					case Robot.WEST:

						if ((xPosition - 1) < 0 && !smell) {
							this.setIsLost(true);
						} else if ((xPosition - 1) < 0 && smell) {
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
MartianRobots.Robot.prototype.getFancyPositionInformation = function() {

	var Robot = MartianRobots.Robot;

	if (this.isLost()) {
		return "<b>Robot " + Robot.robotCount + "</b>" + ": " + this.getXPosition() + " " + this.getYPosition() +
		" " + Robot.headingToString(this.getHeading()) + " " + "<b>LOST</b>";
	} else {
		return "<b>Robot " + Robot.robotCount + "</b>" + ": " + this.getXPosition() + " " + this.getYPosition() +
			" " + Robot.headingToString(this.getHeading());
	}

};

/**
 * We're giving the Robot object two methods of its own that you can call without needing an instance. These act as
 * static functions.
 */
MartianRobots.Robot.setPlanet = function(planet) {
	this.currentPlanet = planet;
};

MartianRobots.Robot.setRobotCount = function(count) {
	this.robotCount = count;
};

/**
 * Convert a (numerical) heading value back into its String form.
 * TODO: Refactor using an enum maybe?
 * @param  {int}    heading A numerical value representing the current heading.
 * @return {String}         The String form of that value.
 */
MartianRobots.Robot.headingToString = function(heading) {

	var Robot = MartianRobots.Robot;

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
			return"?";

	}

};
