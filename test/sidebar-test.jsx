"use strict";

// Set up a headless browser
var jsdom = require("jsdom-no-contextify");
global.document = jsdom.jsdom("<!doctype html><html><body></body></html>");
global.window = document.parentWindow;

import React from "react/addons";
var TestUtils = React.addons.TestUtils;

import chai from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

let assert = chai.assert;
let expect = chai.expect;
let should = chai.should();

chai.use(sinonChai);

import SideBar from "../src/components/sidebar.jsx";

var sandbox;
var sidebar;

before(function() {
  sandbox = sinon.sandbox.create();
  sidebar = TestUtils.renderIntoDocument(<SideBar />);
});

describe("SideBar", function() {

  it("should have a DOM to render to", function() {
    expect(global.document).to.exist;
    expect(global.window).to.exist;
  });

  describe("#editor", function() {

    var editor;

    before(function() {
      editor = TestUtils.findRenderedDOMComponentWithTag(sidebar, "textarea");
    });

    it("should render a TextArea as part of the component", function() {
      expect(editor.getDOMNode().getAttribute("id")).to.equal("editor");
    });

    it("updates when text is read in from a file", function() {

      var testData = "5 3\n1 1 E\nRFRFRFRF\n\n3 2 N\nFRRFLLFFRRFLL\n\n0 3 W\nLLFFFLFLFL\n\n6 4 W\nRFLRFLRF\n\n1 1 E\n" +
                        "RFRFRFRF";

      expect(editor.getDOMNode().value).to.equal("");
      editor.getDOMNode().value = testData;
      expect(editor.getDOMNode().value).to.equal(testData);

    });

  });

});
