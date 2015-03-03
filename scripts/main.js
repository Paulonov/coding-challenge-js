/**
 * main.js
 *
 * Create a planet, create a robot and get going!
 */
var mars = null;
var reader = null;

var robot = null;
var currentRobotInstructions = null;
var instruction = null;
var gridInformation = null;
var i = 0;

var animationRequestId = 0;
var previousFrameTimestamp = null;
var simulationFinished = false;
var finishedAnimating = true;
var newRobot = true;
var finishedRobots = [];

// Taken from http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (

	function() {
		return window.requestAnimationFrame       ||
		       window.webkitRequestAnimationFrame ||
		       window.mozRequestAnimationFrame    ||
		       function( callback ) {
		           window.setTimeout(callback, 1000 / 60);
		       };
	}

 )();

/**
 * Called when the go button is clicked on the Martian Robots web page.
 */
function main() {

	// Set all of our global variables back to defaults
	mars = null;
	reader = null;

	robot = null;
	currentRobotInstructions = null;
	instruction = null;
	gridInformation = null;
	i = 0;

	animationRequestId = 0;
	previousFrameTimestamp = null;
	simulationFinished = false;
	finishedAnimating = true;
	newRobot = true;
	finishedRobots = [];

	// Static variables, these are set before we call the constructor and so we can begin counting
	Robot.robotCount = 0;
	Robot.currentPlanet = null;

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

	// Use the size of the planet to establish a suitable speed for the robots - Totally arbitrary!
	ROBOT_SPEED = (1/(mars.getXBoundary() + mars.getYBoundary())) * 1.5;

	// Draw a grid on the canvas using the size of the planet
	gridInformation = initialiseGridCanvas(mars.getXBoundary(), mars.getYBoundary());
	initialiseRobotsCanvas();
	initialiseFinishedRobotsCanvas();

	animationRequestId = window.requestAnimFrame(simulationLoop);

}

/**
 * The main simulation loop for the program. Should update at (monitor refresh rate) frames per second; tested on a 60Hz
 * monitor. Uses requestAnimationFrame to achieve smooth animations.
 *
 * @param  {DOMHighResTimeStamp} timestamp The current time when the function was called by requestAnimationFrame.
 */
function simulationLoop(timestamp) {

	// Set up initial window callback time if it's not set
	if (!previousFrameTimestamp) {
		previousFrameTimestamp = timestamp;
	}

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
				window.cancelAnimationFrame(animationRequestId);
			}

		} else {
			robot.executeInstruction(instruction, gridInformation);
			mars.updateScents(robot);
			finishedAnimating = false;
		}

	}

	// We need to animate!
	if (!finishedAnimating && !simulationFinished) {

		finishedAnimating = animate(timestamp);

		// Things to do when we're all done animating
		if (finishedAnimating) {

			// Re-draw the robot centred on its end position
			if (!robot.isLost()) {

				robotsContext.beginPath();
				robotsContext.clearRect(0, 0, robotsCanvas.width, robotsCanvas.height);

				robot.setCanvasXPosition((gridInformation.xDifference * robot.getXPosition()) + gridInformation.margin);

				robot.setCanvasYPosition(translateOrigin((gridInformation.yDifference * robot.getYPosition()) +
					gridInformation.margin, gridInformation));

			}

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

		// We're calculating the time difference between frames so we need to save when the current frame was called
		previousFrameTimestamp = timestamp;
		animationRequestId = window.requestAnimFrame(simulationLoop);

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
			    instruction = currentRobotInstructions[i].toUpperCase();

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
