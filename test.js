const ueberzug = require(".");

let gruv_img = new ueberzug.Placement(
  "gruv",
  "/home/jezer/Imágenes/gruvbox_street.png",
  { width: 30 },
  ueberzug.ImageScaler.contain
);

gruv_img.draw();

for (let i = 0; i < 30; i++) {
  gruv_img.move(1, 1, true);
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
      gruv_img.move(0, 1, true);
    } else if (keys[2] == 65) {
      // Up
      gruv_img.move(0, -1, true);
    } else if (keys[2] == 68) {
      // Left
      gruv_img.move(-1, 0, true);
    } else if (keys[2] == 67) {
      // Right
      gruv_img.move(1, 0, true);
    }
  } else if (keys[0] == 106) {
    // 'j' key
    gruv_img.move(0, 1, true);
  } else if (keys[0] == 107) {
    // 'k' key
    gruv_img.move(0, -1, true);
  } else if (keys[0] == 104) {
    // 'h' key
    gruv_img.move(-2, 0, true);
  } else if (keys[0] == 108) {
    // 'l' key
    gruv_img.move(2, 0, true);
  }
});
