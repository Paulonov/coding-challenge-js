import * as Core from "./core.js";
import State from "./core.js";

window.onload = function () {

    var state = new State();
    Core.initialiseFileListener();
    document.getElementById("goButton").onclick = Core.go;

}