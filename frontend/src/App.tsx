import React, { useEffect, useState, useMemo } from 'react';
import FileExplorer from './components/file-explorer/FileExplorer';
import IconList from './components/IconList';
import Header from "./components/Header";
import './App.css';
import { readCwd } from './adapters/FileSystemAdapter';

function App() {
    const [cwd, setCwd] = useState<string | null>(null);
    const [showIcon, setShowIcon] = useState(false);
    const [isExploringFiles, setExploringFiles] = useState(true);
    const [startupError, setStartupError] = useState("");

    useEffect(function() {
        readCwd().then(
            setCwd,
            (err) => setStartupError(err.message)
        )
    }, []);

    const header = useMemo(
        () => (<Header showIcon={showIcon} setShowIcon={setShowIcon} />),
        [showIcon]
    );

    const content = useMemo(
        () => {
            if (startupError) {
                return (<div>
                    <h1>Fatal Error</h1>
                    <p>Could not retrieve cwd data from server:</p>
                    <code>{startupError}</code>
                </div>);
            }
            if (!cwd) {
                return (<div>Loading</div>);
            }
            if (showIcon) {
                return (<IconList />);
            }
            if (!isExploringFiles) {
                return (<div>File display not implemented</div>)
            }
            return <FileExplorer
                onSelectFile={(path: string) => {
                    console.log("File selected:", path);
                    setExploringFiles(false);
                }}
                defaultCurrentPath={cwd}
            />
        },
        [ cwd, showIcon, isExploringFiles, startupError ]
    );

    return (
        <div className="app">
            { header }
            { content }
        </div>
    );
}

export default App;
