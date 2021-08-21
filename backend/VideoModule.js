const cp = require("child_process");

function getVideoMetadata(filePath) {
  return new Promise((resolve, reject) => {
    if (filePath.includes("&") || filePath.includes(";") || filePath.includes("`") || filePath.includes("'") || filePath.includes("\"") || filePath.includes("|") || filePath.includes("*") || filePath.includes("?") || filePath.includes("~") || filePath.includes("<") || filePath.includes(">") || filePath.includes("^") || filePath.includes("(") || filePath.includes(")") || filePath.includes("[") || filePath.includes("]") || filePath.includes("{") || filePath.includes("}") || filePath.includes("$") || filePath.includes("\n") || filePath.includes("\r")) {
      return reject(new Error("Invalid filename"));
    }
    cp.exec(
      [
        "ffprobe",
        "-v",
        "quiet",
        "-of",
        "csv=p=0",
        "-show_entries",
        "format=duration",
        "-show_entries",
        "stream=width,height",
        "\"" + filePath + "\""
      ].join(" "),
      {
        shell: true,
        timeout: 1000
      },
      function(err, stdout, stderr) {
        if (err) {
          if (err.code === "ENOENT") {
            reject(new Error("ffprobe was not found in your system"));
          } else {
            reject(err);
          }
          return;
        }

        if (stderr) {
          reject(new Error(stderr.toString("utf8")));
        } else {
          let outputText = stdout.toString("utf8").replace(/\s+/g, ",");
          if (outputText[0] === ",") {
            outputText = outputText.substr(1);
          }
          const [width, height, duration] = outputText.split(",").map(value => parseFloat(value));
          resolve({duration, width, height});
        }
      }
    );
  });
}

exports.getVideoMetadata = getVideoMetadata;