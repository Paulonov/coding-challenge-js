# Martian Robots
---
A solution to Red Badger's coding challenge using HTML5 and JavaScript. The program is written as a simulation through
the use of the requestAnimationFrame API. The original implementation was written in Java and got as far as the GUI design phase before it was re-written. I decided to change the implementation as wrangling with Swing and the Java graphics API became frustrating and I'd never done any web development before; it turned this challenge into a huge learning experience!

## Usage
Open up `martianrobots.html` in your browser of choice, copy in some instructions to the editor and click `Go` to watch your robots go on a little adventure. The `Skip Animation` button allows you to complete the simulation without showing any animations. As the simulation progresses, the final state of each robot is added to the output box below the grid. Some test data is included in the `data` folder.

## Implementation
The program is broken down into five modules; *Core*, *Graphics*, *Robot*, *Planet* and *InstructionReader* with the Core bringing each of the modules together. The front end is a simple web page with a relative layout and so it *should* scale nicely at different resolutions and text sizes.

The simulation's logic is confined to the Robot and Planet modules. Graphics are updated based on the result of the logic update using time-based animation.

## Extensions
Currently, unimplemented instructions passed to a robot are simply ignored. Any new instructions should be added to the
`executeInstruction` function in `robot.js`. If you want to add an animation to it, update the `animate` function in `graphics.js` to include a check for your new instruction.

New headings can be added although this requires a few more changes:

* Increment `NUMBER_OF_DIRECTIONS` in `robot.js`.

* Directions increase in value going clockwise from NORTH (which is 0). E.g. NORTH_EAST would take the value 1 and then each direction after it would need to have their values updated. This is pretty important or new heading calculations won't work!

* Update the `Robot` constructor function to detect your new heading.

* Update the `executeInstruction` function to use your new heading.

* Update the `headingToString` function to include a conversion for your new heading.

* For animation, update the `animate` function in `graphics.js` to use your new heading.

With some refactoring this could probably be made more like implementing a new instruction.

## TODO
A few more nice features that could be added:

1. **Dynamically resizable canvases:** Add an on-resize event listener that changes the internal resolution of each canvas. The canvases currently get resized once and then stretched according to some CSS rules.

2. **Proportional brush sizes for drawing:** The lines making up the grid and each robot can get a bit thick as the grid size increases and the current solution is very temporary.

3. **Off-screen rendering:** The Chrome CPU profiler shows the `strokeText` as being quite expensive. The robot could be rendered off-screen once per animation cycle and then simply copied and moved.

4. **Add a proper language parser:** Purely for "fun". The current instruction language is simple and assumed to be regular and so it's currently parsed using regular expressions. A true parser would be far more future proof.

5. **Mass refactoring:** Is encapsulation necessary? If so, the getters and setters associated with the Robot, Planet and InstructionReader objects could be turned into properties.

## Browser Testing
The website front-end was designed at 1920x1080. Tested on:

* Chrome 42
* Firefox 35 & 36
* Internet Explorer 11

Different resolutions have been tested using Chrome's and Firefox's built-in dev tools.

## Image Credit
**Mars surface image courtesy of NASA/JPL-Caltech/Univ. of Arizona**

http://www.jpl.nasa.gov/spaceimages/details.php?id=PIA17080

**Favicon image courtesy of Openclipart**

https://openclipart.org/detail/184642/Alien

(Converted to favicon with http://realfavicongenerator.net/)
