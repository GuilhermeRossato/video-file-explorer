var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import NavigationBar from "./NavigationBar.js";
// import PathHistory from "./PathHistory.js"

function removeTrailingSlash(path) {
  if (!path) {
    throw new Error("Invalid path");
  }
  if (path === "/") {
    return path;
  }
  if (path[path.length - 1] === "/" || path[path.length - 1] === "\\") {
    return path.substring(0, path.length - 1);
  }
  return path;
}

function canGoForward(historyList, index) {
  return !!historyList[index + 1];
}

function canGoBack(historyList, index) {
  return !!historyList[index - 1];
}

function _goForward(historyList, index, setIndex, setInputPath) {
  if (!canGoForward(historyList, index)) {
    throw new Error("Cannot go forward");
  }
  setIndex(index + 1);
  setInputPath(historyList[index + 1]);
}

function _goBack(historyList, index, setIndex, setInputPath) {
  if (!canGoBack(historyList, index)) {
    throw new Error("Cannot go forward");
  }
  setIndex(index - 1);
  setInputPath(historyList[index - 1]);
}

function _pushToHistory(historyList, index, setHistoryList, setIndex, path) {
  var treatedPath = removeTrailingSlash(path);
  if (historyList[index] === treatedPath) {
    return;
  }
  var isAtEnd = index + 1 === historyList.length;
  if (isAtEnd) {
    setHistoryList([].concat(_toConsumableArray(historyList), [treatedPath]));
    setIndex(index + 1);
    return;
  }
  setHistoryList([].concat(_toConsumableArray(historyList.slice(0, index + 1)), [treatedPath]));
  setIndex(index + 1);
}

function getCurrentPath(historyList, index) {
  return historyList[index];
}

/*
function setCurrentPath(historyList, index, setHistoryList, path) {
  const newHistoryList = [];
  for (let i = 0; i < historyList.length; i++) {
    if (index === i) {
      newHistoryList.push(path);
    } else {
      newHistoryList.push(historyList[i]);
    }
  }
  setHistoryList(newHistoryList);
}
*/

var FileExplorer = function FileExplorer() {
  var _React$useState = React.useState([]),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      historyList = _React$useState2[0],
      setHistoryList = _React$useState2[1];

  var _React$useState3 = React.useState("C:/"),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      inputPath = _React$useState4[0],
      setInputPath = _React$useState4[1];

  var _React$useState5 = React.useState(0),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      index = _React$useState6[0],
      setIndex = _React$useState6[1];

  return React.createElement(NavigationBar, {
    currentPath: getCurrentPath(historyList, index),
    canGoBack: canGoBack(historyList, index),
    canGoForward: canGoForward(historyList, index),
    pushToHistory: function pushToHistory(path) {
      _pushToHistory(historyList, index, setHistoryList, setIndex, path);
    },
    goBack: function goBack() {
      _goBack(historyList, index, setIndex, setInputPath);
    },
    goForward: function goForward() {
      _goForward(historyList, index, setIndex, setInputPath);
    },
    inputPath: inputPath,
    setInputPath: setInputPath
  });
};

export default FileExplorer;