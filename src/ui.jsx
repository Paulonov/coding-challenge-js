/**
 * ui.jsx
 *
 * A file describing the UI of the application using React. A lot of the state accesses occur on the state property
 * which apparently isn't the best practice but it gets rid of lots of unnecessary re-renders.
 *
 */
"use strict";

import React from "react";

import Robot from "./robot.js";
import Planet from "./planet.js";
import InstructionReader from "./instructionreader.js";

export default class AppContainer extends React.Component {

    render() {
        return (
            <div id="appContainer">
                <Header />
                <MainArea />
            </div>
        );
    }

}

// Common owner for state
class MainArea extends React.Component {

    constructor(props) {

        super(props);

        this.state = {

            instructions: "",
            instructionsSet: false,

            robot: null,
            currentRobotInstructions: null,
            instruction: null,
            instructionCount: 0,
            finishedRobots: [],

            newRobot: true,
            outputBoxData: []

        }

    }

    /**
     * Prepare the instruction reader and the planet and get executin'.
     */
    setup() {

        Robot.robotCount = 0;
        Robot.currentPlanet = null;

        if (!this.createReader() || !this.createPlanet()) {
            return;
        }

        // TODO: Convert the initialise canvas functions into a non-canvasy version
        Robot.currentPlanet = this.state.planet;

        this.executeLogic();

    }

    createReader() {

       // Grab the text from the textarea and give it to the InstructionReader to process
        try {
            this.state.reader = new InstructionReader(this.state.instructions);
        } catch (error) {
            console.log(error);
            return false;
        }

        return true;

    }

    createPlanet() {

        // Make a new planet from the boundaries passed in by the user
        var planetBoundaries = this.state.reader.planetBoundaries;

        try {
            this.state.planet = new Planet(parseInt(planetBoundaries[0]), parseInt(planetBoundaries[1]));
        } catch (error) {
            console.log(error);
            return false;
        }

        return true;

    }

    /**
     * Finish simulating every robot using its instructions.
     */
    executeLogic() {

        /**
         * Get a robot from the reader, execute all of its instructions and record its final state.
         */
        while (!this.state.reader.empty()) {

            if (this.prepareRobot()) {

                // Execute all of the robot's instructions so we can get the final state
                while (typeof this.state.reader.currentRobotInstructions[this.state.instructionCount] !== "undefined") {

                    this.state.robot.executeInstruction(this.state.instruction);
                    this.state.planet.updateScents(this.state.robot);

                    this.state.instructionCount++;
                    this.state.instruction = this.state.reader.currentRobotInstructions[this.state.instructionCount];

                }

                // Save the finished robot along with its instructions
                this.state.finishedRobots.push({
                    robot: this.state.robot,
                    instructions: this.state.reader.currentRobotInstructions.join("")
                });

                this.state.outputBoxData.push(this.state.robot.getFancyPositionInformation());

                var output = this.state.robot.getFancyPositionInformation();
                console.log(output.robot + output.position + output.lost);

            }

        }

    }

    /**
     * Takes care of preparing new robots. If a robot creates an error upon creation, this function is called
     * recursively so we can try and get another robot.
     * @return {boolean} True if a robot has been created successfully, false if there are no robots left to process.
     */
    prepareRobot() {

        if (!this.state.reader.empty()) {

            // If there's a robot to set up, initialiseRobot returns true and we can continue
            if (this.state.reader.initialiseRobot()) {

                // Reset the instruction counter
                this.state.instructionCount = 0;
                var robotPosition = this.state.reader.currentRobotStartingInformation;

                try {

                    this.state.robot = new Robot(parseInt(robotPosition[0], 10),
                        parseInt(robotPosition[1], 10),
                        robotPosition[2]);

                    this.state.instruction = this.state.reader.currentRobotInstructions[
                        this.state.instructionCount].toUpperCase();

                    return true;

                } catch (error) {
                    console.log(error);
                    return this.prepareRobot();
                }

            } else {
                return this.prepareRobot();
            }

        } else {
            return false;
        }

    }

    render() {

        // Save the context of the MainArea so that we can access its state later
        var parentContext = this;

        var saveInstructions = function(instructionsString) {
            parentContext.setState({instructions: instructionsString});
            parentContext.setState({instructionsSet: true});
        }

        /*
         * React triggers a re-render when the state changes; since getting the user's instructions updates the state,
         * we need this check to stop the logic from executing too early.
         */
        if (this.state.instructionsSet) {
            this.setup();
        }

        return (
            <div id="mainArea">
                <GraphicsContainer />
                <SideBar saveInstructions={saveInstructions} />
                <OutputBox data={this.state.outputBoxData} />
            </div>
        );

    }

}

/**
 * The header bar at the top of the page.
 */
class Header extends React.Component {

    render() {
        return (
            <div id="header">
                <p>Martian Robots</p>
            </div>
        );
    }

}

/**
 * A component for each of the animations to occur in.
 */
class GraphicsContainer extends React.Component {

    render() {
        return (
            <div id="graphicsContainer">
            </div>
        );

    }

}

/**
 * The editable text area and buttons below it.
 *
 * TODO: The "Skip Animation" button should probably be part of the graphics component.
 */
class SideBar extends React.Component {

    componentDidMount() {
        this.initialiseFileListener();
    }

    initialiseFileListener() {

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
     * Save the instructions entered into the editor into the application's state when the submit button is clicked.
     */
    handleGoClick() {
        var editor = React.findDOMNode(this.refs.editor);
        this.props.saveInstructions(editor.value);
    }

    handleSkipClick() {

    }

    /**
     * [render description]
     * @return {[type]} [description]
     */
    render() {

        return (

            <div id="sidebar">

                <textarea
                    id="editor" ref="editor" placeholder="Enter your code here!" rows="30" cols="75">
                </textarea>

                <div id="buttonBox">

                    <input className="buttons" type="file" id="fileInput" name="file" />

                    <button className="buttons" id="goButton" type="button" onClick={this.handleGoClick.bind(this)}>
                        <div className="buttonText">Go!</div>
                    </button>

                    <button className="buttons" id="skipButton" ref="skipButton"
                        type="button" onClick={this.handleSkipClick(this)}>
                        <div className="buttonText">Skip Animation</div>
                    </button>

                </div>

            </div>

        );

    }

}

class OutputBox extends React.Component {

    render() {

        var parentContext = this;
        var outputNodes = this.props.data.map(function (output) {

            console.log(output);

            var lost = output.lost ? "LOST" : "";

            return (
                <Output robot={output.robot}>
                    {output.position + " " + lost}
                </Output>
            );

        });

        return (
            <div id="outputBox">
                {outputNodes}
            </div>
        );

    }

}

class Output extends React.Component {

    render() {

        return (

            <div className="output">
                <b>{this.props.robot}</b>
                {this.props.children}
            </div>

        );

    }

}
