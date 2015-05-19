/**
 * entry.jsx
 *
 * The WebPack entry point for the application. Sets up the global State variables, initialises the file listener for
 * the HTML5 File API and sets a function for the go button.
 */
"use strict";

import React from "react";
//import MartianRobots from "./ui.jsx"

// TODO: Only needed so that Webpack can hot reload the CSS
require("../styles/martianrobots.css");

/*
window.onload = function() {
  React.render(
    <MartianRobots />,
    document.getElementById("container")
  );
};
*/

// TODO: The React hot loader doesn't seem to work if state isn't saved at the top level
import World from "./components/world.jsx";

window.onload = function() {
  React.render(
    <World />,
    document.getElementById("container")
  );
};
