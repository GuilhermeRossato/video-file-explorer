import React, { useState, Dispatch, SetStateAction, FC, ReactElement } from 'react';
import NavigationBar from './NavigationBar';
import { NavigationProps } from '../../hooks/useNavigation';

interface Props {
    navigation: NavigationProps;
    currentInputPath: string
    setCurrentInputPath: Dispatch<SetStateAction<string>>
}

const NavigationBarWrapper: FC<Props> = (props): ReactElement => {
    const navigation: NavigationProps = props.navigation;

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

