/**
 * ui.jsx
 *
 * A file describing the UI of the application using React. A lot of the state accesses occur on the state property
 * which apparently isn't the best practice but it gets rid of lots of unnecessary re-renders.
 *
 * TODO: Couldn't get the HTML5 file API working with React
 *      <input className="buttons" type="file" id="fileInput" name="file" />
 */
"use strict";

import React from "react";

import Robot from "./robot.js";
import Planet from "./planet.js";
import InstructionReader from "./InstructionReader.js";

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
         *
         * TODO: Save the robot's final position.
         * TODO: Add the output to the output box.
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

    /**
     * Save the instructions entered into the editor into the application's state when the submit button is clicked.
     */
    handleGoClick() {
        var editor = React.findDOMNode(this.refs.editor);
        this.props.saveInstructions(editor.value);
    }

    handleSkipClick(){

    }

    /**
     * [render description]
     * @return {[type]} [description]
     *
     * TODO: Get the HTML5 file API working again
     *
     *              <button className="buttons" id="fileInput" type="button" onClick={this.handleSubmitClick.bind(this)} >
     *                  <div className="buttonText">Submit Instructions</div>
     *              </button>
     */
    render() {

        return (

            <div id="sidebar">

                <textarea
                    id="editor" ref="editor" placeholder="Enter your code here!" rows="30" cols="75">
                </textarea>

                <div id="buttonBox">

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

        console.log(this.props.children);

        return (

            <div className="output">
                <b>{this.props.robot}</b>
                {this.props.children}
            </div>

        );

    }

}
