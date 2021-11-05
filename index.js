"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Placement = exports.ImageScaler = void 0;
const child_process_1 = __importDefault(require("child_process"));
/**
 * Algorithm which resizes the image to fit into the placement
 */
var ImageScaler;
(function (ImageScaler) {
    /**
     * Crops out an area of the size of the placement size.
     */
    ImageScaler["crop"] = "crop";
    /**
     * Distorts the image to the placement size.
     */
    ImageScaler["distort"] = "distort";
    /**
     * Resizes the image that either the width matches the maximum width or the height matches the maximum height while keeping the image ratio.
     */
    ImageScaler["fit_contain"] = "fit_contain";
    /**
     * Resizes the image to a size <= the placement size while keeping the image ratio.
     */
    ImageScaler["contain"] = "contain";
    /**
     * Resizes the image to cover the entire area which should be filled while keeping the image ratio.
     * If the image is smaller than the desired size it will be stretched to reach the desired size.
     * If the ratio of the area differs from the image ratio the edges will be cut off.
     */
    ImageScaler["forced_cover"] = "forced_cover";
    /**
     * The same as forced_cover but images won't be stretched if they are smaller than the area which should be filled.
     */
    ImageScaler["cover"] = "cover";
})(ImageScaler || (ImageScaler = {}));
exports.ImageScaler = ImageScaler;
class Placement {
    constructor(identifier, path = "", geometry = {}, scaler = ImageScaler.crop, debug = false) {
        this._geometry = {};
        this._scaler = ImageScaler.crop;
        this._identifier = identifier;
        this._debug = debug;
        this._path = path;
        this.geometry = geometry;
        this._scaler = scaler;
        this._debug = debug;
        this._process = child_process_1.default.spawn("ueberzug", ["layer"]);
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
     * Ueberzug identifier
     */
    get identifier() {
        return this._identifier;
    }
    /**
     * Placement geometry
     */
    get geometry() {
        var _a, _b, _c, _d, _e, _f;
        let geom = {
            x: (_a = this._geometry.x) !== null && _a !== void 0 ? _a : 0,
            y: (_b = this._geometry.y) !== null && _b !== void 0 ? _b : 0,
            width: (_c = this._geometry.width) !== null && _c !== void 0 ? _c : 0,
            height: (_d = this._geometry.height) !== null && _d !== void 0 ? _d : 0,
            scaling_position_x: (_e = this._geometry.scaling_position_x) !== null && _e !== void 0 ? _e : 0,
            scaling_position_y: (_f = this._geometry.scaling_position_y) !== null && _f !== void 0 ? _f : 0,
        };
        return geom;
    }
    set geometry(value) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        let geom = {
            x: Math.floor((_b = (_a = value.x) !== null && _a !== void 0 ? _a : this._geometry.x) !== null && _b !== void 0 ? _b : 0),
            y: Math.floor((_d = (_c = value.y) !== null && _c !== void 0 ? _c : this._geometry.y) !== null && _d !== void 0 ? _d : 0),
            width: Math.floor((_f = (_e = value.width) !== null && _e !== void 0 ? _e : this._geometry.width) !== null && _f !== void 0 ? _f : 0),
            height: Math.floor((_h = (_g = value.height) !== null && _g !== void 0 ? _g : this._geometry.height) !== null && _h !== void 0 ? _h : 0),
            scaling_position_x: Math.floor((_k = (_j = value.scaling_position_x) !== null && _j !== void 0 ? _j : this._geometry.scaling_position_x) !== null && _k !== void 0 ? _k : 0),
            scaling_position_y: Math.floor((_m = (_l = value.scaling_position_y) !== null && _l !== void 0 ? _l : this._geometry.scaling_position_y) !== null && _m !== void 0 ? _m : 0),
        };
        this._geometry = geom;
    }
    /**
     * Path to image
     */
    get path() {
        return this._path;
    }
    set path(value) {
        this._path = value;
    }
    /**
     * Algorithm which resizes the image to fit into the placement
     */
    get scaler() {
        return this._scaler;
    }
    set scaler(value) {
        this._scaler = value;
    }
    /**
     * Draws/adds the image to the screen
     * `action = add`
     */
    draw() {
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
    hide() {
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
    move(x, y, relative = false) {
        if (relative)
            this.geometry = {
                x: this.geometry.x + (x !== null && x !== void 0 ? x : 0),
                y: this.geometry.y + (y !== null && y !== void 0 ? y : 0),
            };
        else
            this.geometry = { x, y };
        this.draw();
    }
}
exports.Placement = Placement;
// vim: expandtab:shiftwidth=2:tabstop=2
