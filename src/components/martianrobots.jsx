"use strict";

import React from "react";

import Header from "./header.jsx";
import World from "./world.jsx";

export default class MartianRobots extends React.Component {

  render() {

    return (
      <div id="appContainer">
        <Header />
        <World />
      </div>
    );

  }

}
