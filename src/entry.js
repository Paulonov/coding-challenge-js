/**
 * entry.js
 *
 * The WebPack entry point for the application. Sets up the global State variables, initialises the file listener for
 * the HTML5 File API and sets a function for the go button.
 */
"use strict";

import * as Core from "./core.js";
import State from "./core.js";

window.onload = function () {

    State.initialiseState();
    Core.initialiseFileListener();
    document.getElementById("goButton").onclick = Core.go;

};
