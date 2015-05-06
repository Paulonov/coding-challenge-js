/**
 * core.js
 *
 * Brings each module together so that we can run the program. The important function here is the simulationLoop that
 * updates the State of the world and updates the State of each animation with every frame.
 */

// Imports
import Robot from "./robot.js";
import Planet from "./planet.js";
import * as Graphics from "./graphics.js";
import InstructionReader from "./instructionreader.js";

/*
 * Taken from http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
 * Used for animation compatibility across browsers.
 */
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
 * Bring State together into a single object, useful as they'll be conveniently global (and we shouldn't have to
 * instantiate a State object)
 */
export default class State {

    constructor() {

        // Statics
        State.planet = null;
        State.reader = null;

        // Logic variables
        State.robot = null;
        State.currentRobotInstructions = null;
        State.instruction = null;
        State.gridInformation = null;
        State.instructionCount = 0;

        // Simulation
        State.animationRequestId = 0;
        State.previousFrameTimestamp = null;
        State.simulationFinished = false;
        State.finishedAnimating = true;
        State.newRobot = true;

        // Graphics
        State.gridCanvas = null;
        State.gridContext = null;

        State.robotsCanvas = null;
        State.robotsContext = null;

        State.finishedRobotsCanvas = null;
        State.finishedRobotsContext = null;

    }

}

/**
 * Called when the go button is clicked on the Martian Robots web page.
 */
export function go() {

    // Cancel a previous animation frame if it hasn't been cancelled already
    window.cancelAnimationFrame(State.animationRequestId);

    // Static variables, these are set before we call the constructor and so we can begin counting
    Robot.robotCount = 0;
    Robot.currentPlanet = null;

    // Clear the output box
    var outputBox = document.getElementById("outputBox");
    outputBox.innerHTML = "";

    if (!createReader() || !createPlanet()) {
        return;
    }

    initialiseCanvases();

    // Initialise static variables
    Robot.robotCount = 0;
    Robot.currentPlanet = State.planet;

    // Add an onclick event to the skip button so that animations can now be skipped
    var skipButton = document.getElementById("skipButton");
    skipButton.onclick = skipAnimation;

    // Start the simulation
    State.animationRequestId = window.requestAnimFrame(simulationLoop);

}

/**
 * Create a new planet from the boundaries specified by the user.
 * @return {boolean} True when the planet was successfully created, false otherwise.
 */
function createPlanet() {

    // Make a new planet from the boundaries passed in by the user
    var planetBoundaries = State.reader.planetBoundaries;

    try {
        State.planet = new Planet(parseInt(planetBoundaries[0]), parseInt(planetBoundaries[1]));
    } catch (error) {
        console.log(error);
        addToOutputBox(error);
        return false;
    }

    return true;

}

/**
 * Create a new reader using the text submitted by the user.
 * @return {boolean} True if a reader was created successfully, false otherwise.
 */
function createReader() {

    // Grab the text from the textarea and give it to the InstructionReader to process
    try {
        State.reader = new InstructionReader(editor.value);
    } catch (error) {
        addToOutputBox(error);
        return false;
    }

    return true;

}

function initialiseCanvases() {

    // Draw a grid on the canvas using the size of the planet
    State.gridInformation = Graphics.initialiseGridCanvas(State.planet.x, State.planet.y);
    Graphics.initialiseRobotsCanvas();
    Graphics.initialiseFinishedRobotsCanvas();

}

/**
 * The main simulation loop for the program. Should update at (monitor refresh rate) frames per second; tested on a
 * 60Hz monitor. Uses requestAnimationFrame to achieve smooth animations.
 *
 * @param  {DOMHighResTimeStamp} timestamp The current time when the function was called by requestAnimationFrame.
 */
function simulationLoop(timestamp) {

    // Set up initial frame call time
    if (!State.previousFrameTimestamp) {
        State.previousFrameTimestamp = timestamp;
    }

    // Update logic called once per animation cycle
    if (State.finishedAnimating) {
        updateLogic();
    }

    // We need to animate!
    if (!State.finishedAnimating && !State.simulationFinished) {

        State.finishedAnimating = Graphics.animate(timestamp);

        // Things to do when we're all done animating
        if (State.finishedAnimating) {
            finaliseAnimationStep();
        }

        // We're calculating the time difference between frames so we need to save when the current frame was called
        State.previousFrameTimestamp = timestamp;
        State.animationRequestId = window.requestAnimFrame(simulationLoop);

    }

}

/**
 * Cancel the current animation and skip to the end of the simulation. Executes the simulation loop with animation
 * stripped out as this means the simulation will complete properly no matter when the skip button is clicked.
 */
function skipAnimation() {

    window.cancelAnimationFrame(State.animationRequestId);
    Graphics.initialiseRobotsCanvas();

    while (!State.simulationFinished) {

        // Update logic called once per animation cycle
        if (State.finishedAnimating) {
            updateLogic();
        }

        // We need to animate!
        if (!State.finishedAnimating && !State.simulationFinished) {

            State.finishedAnimating = true;

            // Things to do when we're all done animating
            if (State.finishedAnimating) {
                finaliseSkipAnimationStep();
            }

        }

    }

}

/**
 * Update the robot's internal state by one step.
 */
function updateLogic() {

    if (State.newRobot) {

        // If we can't get a new robot, the simulation is over
        if (prepareRobot()) {

            // Logic update
            State.robot.executeInstruction(State.instruction, State.gridInformation);
            State.planet.updateScents(State.robot);

            State.newRobot = false;
            State.finishedAnimating = false;

        } else {

            State.simulationFinished = true;
            window.cancelAnimationFrame(State.animationRequestId);

            // Disable the skip button
            var skipButton = document.getElementById("skipButton");
            skipButton.onclick = null;

        }

    } else {

        // If we've finished our last animation, we need to execute the next instruction
        State.robot.executeInstruction(State.instruction, State.gridInformation);
        State.planet.updateScents(State.robot);

        State.finishedAnimating = false;

    }

}

/**
 * When an animation is finished, re-draw the robot if necessary.
 */
function finaliseAnimationStep() {

    // Re-draw the robot centred on its end position if it's still on the grid
    if (!State.robot.isLost) {

        State.robotsContext.beginPath();
        State.robotsContext.clearRect(0, 0, State.robotsCanvas.width,
            State.robotsCanvas.height);

        State.robot.canvasXPosition = (State.gridInformation.xDifference * State.robot.xPosition) +
            State.gridInformation.margin;

        State.robot.canvasYPosition = Graphics.translateOrigin((State.gridInformation.yDifference *
            State.robot.yPosition) + State.gridInformation.margin, State.gridInformation);

        State.robot.draw(State.gridInformation, State.robotsContext);

    } else {
        State.robotsContext.clearRect(0, 0, State.robotsCanvas.width, State.robotsCanvas.height);
    }

    // Increment the instruction counter
    State.instructionCount++;

    // If we've finished simulating the current robot, perform all of the required updates
    if (typeof State.currentRobotInstructions[State.instructionCount] === "undefined") {

        State.newRobot = true;

        // If the completed robot is still on the grid, add it to the finishedRobots canvas
        if (!State.robot.isLost) {

            State.robotsContext.clearRect(0, 0, State.robotsCanvas.width,
                State.robotsCanvas.height);

            State.robot.draw(State.gridInformation, State.finishedRobotsContext);

        }

        addToOutputBox(State.robot.getFancyPositionInformation());


    } else {

        // Get a new instruction
        State.instruction = State.currentRobotInstructions[State.instructionCount];

    }

}

/**
 * When an animation has been skipped, ensure that the robot is drawn in its final location if necessary.
 */
function finaliseSkipAnimationStep() {

    // Increment the instruction counter
    State.instructionCount++;

    // If we've finished simulating the current robot, perform all of the required updates
    if (typeof State.currentRobotInstructions[State.instructionCount] === "undefined") {

        State.newRobot = true;

        // Update canvas co-ordinates of the finished robot and draw it to the finishedRobots canvas
        if (!State.robot.isLost) {

            State.robot.canvasXPosition = (State.gridInformation.xDifference *
                State.robot.xPosition) + State.gridInformation.margin;

            State.robot.canvasYPosition = (Graphics.translateOrigin((State.gridInformation.yDifference *
                State.robot.yPosition) + State.gridInformation.margin, State.gridInformation));

            State.robot.draw(State.gridInformation, State.finishedRobotsContext);

        }

        addToOutputBox(State.robot.getFancyPositionInformation());

    } else {
        State.instruction = State.currentRobotInstructions[State.instructionCount];
    }

}

/**
 * Takes care of preparing new robots. If a robot creates an error upon creation, this function is called
 * recursively so we can try and get another robot.
 * @return {boolean} True if a robot has been created successfully, false if there are no robots left to process.
 */
function prepareRobot() {

    if (!State.reader.empty()) {

        // If there's a robot to set up, initialiseRobot returns true and we can continue
        if (State.reader.initialiseRobot()) {

            // Reset the instruction counter
            State.instructionCount = 0;
            var robotPosition = State.reader.currentRobotStartingInformation;

            try {

                State.robot = new Robot(parseInt(robotPosition[0], 10), parseInt(robotPosition[1], 10),
                    robotPosition[2], State.gridInformation);

                State.currentRobotInstructions = State.reader.currentRobotInstructions;
                State.instruction = State.currentRobotInstructions[State.instructionCount].toUpperCase();

                return true;

            } catch (error) {
                addToOutputBox(error);
                return prepareRobot();
            }

        } else {
            return prepareRobot();
        }

    } else {
        return false;
    }

}

/**
 * Sets up a listener so that we can read in robot instructions from a suitable file.
 */
export function initialiseFileListener() {

    // Check for File APIs support - Taken from HTML5Rocks.com
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // File APIs supported
    } else {
        alert('File APIs not fully supported in this browser, loading instructions from a file is disabled.');
        return;
    }

    var reader = new FileReader();
    var fileList = document.getElementById("fileInput");
    var editor = document.getElementById("editor");

    fileList.addEventListener('change', function (e) {

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
 * Take a String and add it to the output box.
 * @param {String} outputString The string to add to the output box.
 */
function addToOutputBox(outputString) {
    var outputBox = document.getElementById("outputBox");
    outputBox.insertAdjacentHTML('beforeend', "<p>" + outputString + "<br/>" + "</p>");
    outputBox.scrollTop = outputBox.scrollHeight;
}
