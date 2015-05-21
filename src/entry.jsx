/**
 * entry.jsx
 *
 * The Webpack entry point for the application. Renders the containing React component to the DOM.
 */
"use strict";

import React from "react";
import MartianRobots from "./components/martianrobots.jsx";

// TODO: Only needed so that Webpack can hot reload the CSS
//require("../styles/martianrobots.css");

window.onload = function() {
  React.render(
    <MartianRobots />,
    document.getElementById("container")
  );
};

/*
// TODO: The React hot loader doesn't seem to work if state isn't saved at the top level
import World from "./components/world.jsx";

window.onload = function() {
  React.render(
    <World />,
    document.getElementById("container")
  );
};
*/
