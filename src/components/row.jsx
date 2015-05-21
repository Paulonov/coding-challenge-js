/**
 * row.jsx
 *
 * The React component responsible for drawing each row of cells.
 */
"use strict";

import React from "react";
import Cell from "./cell.jsx";

import range from "array-range";

export default class Row extends React.Component {

  render() {

    var cells = [];

    // Each cell is 10em wide so let's start at -8 to include a margin
    var cellCounter = -7;

    range(0, this.props.cols).forEach( (output, index) => {

      // Draw the next cell 10em to the right of the previous one
      var style = {
        left: (cellCounter += 10) + "em",
        top: 3 + (this.props.rowNo * 10) + "em"
      };

      var cell = <Cell key={index} style={style}/>;
      cells.push(cell);

    });

    return (
      <div className="row">
        {cells}
      </div>
    );

  }

}
