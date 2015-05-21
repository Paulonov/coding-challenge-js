"use strict";

import React from "react";

/**
 * The editable text area and buttons below it.
 *
 * TODO: The "Skip Animation" button should probably be part of the graphics component.
 */
export default class SideBar extends React.Component {

  // Called once we know that the buttons have been rendered so we will definitely be able to attach an event listener
  componentDidMount() {
    this._initialiseFileListener();
  }

  /**
   * Sets up a listener so that we can read in robot instructions from a suitable file.
   */
  _initialiseFileListener() {

    // Check for File APIs support - Taken from HTML5Rocks.com
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // File APIs supported
    } else {
      alert("File APIs not fully supported in this browser, loading instructions from a file is disabled.");
      return;
    }

    let reader = new FileReader();
    let fileList = document.getElementById("fileInput");
    let editor = document.getElementById("editor");

    fileList.addEventListener("change", function() {

      let file = fileList.files[0];

      reader.onload = function() {

        // Check the MIME type of the file to see if it's a text file
        if (file.type.match("text/*")) {
          editor.value = reader.result;
        } else {
          alert("File extension not supported!");
        }

      };

      reader.readAsText(file);

    });

  }

  /**
   * Save the instructions entered into the editor into the application's state when the submit button is clicked.
   */
  _handleGoClick() {
    let editor = React.findDOMNode(this.refs.editor);
    this.props._setup(editor.value);
  }

  _handleSkipClick() {
    this.props._skip();
  }

  /**
   * [render description]
   * @return {[type]} [description]
   */
  render() {

    return (

      <div id="sidebar">

        <textarea
          id="editor" ref="editor" placeholder="Enter your code here!" rows="30" cols="75">
        </textarea>

        <div id="buttonBox">

          <input className="buttons" type="file" id="fileInput" name="file" />

          <button className="buttons" id="goButton" type="button" onClick={this._handleGoClick.bind(this)}>
            <div className="buttonText">Go!</div>
          </button>

          <button className="buttons" id="skipButton" type="button" onClick={this._handleSkipClick.bind(this)}>
            <div className="buttonText">Skip Animation</div>
          </button>

        </div>

      </div>

    );

  }

}
