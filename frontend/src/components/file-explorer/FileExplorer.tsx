import React, { FC, ReactElement, useState, useEffect, useRef } from 'react';
import NavigationBarWrapper from './NavigationBarWrapper';
import { Folder, RefreshRounded, InsertDriveFileOutlined, Error as ErrorIcon } from '@material-ui/icons';
import { IconButton, Table, TableHead, TableBody, TableCell, TableRow, TableSortLabel } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { ClientFileInfo, readFolderContents } from '../../adapters/FileSystemAdapter';
import { getVideoMetadata, getVideoTypeFromFilename } from '../../adapters/VideoAdapter';
import { getHumanReadablePeriod } from '../../helpers/getHumanReadablePeriod';
import { getHumanReadableSize } from '../../helpers/getHumanReadableSize';
import { useNavigation, NavigationProps } from '../../hooks/useNavigation';
import "./FileExplorer.css";

interface Props {
    defaultCurrentPath: string;
    onSelectFile: (str: string) => void;
}

interface FileInfoMetadata extends ClientFileInfo {
    videoType?: string,
    metadata?: string | {
        duration: number;
        width: number;
        height: number;
    } | null
}

const FileExplorer: FC<Props> = (props): ReactElement => {
    const defaultCurrentPath = props.defaultCurrentPath.split("\\").join("/");
    const [currentInputPath, setCurrentInputPath] = useState(defaultCurrentPath);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingPath, setLoadingPath] = useState(defaultCurrentPath);
    const [errorMessage, setErrorMessage] = useState("");
    const [fileList, setFileList] = useState<FileInfoMetadata[]>([]);
    const [ordering, setOrdering] = useState<{column: string, order: "asc" | "desc"}>({column: "name", order: "asc"});

    const currentPath = useRef("");
    currentPath.current = loadingPath;

    useEffect(() => {
        loadPath(currentPath, setIsLoading, setLoadingPath, setErrorMessage, setFileList, defaultCurrentPath)
    }, [defaultCurrentPath]);

    function onRefreshClick() {
        setErrorMessage("");
        loadPath(currentPath, setIsLoading, setLoadingPath, setErrorMessage, setFileList, loadingPath);
    }

    function onSortLabelClick(column: string) {
        return setOrdering({
            column: column,
            order: (ordering.column === column) ? (ordering.order === "asc" ? "desc" : "asc") : "asc"
        });
    }

    function commitPath(path: string) {
        setErrorMessage("");
        setCurrentInputPath(path);
        loadPath(currentPath, setIsLoading, setLoadingPath, setErrorMessage, setFileList, path);
    }

    const navigation: NavigationProps = useNavigation(
        currentInputPath,
        setCurrentInputPath,
        commitPath
    );

    return (
        <div className="file-explorer">
            <div className="file-explorer-top">
                <NavigationBarWrapper
                    navigation={navigation}
                    currentInputPath={currentInputPath}
                    setCurrentInputPath={setCurrentInputPath}
                />
            </div>
            {
                renderContent(
                    errorMessage,
                    isLoading,
                    fileList,
                    ordering,
                    onRefreshClick,
                    onSortLabelClick,
                    navigation.pushToHistory,
                    props.onSelectFile
                )
            }
        </div>
    );
}

function renderContent(
    errorMessage: string,
    isLoading: boolean,
    fileList: FileInfoMetadata[],
    order: {column: string, order: "asc" | "desc"},
    onRefreshClick: () => void,
    onSortLabelClick: (column: string) => void,
    pushToHistory: (path: string) => void,
    selectFile: (path: string) => void
) {
    if (errorMessage) {
        return (
            <Alert
                style={{marginTop: 10}}
                severity="error"
                action={
                    <IconButton onClick={onRefreshClick} color="inherit" size="small">
                        <RefreshRounded />
                    </IconButton>
                }
            >{errorMessage}</Alert>);
    }
    if (isLoading) {
        return <div style={{display: "flex", justifyContent: "center", padding: "10px 0"}}>
            <RefreshRounded style={{animation: `spin 2s linear infinite`}} />
        </div>
    }
    return <div>
        <Table stickyHeader={true}>
            <TableHead>
                <TableRow>
                    <TableCell>
                        <TableSortLabel
                            active={order.column === "icon"}
                            direction={order.column === "icon" ? (order.order === "asc" ? "asc" : "desc") : 'asc'}
                            onClick={onSortLabelClick.bind(null, "icon")}
                        >Icon</TableSortLabel>
                    </TableCell>
                    <TableCell>
                        <TableSortLabel
                            active={order.column === "name"}
                            direction={order.column === "name" ? (order.order === "asc" ? "asc" : "desc") : 'asc'}
                            onClick={onSortLabelClick.bind(null, "name")}
                        >Name</TableSortLabel>
                    </TableCell>
                    <TableCell>
                        <TableSortLabel
                            active={order.column === "duration"}
                            direction={order.column === "duration" ? (order.order === "asc" ? "asc" : "desc") : 'asc'}
                            onClick={onSortLabelClick.bind(null, "duration")}
                        >Duration</TableSortLabel>
                    </TableCell>
                    <TableCell>
                        <TableSortLabel
                            active={order.column === "size"}
                            direction={order.column === "size" ? (order.order === "asc" ? "asc" : "desc") : 'asc'}
                            onClick={onSortLabelClick.bind(null, "size")}
                        >Size</TableSortLabel>
                    </TableCell>
                    <TableCell>
                        <TableSortLabel
                            active={order.column === "fileSize"}
                            direction={order.column === "fileSize" ? (order.order === "asc" ? "asc" : "desc") : 'asc'}
                            onClick={onSortLabelClick.bind(null, "fileSize")}
                        >File Size</TableSortLabel></TableCell>
                    <TableCell>
                        <TableSortLabel
                            active={order.column === "mtime"}
                            direction={order.column === "mtime" ? (order.order === "asc" ? "asc" : "desc") : 'asc'}
                            onClick={onSortLabelClick.bind(null, "mtime")}
                        >Modified Time</TableSortLabel>
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    fileList.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} align={"center"}>There are no files inside this folder</TableCell>
                        </TableRow>
                    ) : fileList.sort(findSortFunctionByOrder(order)).map(renderFileComponent.bind(null, pushToHistory, selectFile))
                }
            </TableBody>
        </Table>
    </div>
}

function findSortFunctionByOrder({column, order}: {column: string, order: "asc" | "desc"}) {
    function orderByName(left: FileInfoMetadata, right: FileInfoMetadata) {
        if (left.name === right.name) {
            return 0;
        } else {
            return (left.name > right.name ? 1 : -1) * (order === "asc" ? 1 : -1);
        }
    }

    if (column === "name") {
        return orderByName;
    } else if (column === "icon") {
        return function orderByType(left: FileInfoMetadata, right: FileInfoMetadata) {
            if (left.type === right.type) {
                if (left.name === right.name) {
                    return 0;
                }
                return (left.name > right.name ? 1 : -1);
            } else {
                return (left.type > right.type ? -1 : 1) * (order === "asc" ? 1 : -1);
            }
        }
    } else if (column === "duration") {
        return function orderByDuration(left: FileInfoMetadata, right: FileInfoMetadata) {
            if (typeof left.metadata !== "string" && left.metadata !== null && left.metadata !== undefined) {
                // leftHasDuration
                if (typeof right.metadata !== "string" && right.metadata !== null && right.metadata !== undefined) {
                    // rightHasDuration
                    return (left.metadata.duration > right.metadata.duration ? 1 : -1) * (order === "asc" ? 1 : -1);
                } else {
                    // leftHasDuration && !rightHasDuration
                    return -1;
                }
            } else {
                // !leftHasDuration
                if (typeof right.metadata !== "string" && right.metadata !== null && right.metadata !== undefined) {
                    // rightHasDuration
                    return 1;
                } else {
                    // !leftHasDuration && !rightHasDuration
                    return 0;
                }
            }
        }
    } else if (column === "size") {
        return function orderBySize(left: FileInfoMetadata, right: FileInfoMetadata) {
            if (typeof left.metadata === "object" && left.metadata && left.metadata.duration) {
                if (typeof right.metadata === "object" && right.metadata && right.metadata.duration) {
                    // leftHasSize && rightHasSize
                    if (left.metadata.width === right.metadata.width) {
                        return 0;
                    }
                    return ((left.metadata.width > right.metadata.width) ? 1 : -1) * (order === "asc" ? 1 : -1);
                } else {
                    // leftHasSize && !rightHasSize
                    return -1;
                }
            } else {
                if (typeof right.metadata === "object" && right.metadata && right.metadata.duration) {
                    // !leftHasSize && rightHasSize
                    return 1;
                } else {
                    // !leftHasSize && !rightHasSize
                    return 0;
                }
            }
        }
    } else if (column === "fileSize") {
        return function orderByFileSize(left: FileInfoMetadata, right: FileInfoMetadata) {
            const leftHasSize = !(left.type === "dir" || left.size === null || left.size === undefined);
            const rightHasSize = !(right.type === "dir" || right.size === null || right.size === undefined);

            if (leftHasSize && rightHasSize) {
                if (left.size === right.size) {
                    return 0;
                }
                return (left.size > right.size ? 1 : -1) * (order === "asc" ? 1 : -1);
            }
            if (!leftHasSize && !rightHasSize) {
                return 0;
            }
            if (leftHasSize) {
                return -1;
            }
            if (rightHasSize) {
                return 1;
            }
            return 0;
        }
    } else if (column === "mtime") {
        return function orderByModifiedTime(left: FileInfoMetadata, right: FileInfoMetadata) {
            if (left.mtime === right.mtime) {
                return 0;
            } else {
                return (left.mtime.getTime() > right.mtime.getTime() ? 1 : -1) * (order === "asc" ? 1 : -1);
            }
        }
    } else {
        return orderByName;
    }
}

function formatDurationForDisplay(duration: number) {
    if (duration < 60) {
        return duration.toFixed(1) + " s";
    }
    const seconds = (duration % 60).toFixed(0).padStart(2, "0");
    const minutes = (Math.floor(duration / 60) % 60).toString().padStart(2, "0");
    if (duration < 3600) {
        return `${minutes}:${seconds}`;
    }
    const hours = Math.floor(duration / (60 * 60)).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

function renderFileComponent(
    pushToHistory: (path: string) => void,
    selectFile: (path: string) => void,
    file: FileInfoMetadata,
    index: number
) {
    const timeAgoString = getHumanReadablePeriod(file.mtime, new Date());
    const dateTimeString = file.mtime.toLocaleString();
    const fileSizeString = file.type === "file" ? getHumanReadableSize(file.size) : "";

    return (
        <TableRow key={index} onClick={file.type === "file" ? selectFile.bind(null, file.path) : pushToHistory.bind(null, file.path + "/" + file.name)}>
            <TableCell>{
                file.type === "dir" ? <Folder /> : (
                    file.type === "file" ? <InsertDriveFileOutlined /> : (file.type === "error" ? <ErrorIcon /> : file.type)
                )}
            </TableCell>
            <TableCell>{file.name}</TableCell>
            <TableCell>{
                file.videoType ? (
                    !file.metadata ? (
                        <RefreshRounded style={{animation: `spin 2s linear infinite`}} />
                    ) : (
                        typeof file.metadata === "string" ? <ErrorIcon /> : (formatDurationForDisplay(file.metadata.duration))
                    )
                ) : null
            }</TableCell>
            <TableCell>{
                file.videoType ? (
                    !file.metadata ? (
                        <RefreshRounded style={{animation: `spin 2s linear infinite`}} />
                    ) : (
                        typeof file.metadata === "string" ? null : `${file.metadata.width}x${file.metadata.height}`
                    )
                ) : null
            }</TableCell>
            <TableCell>{fileSizeString}</TableCell>
            <TableCell>{timeAgoString} <small>({dateTimeString})</small></TableCell>
        </TableRow>
    );
}

async function loadPath(
    currentPath: React.MutableRefObject<string>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setLoadingPath: React.Dispatch<React.SetStateAction<string>>,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    setFileList: React.Dispatch<React.SetStateAction<FileInfoMetadata[]>>,
    path: string
) {
    setIsLoading(true);
    setLoadingPath(path);
    try {
        const rawFiles = await readFolderContents(path);
        if (currentPath.current !== path) {
            console.log("Folder changed before server finished sending data");
            return;
        }
        const files: FileInfoMetadata[] = rawFiles.map((file) => ({
            mtime: file.mtime,
            name: file.name,
            path: file.path,
            size: file.size,
            type: file.type,
            message: file.message,
            videoType: file.type === "file" ? getVideoTypeFromFilename(file.path + "/" + file.name) : undefined,
            metadata: undefined
        }));
        setIsLoading(false);
        setFileList(files);
        const treatedFiles = await Promise.all(
            files.map(
                async (file) => {
                    const obj = {
                        mtime: file.mtime,
                        name: file.name,
                        path: file.path,
                        size: file.size,
                        type: file.type,
                        videoType: file.videoType,
                        message: file.message,
                        metadata: null as any
                    }
                    if (file.videoType) {
                        try {
                            obj.metadata = await getVideoMetadata(file.path + "/" + file.name);
                        } catch (err) {
                            obj.metadata = err.message;
                        }
                    }
                    return obj;
                }
            )
        );
        if (currentPath.current !== path) {
            console.log("Folder changed before server finished retrieving video metadata");
            return;
        }
        setFileList(treatedFiles);
    } catch (err) {
        setErrorMessage(err.message);
        return;
    }
}

export default FileExplorer;
