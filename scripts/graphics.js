/**
 * graphics.js
 *
 * Used for doing canvas-y things. Includes setup code for both canvases and all of the movement code for the robots.
 */

function initialiseGridCanvas() {

	// Clear the grid and any robots from the canvas
	var gridCanvas = document.getElementById("grid");
	var gridContext = gridCanvas.getContext("2d");

	gridContext.clearRect(0, 0, gridCanvas.width, gridCanvas.height);

}


function initialiseRobotsCanvas() {

	var canvas = document.getElementById("robots");
	var context = canvas.getContext("2d");

	context.clearRect(0, 0, canvas.width, canvas.height);

	// Chrome's JavaScript CPU profiler revealed setting this took lots of time so set it once here
  	context.font = "12px Arial";

}

/**
 * Draw a nicely divided grid onto the grid canvas. Represents the planet surface.
 * @param  {int} 	planetX The X boundary of the current planet.
 * @param  {int} 	planetY The Y boundary of the current planet.
 * @return {Object} 		An object whose properties are various useful information about the created grid.
 */
function drawGrid(planetX, planetY) {

	var canvas = document.getElementById("grid");
	var context = canvas.getContext("2d");

	// How far in from 0, 0 we want to draw the grid, we need a margin or the robots can't be centred on the grid
	var marginValue = 50;

	/*
	 * We want to divide our grid based on the size of the planet so we need to consider the margin that surrounds
	 * the grid in our calculations.
	 */
	var xUp = (canvas.width - (marginValue*2))/planetX;
	var yUp = (canvas.height - (marginValue*2))/planetY;

	var xBoundary = canvas.width - marginValue;
	var yBoundary = canvas.height - marginValue;

	console.log("The difference between x grid positions is: " + xUp);
	console.log("The difference between y grid positions is: " + yUp);

	console.log("The x boundary of the grid is " + xBoundary);
	console.log("The y boundary of the grid is " + yBoundary);

	// We have to start a path to define the shape (a grid) we want to draw using stroke()
	context.beginPath();

	for (var x = marginValue; x <= xBoundary; x += xUp) {
		context.moveTo(x, marginValue);
		context.lineTo(x, yBoundary);
	}

	for (var y = marginValue; y <= yBoundary; y += yUp) {
		context.moveTo(marginValue, y);
		context.lineTo(xBoundary, y);
	}

	context.closePath();

	context.strokeStyle = "#B5F779";

	// TODO: Make lineWidth scale with planet size
	if ((planetX + planetY) < 15) {
		context.lineWidth = 7;
	} else {
		context.lineWidth = 4;
	}

	context.stroke();

	return {
		xDifference: xUp,
		yDifference: yUp,
		width: xBoundary,
		height: yBoundary,
		margin: marginValue
	};

}

/**
 * Each of the following move functions are very similar; they calculate the destination canvas co-ordinate value in the
 * corresponding direction and either return true if the destination has been reached or update the current canvas
 * value by a small increment and redraw.
 *
 * TODO: All of these use the size difference between grid squares divided by 60 to achieve smooth movement but they
 * really need to use time.
 *
 * @return {boolean} True if the destination has been reached, false otherwise.
 */
function moveNorth() {

	/*
	 * This value needs to be translated as otherwise it would calculate the canvas position of the grid co-ordinate
	 * with respect to the origin in the upper left hand corner of the grid
	 */
	var nextY = translateOrigin(gridInformation.yDifference * robot.getYPosition() + gridInformation.margin,
		gridInformation);

	// Update the canvas y position by a small increment
	var newY = robot.getCanvasYPosition() - (gridInformation.yDifference / 60);

	// If the robot has made it to the new grid square, we can stop animating
	if (newY <= nextY) {
		return true;
	}

	clearPreviousRobotDrawing();
	robot.setCanvasYPosition(newY);
	robot.draw(gridInformation, "robots");

	return false;

}

function moveEast() {

	var nextX = gridInformation.xDifference * robot.getXPosition() + gridInformation.margin;

	// Update the canvas y position by a small increment
	var newX = robot.getCanvasXPosition() + (gridInformation.xDifference / 60);

	// If the robot has made it to the new grid square, we can stop animating
	if (newX >= nextX) {
		return true;
	}

	clearPreviousRobotDrawing();
	robot.setCanvasXPosition(newX);
	robot.draw(gridInformation, "robots");

	return false;

}

function moveSouth() {

	var nextY = translateOrigin(gridInformation.yDifference * robot.getYPosition() + gridInformation.margin, gridInformation);

	// Update the canvas y position by a small increment
	var newY = robot.getCanvasYPosition() + (gridInformation.yDifference / 60);

	// If the robot has made it to the new grid square, we can stop animating
	if (newY >= nextY) {
		return true;
	}

	clearPreviousRobotDrawing();
	robot.setCanvasYPosition(newY);
	robot.draw(gridInformation, "robots");

	return false;

}

function moveWest() {

	var nextX = gridInformation.xDifference * robot.getXPosition() + gridInformation.margin;

	// Update the canvas y position by a small increment
	var newX = robot.getCanvasXPosition() - (gridInformation.xDifference / 60);

	// If the robot has made it to the new grid square, we can stop animating
	if (newX <= nextX) {
		return true;
	}

	clearPreviousRobotDrawing();
	robot.setCanvasXPosition(newX);
	robot.draw(gridInformation, "robots");

	return false;

}

function clearPreviousRobotDrawing() {

	var canvas = document.getElementById("robots");
	var context = canvas.getContext("2d");

	var robotWidth = robot.getWidth();
	var robotLength = robot.getLength();

	//context.clearRect(robot.getCanvasXPosition() - (robotWidth/2), robot.getCanvasYPosition() - (robotLength/2), robotWidth, robotLength);
	context.clearRect(0, 0, canvas.width, canvas.height);

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
			finishedRobots[i].draw(gridInformation, "finishedRobots");
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
