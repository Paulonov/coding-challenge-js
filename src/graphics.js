/**
 * graphics.js
 *
 * Used for doing canvas-y things. Includes setup code for both canvases and all of the movement code for the robots.
 */
var MartianRobots = MartianRobots || {};
MartianRobots.Graphics = MartianRobots.Graphics || {};

MartianRobots.Graphics = {

	// These properties act as global variable
	gridCanvas: null,
	gridContext: null,

	robotsCanvas: null,
	robotsContext: null,

	finishedRobotsCanvas: null,
	finishedRobotsContext: null,

	/**
	 * Draw a new grid onto the corresponding canvas using the size of the planet as boundaries.
	 * @param  {int} planetX The x boundary of the current planet.
	 * @param  {int} planetY The y boundary of the current planet.
	 * @return {Object}      An object containing useful properties about the grid: It's height and width, the x and y
	 *                       differences between its grid positions and also the size of the margin surrounding the
	 *                       grid.
	 */
	initialiseGridCanvas: function(planetX, planetY) {

		/*
		 * Adjust the internal resolution of the canvas to match the (relative) size of its container.
		 * TODO: It would be nice if the canvas could dynamically readjust to window changes.
		 */
		var graphicsContainer = document.getElementById("graphicsContainer");

		this.gridCanvas = document.getElementById("grid");

		this.gridCanvas.height = graphicsContainer.offsetHeight;
		this.gridCanvas.width = graphicsContainer.offsetWidth;

		this.gridContext = this.gridCanvas.getContext("2d");
		this.gridContext.clearRect(0, 0, this.gridCanvas.width, this.gridCanvas.height);

		// How far in from 0, 0 we want to draw the grid, we need a margin or the robots can't be centred on the grid
		var marginValue = 0;

		if ((planetX + planetY) < 15) {
			marginValue = 50;
		} else {
			marginValue = 20;
		}

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

			/*
			 * We're using floating point numbers for the difference between each grid position so errors can accrue as
			 * the grid is drawn. Taking the floor of x once it's nearing the x boundary ensures that the last line of
			 * the grid will be drawn. Quite hacky!
			 */
			if ((x + xUp) > xBoundary) {
				x = Math.floor(x);
			}

			this.gridContext.moveTo(x, marginValue);
			this.gridContext.lineTo(x, yBoundary);

		}

		for (var y = marginValue; Math.floor(y) <= yBoundary; y += yUp) {

			/*
			 * We're using floating point numbers for the difference between each grid position so errors can accrue as
			 * the grid is drawn. Taking the floor of y once it's nearing the y boundary ensures that the last line of
			 * the grid will be drawn. Quite hacky!
			 */
			if ((y + yUp) > yBoundary) {
				y = Math.floor(y);
			}

			this.gridContext.moveTo(marginValue, y);
			this.gridContext.lineTo(xBoundary, y);

		}

		this.gridContext.closePath();

		// TODO: Make lineWidth scale with planet size
		if ((planetX + planetY) < 15) {
			this.gridContext.lineWidth = 7;
		} else {
			this.gridContext.lineWidth = 4;
		}

		this.gridContext.strokeStyle = "#B5F779";
		this.gridContext.stroke();

		return {
			xDifference: xUp,
			yDifference: yUp,
			width: xBoundary,
			height: yBoundary,
			margin: marginValue
		};

	},

	/**
	 * Initialise the canvas that active robots will be drawn to.
	 */
	initialiseRobotsCanvas: function() {

		// Adjust the internal resolution of the canvas to match the (relative) size of its container
		var graphicsContainer = document.getElementById("graphicsContainer");
		this.robotsCanvas = document.getElementById("robots");

		this.robotsCanvas.height = graphicsContainer.offsetHeight;
		this.robotsCanvas.width = graphicsContainer.offsetWidth;

		this.robotsContext = this.robotsCanvas.getContext("2d");
		this.robotsContext.clearRect(0, 0, this.robotsCanvas.width, this.robotsCanvas.height);

		// Chrome's JavaScript CPU profiler revealed setting this took lots of time so set it once here
	  	this.robotsContext.font = "0.8em Arial";

	},

	/**
	 * Initialise the canvas that completed robots will be drawn to.
	 */
	initialiseFinishedRobotsCanvas: function() {

		// Adjust the internal resolution of the canvas to match the (relative) size of its container
		var graphicsContainer = document.getElementById("graphicsContainer");
		this.finishedRobotsCanvas = document.getElementById("finishedRobots");

		this.finishedRobotsCanvas.height = graphicsContainer.offsetHeight;
		this.finishedRobotsCanvas.width = graphicsContainer.offsetWidth;

		this.finishedRobotsContext = this.finishedRobotsCanvas.getContext("2d");
		this.finishedRobotsContext.clearRect(0, 0, this.finishedRobotsCanvas.width, this.finishedRobotsCanvas.height);

		this.finishedRobotsContext.font = "0.8em Arial";

	},

	/**
	 * The animate function handles graphical position updates for the current robot based on the time elapsed between
	 * frames.
	 * @return {boolean} True if the robot has reached its destination, false otherwise.
	 */
	animate: function(timestamp) {

		// Namespace aliases
		var Core = MartianRobots.Core;
		var Robot = MartianRobots.Robot;

		var heading = Core.robot.getHeading();
		var speed = Core.robot.getSpeed();

		var nextPos = -1;
		var newPos = -1;

		// The time difference between frames used to calculate how far the robot needs to move this frame
		var dt = (timestamp - Core.previousFrameTimestamp);

		if (Core.instruction === "F") {

			if (heading === Robot.NORTH) {

				/*
				 * Screen co-ordinates begin in the top left of the canvas but our co-ordinate system begins in the
				 * bottom left so we need to translate the co-ordinate value accordingly.
				 */
				nextPos = this.translateOrigin(Core.gridInformation.yDifference * Core.robot.getYPosition() +
					Core.gridInformation.margin, Core.gridInformation);

				// Update the canvas y position based on the time that's passed between frames
				newPos = Core.robot.getCanvasYPosition() - (dt * speed);

				// If the robot has made it to the new grid square, we can stop animating
				if (newPos <= nextPos) {
					return true;
				}

				Core.robot.setCanvasYPosition(newPos);

			} else if (heading === Robot.EAST) {

				nextPos = (Core.gridInformation.xDifference * Core.robot.getXPosition()) + Core.gridInformation.margin;

				// Update the canvas x position based on the time that's passed between frames
				newPos = Core.robot.getCanvasXPosition() + (dt * speed);

				// If the robot has made it to the new grid square, we can stop animating
				if (newPos >= nextPos) {
					return true;
				}

				Core.robot.setCanvasXPosition(newPos);

			} else if (heading === Robot.SOUTH) {

				nextPos = this.translateOrigin(Core.gridInformation.yDifference * Core.robot.getYPosition() +
					Core.gridInformation.margin, Core.gridInformation);

				// Update the canvas y position based on the time that's passed between frames
				newPos = Core.robot.getCanvasYPosition() + (dt * speed);

				// If the robot has made it to the new grid square, we can stop animating
				if (newPos >= nextPos) {
					return true;
				}

				Core.robot.setCanvasYPosition(newPos);

			} else if (heading === Robot.WEST) {

				nextPos = Core.gridInformation.xDifference * Core.robot.getXPosition() + Core.gridInformation.margin;

				// Update the canvas y position by a small increment
				newPos = Core.robot.getCanvasXPosition() - (dt * speed);

				// If the robot has made it to the new grid square, we can stop animating
				if (newPos <= nextPos) {
					return true;
				}

				Core.robot.setCanvasXPosition(newPos);

			}

			this.robotsContext.beginPath();
			this.robotsContext.clearRect(0, 0, this.robotsCanvas.width, this.robotsCanvas.height);

			Core.robot.draw(Core.gridInformation, this.robotsContext);

			// The animation isn't finished yet so return false
			return false;

		} else {

			// Some instructions don't require animation or may be unimplemented so simply return true
			return true;

		}

	},

	/**
	 * Translate the origin to be in the bottom left hand corner of the co-ordinate system from the top left.
	 * @param  {int}    coordinate      The co-ordinate value to convert.
	 * @param  {Object} gridInformation An object with properties that define the properties of the current grid in use.
	 * @return {int}                    The translated co-ordinate.
	 */
	translateOrigin: function(coordinate, gridInformation) {
		return (-coordinate) + (gridInformation.height + gridInformation.margin);
	}

};
