/**
 * graphics.js
 *
 * Used for doing canvas-y things.
 */

/**
 * [drawGrid description]
 * @param  {[type]} planetX [description]
 * @param  {[type]} planetY [description]
 * @return {[type]}         [description]
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

	console.log(xUp);
	console.log(yUp);

	console.log(xBoundary);
	console.log(yBoundary);

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

	var gridInformation = {
		xDifference: xUp,
		yDifference: yUp,
		width: xBoundary,
		height: yBoundary,
		margin: marginValue
	};

	return gridInformation;

}

function drawRobot(x, y, robotCount, gridInformation) {

	var robot = {

		width: 50,
		length: 50,

		draw: function(robotX, robotY, robotCount, gridInformation) {

			// We need to convert from the robot's co-ordinates to our canvas' co-ordinates.
			var x = (gridInformation.xDifference * robotX) + gridInformation.margin;
			var y = (gridInformation.yDifference * robotY) + gridInformation.margin;

			var canvas = document.getElementById("robots");
			var context = canvas.getContext("2d");

			context.beginPath();

			// Draw the rectangle centred on the grid point
			context.rect(x - (this.width/2), y - (this.width/2), this.width, this.length);

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
		  	context.font = "12px Arial";
	  		context.strokeText(robotCount, x, y);

		}

	};

	robot.draw(x, y, robotCount, gridInformation);

}
