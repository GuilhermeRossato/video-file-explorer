import React, { ReactElement, FC } from "react";
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import { FolderOpen } from '@material-ui/icons';

interface Props {
    showIcon: boolean;
    setShowIcon: (value: boolean) => void;
}

const Header: FC<Props> = ({ showIcon, setShowIcon }): ReactElement => {
    return (
        <AppBar position="static" style={{marginBottom: "10px"}}>
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="show icon list"
                    onClick={() => setShowIcon(!showIcon)}
                >
                    <FolderOpen />
                </IconButton>
                <Typography variant="h6">Video Explorer</Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Header;