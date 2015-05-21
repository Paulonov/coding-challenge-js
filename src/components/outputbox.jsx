/**
 * outputbox.jsx
 *
 * The React component responsible for containing and displaying output messages.
 */
"use strict";

import React from "react";
import Output from "./output.jsx";

export default class OutputBox extends React.Component {

  render() {

    // Populate our output box with output nodes
    let outputNodes = this.props.outputData.map( (output, index) => {
      return (
        <Output key={index} message={output} />
      );
    });

    return (
      <div id="outputBox">
        {outputNodes}
      </div>
    );

  }

}
