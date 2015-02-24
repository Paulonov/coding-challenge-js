/**
 * main.js
 *
 * Create a planet, create a robot and get going!
 */
var mars;
var reader;

var robot;
var currentRobotInstructions;
var instruction;
var gridInformation;
var i;

var simulationFinished = false;
var finishedAnimating = true;
var newRobot = true;
var finishedRobots = [];

// Taken from http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function() {
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

/**
 * Called when the go button is clicked on the Martian Robots web page.
 * TODO: If the button is clicked again after the program is finished, it will not work again!
 */
function main() {

	// Clear the output box
	var outputBox = document.getElementById("outputBox");
	outputBox.innerHTML = "";

	// Grab the text from the textarea and give it to the InstructionReader to process
	try {
		reader = new InstructionReader(editor.value);
	} catch (error) {
		addToOutputBox(error);
		return;
	}

	var planetBoundaries = reader.getPlanetBoundaries();

	try {
		mars = new Planet(parseInt(planetBoundaries[0]), parseInt(planetBoundaries[1]));
	} catch (error) {
		console.log(error);
		addToOutputBox(error);
		return;
	}

	// Initialise static variables
	Robot.robotCount = 0;
	Robot.setPlanet(mars);

	// Draw a grid on the canvas using the size of the planet
	gridInformation = initialiseGridCanvas(mars.getXBoundary(), mars.getYBoundary());
	initialiseRobotsCanvas();
	initialiseFinishedRobotsCanvas();

	simulationLoop();

}

/**
 * The main simulation loop for the program. Should update at (monitor refresh rate) frames per second; tested on a 60Hz
 * monitor. Uses requestAnimationFrame to achieve smooth animations.
 *
 * TODO: Animation currently updates frame by frame. Needs to be rewritten to use time instead.
 */
function simulationLoop() {

	// Update logic called once per animation cycle
	if (finishedAnimating) {

		if (newRobot) {

			// If we can't get a new robot, the simulation is over
			if (initialSetup()) {
				newRobot = false;
				finishedAnimating = false;
				robot.executeInstruction(instruction, gridInformation);
			} else {
				simulationFinished = true;
			}

		} else {
			robot.executeInstruction(instruction, gridInformation);
			mars.updateScents(robot);
			finishedAnimating = false;
		}

	}

	// We need to animate!
	if (!finishedAnimating && !simulationFinished) {

		finishedAnimating = animate();

		// Things to do when we're all done animating
		if (finishedAnimating) {

			// Re-draw the robot centred on its end position
			clearPreviousRobotDrawing();
			robot.setCanvasXPosition((gridInformation.xDifference * robot.getXPosition()) + gridInformation.margin);
			robot.setCanvasYPosition(translateOrigin((gridInformation.yDifference * robot.getYPosition()) +
				gridInformation.margin, gridInformation));

			robot.draw(gridInformation, robotsContext);

			i++;

			// If we've finished simulating the current robot, perform all of the required updates
			if (typeof currentRobotInstructions[i] === "undefined") {

				newRobot = true;

				finishedRobots.push(robot);

				// Ensure that other robots appear on the canvas if they existed
				if (typeof finishedRobots[0] !== "undefined") {
					drawFinishedRobots();
				}
				addToOutputBox(robot.getFancyPositionInformation());

			} else {
				instruction = currentRobotInstructions[i];
			}

		}

		window.requestAnimFrame(simulationLoop);

	}

}

/**
 * Takes care of preparing new robots. If a robot creates an error upon creation, this function is called recursively.
 * @return {boolean} True if a robot has been created successfully, false if there are no robots left to process.
 */
function initialSetup() {

	if (!reader.empty()) {

		// If there's a robot to set up, initialiseRobot returns true and we can continue
		if (reader.initialiseRobot()) {

		    var robotPosition = reader.getCurrentRobotStartingInformation();
		    i = 0;

		    try {

		    	robot = new Robot(parseInt(robotPosition[0], 10), parseInt(robotPosition[1], 10), robotPosition[2],
		    		gridInformation);

			    currentRobotInstructions = reader.getCurrentRobotInstructions();
			    instruction = currentRobotInstructions[i];

			    return true;

	    	} catch (error) {
	    		addToOutputBox(error);
	    		return initialSetup();
	    	}

		} else {
			return initialSetup();
		}

	} else {
		return false;
	}

}

/**
 * A simple wrapper function that uses the current instruction to decide how to animate the robot.
 * @return {boolean} True if the animation is finished, false if we need to keep animating.
 */
function animate() {

	switch (instruction) {

		case 'F':

			switch(robot.getHeading()) {
				case NORTH:
					return moveNorth();
				case EAST:
					return moveEast();
				case SOUTH:
					return moveSouth();
				case WEST:
					return moveWest();
			}

		break;

		default:
			return true;

	}

}

/**
 * Sets up a listener so that we can read in robot instructions from a suitable file.
 */
function setUpFileListeners() {

	// Check for the various File API support - Taken from HTML5Rocks.com
	if (window.File && window.FileReader && window.FileList && window.Blob) {
	// Great success! All the File APIs are supported.
	} else {
		alert('The File APIs are not fully supported in this browser.');
		return;
	}

	var reader = new FileReader();
	var fileList = document.getElementById("fileInput");
	var editor = document.getElementById("editor");

    fileList.addEventListener('change', function (e) {

	    //Get the file object
	    var file = fileList.files[0];

        reader.onload = function (e) {

        	// Check the MIME type of the file to see if it's a text file
        	if (file.type.match("text/*")) {
        		editor.value = reader.result;
        	} else {
        		alert("File extension not supported!");
        	}

        };

        reader.readAsText(file);

    });

}

/**
 * Take a String and put it nicely into the output box.
 * @param {String} outputString The string to add to the output box.
 */
function addToOutputBox(outputString) {
	var outputBox = document.getElementById("outputBox");
	outputBox.insertAdjacentHTML('beforeend', "<p>" + outputString + "<br/>" + "</p>");
}
