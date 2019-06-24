const express = require("express");
const axios = require("axios");
const cron = require("node-cron");
const fs = require("fs");

const app = express();

// Call End-points routers
const router = require("./routers/router");

app.use(express.json());
app.use(router);

var timer = 1;
// schedule tasks to be run on the server
cron.schedule("* * * * *", function() {
  axios
    .get(`https://reqres.in/api/users?page=${timer++}`)
    .then(response => {
      console.log(response);
      fs.appendFile(
        "users.json",
        JSON.stringify(response.data.data),
        "utf8",
        err => {
          if (err) throw err;
          console.log("File written to...");
        }
      );
    })
    .catch(error => {
      console.log(error);
    });
});

const PORT = 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}.`);
});
