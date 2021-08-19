import React, { useState, Dispatch, SetStateAction, FC, ReactElement } from 'react';
import NavigationBar from './NavigationBar';
import { dirname } from "path";

interface Props {
    changeCurrentPath: (path: string) => void;
    defaultCurrentPath: string
}

const NavigationBarWrapper: FC<Props> = (props): ReactElement => {
    const [currentInputPath, setCurrentInputPath] = useState(props.defaultCurrentPath);
    const [historyList, setHistoryList] = useState<string[]>([props.defaultCurrentPath]);
    const [index, setIndex] = useState(0);
    const [showingHistory, setShowHistory] = useState(false);

    return (
        <div className="navigation-bar-wrapper">
            <NavigationBar
                currentPath={currentInputPath}
                onTextChange={(text: string) => setCurrentInputPath(text)}

                canGoBack={canGoBack(historyList, index)}
                canGoForward={canGoForward(historyList, index)}
                canGoUp={canGoUp(historyList, index)}

                canShowHistory={canShowHistory(historyList)}
                isShowingHistory={showingHistory}
                toggleHistory={() => setShowHistory(!showingHistory)}
                historyList={historyList}

                pushToHistory={() => {
                    pushToHistory(historyList, index, setHistoryList, setIndex, currentInputPath);
                    props.changeCurrentPath(currentInputPath);
                }}
                goBack={() => {
                    const newPath = goBack(historyList, index, setIndex, setCurrentInputPath);
                    props.changeCurrentPath(newPath);
                }}
                goForward={() => {
                    const newPath = goForward(historyList, index, setIndex, setCurrentInputPath);
                    props.changeCurrentPath(newPath);
                }}
                goUp={() => {
                    const newPath = goUp(historyList, index, setIndex, setCurrentInputPath, setHistoryList);
                    props.changeCurrentPath(newPath);
                }}
                selectFromHistory={(index: number) => {
                    const newPath = selectFromHistory(historyList, index, setIndex, setCurrentInputPath);
                    props.changeCurrentPath(newPath);
                }}
            ></NavigationBar>
        </div>
    );
}

function canShowHistory(historyList: string[]) {
    return historyList.length > 0;
}

function removeTrailingSlash(path: string) {
    if (!path) {
        throw new Error("Invalid path");
    }
    if (path === "/") {
        return path;
    }
    if (path[path.length - 1] === "/" || path[path.length - 1] === "\\") {
        // Check to avoid removing trailing when its root url on Windows
        if (path.length === 3 && path[1] === ":") {
            return path;
        }
        return path.substring(0, path.length - 1);
    }
    return path;
}

function canGoForward(historyList: string[], index: number) {
    return !!historyList[index + 1];
}

function canGoBack(historyList: string[], index: number) {
    return !!historyList[index - 1];
}

function canGoUp(historyList: string[], index: number) {
    if (historyList[index].length > 3 && historyList[index].substr(1, 2) === ":/") {
        return true;
    }
    return (historyList[index].split("/").length > 2)
}

function selectFromHistory(historyList: string[], index: number, setIndex: Dispatch<SetStateAction<number>>, setInputPath: Dispatch<SetStateAction<string>>) {
    if (index < 0 || index >= historyList.length) {
        throw new Error("Cannot go to index " + index + " because its out of bounds (0 ~ " + historyList.length + ")");
    }
    setIndex(index);
    setInputPath(historyList[index]);
    return historyList[index];
}

function goForward(historyList: string[], index: number, setIndex: Dispatch<SetStateAction<number>>, setInputPath: Dispatch<SetStateAction<string>>) {
    if (!canGoForward(historyList, index)) {
        throw new Error("Cannot go forward");
    }
    setIndex(index + 1);
    setInputPath(historyList[index + 1]);
    return historyList[index + 1];
}

function goBack(historyList: string[], index: number, setIndex: Dispatch<SetStateAction<number>>, setInputPath: Dispatch<SetStateAction<string>>) {
    if (!canGoBack(historyList, index)) {
        throw new Error("Cannot go back");
    }
    setInputPath(historyList[index - 1]);
    setIndex(index - 1);
    return historyList[index - 1];
}

function goUp(historyList: string[], index: number, setIndex: Dispatch<SetStateAction<number>>, setInputPath: Dispatch<SetStateAction<string>>, setHistoryList: Dispatch<SetStateAction<string[]>>) {
    if (!canGoUp(historyList, index)) {
        throw new Error("Cannot go forward");
    }
    let newPath = dirname(historyList[index]);
    if (newPath.length === 2 && newPath[1] === ":") {
        newPath += "/";
    }
    setInputPath(newPath);
    pushToHistory(historyList, index, setHistoryList, setIndex, newPath);
    return newPath;
}

function pushToHistory(historyList: string[], index: number, setHistoryList: Dispatch<SetStateAction<string[]>>, setIndex: Dispatch<SetStateAction<number>>, path: string) {
    const treatedPath = removeTrailingSlash(path);
    if (historyList[index] === treatedPath) {
        return;
    }
    const newHistoryList = [
        ...historyList.slice(0, index + 1),
        treatedPath
    ];
    setHistoryList(newHistoryList);
    setIndex(index + 1);
}


export default NavigationBarWrapper;

