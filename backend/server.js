const fs = require("fs");
const fsp = fs.promises;
const path = require("path");
const cp = require("child_process");
const serverPort = 8081;

if (!fs.existsSync(path.resolve(__dirname, "..", "node_modules"))) {
  console.log("\n > Installing backend dependencies\n");

  cp.execSync(
    "npm install --only=production",
    {
      cwd: path.resolve(__dirname, ".."),
      stdio: 'inherit'
    }
  );
}

const frontendPath = path.resolve(__dirname, '..', 'frontend');

if (!fs.existsSync(path.resolve(__dirname, "..", "frontend", "node_modules"))) {
  console.log("\n > Installing frontend dependencies\n");

  cp.execSync(
    "npm install --only=production",
    {
      cwd: frontendPath,
      stdio: 'inherit'
    }
  );
}

if (!fs.existsSync(path.resolve(__dirname, "..", "frontend", "build"))) {
  console.log("\n > Building react frontend\n");

  cp.execSync(
    "npm run build",
    {
      cwd: frontendPath,
      stdio: 'inherit'
    }
  );
}

console.log("\n > Starting backend server\n");

const express = require("express");
const { openBrowser } = require("./openBrowser.js");
const { getVideoMetadata } = require("./VideoModule.js");

const frontendBuildPath = path.resolve(__dirname, '..', 'frontend', 'build');

const app = express();

app.use(express.static(frontendBuildPath));

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.options("*", function(req, res) {
  res.end();
});

app.post("/api/get-video-metadata/", function(req, res) {
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
  const chunks = [];

  req.on("data", function(data) {
    chunks.push(data);
  });
  req.on("end", async function() {
    const targetPath = Buffer.concat(chunks).toString("utf8");

    let files;
    try {
      files = await fsp.readdir(targetPath);
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
        const stats = await fsp.stat(fullPath);

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

app.get("/api/cwd/", function(req, res) {
  res.json({
    cwd: process.cwd()
  });
});

app.get("/", function(req, res) {
  const indexHtmlPath = path.resolve(frontendBuildPath, "index.html");
  res.sendFile(indexHtmlPath);
});

const listener = app.listen(serverPort, async function() {
  const { address, family, port } = listener.address();

  const link = family === "IPv6" ? `http://[${address === "::" ? "::1" : address}]:${port}/` : `http://${address}:${port}/`;

  try {
    await openBrowser(link);
  } catch (err) {
    console.log(err.message);
    console.log("Open link manually by entering the following on your browser:");
    console.log(link);
  }
});
