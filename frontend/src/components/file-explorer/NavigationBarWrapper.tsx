import React, { useState, useEffect, Dispatch, SetStateAction, FC, ReactElement } from 'react';
import NavigationBar from './NavigationBar';
import { useNavigation, NavigationProps } from '../../hooks/useNavigation';

interface Props {
    commitPath: (path: string) => void;
    currentInputPath: string
    setCurrentInputPath: React.Dispatch<React.SetStateAction<string>>
}

const NavigationBarWrapper: FC<Props> = (props): ReactElement => {
    const navigation: NavigationProps = useNavigation(
        props.currentInputPath,
        props.setCurrentInputPath,
        props.commitPath
    );

    const [showingHistory, setShowHistory] = useState(false);

    return (
        <div className="navigation-bar-wrapper">
            <NavigationBar
                currentPath={props.currentInputPath}
                onTextChange={props.setCurrentInputPath}

                navigation={navigation}

                isShowingHistory={showingHistory}
                canShowHistory={navigation.historyList.length > 0}
                toggleHistory={() => setShowHistory(!showingHistory)}
            ></NavigationBar>
        </div>
    );
}

export default NavigationBarWrapper;

