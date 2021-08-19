import React, { useState, useEffect, FC, ReactElement } from 'react';
import NavigationBarWrapper from './NavigationBarWrapper';
import { RefreshRounded } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { readFolderContents } from '../../adapters/FileSystem';

type FileInfo = {
    name: string;
    path: string;
    mtime: Date;
}

interface Props {
    changeCurrentPath: (path: string) => void;
    defaultCurrentPath: string
}

const FileExplorer: FC<Props> = (props): ReactElement => {

    const [isLoading, setIsLoading] = useState(false);
    const [loadingPath, setLoadingPath] = useState(props.defaultCurrentPath);
    const [errorMessage, setErrorMessage] = useState("");
    const [fileList, setFileList] = useState<FileInfo[]>([]);

    useEffect(() => {
        startLoadingPath(setIsLoading, setLoadingPath, setErrorMessage, setFileList, props.defaultCurrentPath)
    }, []);

    return (
        <>
            <div className="navigation-bar-wrapper">
                <NavigationBarWrapper
                    changeCurrentPath={(path: string) => {
                        startLoadingPath(setIsLoading, setLoadingPath, setErrorMessage, setFileList, path);
                    }}
                    defaultCurrentPath={props.defaultCurrentPath}
                />
            </div>
            {
                renderContent(errorMessage, isLoading, fileList)
            }
        </>
    );
}

function renderContent(errorMessage: string, isLoading: boolean, fileList: FileInfo[]) {
    if (errorMessage) {
        return (
            <Alert
                style={{marginTop: 10}}
                severity="error"
                action={
                    <IconButton color="inherit" size="small">
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
    return <div>{
        fileList.map((fileInfo, index) => <div key={index}>{JSON.stringify(fileInfo)}</div>)
    }</div>
}

async function startLoadingPath(
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setLoadingPath: React.Dispatch<React.SetStateAction<string>>,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    setFileList: React.Dispatch<React.SetStateAction<FileInfo[]>>,
    path: string
) {
    setIsLoading(true);
    setLoadingPath(path);
    await new Promise(resolve => setTimeout(resolve, 5000));
    try {
        const files = await readFolderContents(path);
        setIsLoading(false);
        setFileList(files);
    } catch (err) {
        setErrorMessage(err.message);
        return;
    }

}

export default FileExplorer;
