/**
 * graphics.js
 *
 * Used for doing canvas-y things. Includes setup code for both canvases and all of the movement code for the robots.
 */

var MartianRobots = MartianRobots || {};
MartianRobots.Graphics = MartianRobots.Graphics || {};

MartianRobots.Graphics = {

	gridCanvas: null,
	gridContext: null,

	robotsCanvas: null,
	robotsContext: null,

	finishedRobotsCanvas: null,
	finishedRobotsContext: null,

	// The speed of each robot in pixels/s
	ROBOT_SPEED: 0,

	initialiseGridCanvas: function(planetX, planetY) {

		var Core = MartianRobots.Core;

		// Clear the grid and any robots from the canvas
		this.gridCanvas = document.getElementById("grid");
		this.gridContext = this.gridCanvas.getContext("2d");

		this.gridContext.clearRect(0, 0, this.gridCanvas.width, this.gridCanvas.height);

		// How far in from 0, 0 we want to draw the grid, we need a margin or the robots can't be centred on the grid
		var marginValue = 50;

		/*
		 * We want to divide our grid based on the size of the planet so we need to consider the margin that surrounds
		 * the grid in our calculations.
		 */
		var xUp = (this.gridCanvas.width - (marginValue*2))/planetX;
		var yUp = (this.gridCanvas.height - (marginValue*2))/planetY;

		var xBoundary = this.gridCanvas.width - marginValue;
		var yBoundary = this.gridCanvas.height - marginValue;

		console.log("The difference between x grid positions is: " + xUp);
		console.log("The difference between y grid positions is: " + yUp);

		console.log("The x boundary of the grid is " + xBoundary);
		console.log("The y boundary of the grid is " + yBoundary);

		// We have to start a path to define the shape (a grid) we want to draw using stroke()
		this.gridContext.beginPath();

		for (var x = marginValue; x <= xBoundary; x += xUp) {
			this.gridContext.moveTo(x, marginValue);
			this.gridContext.lineTo(x, yBoundary);
		}

		for (var y = marginValue; y <= yBoundary; y += yUp) {
			this.gridContext.moveTo(marginValue, y);
			this.gridContext.lineTo(xBoundary, y);
		}

		this.gridContext.closePath();

		this.gridContext.strokeStyle = "#B5F779";

		// TODO: Make lineWidth scale with planet size
		if ((planetX + planetY) < 15) {
			this.gridContext.lineWidth = 7;
		} else {
			this.gridContext.lineWidth = 4;
		}

		this.gridContext.stroke();

		return {
			xDifference: xUp,
			yDifference: yUp,
			width: xBoundary,
			height: yBoundary,
			margin: marginValue
		};


	},

	initialiseRobotsCanvas: function() {

		this.robotsCanvas = document.getElementById("robots");
		this.robotsContext = this.robotsCanvas.getContext("2d");

		this.robotsContext.clearRect(0, 0, this.robotsCanvas.width, this.robotsCanvas.height);

		// Chrome's JavaScript CPU profiler revealed setting this took lots of time so set it once here
	  	this.robotsContext.font = "12px Arial";

	},

	initialiseFinishedRobotsCanvas: function() {

		this.finishedRobotsCanvas = document.getElementById("finishedRobots");
		this.finishedRobotsContext = this.finishedRobotsCanvas.getContext("2d");

		this.finishedRobotsContext.clearRect(0, 0, this.finishedRobotsCanvas.width, this.finishedRobotsCanvas.height);

	},

	/**
	 * The animate function handles graphical position updates for the current robot.
	 * @return {boolean} True if the robot has reached its destination, false otherwise.
	 */
	animate: function(timestamp) {

		var Core = MartianRobots.Core;
		var Robot = MartianRobots.Robot;

		var heading = Core.robot.getHeading();

		var nextPos = -1;
		var newPos = -1;

		// The time difference between frames
		var dt = (timestamp - Core.previousFrameTimestamp);

		if (Core.instruction === "F") {

			if (heading === Robot.NORTH) {

				nextPos = this.translateOrigin(Core.gridInformation.yDifference * Core.robot.getYPosition() + Core.gridInformation.margin,
					Core.gridInformation);

				// Update the canvas y position by a small increment
				newPos = Core.robot.getCanvasYPosition() - (dt * this.ROBOT_SPEED);

				// If the robot has made it to the new grid square, we can stop animating
				if (newPos <= nextPos) {
					return true;
				}

				Core.robot.setCanvasYPosition(newPos);

			} else if (heading === Robot.EAST) {

				nextPos = Core.gridInformation.xDifference * Core.robot.getXPosition() + Core.gridInformation.margin;

				// Update the canvas x position by a small increment
				newPos = Core.robot.getCanvasXPosition() + (dt * this.ROBOT_SPEED);

				// If the robot has made it to the new grid square, we can stop animating
				if (newPos >= nextPos) {
					return true;
				}

				Core.robot.setCanvasXPosition(newPos);

			} else if (heading === Robot.SOUTH) {

				nextPos = this.translateOrigin(Core.gridInformation.yDifference * Core.robot.getYPosition() + Core.gridInformation.margin,
					Core.gridInformation);

				// Update the canvas y position by a small increment
				newPos = Core.robot.getCanvasYPosition() + (dt * this.ROBOT_SPEED);

				// If the robot has made it to the new grid square, we can stop animating
				if (newPos >= nextPos) {
					return true;
				}

				Core.robot.setCanvasYPosition(newPos);

			} else if (heading === Robot.WEST) {

				nextPos = Core.gridInformation.xDifference * Core.robot.getXPosition() + Core.gridInformation.margin;

				// Update the canvas y position by a small increment
				newPos = Core.robot.getCanvasXPosition() - (dt * this.ROBOT_SPEED);

				// If the robot has made it to the new grid square, we can stop animating
				if (newPos <= nextPos) {
					return true;
				}

				Core.robot.setCanvasXPosition(newPos);

			}

			this.robotsContext.beginPath();
			this.robotsContext.clearRect(0, 0, this.robotsCanvas.width, this.robotsCanvas.height);

			Core.robot.draw(Core.gridInformation, this.robotsContext);

			return false;

		} else {
			return true;
		}

	},

	/**
	 * Use the maintained list of robots that have reached an on-grid destination to draw to a separate "finishedRobots"
	 * canvas. Reduces the number of draw calls and allows us to optimise usage of the clearRect function.
	 *
	 * TODO: Treat it as a stack for even more efficiency
	 */
	drawFinishedRobots: function(finishedRobots) {

		var Core = MartianRobots.Core;

		for (var i = 0; i < Core.finishedRobots.length; i++) {

			if (!Core.finishedRobots[i].isLost()) {
				Core.finishedRobots[i].draw(Core.gridInformation, this.finishedRobotsContext);
			}

		}

	},

	/**
	 * Translate the origin to be in the bottom left hand corner of the co-ordinate system.
	 * @param  {int}    coordinate      The co-ordinate value to convert.
	 * @param  {Object} gridInformation An object with properties that define the properties of the current grid in use.
	 * @return {int}                    The translated co-ordinate.
	 */
	translateOrigin: function(coordinate, gridInformation) {
		return (-coordinate) + (gridInformation.height + gridInformation.margin);
	}

};
