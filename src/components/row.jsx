"use strict";

import React from "react";
import Cell from "./cell.jsx";

import range from "array-range";

export default class Row extends React.Component {

  render() {

    return (
      <div className="row">
        {range(0, this.props.cols).map( (output, index) => <Cell key={index} /> )}
      </div>
    );
  }

}
