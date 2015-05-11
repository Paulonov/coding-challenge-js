/**
 * robot.js
 *
 * Contains the constructor required to create a Robot along with the logic to handle each instruction.
 *
 * Properties: xPosition, yPosition, heading, width, length, canvasXPosition, canvasYPosition, speed, isLost
 * TODO: Should these properties be set to some default values?
 */
"use strict";

import * as Core from "./core.js";
import State from "./core.js";
import * as Graphics from "./graphics.js";

/**
 * Constructor for making a Robot object.
 * @param {int}  initialXPosition The robot's starting X position.
 * @param {int}  initialYPosition The robot's starting Y position.
 * @param {char} initialHeading  The direction the robot is facing.
 */
export default class Robot {

    constructor(initialXPosition, initialYPosition, initialHeading) {

        /**
         * Internal heading values: Counted clockwise from north
         * Defining them outside of this doesn't seem to get them "counted" with the export
         *
         * TODO: Can these use the const keyword?
         */
        Robot.NUMBER_OF_DIRECTIONS = 4;
        Robot.NORTH = 0;
        Robot.EAST = 1;
        Robot.SOUTH = 2;
        Robot.WEST = 3;

        if (initialXPosition < 0 || initialYPosition < 0 || initialXPosition > Robot.currentPlanet.x ||
            initialYPosition > Robot.currentPlanet.y) {

            throw "<b>Robot Placement Out of Bounds: </b>" + initialXPosition + ", " + initialYPosition;

        } else {

            this.xPosition = initialXPosition;
            this.yPosition = initialYPosition;

             // this.canvasXPosition = (gridInformation.xDifference * this.xPosition) + gridInformation.margin;
            // this.canvasYPosition = Graphics.translateOrigin((gridInformation.yDifference * this.yPosition) +
                // gridInformation.margin, gridInformation);

            // Use the size of the planet to establish a suitable speed for the robots - Totally arbitrary!
            // this.speed = (1/(State.planet.x + State.planet.y)) * 1.5;

            // Set up the size of the robot in canvas co-ordinates, scales with the size of the grid
            /*if ((Robot.currentPlanet.x + Robot.currentPlanet.y) < 25) {
                this.length = 50;
                this.width = 50;
            } else {
                this.length = 30;
                this.width = 30;
            } */

            this.heading = Robot.stringToHeading(initialHeading);

            if (this.heading === "?") {
                throw "<b>Robot Creation Error:</b> Invalid initial heading!";
            }

            // Robot has been successfully created so increase the count
            Robot.robotCount++;
            this.id = Robot.robotCount;
            this.isLost = false;

        }

    }

    /**
     * Execute the instruction given to the robot and update its internal state.
     * @param  {char} instruction A character representing the instruction to execute.
     */
    executeInstruction(instruction) {

        // Save values that get accessed a lot early on so that we don't have to keep accessing the getter method
        var heading = this.heading;
        var xPosition = this.xPosition;
        var yPosition = this.yPosition;

        var smell = Robot.currentPlanet.getSmellFromCoordinates(xPosition, yPosition);
        var currentPlanetXBoundary = Robot.currentPlanet.x;
        var currentPlanetYBoundary = Robot.currentPlanet.y;

        if (!(this.isLost)) {

            switch (instruction) {

                // Using mod n allows us to add (n - 1) to the heading to get the next heading the left
                case 'L':
                    this.heading = (heading + (Robot.NUMBER_OF_DIRECTIONS - 1)) % Robot.NUMBER_OF_DIRECTIONS;
                    break;

                // Same again but we add 1 to get the next heading to the right
                case 'R':
                    this.heading = (heading + 1) % Robot.NUMBER_OF_DIRECTIONS;
                    break;

                case 'F':

                    switch (heading) {

                        case Robot.NORTH:

                            if ((yPosition + 1) > currentPlanetYBoundary && !smell) {
                                this.isLost = true;
                            } else if ((yPosition + 1) > currentPlanetYBoundary && smell) {
                                // Do nothing if we're about to leave the grid but we can smell lost robots
                            } else {
                                this.yPosition = (yPosition + 1);
                            }

                            break;

                        case Robot.EAST:

                            if ((xPosition + 1) > currentPlanetXBoundary && !smell) {
                                this.isLost = true;
                            } else if ((xPosition + 1) > currentPlanetXBoundary && smell) {
                                    // Do nothing if we're about to leave the grid but we can smell lost robots
                            } else {
                                this.xPosition = (xPosition + 1);
                            }

                            break;

                        case Robot.SOUTH:

                            if ((yPosition - 1) < 0 && !smell) {
                                this.isLost = true;
                            } else if ((yPosition - 1) < 0 && smell) {
                                // Do nothing if we're about to leave the grid but we can smell lost robots
                            } else {
                                this.yPosition = (yPosition - 1);
                            }

                            break;

                        case Robot.WEST:

                            if ((xPosition - 1) < 0 && !smell) {
                                this.isLost = true;
                            } else if ((xPosition - 1) < 0 && smell) {
                                // Do nothing if we're about to leave the grid but we can smell lost robots
                            } else {
                                this.xPosition = (xPosition - 1);
                            }

                            break;

                    }

                    break;


                default:
                    // Just in case the instruction is unimplemented
                    break;

            }

        }

    }

    /**
     * Get some information about the robot with added HTML tags.
     * @return {String} A string containing useful information about the robot.
     */
    getFancyPositionInformation() {

        if (this.isLost) {
            return "<b>Robot " + Robot.robotCount + "</b>" + ": " + this.xPosition + " " + this.yPosition +
            " " + Robot.headingToString(this.heading) + " " + "<b>LOST</b>";
        } else {
            return "<b>Robot " + Robot.robotCount + "</b>" + ": " + this.xPosition + " " + this.yPosition +
                " " + Robot.headingToString(this.heading);
        }

    }

    /**
     * We're giving the Robot object two methods of its own that you can call without needing an instance. These act as
     * static functions.
     */
    static setPlanet(planet) {
        this.currentPlanet = planet;
    }

    static setRobotCount(count) {
        this.robotCount = count;
    }


    /**
     * Convert a heading string into its numerical equivalent.
     * @param  {string} heading A string containing the heading character to convert.
     * @return {int}            A numerical value corresponding to the heading passed in or a question mark if the value
     *                          cannot be converted.
     */
    static stringToHeading(heading) {

        switch (heading) {
            case "N":
                return Robot.NORTH;
            case "E":
                return Robot.EAST;
            case "S":
                return Robot.SOUTH;
            case "W":
                return Robot.WEST;
            default:
                return "?";
        }

    }

    /**
     * Convert a (numerical) heading value back into its string form.
     * TODO: Refactor using an enum maybe?
     * @param  {int}    heading A numerical value representing the current heading.
     * @return {String}         The String form of that value.
     */
    static headingToString(heading) {

        switch (heading) {
            case Robot.NORTH:
                return "N";
            case Robot.EAST:
                return "E";
            case Robot.SOUTH:
                return "S";
            case Robot.WEST:
                return "W";
            default:
                return "?";

        }

    }

}
