import React, { ReactElement, FC } from "react";
import { IconButton, TextField, Tooltip, ButtonGroup, Button } from '@material-ui/core';
import { ArrowForward, SubdirectoryArrowRightOutlined, ExpandMore } from '@material-ui/icons';

import './NavigationBar.css'
import { NavigationProps } from "../../hooks/useNavigation";

interface Props {
    currentPath: string,
    onTextChange: (text: string) => void;

    navigation: NavigationProps;

    canShowHistory?: boolean;
    toggleHistory: () => void;
    isShowingHistory: boolean;
}

const NavigationBar: FC<Props> = (props): ReactElement => {

    function selectFromHistory(index: number) {
        props.toggleHistory();
        props.navigation.selectFromHistory(index);
    }

    return (
        <div className="navigation-bar">
            <Tooltip title="Go back" placement="bottom">
                <span>
                    <IconButton color="primary" onClick={props.navigation.goBack} disabled={!props.navigation.canGoBack}>
                        <ArrowForward style={{ transform: "rotate(180deg)" }} />
                    </IconButton>
                </span>
            </Tooltip>
            <Tooltip title="Go forward" placement="bottom">
                <span>
                    <IconButton color="primary" onClick={props.navigation.goForward} disabled={!props.navigation.canGoForward}>
                        <ArrowForward />
                    </IconButton>
                </span>
            </Tooltip>
            <div style={{maxHeight: 56}}>
                <Tooltip title="History" placement="bottom">
                    <span>
                        <IconButton color="primary" onClick={props.toggleHistory} disabled={!props.canShowHistory}>
                            <ExpandMore />
                        </IconButton>
                    </span>
                </Tooltip>
                <div className="dropdown">
                {
                    props.isShowingHistory ? (
                        <div style={{position: "relative", left: "10px", zIndex: 10, backgroundColor: "white"}}>
                            <ButtonGroup
                                orientation="vertical"
                                color="primary"
                                aria-label="outlined primary button group"
                            >{
                                props.navigation.historyList.map((historyText, index) => (
                                    <Button key={index} onClick={selectFromHistory.bind(this, index)}>
                                        {historyText}
                                    </Button>
                                ))
                            }</ButtonGroup>
                        </div>
                    ) : null
                }
                </div>
            </div>
            <Tooltip title="Parent folder" placement="bottom">
                <span>
                    <IconButton color="primary" onClick={props.navigation.goUp} disabled={!props.navigation.canGoUp}>
                        <ArrowForward style={{ transform: "rotate(-90deg)" }} />
                    </IconButton>
                </span>
            </Tooltip>
            <TextField
                fullWidth={true}
                variant="outlined"
                value={props.currentPath}
                onChange={(event) => props.onTextChange(event.target.value)}
                onKeyDown={(event) => event.code === "Enter" && props.navigation.pushToHistory(props.currentPath)}
            />
            <Tooltip title="Navigate" placement="bottom">
                <IconButton color="primary" onClick={() => props.navigation.pushToHistory(props.currentPath)}>
                    <SubdirectoryArrowRightOutlined />
                </IconButton>
            </Tooltip>
        </div>
    );
}

export default NavigationBar;