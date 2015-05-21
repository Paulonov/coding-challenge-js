/**
 * output.jsx
 *
 * The React component used to display output messages within the output box.
 */
"use strict";

import React from "react";

/**
 * Represents a single line of output in the output box.
 */
export default class Output extends React.Component {

  render() {

    // dangerouslySetInnerHTML is used for compatibility; output messages are formatted with HTML
    return (
      <div className="output">
        <p dangerouslySetInnerHTML={{__html: this.props.message}} />
      </div>
    );

  }

}
