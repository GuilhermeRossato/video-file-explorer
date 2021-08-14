const express = require("express");
const { openBrowser } = require("./openBrowser.js");

const app = express();

app.use(express.static("frontend/public"));

const listener = app.listen(0, async function() {
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