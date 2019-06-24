const download = require("image-downloader");

const downloadAvatar = options => {
  download
    .image(options)
    .then(({ filename, image }) => {
      console.log("File Saved."), filename;
    })
    .catch(error => {
      console.log(error);
    });
};

module.exports = downloadAvatar;
