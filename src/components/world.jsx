/**
 * world.jsx
 *
 * The React component that acts as the core of the application. All logic is containing here along with the state of
 * the world. When the simulation is running, it updates the state of the world every second and is accompanied by some
 * nice CSS transitions as the robots move around.
 */
"use strict";

import React from "react";

import SideBar from "./sidebar.jsx";
import OutputBox from "./outputbox.jsx";
import Row from "./row.jsx";
import Robot from "./robot.jsx";

import {executeInstruction, getFancyPositionInformation} from "../robot.js";
import {parseInstructions, prepareRobots} from "../instructionreader.js";

import range from "array-range";

/**
 * State entirely resides here; if it's need elsewhere, it can be passed down to child components as props.
 */
export default class World extends React.Component {

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

      // Clear everything so we can start again
      this.setState({

          robots: [],

          planet: {
            cols: 0,
            rows: 0
          },

          outputMessages: []

      });

      this.setIntervalId = -1;

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
      let initialPlanet = { scents: {}, cols: parseInt(planetBoundaries[0], 10), rows: parseInt(planetBoundaries[1], 10) };

      // Update the state of the world accordingly: The callback starts the simulation
      this.setState({ robots: initialRobots, planet: initialPlanet },

        () => {
          this.setIntervalId = setInterval(this._tick.bind(this), 1000);
        }

      );

    }

    /**
     * Update the state of the world by one tick. On a tick, each robot executes a single instruction.
     */
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

    this.setState({
      robots: newRobots
    });

    return;

  }

  /**
   * Used to jump to the end of the simulation if the user wishes.
   */
  _skip() {

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

      let newRobot = robot;

      // TODO: Execute each instruction one at a time for each robot rather than for one robot at a time
      while(newRobot.instructions.length > 0 && !newRobot.lost) {

        // Get a new robot by updating the state of the current one being processed
        newRobot = executeInstruction(newRobot, planet, newRobot.instructions[newRobot.instructions.length - 1]);
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

          break;

        }

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

    this.setState({
      robots: newRobots
    });

    return;

  }

  render() {

    var robotNodes = [];

    // Calculate where each robot needs to be
    this.state.robots.forEach( (robot, index, array) => {

      // Each cell is 10em x 10 em, use a margin of, say, 0.5em
      var x = (robot.x * 10) + 1.3;

      /*
       * Convert y value to Cartesian co-ordinates; the robots are positioned using top and left CSS offsets so we
       * calculate where the robot is from the bottom of the grid rather than the top.
       */
      var y = ((this.state.planet.rows - robot.y) * 10) + 1.5;

      var style = {};

      // Don't show the robot if it's lost
      if (robot.lost) {

        style = {
          top: y + "em",
          left: x + "em",
          zIndex: index,
          opacity: 0,
          visibility: "hidden"
        };

      } else {

        style = {
          top: y + "em",
          left: x + "em",
          zIndex: index
        };

      }

      var robotNode = <Robot key={index} id={robot.id} x={robot.x} y={robot.y} heading={robot.heading} style={style} />;
      robotNodes.push(robotNode);

    });

    return (
      <div id="mainArea">
        <div id="graphicsContainer">
          {range(0, this.state.planet.rows).map( (output, index) => <Row key={index} rowNo={index} cols={this.state.planet.cols} /> )}
          {robotNodes}
        </div>
        <SideBar _setup={this._setup.bind(this)} _skip={this._skip.bind(this)}/>
        <OutputBox outputData={this.state.outputMessages} />
      </div>
    );

  }

}

