import child_process from "child_process";

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
enum ImageScaler {
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

class Placement {
  private _identifier: string;
  private _process: child_process.ChildProcessWithoutNullStreams;
  private _debug: boolean;
  private _geometry: Geometry = {};
  private _scaler: ImageScaler = ImageScaler.crop;
  private _path: string;

  /**
   * Ueberzug identifier
   */
  public get identifier(): string {
    return this._identifier;
  }

  /**
   * Placement geometry
   */
  public get geometry(): Required<Geometry> {
    let geom: Required<Geometry> = {
      x: this._geometry.x ?? 0,
      y: this._geometry.y ?? 0,
      width: this._geometry.width ?? 0,
      height: this._geometry.height ?? 0,
      scaling_position_x: this._geometry.scaling_position_x ?? 0,
      scaling_position_y: this._geometry.scaling_position_y ?? 0,
    };
    return geom;
  }
  public set geometry(value: Geometry) {
    let geom: Geometry = {
      x: Math.floor(value.x ?? this._geometry.x ?? 0),
      y: Math.floor(value.y ?? this._geometry.y ?? 0),
      width: Math.floor(value.width ?? this._geometry.width ?? 0),
      height: Math.floor(value.height ?? this._geometry.height ?? 0),
      scaling_position_x:
        value.scaling_position_x ?? this._geometry.scaling_position_x ?? 0,
      scaling_position_y:
        value.scaling_position_y ?? this._geometry.scaling_position_y ?? 0,
    };
    this._geometry = geom;
  }

  /**
   * Path to image
   */
  public get path(): string {
    return this._path;
  }
  public set path(value: string) {
    this._path = value;
  }

  /**
   * Algorithm which resizes the image to fit into the placement
   */
  public get scaler(): ImageScaler {
    return this._scaler;
  }
  public set scaler(value: ImageScaler) {
    this._scaler = value;
  }

  public constructor(
    identifier: string,
    path: string = "",
    geometry: Geometry = {},
    scaler: ImageScaler = ImageScaler.crop,
    debug: boolean = false
  ) {
    this._identifier = identifier;
    this._debug = debug;
    this._path = path;
    this.geometry = geometry;
    this._scaler = scaler;
    this._debug = debug;

    this._process = child_process.spawn("ueberzug", ["layer"]);
    if (this._debug) {
      console.log("A");
      this._process.stdout.on("data", (data) => {
        process.stdout.write(data);
      });
      this._process.stderr.on("data", (data) => {
        process.stdout.write(data);
      });
    }
    process.on("exit", () => {
      this._process.kill();
    });
  }

  /**
   * Draws/adds the image to the screen
   * `action = add`
   */
  public draw(): void {
    let add = {
      action: "add",
      identifier: this.identifier,
      x: this.geometry.x,
      y: this.geometry.y,
      width: this.geometry.width,
      height: this.geometry.height,
      path: this.path,
      scaler: this.scaler,
    };
    this._process.stdin.write(JSON.stringify(add) + "\n");
  }

  /**
   * Hides/removes the image from screen
   * `action = remove`
   */
  public hide(): void {
    let remove = {
      action: "remove",
      identifier: this.identifier,
    };
    this._process.stdin.write(JSON.stringify(remove) + "\n");
  }

  /**
   * Move the image
   * @param {number} [x] - x position
   * @param {number} [y] - y position
   * @param {boolean} [relative] - Move relative to current position
   */
  public move(x?: number, y?: number, relative: boolean = false): void {
    if (relative)
      this.geometry = {
        x: this.geometry.x + (x ?? 0),
        y: this.geometry.y + (y ?? 0),
      };
    else this.geometry = { x, y };
    this.draw();
  }
}

export { Geometry, ImageScaler, Placement };

// vim: expandtab:shiftwidth=2:tabstop=2
