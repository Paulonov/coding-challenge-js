/**
 * robot.js
 *
 * Contains the constructor required to create a Robot along with the logic to handle each instruction.
 *
 * Properties: xPosition, yPosition, heading, width, length, canvasXPosition, canvasYPosition, speed, isLost
 * TODO: Should these properties be set to some default values?
 */
"use strict";

var Robot = {
    NUMBER_OF_DIRECTIONS: 4,
    NORTH: 0,
    EAST: 1,
    SOUTH: 2,
    WEST: 3;
};

/**
 * Execute the instruction given to the robot and update its internal state.
 * @param  {char} instruction A character representing the instruction to execute.
 * @return {A new robot object with an updated internal state}
 */
export function executeInstruction(robot, instruction) {

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
            case "L":
                this.heading = (heading + (Robot.NUMBER_OF_DIRECTIONS - 1)) % Robot.NUMBER_OF_DIRECTIONS;
                break;

            // Same again but we add 1 to get the next heading to the right
            case "R":
                this.heading = (heading + 1) % Robot.NUMBER_OF_DIRECTIONS;
                break;

            case "F":

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
 * Get some information about the robot that can be added to the output box.
 * @return {Object} An object with the properties robot, position and lost that can be presented in the output box.
 */
export function getFancyPositionInformation(robot) {

    if (robot.isLost) {
        return "<b>Robot " + Robot.robotCount + "</b>" + ": " + this.xPosition + " " + this.yPosition +
        " " + Robot.headingToString(this.heading) + " " + "<b>LOST</b>";
    } else {
        return "<b>Robot " + Robot.robotCount + "</b>" + ": " + this.xPosition + " " + this.yPosition +
            " " + Robot.headingToString(this.heading);
    }

}

/**
 * Convert a heading string into its numerical equivalent.
 * @param  {string} heading A string containing the heading character to convert.
 * @return {int}            A numerical value corresponding to the heading passed in or a question mark if the value
 *                          cannot be converted.
 */
export function stringToHeading(heading) {

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
export function headingToString(heading) {

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
