const express = require("express");
const { openBrowser } = require("./openBrowser.js");

const app = express();

app.use(express.static("frontend/public"));

app.options("*", function(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end();
})

app.post("/api/read/", function(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const chunks = [];

  req.on("data", function(data) {
    chunks.push(data);
  })
  req.on("end", function() {
    const path = Buffer.concat(chunks).toString("utf8");

    res.status(200).json({
      files: [
        {
          path,
          name: "hello world.mp4",
          mtime: new Date()
        },
        {
          path,
          name: "hello file.mp4",
          mtime: new Date()
        }
      ]
    });
  });
});

const listener = app.listen(0, async function() {
  const { address, family, port } = listener.address();

  const link = family === "IPv6" ? `http://[${address === "::" ? "::1" : address}]:${port}/` : `http://${address}:${port}/`;

  console.log("Server started at: " + link);
  /*
  try {
    await openBrowser(link);
  } catch (err) {
    console.log(err.message);
    console.log("Open link manually by entering the following on your browser:");
    console.log(link);
  }
  */
});