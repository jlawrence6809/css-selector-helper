import React, {createContext, useReducer} from 'react';
import { ActionTypes, AttributeButtonClick } from './Actions';
import ChromeExtensionApi from './ChromeExtensionApi';
import { INITIAL_LOCAL_STORAGE, LocalStorage } from './LocalStorage';

// https://dev.to/elisealcala/react-context-with-usereducer-and-typescript-4obm

export interface IState {
    darkMode: boolean;
    chromeExtensionApi: ChromeExtensionApi,
    localStorage: LocalStorage;
}

export const INITIAL_STATE: IState = {
    darkMode: false,
    chromeExtensionApi: new ChromeExtensionApi(),
    localStorage: {
        ...INITIAL_LOCAL_STORAGE,
        ...window.localStorage,
    },
};

export const StoreContext = createContext<{state: IState; dispatch: React.Dispatch<ActionTypes>}>({state: INITIAL_STATE, dispatch: () => null});

function reducer(state: IState, action: ActionTypes): IState {
    switch(action.type) {
        case AttributeButtonClick:
            return {...state};
    }
    return state;
}

const Store: React.FC = ({children}) => {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    return (<StoreContext.Provider value={{state, dispatch}}>{children}</StoreContext.Provider>);
}

export default Store;
