const os = require("os");
const cp = require("child_process");

function openBrowser(link, retry = 0) {
  return new Promise((resolve, reject) => {
    const plat = os.platform();
    let command = "open";
    if (retry === 0) {
      if (plat === "win32") {
        command = "start";
      } else if (plat !== "darvin") {
        command = "xdg-open";
      } else {
        command = "open";
      }
    } else if (retry === 1) {
      if (plat === "win32") {
        command = "xdg-open";
      } else if (plat !== "darvin") {
        command = "open";
      } else {
        command = "start";
      }
    } else if (retry === 2) {
      if (plat === "win32") {
        command = "xdg-open";
      } else if (plat !== "darvin") {
        command = "open";
      } else {
        command = "start";
      }
    } else {
      return reject(new Error("Could not open browser with url: " + link));
    }
    const child = cp.spawn(
      command,
      [link],
      {
        shell: true,
        env: undefined,
        detached: true,
        stdio: ['ignore', 'ignore', 'ignore']
      });

    const exitTimeout = setTimeout(() => {
      if (child && child.unref) {
        child.unref();
      }
      resolve();
    }, 1000);

    child.on("close", (err) => {
      clearTimeout(exitTimeout);
      if (err === 0) {
        resolve();
      } else if (retry + 1 > 2) {
        reject(new Error("Could not open browser with url: " + link));
      } else {
        openBrowser(link, retry + 1).then(resolve).catch(reject);
      }
    });

    child.on("error", function (err) {
      clearTimeout(exitTimeout);
      if (retry + 1 > 2) {
        reject(new Error("Could not open browser with url: " + link + " because of error: " + err.message));
      } else {
        openBrowser(link, retry + 1).then(resolve).catch(reject);
      }
    });
  });
}
exports.openBrowser = openBrowser;
