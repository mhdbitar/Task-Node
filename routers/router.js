const express = require("express");
const axios = require("axios");
const downloadAvatar = require("../helpers/downloadAvatar");
const readImageBase64 = require("../helpers/readImageBase64");
const fs = require("fs");
const rimraf = require("rimraf");

const router = new express.Router();

// First End-point
router.get("/api/user/:id", async (req, res) => {
  let id = req.params.id;

  try {
    getUser(id)
      .then(user => {
        if (!user) {
          throw new Error("User does not exsit.");
        }
        res.send({ success: true, data: user, error: "" });
      })
      .catch(error => {
        throw new Error(error);
      });
  } catch (error) {
    res.status(400).send();
  }
});

const getUser = async id => {
  let user = await axios.get(`https://reqres.in/api/users/${id}`);

  return user.data.data;
};

// Send End-point
router.get("/api/user/:id/avatar", async (req, res) => {
  let id = req.params.id;
  let imagePath = "images/" + id;
  if (fs.existsSync(imagePath)) {
    fs.readdir(imagePath, (err, files) => {
      let name = files[0];
      let imageBase64 = readImageBase64(imagePath + "/" + name);
      res.send({ success: true, data: imageBase64, error: "" });
    });
  } else {
    downloadImage(id)
      .then(res => {
        res.send({
          success: true,
          data: "Images addedd successfully to the file system",
          error: ""
        });
      })
      .catch(error => {
        res.status(400).send({ success: false, data: null, error: error });
      });
  }
});

const downloadImage = id => {
  return new Promise((resolve, reject) => {
    try {
      let dir = "images/" + id;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      getUser(id)
        .then(user => {
          if (!user) {
            throw new Error("User does not exist");
          }

          let avatarUrl = user.avatar;
          const options = {
            url: avatarUrl,
            dest: "images/" + id + "/"
          };
          downloadAvatar(options);
        })
        .catch(error => {
          throw new Error(error);
        });

      resolve(true);
    } catch (error) {
      reject(dalse);
    }
  });
};

router.delete("/api/user/:id/avatar", async (req, res) => {
  let id = req.params.id;
  let imagePath = "images/" + id;

  try {
    if (fs.existsSync(imagePath)) {
      fs.readdir(imagePath, (err, files) => {
        let name = files[0];
        fs.unlink(imagePath + "/" + name, err => {
          throw new Error(error);
        });
        rimraf.sync(imagePath);
        res.send({ success: true, data: "Image deleted", error: "" });
      });
    } else {
      downloadImage(id)
        .then(res => {
          res.send({
            success: true,
            data: "Images addedd successfully to the file system",
            error: ""
          });
        })
        .catch(error => {
          res.status(400).send({ success: false, data: null, error: error });
        });
    }
  } catch (error) {
    res.status(400).send();
  }
});

module.exports = router;
