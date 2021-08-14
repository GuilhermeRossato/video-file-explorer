import React, { ReactElement, FC } from "react";
import {
    createStyles,
    makeStyles,
    Theme,
    IconButton,
    Drawer,
} from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

interface Props {
    title: String;
    handleMenuClose: () => void;
}

const Header: FC<Props> = ({ title, handleMenuClose }): ReactElement => {
    return (
        <Drawer
            variant="permanent"
        >
            <div>
                <IconButton onClick={handleMenuClose}>
                    <ChevronLeftIcon htmlColor="#000" />
                </IconButton>
            </div>
        </Drawer>
    );
};

export default Header;