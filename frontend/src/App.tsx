import React, { useState } from 'react';
import './App.css';
import FileExplorer from './components/FileExplorer';
import IconList from './components/IconList';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import { FolderOpen } from '@material-ui/icons';

async function getFilesInPath(path: string) {
    return [
        {
            name: "file.txt",
            path,
            mtime: new Date()
        },
        {
            name: "file.png",
            path,
            mtime: new Date()
        }
    ];
}

function App() {
    const [showIcon, setShowIcon] = useState(false);
    return (
        <div className="app">
            <AppBar position="static" style={{marginBottom: "10px"}}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="showIcon"
                        onClick={() => setShowIcon(!showIcon)}
                    >
                        <FolderOpen />
                    </IconButton>
                    <Typography variant="h6">Video Slicer</Typography>
                </Toolbar>
            </AppBar>
            {
                showIcon ? (<IconList />) : (
                    <FileExplorer
                        getFilesInPath={getFilesInPath}
                    />
                )
            }

        </div>
    );
}

export default App;
