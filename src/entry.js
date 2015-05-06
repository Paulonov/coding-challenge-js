/**
 * entry.js
 *
 * The WebPack entry point for the application. Sets up the global State variables, initialises the file listener for
 * the HTML5 File API and sets a function for the go button.
 */


import * as Core from "./core.js";
import State from "./core.js";

window.onload = function () {

    var state = new State();
    Core.initialiseFileListener();
    document.getElementById("goButton").onclick = Core.go;

}
