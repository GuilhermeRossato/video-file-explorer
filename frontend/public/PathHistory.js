var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function removeTrailingSlash(path) {
  if (path === "/") {
    return path;
  }
  if (path[path.length - 1] === "/" || path[path.length - 1] === "\\") {
    return path.substring(0, path.length - 1);
  }
  return path;
}

var PathHistory = function () {
  /**
   * @param {string} startPath
   */
  function PathHistory(startPath) {
    _classCallCheck(this, PathHistory);

    this.state = {};
    this.state.index = 0;
    this.state.historyList = [removeTrailingSlash(startPath)];
  }

  _createClass(PathHistory, [{
    key: "canGoForward",
    value: function canGoForward() {
      return !!this.state.historyList[this.state.index + 1];
    }
  }, {
    key: "canGoBack",
    value: function canGoBack() {
      return !!this.state.historyList[this.state.index - 1];
    }
  }, {
    key: "goForward",
    value: function goForward() {
      if (!this.state.canGoForward()) {
        throw new Error("Cannot go forward");
      }
      this.state.index++;
    }
  }, {
    key: "goBack",
    value: function goBack() {
      if (!this.state.canGoBack()) {
        throw new Error("Cannot go forward");
      }
      this.state.index--;
    }
  }, {
    key: "push",
    value: function push(path) {
      var treatedPath = removeTrailingSlash(path);
      if (this.state.historyList[this.state.index] === treatedPath) {
        return;
      }
      var isAtEnd = this.state.index + 1 === this.state.historyList.length;
      if (isAtEnd) {
        this.state.historyList.push(treatedPath);
        this.state.index++;
        return;
      }
      this.state.historyList = this.state.historyList.slice(0, this.state.index + 1);
      this.state.historyList.push(treatedPath);
      this.state.index++;
    }
  }, {
    key: "getCurrentPath",
    value: function getCurrentPath() {
      return this.state.historyList[this.state.index];
    }
  }]);

  return PathHistory;
}();

export default PathHistory;