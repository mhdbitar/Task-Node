const download = require("image-downloader");
const fs = require("fs");

const readImageBase64 = image => {
  // read binary data
  var bitmap = fs.readFileSync(image);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString("base64");
};

module.exports = readImageBase64;
