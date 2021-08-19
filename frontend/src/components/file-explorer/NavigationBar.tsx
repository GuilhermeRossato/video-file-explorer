import React, { ReactElement, FC } from "react";
import { IconButton, TextField, Tooltip, ButtonGroup, Button } from '@material-ui/core';
import { ArrowForward, SubdirectoryArrowRightOutlined, ExpandMore } from '@material-ui/icons';

import './NavigationBar.css'

interface Props {
    currentPath: string,
    onTextChange: (text: string) => void;

    canGoBack?: boolean;
    canGoForward?: boolean;
    canGoUp?: boolean;

    canShowHistory?: boolean;
    toggleHistory: () => void;
    isShowingHistory: boolean;
    pushToHistory: () => void;
    historyList: string[];
    goBack: () => void;
    goForward: () => void;
    goUp: () => void;

    selectFromHistory: (index: number) => void;
}

const NavigationBar: FC<Props> = (props): ReactElement => {
    return (
        <div className="navigation-bar">
            <Tooltip title="Go back" placement="bottom">
                <span>
                    <IconButton color="primary" onClick={props.goBack} disabled={!props.canGoBack}>
                        <ArrowForward style={{ transform: "rotate(180deg)" }} />
                    </IconButton>
                </span>
            </Tooltip>
            <Tooltip title="Go forward" placement="bottom">
                <span>
                    <IconButton color="primary" onClick={props.goForward} disabled={!props.canGoForward}>
                        <ArrowForward />
                    </IconButton>
                </span>
            </Tooltip>
            <div>
                <Tooltip title="History" placement="bottom">
                    <span>
                        <IconButton color="primary" onClick={props.toggleHistory} disabled={!props.canShowHistory}>
                            <ExpandMore />
                        </IconButton>
                    </span>
                </Tooltip>
                {
                    props.isShowingHistory ? (
                        <div className="dropdown" >
                            <div style={{position: "relative", zIndex: 10, backgroundColor: "white"}}>
                                <ButtonGroup
                                    orientation="vertical"
                                    color="primary"
                                    aria-label="outlined primary button group"
                                >
                                    {
                                        props.historyList.map((historyText, index) => (
                                            <Button key={index} onClick={props.selectFromHistory.bind(this, index)}>
                                                {historyText}
                                            </Button>
                                        ))
                                    }
                                </ButtonGroup>
                            </div>
                        </div>
                    ) : null
                }
            </div>
            <Tooltip title="Parent folder" placement="bottom">
                <span>
                    <IconButton color="primary" onClick={props.goUp} disabled={!props.canGoUp}>
                        <ArrowForward style={{ transform: "rotate(-90deg)" }} />
                    </IconButton>
                </span>
            </Tooltip>
            <TextField
                fullWidth={true}
                variant="outlined"
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