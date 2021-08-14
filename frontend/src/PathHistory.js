function removeTrailingSlash(path) {
  if (path === "/") {
    return path;
  }
  if (path[path.length - 1] === "/" || path[path.length - 1] === "\\") {
    return path.substring(0, path.length - 1);
  }
  return path;
}

class PathHistory {
  /**
   * @param {string} startPath
   */
  constructor(startPath) {
    this.state = {};
    this.state.index = 0;
    this.state.historyList = [removeTrailingSlash(startPath)];
  }

  canGoForward() {
    return !!this.state.historyList[this.state.index + 1];
  }

  canGoBack() {
    return !!this.state.historyList[this.state.index - 1];
  }

  goForward() {
    if (!this.state.canGoForward()) {
      throw new Error("Cannot go forward");
    }
    this.state.index++;
  }

  goBack() {
    if (!this.state.canGoBack()) {
      throw new Error("Cannot go forward");
    }
    this.state.index--;
  }

  push(path) {
    const treatedPath = removeTrailingSlash(path);
    if (this.state.historyList[this.state.index] === treatedPath) {
      return;
    }
    const isAtEnd = this.state.index + 1 === this.state.historyList.length;
    if (isAtEnd) {
      this.state.historyList.push(treatedPath);
      this.state.index++;
      return;
    }
    this.state.historyList = this.state.historyList.slice(0, this.state.index + 1);
    this.state.historyList.push(treatedPath);
    this.state.index++;
  }

  getCurrentPath() {
    return this.state.historyList[this.state.index];
  }
}

export default PathHistory;