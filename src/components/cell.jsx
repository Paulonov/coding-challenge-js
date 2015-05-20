"use strict";

import React from "react";

export default class Cell extends React.Component {
  render() {
    return (
      <div className="cell" style={this.props.style}></div>
    );
  }
}
