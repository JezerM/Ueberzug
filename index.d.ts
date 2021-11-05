declare module "ueberzug";

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

/**
 * Algorithm which resizes the image to fit into the placement
 */
declare enum ImageScaler {
  /**
   * Crops out an area of the size of the placement size.
   */
  crop = "crop",
  /**
   * Distorts the image to the placement size.
   */
  distort = "distort",
  /**
   * Resizes the image that either the width matches the maximum width or the height matches the maximum height while keeping the image ratio.
   */
  fit_contain = "fit_contain",
  /**
   * Resizes the image to a size <= the placement size while keeping the image ratio.
   */
  contain = "contain",
  /**
   * Resizes the image to cover the entire area which should be filled while keeping the image ratio.
   * If the image is smaller than the desired size it will be stretched to reach the desired size.
   * If the ratio of the area differs from the image ratio the edges will be cut off.
   */
  forced_cover = "forced_cover",
  /**
   * The same as forced_cover but images won't be stretched if they are smaller than the area which should be filled.
   */
  cover = "cover",
}

/**
 * The class which represent a (image) placement on the terminal.
 * @class Initialize a new Placement
 */
declare class Placement {
  /**
   * @param {string} identifier - The ueberzug identifier
   * @param {string} [path] - Absolute path to image
   * @param {Geometry} [geometry] - Placement/image's geometry
   * @param {ImageScaler} [scaler] - Algorithm name to resize the image to fit the placement geometry
   * @param {boolean} [debug] - Debug ueberzug output to process.stdout
   * @constructor
   */
  constructor(
    identifier: string,
    path?: string,
    geometry?: Geometry,
    scaler?: ImageScaler,
    debug?: boolean
  );

  /**
   * Ueberzug identifier
   */
  public get identifier(): string;

  /**
   * Placement geometry
   */
  public get geometry(): Required<Geometry>;
  public set geometry(value: Geometry);

  /**
   * Path to image
   */
  public get path(): string;
  public set path(value: string);

  /**
   * Algorithm which resizes the image to fit into the placement
   */
  public get scaler(): ImageScaler;
  public set scaler(value: ImageScaler);

  /**
   * Draws/adds the image to the screen
   * `action = add`
   */
  public draw(): void;

  /**
   * Hides/removes the image from screen
   * `action = remove`
   */
  public hide(): void;

  /**
   * Move the image
   * @param {number} [x] - x position
   * @param {number} [y] - y position
   * @param {boolean} [relative] - Move relative to current position
   */
  public move(x?: number, y?: number, relative?: boolean): void;
}

export { Geometry, ImageScaler, Placement };
