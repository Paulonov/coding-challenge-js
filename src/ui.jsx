/**
 * ui.jsx
 *
 * A file describing the UI of the application using React. A lot of the state accesses occur on the state property
 * which apparently isn't the best practice but it gets rid of lots of unnecessary re-renders.
 *
 */
"use strict";
/*eslint-disable no-console, no-underscore-dangle*/

import React from "react";

// import { executeInstruction } from "./robot.js";
//import Planet from "./planet.js";
import { parseInstructions, prepareRobots } from "./instructionreader.js";

export default class MartianRobots extends React.Component {

    render() {

        return (
            <div id="appContainer">
                <Header />
                <World />
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
 * State entirely resides here; if it's need elsewhere, it can be passed down to child components as props.
 */
class World extends React.Component {

    constructor() {

        super();

        /**
         * State becomes immutable with some easily updatable properties. Every tick of the world updates the entire
         * world state so that React can re-render it.
         * @type {Object}
         */
        this.state = {

            // Every robot that exists in the world and its state
            robots:
            [
                // e.g. { heading: "N", instructionStack: "FFRLF", x: 0, y: 0, lost: false }
            ],

            // The state of the planet
            planet: {
                scents: {
                    // E.g. "5,2": true
                },
                rows: 0,
                cols: 0
            }

        };

    }

    /**
     * Set the initial state of the world.
     * @param  {String} instructionsString The user's input taken straight from the editor.
     */
    _setup(instructionsString) {

        var instructionStack;

        try {
            instructionStack = parseInstructions(instructionsString);
        } catch (error) {
            console.log(error);
            return;
        }

        // The first item on the stack is the planet's boundaries
        var planetBoundaries = instructionStack.pop().trim().split(" ");

        // Use the instruction stack to set the initial state of the world
        var initialRobots = prepareRobots(instructionStack);
        var initialPlanet = { scents: {}, rows: parseInt(planetBoundaries[0], 10), cols: parseInt(planetBoundaries[1], 10) };

        // Update the state of the world accordingly
        this.setState({
            robots: initialRobots,
            planet: initialPlanet
        });

    }

    _tick() {

        // Use executeInstruction once on each robot to get the next state of the world


    }

    render() {

        console.log(this.state);

        // 0 is falsey so if the planet is 0, 0 it is undefined and we need to set everything up
        if (!(this.state.planet.rows && this.state.planet.cols)) {
            return (
                <div id="mainArea">
                    <div id="graphicsContainer"></div>
                    <SideBar _setup={this._setup.bind(this)} />
                    <OutputBox outputData={[""]} />
                </div>
            );
        }

        return (
            <div id="mainArea">
                <div id="graphicsContainer"> </div>
                <SideBar _setup={this._setup.bind(this)} />
                <OutputBox outputData={[""]} />
            </div>
        );

        /*
        <div className="graphicsContainer">
            { [1, ...(this.state.planet.rows)].map( () =>
                <Row cols={this.state.planet.cols} rows={this.state.planet.rows} />) };
        </div>
        */

    }

}

class Row extends React.Component {
    render() {
        return ( <div className="row" > {
            [1, ...(this.props.cols)].map( () => <Cell cols={this.props.cols}/> )
        } </div>);
    }
}

class Cell extends React.Component {
    render() {
        return ( <div className="cell"> Cell </div>);
    }

}

//Stateless/Dumb component
class RobotComponent extends React.Component {
    render() {
        return (
            <div className ="robot" >
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

    // Called once we know that the buttons have been rendered so we will definitely be able to attach an event listener
    componentDidMount() {
        this._initialiseFileListener();
    }

    /**
     * Sets up a listener so that we can read in robot instructions from a suitable file.
     */
    _initialiseFileListener() {

        /*eslint-disable no-alert*/

        // Check for File APIs support - Taken from HTML5Rocks.com
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            // File APIs supported
        } else {
            alert("File APIs not fully supported in this browser, loading instructions from a file is disabled.");
            return;
        }

        var reader = new FileReader();
        var fileList = document.getElementById("fileInput");
        var editor = document.getElementById("editor");

        fileList.addEventListener("change", function() {

            var file = fileList.files[0];

            reader.onload = function() {

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
    _handleGoClick() {

        var editor = document.getElementById("editor");
        this.props._setup(editor.value);

        //setInterval(this._tick, 2000);

    }

    _handleSkipClick() {
        // TODO
    }

    /**
     * [render description]
     * @return {[type]} [description]
     */
    render() {

        return (

            <div id="sidebar">

                <textarea
                    id="editor" placeholder="Enter your code here!" rows="30" cols="75">
                </textarea>

                <div id="buttonBox">

                    <input className="buttons" type="file" id="fileInput" name="file" />

                    <button className="buttons" id="goButton" type="button"
                        onClick={this._handleGoClick.bind(this)}>
                            <div className="buttonText">Go!</div>
                    </button>

                    <button className="buttons" id="skipButton" ref="skipButton" type="button">
                        <div className="buttonText">Skip Animation</div>
                    </button>

                </div>

            </div>

        );

    }

}

/**
 * Used to contain output components that display output and error messages to the user.
 */
class OutputBox extends React.Component {

    constructor() {

        super();

        // Contains an value that can be incremented to stop React complaining about a lack of key
        this.state = {
            id: -1
        };

    }

    render() {

        var parentContext = this;

        // Populate our output box with output nodes
        var outputNodes = this.props.outputData.map(function (output) {
            return (
                <Output key={parentContext.state.id += 1} message={output} />
            );
        });

        return (
            <div id="outputBox">
                {outputNodes}
            </div>
        );

    }

}

/**
 * Represents a single line of output in the output box.
 */
class Output extends React.Component {

    render() {

        // dangerouslySetInnerHTML is used for compatibility; output messages are formatted with HTML
        return (
            <div className="output">
                <p dangerouslySetInnerHTML={{__html: this.props.message}} />
            </div>
        );

    }

}
