# Überzug for nodejs

[Üeberzug][ueberzug] is a command line util which allows to draw images on terminal by using child windows.

This package offers an easy way to create and manipulate images on terminal using Ueberzug command line util.

## Dependencies

- [ueberzug][ueberzug-dep]

## Installation

```sh
npm install ueberzug
```

## Usage
```typescript
import { Placement, ImageScaler } from "ueberzug";

let img = new Placement("demo", "/path/to/image", { width: 30 }, ImageScaler.contain);

img.draw();
```

## Methods

### Constructor

The constructor method receives at least the identifier, which could be any string you want, and some other parameters:

```typescript
  /**
   * @param {string} identifier - The ueberzug identifier
   * @param {string} [path] - Absolute path to image
   * @param {Geometry} [geometry] - Placement/image's geometry
   * @param {ImageScaler} [scaler] - Algorithm name to resize the image to fit the placement geometry
   * @param {boolean} [debug] - Debug ueberzug output to process.stdout
   * @constructor
   */
  constructor( identifier: string, path?: string, geometry?: Geometry, scaler?: ImageScaler, debug?: boolean );
```

### draw

Draws/adds the image to the screen. Draw's ueberzug action is `add`.

Drawing an image also works as a redraw, so it won't create ghost images.

```typescript
img.draw();
```

### hide

Hides/removes the image from screen. Hide's ueberzug action is `remove`.

Hiding/removing an image does not delete it, therefore you can use `draw` to make it appear on screen.

```typescript
img.hide();
```

### move

Moves the image to the specified position, either absolute or relative.

```typescript
  /**
   * Move the image
   * @param {number} [x] - x position
   * @param {number} [y] - y position
   * @param {boolean} [relative] - Move relative to current position
   */
  public move(x?: number, y?: number, relative?: boolean): void;
```

```typescript
img.move(0, 20, true); // Moves the image 20 rows down from actual position
img.move(0, 0); // Moves the image to origin (0, 0)
```

## Properties

### identifier

Ueberzug identifier used to manipulate one image.

```typescript
img.identifier: string;
```

### geometry

Placement/image geometry.

```typescript
interface Geometry {
  /**
   * x position
   * [Integer]
   */
  x?: number;
  /**
   * y position
   * [Integer]
   */
  y?: number;
  /**
   * Desired width; original width will be used if not set
   * [Integer]
   */
  width?: number;
  /**
   * Desired height; original height will be used if not set
   * [Integer]
   */
  height?: number;
  /**
   * The x centered position, if possible.
   * Specified as factor of the image size, so it should be an element of [0, 1].
   * [Float]
   */
  scaling_position_x?: number;
  /**
   * The y centered position, if possible.
   * Specified as factor of the image size, so it should be an element of [0, 1].
   * [Float]
   */
  scaling_position_y?: number;
}
```

### path

Path to image

```typescript
img.path: string;
```

### scaler

Algorithm which resizes the image to fit into the placement.

| scaler | description |
|--------|-------------|
| crop | Crops out an area of the size of the placement size. |
| distort | Distorts the image to the placement size. |
| fit_contain | Resizes the image that either the width matches the maximum width or the height matches the maximum height while keeping the image ratio. |
| contain | Resizes the image to a size &lt= the placement size while keeping the image ratio. |
| forced_cover | Resizes the image to cover the entire area which should be filled while keeping the image ratio. <br>If the image is smaller than the desired size it will be stretched to reach the desired size. <br>If the ratio of the area differs from the image ratio the edges will be cut off. |
| cover | The same as forced_cover but images won't be stretched if they are smaller than the area which should be filled. |


## Example

The next example draws an image on the terminal and moves it with arrow keys.

```javascript
const ueberzug = require(".");

let image = new ueberzug.Placement(
  "demo",
  "/path/to/image",
  { width: 30 },
  ueberzug.ImageScaler.contain
);

image.draw();

for (let i = 0; i < 30; i++) {
  image.move(1, 1, true);
}

process.stdin.setRawMode(true);

process.stdin.on("data", (data) => {
  let keys = data.toJSON().data;
  if (keys.length == 0) return false;

  if (keys[0] == 3) {
    // 'Ctrl + c' key
    process.exit(0);
  } else if (keys[0] == 27 && keys[1] == 91) {
    if (keys[2] == 66) {
      // Down
      image.move(0, 1, true);
    } else if (keys[2] == 65) {
      // Up
      image.move(0, -1, true);
    } else if (keys[2] == 68) {
      // Left
      image.move(-1, 0, true);
    } else if (keys[2] == 67) {
      // Right
      image.move(1, 0, true);
    }
  }
});
```

[ueberzug]: https://github.com/seebye/ueberzug "Üeberzug"
[ueberzug-dep]: https://github.com/seebye/ueberzug#dependencies
