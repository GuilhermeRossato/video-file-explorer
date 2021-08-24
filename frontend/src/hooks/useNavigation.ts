import { useState } from 'react';
import { removeTrailingSlash } from '../helpers/removeTrailingSlash';
import { dirname } from "path";

export interface NavigationProps {
    historyList: string[];
    pushToHistory: (path: string) => void;
    selectFromHistory: (index: number) => string;
    canGoForward: boolean;
    canGoBack: boolean;
    canGoUp: boolean;
    goForward: () => string;
    goBack: () => string;
    goUp: () => string;
}

export function useNavigation(
    currentInputPath: string,
    changeInputText: (path: string) => void,
    commitPath: (path: string) => void
): NavigationProps {
    const [historyList, setHistoryList] = useState<string[]>([currentInputPath]);
    const [index, setIndex] = useState(0);

    function pushToHistory(path: string) {
        const treatedPath = removeTrailingSlash(path);
        if (historyList[index] === treatedPath) {
            return;
        }
        const newHistoryList = [
            ...historyList.slice(0, index + 1),
            treatedPath
        ];
        changeInputText(path);
        commitPath(path);
        setHistoryList(newHistoryList);
        setIndex(index + 1);
    }

    const canGoForward = (function checkCanGoForward() {
        return !!historyList[index + 1];
    })();

    const canGoBack = (function checkCanGoBack() {
        return !!historyList[index - 1];
    })();

    function checkCanGoUp() {
        if (!historyList[index]) {
            return false;
        }
        if (historyList[index].length > 3 && historyList[index].substr(1, 2) === ":/") {
            return true;
        }
        return (historyList[index].split("\\").join("/").split("/").length > 2)
    }

    const canGoUp = checkCanGoUp();

    function goForward() {
        if (!historyList[index + 1]) {
            throw new Error("Cannot go forward");
        }
        setIndex(index + 1);
        changeInputText(historyList[index + 1]);
        commitPath(historyList[index + 1]);
        return historyList[index + 1];
    }

    function goBack() {
        if (!historyList[index - 1]) {
            throw new Error("Cannot go back");
        }
        changeInputText(historyList[index - 1]);
        commitPath(historyList[index - 1]);
        setIndex(index - 1);
        return historyList[index - 1];
    }

    function goUp() {
        if (!checkCanGoUp()) {
            throw new Error("Cannot go forward");
        }
        let newPath = dirname(historyList[index].split("\\").join("/"));
        if (newPath.length === 2 && newPath[1] === ":") {
            newPath += "/";
        }
        pushToHistory(newPath);
        return newPath;
    }

    function selectFromHistory(index: number) {
        if (index < 0 || index >= historyList.length) {
            throw new Error("Cannot go to index " + index + " because its out of bounds (0 ~ " + historyList.length + ")");
        }
        setIndex(index);
        changeInputText(historyList[index]);
        commitPath(historyList[index]);
        return historyList[index];
    }

    return {
        historyList,
        pushToHistory,
        selectFromHistory,
        canGoForward,
        canGoBack,
        canGoUp,
        goForward,
        goBack,
        goUp,
    }
}