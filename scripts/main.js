/**
 * main.js
 *
 * Create a planet, create a robot and get going!
 */
function Main() {

	// Clear the output box
	var outputBox = document.getElementById("outputBox");
	outputBox.innerHTML = "";

	// Clear the grid and any robots from the canvas
	var gridCanvas = document.getElementById("grid");
	var gridContext = gridCanvas.getContext("2d");

	gridContext.clearRect(0, 0, gridCanvas.width, gridCanvas.height);

	var robotsCanvas = document.getElementById("robots");
	var robotsContext = robotsCanvas.getContext("2d");

	robotsContext.clearRect(0, 0, robotsCanvas.width, robotsCanvas.height);

	// Grab the text from the textarea and give it to the InstructionReader to process
	var reader;

	try {
		reader = new InstructionReader(document.getElementById("editor").value);
	} catch (error) {
		addToOutputBox(error);
		return;
	}

	var planetBoundaries = reader.getPlanetBoundaries();
	var mars;

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
	var gridInformation = drawGrid(mars.getXBoundary(), mars.getYBoundary());
	drawRobot(2, 2, 1, gridInformation);

	while (!reader.empty()) {

		// If there's a robot to set up, initialiseRobot returns true and we can continue
		if (reader.initialiseRobot()) {

		    var robotPosition = reader.getCurrentRobotStartingInformation();
		    var robot;

		    try {
		    	robot = new Robot(parseInt(robotPosition[0], 10), parseInt(robotPosition[1], 10), robotPosition[2]);
	    	} catch (error) {
	    		addToOutputBox(error);
	    		continue;
	    	}

		    /*
		    * Instructions are given as an array of characters by the reader so we can iterate over the
		    * array, parse the character into the robot's representation and then execute the
		    * instruction. If the robot is lost, a scent is left at its last known grid location.
		    */
		    var currentRobotInstructions = reader.getCurrentRobotInstructions();

		    for (var i = 0; i < currentRobotInstructions.length; i++) {
		        robot.executeInstruction(currentRobotInstructions[i]);
		        mars.updateScents(robot);
		    }

		    // Add the result of the simulation to the output box
		    addToOutputBox(robot.getFancyPositionInformation());

		}

    }

    // Scroll to the bottom of the output box
	outputBox.scrollTop = outputBox.scrollHeight;

}

/**
 * [setUpFileListeners description]
 */
function setUpFileListeners() {

	console.log("Setting up file listeners...");

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

        	console.log(file.type);

        	// Check the MIME type of the file to see if it's a text file
        	if (file.type.match("text/*")) {
        		editor.value = reader.result;
        	} else {
        		alert("File extension not supported!");
        	}

        };

        reader.readAsText(file);

    });

    console.log("Done!");

}

/**
 * [addToOutputBox description]
 * @param {[type]} outputString [description]
 */
/*function addToOutputBox(outputString) {

	var outputBox = document.getElementById("outputBox");

	outputBox.insertAdjacentHTML('beforeend', outputString);

    //var paragraphNode = document.createElement("P");
    //var outputNode = document.createTextNode(outputString);

    //paragraphNode.appendChild(outputNode);
    //outputBox.appendChild(paragraphNode);

}*/

/**
 * [addToOutputBox description]
 * @param {[type]} outputString [description]
 */
function addToOutputBox(outputString) {
	var outputBox = document.getElementById("outputBox");
	outputBox.insertAdjacentHTML('beforeend', "<p>" + outputString + "<br/>" + "</p>");
}
