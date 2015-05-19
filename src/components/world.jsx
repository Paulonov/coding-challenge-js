"use strict";

import React from "react";

import SideBar from "./sidebar.jsx";
import OutputBox from "./outputbox.jsx";
import Row from "./row.jsx";

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

    this.setState({
      robots: newRobots
    });

    return;

  }

  render() {

    return (
      <div id="mainArea">
        <div id="graphicsContainer">
          {range(0, this.state.planet.rows).map( (output, index) => <Row key={index} cols={this.state.planet.cols} /> )}
        </div>
        <SideBar _setup={this._setup.bind(this)} />
        <OutputBox outputData={this.state.outputMessages} />
      </div>
    );

  }

}

