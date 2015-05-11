/**
 * entry.jsx
 *
 * The WebPack entry point for the application. Sets up the global State variables, initialises the file listener for
 * the HTML5 File API and sets a function for the go button.
 */
"use strict";

import React from 'react';
import AppContainer from './ui.jsx';

window.onload = function () {

    React.render(
        <AppContainer />,
        document.getElementById("container")
    );

}
