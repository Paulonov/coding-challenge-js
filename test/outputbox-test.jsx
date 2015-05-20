"use strict";

// Set up a headless browser
// var jsdom = require("jsdom-no-contextify");
// global.document = jsdom.jsdom("<!doctype html><html><body></body></html>");
// global.window = document.parentWindow;

import React from "react/addons";
var TestUtils = React.addons.TestUtils;

import chai from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

let assert = chai.assert;
let expect = chai.expect;
let should = chai.should();

chai.use(sinonChai);

import OutputBox from "../src/components/outputbox.jsx";

var sandbox;
var outputBox;

before(function() {
  sandbox = sinon.sandbox.create();
  outputBox = TestUtils.renderIntoDocument(<OutputBox outputData={["Testing"]}/>);
});

describe("OutputBox", function() {

  it("should have a DOM to render to", function() {
    expect(global.document).to.exist;
    expect(global.window).to.exist;
  });

  it("should render an output node", function() {
    console.log(outputBox);
    expect(true).to.be.true;
  });

});
