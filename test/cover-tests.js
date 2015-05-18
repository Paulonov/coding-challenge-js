/**
 * cover-tests.js
 *
 * Use CoverJS to produce a coverage report for our test suite.
 */
"use strict";

import coverloader from "coverjs-loader";

/*eslint-disable no-unused-vars*/
import robotTest from "./robot-test.js";
import instructionReaderTest from "./instructionreader-test.js";

after(function() {
    coverloader.reportHtml();
});
