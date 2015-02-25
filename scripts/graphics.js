/**
 * graphics.js
 *
 * Used for doing canvas-y things. Includes setup code for both canvases and all of the movement code for the robots.
 */
var gridCanvas = null;
var gridContext = null;

var robotsCanvas = null;
var robotsContext = null;

var finishedRobotsCanvas = null;
var finishedRobotsContext = null;

function initialiseGridCanvas(planetX, planetY) {

	// Clear the grid and any robots from the canvas
	gridCanvas = document.getElementById("grid");
	gridContext = gridCanvas.getContext("2d");

	gridContext.clearRect(0, 0, gridCanvas.width, gridCanvas.height);

	// How far in from 0, 0 we want to draw the grid, we need a margin or the robots can't be centred on the grid
	var marginValue = 50;

	/*
	 * We want to divide our grid based on the size of the planet so we need to consider the margin that surrounds
	 * the grid in our calculations.
	 */
	var xUp = (gridCanvas.width - (marginValue*2))/planetX;
	var yUp = (gridCanvas.height - (marginValue*2))/planetY;

	var xBoundary = gridCanvas.width - marginValue;
	var yBoundary = gridCanvas.height - marginValue;

	console.log("The difference between x grid positions is: " + xUp);
	console.log("The difference between y grid positions is: " + yUp);

	console.log("The x boundary of the grid is " + xBoundary);
	console.log("The y boundary of the grid is " + yBoundary);

	// We have to start a path to define the shape (a grid) we want to draw using stroke()
	gridContext.beginPath();

	for (var x = marginValue; x <= xBoundary; x += xUp) {
		gridContext.moveTo(x, marginValue);
		gridContext.lineTo(x, yBoundary);
	}

	for (var y = marginValue; y <= yBoundary; y += yUp) {
		gridContext.moveTo(marginValue, y);
		gridContext.lineTo(xBoundary, y);
	}

	gridContext.closePath();

	gridContext.strokeStyle = "#B5F779";

	// TODO: Make lineWidth scale with planet size
	if ((planetX + planetY) < 15) {
		gridContext.lineWidth = 7;
	} else {
		gridContext.lineWidth = 4;
	}

	gridContext.stroke();

	return {
		xDifference: xUp,
		yDifference: yUp,
		width: xBoundary,
		height: yBoundary,
		margin: marginValue
	};


}

function initialiseRobotsCanvas() {

	robotsCanvas = document.getElementById("robots");
	robotsContext = robotsCanvas.getContext("2d");

	robotsContext.clearRect(0, 0, robotsCanvas.width, robotsCanvas.height);

	// Chrome's JavaScript CPU profiler revealed setting this took lots of time so set it once here
  	robotsContext.font = "12px Arial";

}

function initialiseFinishedRobotsCanvas() {

	finishedRobotsCanvas = document.getElementById("finishedRobots");
	finishedRobotsContext = finishedRobotsCanvas.getContext("2d");

	finishedRobotsContext.clearRect(0, 0, finishedRobotsCanvas.width, finishedRobotsCanvas.height);

}

function animate() {

	var heading = robot.getHeading();

	var nextPos = -1;
	var newPos = -1;

	if (instruction === "F") {

		if (heading === NORTH) {

			nextPos = translateOrigin(gridInformation.yDifference * robot.getYPosition() + gridInformation.margin,
				gridInformation);

			// Update the canvas y position by a small increment
			newPos = robot.getCanvasYPosition() - (gridInformation.yDifference / 60);

			// If the robot has made it to the new grid square, we can stop animating
			if (newPos <= nextPos) {
				return true;
			}

			robot.setCanvasYPosition(newPos);

		} else if (heading === EAST) {

			nextPos = gridInformation.xDifference * robot.getXPosition() + gridInformation.margin;

			// Update the canvas y position by a small increment
			newPos = robot.getCanvasXPosition() + (gridInformation.xDifference / 60);

			// If the robot has made it to the new grid square, we can stop animating
			if (newPos >= nextPos) {
				return true;
			}

			robot.setCanvasXPosition(newPos);

		} else if (heading === SOUTH) {

			nextPos = translateOrigin(gridInformation.yDifference * robot.getYPosition() + gridInformation.margin,
				gridInformation);

			// Update the canvas y position by a small increment
			newPos = robot.getCanvasYPosition() + (gridInformation.yDifference / 60);

			// If the robot has made it to the new grid square, we can stop animating
			if (newPos >= nextPos) {
				return true;
			}

			robot.setCanvasYPosition(newPos);

		} else if (heading === WEST) {

			nextPos = gridInformation.xDifference * robot.getXPosition() + gridInformation.margin;

			// Update the canvas y position by a small increment
			newPos = robot.getCanvasXPosition() - (gridInformation.xDifference / 60);

			// If the robot has made it to the new grid square, we can stop animating
			if (newPos <= nextPos) {
				return true;
			}

			robot.setCanvasXPosition(newPos);

		}

		robotsContext.beginPath();
		robotsContext.clearRect(0, 0, robotsCanvas.width, robotsCanvas.height);

		robot.draw(gridInformation, robotsContext);

	} else {
		return true;
	}

}

/**
 * Use the maintained list of robots that have reached an on-grid destination to draw to a separate "finishedRobots"
 * canvas. Reduces the number of draw calls and allows us to optimise usage of the clearRect function.
 *
 * TODO: Treat it as a stack for even more efficiency
 */
function drawFinishedRobots() {

	for (var i = 0; i < finishedRobots.length; i++) {

		if (!finishedRobots[i].isLost()) {
			finishedRobots[i].draw(gridInformation, finishedRobotsContext);
		}

	}

}

/**
 * Translate the origin to be in the bottom left hand corner of the co-ordinate system.
 * @param  {int}    coordinate      The co-ordinate value to convert.
 * @param  {Object} gridInformation An object with properties that define the properties of the current grid in use.
 * @return {int}                    The translated co-ordinate.
 */
function translateOrigin(coordinate, gridInformation) {
	return (-coordinate) + (gridInformation.height + gridInformation.margin);
}
