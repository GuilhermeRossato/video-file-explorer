import React, { ReactElement, FC } from "react";
import { IconButton, TextField, Tooltip } from '@material-ui/core';
import { ArrowForward, SubdirectoryArrowRightOutlined, ExpandMore } from '@material-ui/icons';

import './NavigationBar.css'

interface Props {
    currentPath: string,
    onTextChange: (text: string) => void;
    canGoBack?: boolean;
    canGoForward?: boolean;
    canShowHistory?: boolean;
    pushToHistory: () => void;
    goBack: () => void;
    goForward: () => void;
}

const NavigationBar: FC<Props> = (props): ReactElement => {
    return (
        <div className="navigation-bar">
            <Tooltip title="Go back" placement="bottom">
                <IconButton color="primary" onClick={props.goBack} disabled={!props.canGoBack}>
                    <ArrowForward style={{transform: "rotate(180deg)"}} />
                </IconButton>
            </Tooltip>
            <Tooltip title="Go forward" placement="bottom">
                <IconButton color="primary" onClick={props.goForward} disabled={!props.canGoForward}>
                    <ArrowForward />
                </IconButton>
            </Tooltip>
            <Tooltip title="History" placement="bottom">
                <IconButton color="primary" disabled={!props.canShowHistory}>
                    <ExpandMore />
                </IconButton>
            </Tooltip>
            <Tooltip title="Parent folder" placement="bottom">
                <IconButton color="primary">
                    <ArrowForward style={{transform: "rotate(-90deg)"}} />
                </IconButton>
            </Tooltip>
            <TextField
                fullWidth={true}
                variant="outlined"
                style={{width: "300px"}}
                value={props.currentPath}
                onChange={(event) => props.onTextChange(event.target.value)}
            />
            <Tooltip title="Navigate" placement="bottom">
                <IconButton color="primary" onClick={props.pushToHistory}>
                    <SubdirectoryArrowRightOutlined />
                </IconButton>
            </Tooltip>
        </div>
    );
}

export default NavigationBar;