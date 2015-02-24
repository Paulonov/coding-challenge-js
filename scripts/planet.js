/**
 * planet.js
 *
 * A representation of the planet. Simply stores the X and Y boundaries of its grid and also a "scent map" so that a
 * robot can sniff the air at its current position for the smell of a sad, lost and alone friend... And not go the same
 * way.
 */

/**
 * Constructor to create a planet object.
 * @param {int} planetX The X boundary of the planet.
 * @param {int} planetY The Y boundary of the planet.
 */
var Planet = function(planetX, planetY) {

	var x;
	var y;
	var scentMap = [];

	// Make sure that the provided planet co-ordinates are in bounds otherwise set up the planet as normal
	if (planetX > 50 || planetY > 50 || planetX < 0 || planetY < 0 || typeof planetX === "undefined" ||
		typeof planetY === "undefined") {
			throw "Planet Creation Error: Specified planet co-ordinates are out of bounds! Max planet size is 50x50";
	} else {

		x = planetX;
		y = planetY;

		// If a grid square has a value of true, a robot has left a scent before it got lost
		for (var i = 0; i < planetX; i++) {
			scentMap[i] = [];
			for (var j = 0; j < planetY; j++) {
				scentMap[i][j] = false;
			}
		}

	}

	this.getXBoundary = function() {
		return x;
	};

	this.getYBoundary = function() {
		return y;
	};

	this.getSmellFromCoordinates = function(xPosition, yPosition) {
		return scentMap[xPosition][yPosition];
	};

	this.updateScents = function(robot) {

		/* The robot stops processing instructions once it is lost so we can use its latest position as the point it got
		 * lost at.
		 */
		if (robot.isLost()) {
			scentMap[robot.getXPosition()][robot.getYPosition()] = true;
		}

	};

};
