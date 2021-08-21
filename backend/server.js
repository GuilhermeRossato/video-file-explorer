const express = require("express");
const { openBrowser } = require("./openBrowser.js");
const { getVideoMetadata } = require("./VideoModule.js");
const fs = require("fs").promises;
const path = require("path");

const app = express();

app.use(express.static("frontend/public"));

app.options("*", function(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end();
})

app.post("/api/get-video-metadata/", function(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const chunks = [];

  req.on("data", function(data) {
    chunks.push(data);
  })
  req.on("end", async function() {
    const targetPath = Buffer.concat(chunks).toString("utf8");
    try {
      const metadata = await getVideoMetadata(targetPath);
      res.json(metadata);
    } catch (err) {
      res.status(500).json({
        error: err.message,
        stack: err.stack
      });
    }
  });
});

app.post("/api/read/", function(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const chunks = [];

  req.on("data", function(data) {
    chunks.push(data);
  })
  req.on("end", async function() {
    const targetPath = Buffer.concat(chunks).toString("utf8");

    let files;
    try {
      files = await fs.readdir(targetPath);
    } catch (err) {
      if (err.code === "ENOENT") {
        return res.status(500).json({
          error: "Path not found"
        });
      }
      res.status(500).json({
        error: err.message
      });
      return;
    }

    const result = await Promise.all(files.map(async (file) => {
      const fullPath = path.resolve(targetPath, file);
      try {
        const stats = await fs.stat(fullPath);

        return {
          path: targetPath,
          name: file,
          mtime: stats.mtime,
          type: stats.isDirectory() ? "dir" : "file",
          size: stats.size
        }
      } catch (err) {
        return {
          path: targetPath,
          name: file,
          mtime: null,
          type: "error",
          message: err.message
        }
      }
    }))

    res.status(200).json({
      files: result
    });
  });
});

app.get("/", function(req, res) {
  res.end("Seja bem vindo");
});

const listener = app.listen(9090, async function() {
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