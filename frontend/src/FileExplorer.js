import NavigationBar from "./NavigationBar.js"
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

function goForward(historyList, index, setIndex, setInputPath) {
  if (!canGoForward(historyList, index)) {
    throw new Error("Cannot go forward");
  }
  setIndex(index + 1);
  setInputPath(historyList[index + 1]);
}

function goBack(historyList, index, setIndex, setInputPath) {
  if (!canGoBack(historyList, index)) {
    throw new Error("Cannot go forward");
  }
  setIndex(index - 1);
  setInputPath(historyList[index - 1]);
}

function pushToHistory(historyList, index, setHistoryList, setIndex, path) {
  const treatedPath = removeTrailingSlash(path);
  if (historyList[index] === treatedPath) {
    return;
  }
  const isAtEnd = index + 1 === historyList.length;
  if (isAtEnd) {
    setHistoryList([
      ...historyList,
      treatedPath
    ]);
    setIndex(index + 1);
    return;
  }
  setHistoryList([
    ...historyList.slice(0, index + 1),
    treatedPath
  ]);
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

const FileExplorer = () => {
  const [historyList, setHistoryList] = React.useState([]);
  const [inputPath, setInputPath] = React.useState("C:/");
  const [index, setIndex] = React.useState(0);

  return (
    <NavigationBar
      currentPath={getCurrentPath(historyList, index)}
      canGoBack={canGoBack(historyList, index)}
      canGoForward={canGoForward(historyList, index)}
      pushToHistory={(path) => {
        pushToHistory(historyList, index, setHistoryList, setIndex, path);
      }}
      goBack={() => {
        goBack(historyList, index, setIndex, setInputPath);
      }}
      goForward={() => {
        goForward(historyList, index, setIndex, setInputPath);
      }}
      inputPath={inputPath}
      setInputPath={setInputPath}
    />
  )
}

export default FileExplorer;