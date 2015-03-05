/**
 * main.js
 *
 * Create a planet, create a robot and get going!
 */

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

// Contain the application within an object so our functions and variables don't pollute the window
var MartianRobots = MartianRobots || {};

MartianRobots.Core = {

	// These properties are all treated as global variables as multiple areas of the program need to access them.
	planet: null,
	reader: null,

	robot: null,
	currentRobotInstructions: null,
	instruction: null,
	gridInformation: null,
	i: 0,

	animationRequestId: 0,
	previousFrameTimestamp: null,
	simulationFinished: false,
	finishedAnimating: true,
	newRobot: true,

	/**
	 * Called when the go button is clicked on the Martian Robots web page.
	 */
	main: function() {

		// Namespace aliases
		var Core = MartianRobots.Core;
		var Graphics = MartianRobots.Graphics;
		var Robot = MartianRobots.Robot;
		var Planet = MartianRobots.Planet;
		var InstructionReader = MartianRobots.InstructionReader;

		// Cancel a previous animation frame if it hasn't been cancelled already
		window.cancelAnimationFrame(this.animationRequestId);

		// Get rid of the skip button on-click event so that it can't be used before the animation has started
		var skipButton = document.getElementById("skipButton");
		skipButton.onclick = null;

		this.initialiseCoreVariables();

		// Static variables, these are set before we call the constructor and so we can begin counting
		Robot.robotCount = 0;
		Robot.currentPlanet = null;

		// Clear the output box
		var outputBox = document.getElementById("outputBox");
		outputBox.innerHTML = "";

		// Grab the text from the textarea and give it to the InstructionReader to process
		try {
			this.reader = new InstructionReader(editor.value);
		} catch (error) {
			Core.addToOutputBox(error);
			return;
		}

		// Make a new planet from the boundaries passed in by the user
		var planetBoundaries = this.reader.getPlanetBoundaries();

		try {
			this.planet = new Planet(parseInt(planetBoundaries[0]), parseInt(planetBoundaries[1]));
		} catch (error) {
			console.log(error);
			Core.addToOutputBox(error);
			return;
		}

		// Initialise static variables
		Robot.robotCount = 0;
		Robot.setPlanet(this.planet);

		// Draw a grid on the canvas using the size of the planet
		this.gridInformation = Graphics.initialiseGridCanvas(this.planet.getXBoundary(), this.planet.getYBoundary());
		Graphics.initialiseRobotsCanvas();
		Graphics.initialiseFinishedRobotsCanvas();

		// Add an onclick event to the skip button so that animations can now be skipped
		skipButton = document.getElementById("skipButton");
		skipButton.onclick = Core.skipAnimation;

		// Start the simulation
		this.animationRequestId = window.requestAnimFrame(this.simulationLoop);

	},

	/**
	 * Set all of the "global" properties to their default values. Ensures that program can be run again after it has
	 * run once in the same session!
	 */
	initialiseCoreVariables: function() {

		this.planet = null;
		this.reader = null;

		this.robot = null;
		this.currentRobotInstructions = null;
		this.instruction = null;
		this.gridInformation = null;
		this.i = 0;

		this.animationRequestId = 0;
		this.previousFrameTimestamp = null;
		this.simulationFinished = false;
		this.finishedAnimating = true;
		this.newRobot = true;

	},

	/**
	 * The main simulation loop for the program. Should update at (monitor refresh rate) frames per second; tested on a
	 * 60Hz monitor. Uses requestAnimationFrame to achieve smooth animations.
	 *
	 * @param  {DOMHighResTimeStamp} timestamp The current time when the function was called by requestAnimationFrame.
	 */
	simulationLoop: function(timestamp) {

		// Namespace aliases
		var Core = MartianRobots.Core;
		var Graphics = MartianRobots.Graphics;
		var Robot = MartianRobots.Robot;
		var Planet = MartianRobots.Planet;
		var InstructionReader = MartianRobots.InstructionReader;

		// Set up initial frame call time
		if (!Core.previousFrameTimestamp) {
			Core.previousFrameTimestamp = timestamp;
		}

		// Update logic called once per animation cycle
		if (Core.finishedAnimating) {

			if (Core.newRobot) {

				// If we can't get a new robot, the simulation is over
				if (Core.prepareRobot()) {

					// Logic update
					Core.robot.executeInstruction(Core.instruction, Core.gridInformation);
					Core.planet.updateScents(Core.robot);

					Core.newRobot = false;
					Core.finishedAnimating = false;

				} else {
					Core.simulationFinished = true;
					window.cancelAnimationFrame(Core.animationRequestId);
				}

			} else {

				// If we've finished our last animation, we need to execute the next instruction
				Core.robot.executeInstruction(Core.instruction, Core.gridInformation);
				Core.planet.updateScents(Core.robot);

				Core.finishedAnimating = false;

			}

		}

		// We need to animate!
		if (!Core.finishedAnimating && !Core.simulationFinished) {

			Core.finishedAnimating = Graphics.animate(timestamp);

			// Things to do when we're all done animating
			if (Core.finishedAnimating) {

				// Re-draw the robot centred on its end position if it's still on the grid
				if (!Core.robot.isLost()) {

					Graphics.robotsContext.beginPath();
					Graphics.robotsContext.clearRect(0, 0, Graphics.robotsCanvas.width,
						Graphics.robotsCanvas.height);

					Core.robot.setCanvasXPosition((Core.gridInformation.xDifference * Core.robot.getXPosition()) +
						Core.gridInformation.margin);

					Core.robot.setCanvasYPosition(Graphics.translateOrigin((Core.gridInformation.yDifference *
						Core.robot.getYPosition()) + Core.gridInformation.margin, Core.gridInformation));


					Core.robot.draw(Core.gridInformation, Graphics.robotsContext);

				}

				// Increment the instruction counter
				Core.i++;

				// If we've finished simulating the current robot, perform all of the required updates
				if (typeof Core.currentRobotInstructions[Core.i] === "undefined") {

					Core.newRobot = true;

					// If the completed the robot is still on the grid, add it to the finishedRobots canvas
					if (!Core.robot.isLost()) {
						Core.robot.draw(Core.gridInformation, Graphics.finishedRobotsContext);
					}

					Core.addToOutputBox(Core.robot.getFancyPositionInformation());


				} else {

					// Get a new instruction
					Core.instruction = Core.currentRobotInstructions[Core.i];

				}

			}

			// We're calculating the time difference between frames so we need to save when the current frame was called
			Core.previousFrameTimestamp = timestamp;
			Core.animationRequestId = window.requestAnimFrame(Core.simulationLoop);

		}

	},

	/**
	 * Cancel the current animation and skip to the end of the simulation. Executes the simulation loop with animation
	 * stripped out as this means the simulation will complete properly no matter when the skip button is clicked.
	 */
	skipAnimation: function() {

		// Namespace aliases
		var Core = MartianRobots.Core;
		var Graphics = MartianRobots.Graphics;
		var Robot = MartianRobots.Robot;
		var Planet = MartianRobots.Planet;
		var InstructionReader = MartianRobots.InstructionReader;

		window.cancelAnimationFrame(Core.animationRequestId);

		Graphics.initialiseRobotsCanvas();
		Graphics.initialiseFinishedRobotsCanvas();

		while (!Core.simulationFinished) {

			// Update logic called once per animation cycle
			if (Core.finishedAnimating) {

				if (Core.newRobot) {

					// If we can't get a new robot, the simulation is over
					if (Core.prepareRobot()) {

						// Logic update
						Core.robot.executeInstruction(Core.instruction, Core.gridInformation);
						Core.planet.updateScents(Core.robot);

						Core.newRobot = false;
						Core.finishedAnimating = false;

					} else {
						Core.simulationFinished = true;
						break;
					}

				} else {

					// If we've finished our last (fake) animation, we need to execute the next instruction
					Core.robot.executeInstruction(Core.instruction, Core.gridInformation);
					Core.planet.updateScents(Core.robot);

					Core.finishedAnimating = false;

				}

			}

			// We need to animate!
			if (!Core.finishedAnimating && !Core.simulationFinished) {

				Core.finishedAnimating = true;

				// Things to do when we're all done animating
				if (Core.finishedAnimating) {

					// Increment the instruction counter
					Core.i++;

					// If we've finished simulating the current robot, perform all of the required updates
					if (typeof Core.currentRobotInstructions[Core.i] === "undefined") {

						Core.newRobot = true;

						// Update canvas co-ordinates of the finished robot and draw it to the finishedRobots canvas

						if (!Core.robot.isLost()) {

							Core.robot.setCanvasXPosition((Core.gridInformation.xDifference *
								Core.robot.getXPosition()) + Core.gridInformation.margin);

							Core.robot.setCanvasYPosition(Graphics.translateOrigin((Core.gridInformation.yDifference *
								Core.robot.getYPosition()) + Core.gridInformation.margin, Core.gridInformation));

							Core.robot.draw(Core.gridInformation, Graphics.finishedRobotsContext);

						}

						Core.addToOutputBox(Core.robot.getFancyPositionInformation());

					} else {
						Core.instruction = Core.currentRobotInstructions[Core.i];
					}

				}

			}

		}

	},

	/**
	 * Takes care of preparing new robots. If a robot creates an error upon creation, this function is called
	 * recursively.
	 * @return {boolean} True if a robot has been created successfully, false if there are no robots left to process.
	 */
	prepareRobot: function() {

		// Namespace aliases
		var Core = MartianRobots.Core;
		var Robot = MartianRobots.Robot;

		if (!Core.reader.empty()) {

			// If there's a robot to set up, initialiseRobot returns true and we can continue
			if (Core.reader.initialiseRobot()) {

				// Reset the instruction counter
				Core.i = 0;
			    var robotPosition = Core.reader.getCurrentRobotStartingInformation();

			    try {

			    	Core.robot = new Robot(parseInt(robotPosition[0], 10), parseInt(robotPosition[1], 10),
			    		robotPosition[2], Core.gridInformation);

				    Core.currentRobotInstructions = Core.reader.getCurrentRobotInstructions();
				    Core.instruction = Core.currentRobotInstructions[Core.i].toUpperCase();

				    return true;

		    	} catch (error) {
		    		Core.addToOutputBox(error);
		    		return Core.prepareRobot();
		    	}

			} else {
				return Core.prepareRobot();
			}

		} else {
			return false;
		}

	},

	/**
	 * Sets up a listener so that we can read in robot instructions from a suitable file.
	 */
	initialiseFileListener: function() {

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

	},

	/**
	 * Take a String and add it to the output box.
	 * @param {String} outputString The string to add to the output box.
	 */
	addToOutputBox: function(outputString) {
		var outputBox = document.getElementById("outputBox");
		outputBox.insertAdjacentHTML('beforeend', "<p>" + outputString + "<br/>" + "</p>");
		outputBox.scrollTop = outputBox.scrollHeight;
	}

};
