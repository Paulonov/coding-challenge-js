/**
 * planet.js
 *
 * A representation of the planet. Simply stores the X and Y boundaries of its grid and also a "scent map" so that a
 * robot can sniff the air at its current position for the smell of a friend that's wandered off the grid.
 *
 * Properties: x, y, scentMap
 */
"use strict";

/**
 * Constructor to create a planet object.
 * @param {int} planetX The X boundary of the planet.
 * @param {int} planetY The Y boundary of the planet.
 */
export default class Planet {

    constructor(planetX, planetY) {

        this.scentMap = [];

        // Make sure that the provided planet co-ordinates are in bounds otherwise set up the planet as normal
        if (planetX > 50 || planetY > 50 || planetX <= 0 || planetY <= 0 || typeof planetX === "undefined" ||
            typeof planetY === "undefined" || planetX === null || planetY === null) {

                throw "<b>Planet Creation Error: </b> Specified planet co-ordinates are out of bounds! Max planet size " +
                        "is 50x50";

        } else {

            this.x = planetX;
            this.y = planetY;

            // If a grid square has a value of true, a robot has left a scent before it got lost
            for (var i = 0; i <= planetX; i++) {

                this.scentMap[i] = [];

                for (var j = 0; j <= planetY; j++) {
                    this.scentMap[i][j] = false;
                }

            }

        }

    }

    getSmellFromCoordinates(xPosition, yPosition) {
        return this.scentMap[xPosition][yPosition];
    }

    updateScents(robot) {

        /*
         * The robot stops processing instructions once it is lost so we can use its latest position as the point it got
         * lost at.
         */
        if (robot.isLost) {
            this.scentMap[robot.xPosition][robot.yPosition] = true;
        }

    }

}
