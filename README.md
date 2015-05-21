[![Circle CI](https://circleci.com/gh/Paulonov/coding-challenge-js/tree/master.svg?style=shield)](https://circleci.com/gh/Paulonov/coding-challenge-js/tree/master)

# Martian Robots
A solution to Red Badger's developer programming rewritten to use ES6 and React. The program is written as a simulation through React's management of state. The original JavaScript version used the requestAnimationFrame API to achieve a similar goal.

## Usage
The tooling for this application is based around Webpack. After downloading the repo, run `npm install` inside of it followed by `npm run build` to get everything ready.

Once built, open up `martianrobots.html` in your browser of choice, copy in some instructions to the editor and click `Go` to watch your robots go on a little adventure. The `Skip Animation` button allows you to complete the simulation without showing any animations. As the simulation progresses, the final state of each robot is added to the output box below the grid. Some test data is included in the `data` folder.

## Implementation
The program is broken down into React components that are rendered in `entry.jsx`. The core component is the `World` within which all state and functions to update it are contained. Two addition modules, `robot.js` and `instructionreader.js` contain helper functions for parsing

Animation has been achieved through the use of CSS transitions; the simulation ticks every one second and between these ticks, a one second long CSS transition is used to animate the movement between each state.

## Extensions
Currently, unimplemented instructions passed to a robot are simply ignored. Any new instructions should be added to the
`executeInstruction` function in `robot.js`. If you want to add an animation to it, update the `animate` function in `graphics.js` to include a check for your new instruction.

New headings can be added too although this requires a few more changes:

* Increment `NUMBER_OF_DIRECTIONS` in `robot.js`.

* Directions increase in value going clockwise from NORTH (which is 0). E.g. NORTH_EAST would take the value 1 and then each direction after it would need to have their values updated. This is pretty important or new heading calculations won't work!

* Update the `Robot` constructor function to detect your new heading.

* Update the `executeInstruction` function to use your new heading.

* Update the `headingToString` function to include a conversion for your new heading.

* For animation, update the `animate` function in `graphics.js` to use your new heading.

With some refactoring this could probably be made more like implementing a new instruction.

## TODO
A few more nice features that could be added:

1. **Re-sizable graphics:** The current graphics implementation does not scale to the size of the graphics container and so will massively overflow at larger planet sizes.

2. **Add a proper language parser:** Purely for "fun". The current instruction language is simple and assumed to be regular so it's currently parsed using regular expressions. A true parser would be far more future proof.

## Browser Testing
The website front-end was designed at 1920x1080. Tested on:

* Chrome 42

* Firefox 35 & 36

* Internet Explorer 11

Different resolutions have been tested using Chrome's and Firefox's built-in dev tools. Varying font sizes have been tested using browser zoom levels.

## Image Credit
**Mars surface image courtesy of NASA/JPL-Caltech/Univ. of Arizona**

http://www.jpl.nasa.gov/spaceimages/details.php?id=PIA17080

**Favicon image courtesy of Openclipart**

https://openclipart.org/detail/184642/Alien

(Converted to favicon with http://realfavicongenerator.net/)
