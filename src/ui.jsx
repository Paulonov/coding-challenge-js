/**
 * ui.jsx
 *
 * A file describing the UI of the application using React. A lot of the state accesses occur on the state property
 * which apparently isn't the best practice but it gets rid of lots of unnecessary re-renders.
 *
 */
"use strict";

import React from "react";

import {executeInstruction, getFancyPositionInformation} from "./robot.js";
import {parseInstructions, prepareRobots} from "./instructionreader.js";

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
          robots: [],

          // The state of the planet
          planet: {
            cols: 0,
            rows: 0
          },

          outputMessages: []

        };

        this.setIntervalId = -1;

    }

    /**
     * Set the initial state of the world.
     * @param  {String} instructionsString The user's input taken straight from the editor.
     */
    _setup(instructionsString) {

      let instructionStack;

      // Convert the instructions passed in by the user into a stack
      try {
        instructionStack = parseInstructions(instructionsString);
      } catch (error) {
        console.log(error);
        return;
      }

      // The first item on the stack is the planet's boundaries
      let planetBoundaries = instructionStack.pop().trim().split(" ");

      // Use the instruction stack to set the initial state of the world
      let initialRobots = prepareRobots(instructionStack, planetBoundaries);
      let initialPlanet = { scents: {}, rows: parseInt(planetBoundaries[0], 10), cols: parseInt(planetBoundaries[1], 10) };

      // Update the state of the world accordingly: The callback starts the simulation
      this.setState({ robots: initialRobots, planet: initialPlanet },

        () => {
          this.setIntervalId = setInterval(this._tick.bind(this), 100);
        }

      );

    }

    // Update everything in the world by one instruction
    // TODO: Make all of the data accesses immutable
    _tick() {

      // Use executeInstruction once on each robot to get the next state of the world
      let planet = this.state.planet;
      let robots = this.state.robots;
      let outputMessages = this.state.outputMessages;
      let doneCount = 0;

      // Map is immutable, return result to new array
      let newRobots = [];
      robots.forEach( (robot, index, array) => {

        // If the robot does not have any instructions to execute or is lost, bail
        if (robot.lost || robot.instructions.length === 0) {
          doneCount++;
          newRobots.push(robot);
          return;
        }

        // Get a new robot by updating the state of the current one being processed
        let newRobot = executeInstruction(robot, planet, robot.instructions[robot.instructions.length - 1]);
        newRobot.instructions.pop();

        if (newRobot.lost) {

          // Leave a scent
          this.setState({

            planet: {
              cols: planet.cols,
              rows: planet.rows,
              scents: { [`${newRobot.x},${newRobot.y}`]: true }
            }

          });

        }

        newRobots.push(newRobot);

    });

    // If every robot is done, we're finished
    if (doneCount === robots.length) {

      robots.forEach( (robot, index, array) => {
        outputMessages.push(getFancyPositionInformation(robot));
      });

      // Stop our update ticks and do a final state update
      clearInterval(this.setIntervalId);
      this.setState({robots: newRobots, outputMessages: outputMessages});

      return;

    }

    console.log(JSON.stringify(newRobots, null, 2));

    this.setState({
      robots: newRobots
    });

    return;

  }

  render() {

    //console.log(JSON.stringify(this.state, null, 2));

    return (
      <div id="mainArea">
        <div id="graphicsContainer">
          <Row cols={this.state.planet.cols} rows={this.state.planet.rows} />
        </div>
        <SideBar _setup={this._setup.bind(this)} />
        <OutputBox outputData={this.state.outputMessages} />
      </div>
    );

  }

}

class Row extends React.Component {

  render() {
    return (
      <div className="row">
        { [1, ...(this.props.cols)].forEach( () => <Cell /> )}
      </div>
    );
  }

}

class Cell extends React.Component {
  render() {
    return (
      <div className="cell">This is a cell</div>
    );
  }
}

//Stateless/Dumb component
class RobotComponent extends React.Component {
  render() {
    return (
      <div className="robot"></div>
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

    // Check for File APIs support - Taken from HTML5Rocks.com
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // File APIs supported
    } else {
      alert("File APIs not fully supported in this browser, loading instructions from a file is disabled.");
      return;
    }

    let reader = new FileReader();
    let fileList = document.getElementById("fileInput");
    let editor = document.getElementById("editor");

    fileList.addEventListener("change", function() {

      let file = fileList.files[0];

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
    let editor = document.getElementById("editor");
    this.props._setup(editor.value);
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

          <button className="buttons" id="goButton" type="button" onClick={this._handleGoClick.bind(this)}>
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

  render() {

    // Populate our output box with output nodes
    let outputNodes = this.props.outputData.map( (output, index) => {
      return (
        <Output key={index} message={output} />
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
