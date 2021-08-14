import React, { useState, Dispatch, SetStateAction, FC, ReactElement } from 'react';
import NavigationBar from './NavigationBar';

type FileInfo = {
    name: string;
    path: string;
    mtime: Date;
}

interface Props {
    getFilesInPath: (path: string) => Promise<FileInfo[]>;
}

const FileExplorer: FC<Props> = (props): ReactElement => {
    const [currentInputPath, setCurrentInputPath] = useState("C:/");
    const [historyList, setHistoryList] = useState<string[]>([]);
    const [index, setIndex] = useState(0);

    props.getFilesInPath("hello");

    return (
        <div className="file-explorer">
            <NavigationBar
                currentPath={currentInputPath}
                onTextChange={text => setCurrentInputPath(text)}
                canGoBack={canGoBack(historyList, index)}
                canGoForward={canGoForward(historyList, index)}
                canShowHistory={canShowHistory(historyList)}
                pushToHistory={() => {
                    pushToHistory(historyList, index, setHistoryList, setIndex, currentInputPath);
                }}
                goBack={() => {
                    goBack(historyList, index, setIndex, setCurrentInputPath);
                }}
                goForward={() => {
                    goForward(historyList, index, setIndex, setCurrentInputPath);
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

function goForward(historyList: string[], index: number, setIndex: Dispatch<SetStateAction<number>>, setInputPath: Dispatch<SetStateAction<string>>) {
    if (!canGoForward(historyList, index)) {
        throw new Error("Cannot go forward");
    }
    setIndex(index + 1);
    setInputPath(historyList[index + 1]);
}

function goBack(historyList: string[], index: number, setIndex: Dispatch<SetStateAction<number>>, setInputPath: Dispatch<SetStateAction<string>>) {
    if (!canGoBack(historyList, index)) {
        throw new Error("Cannot go forward");
    }
    setIndex(index - 1);
    setInputPath(historyList[index - 1]);
}

function pushToHistory(historyList: string[], index: number, setHistoryList: Dispatch<SetStateAction<string[]>>, setIndex: Dispatch<SetStateAction<number>>, path: string) {
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

function getCurrentPath(historyList: string[], index: number) {
    return historyList[index];
}


export default FileExplorer;

