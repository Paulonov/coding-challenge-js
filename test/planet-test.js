/**
 * planet-test.js
 *
 * A file containing some Mocha tests for the application.
 */
"use strict";

import chai from "chai";
var assert = chai.assert;
var expect = chai.expect;

/*eslint-disable no-unused-vars*/
var should = chai.should();

import Planet from "../src/planet.js";

describe("Planet", function() {

    var creationError = "Planet Creation Error";

    /*eslint-disable no-unused-vars*/
    describe("#constructor()", function() {

        it("should return an instance of Planet", function() {
            expect(new Planet(5, 5)).to.be.an.instanceof(Planet);
        });

        it("should not create a planet with an x larger than 50", function() {
            expect( planet => new Planet(51, 50) ).to.throw(creationError);
        });

        it("should not create a planet with a y larger than 50", function() {
            expect( planet => new Planet(50, 51) ).to.throw(creationError);
        });

        it("should not create a planet with an x smaller than 0", function() {
            expect( planet => new Planet(-1, 0) ).to.throw(creationError);
        });

        it("should not create a planet with a y smaller than 0", function() {
            expect( planet => new Planet(0, -1) ).to.throw(creationError);
        });

        it("should not create a planet with an undefined x", function() {
            expect( planet => new Planet(null, 0) ).to.throw(creationError);
        });

        it("should not create a planet with an undefined y", function() {
            expect( planet => new Planet(0, null) ).to.throw(creationError);
        });

    });

    describe("#getSmellFromCoordinates()", function() {

        it("should find a smell at 5, 4", function() {

            var planet = new Planet(5, 5);
            planet.scentMap[5][5] = true;

            assert(planet.getSmellFromCoordinates(5, 5), true);

        });

    });

});
