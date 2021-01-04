import React, {createContext, useReducer} from 'react';
import { Actions } from './Actions';
import ChromeExtensionApi, { AttributesHierarchy, CopyResult, SelectElementResult } from '../helpers/ChromeExtensionApi';
import { INITIAL_LOCAL_STORAGE, LocalStorage } from '../helpers/LocalStorage';
import { reducer } from './Reducer';
import { dispatchEffectsMiddleware } from './Effects';

// https://dev.to/elisealcala/react-context-with-usereducer-and-typescript-4obm

const chromeExtensionApi = new ChromeExtensionApi();

export type QuerySelectorState = string[][];
export type MatchState = SelectElementResult;

export interface IState {
    darkMode: boolean;
    chromeExtensionApi: ChromeExtensionApi,
    localStorage: LocalStorage;
    matchState: MatchState;
    attributesHierarchies: AttributesHierarchy[];
    querySelectorState: QuerySelectorState;
    visibleOnly: boolean;
    copyResult: CopyResult;
}

export const INITIAL_STATE: IState = {
    darkMode: false,
    chromeExtensionApi: chromeExtensionApi,
    localStorage: {
        ...INITIAL_LOCAL_STORAGE,
        ...window.localStorage,
    },
    matchState: {
        currentMatch: -1,
        matchCount: -1
    },
    attributesHierarchies: [],
    querySelectorState: [],
    visibleOnly: false,
    copyResult: CopyResult.DEFAULT,
};

export type DispatchMiddleware = (action: Actions) => Promise<void>;
export const StoreContext = createContext<{state: IState; dispatch: DispatchMiddleware}>({state: INITIAL_STATE, dispatch: () => new Promise(() => null)});

// inpiration for effects/reducer pattern I used: https://gist.github.com/astoilkov/013c513e33fe95fa8846348038d8fe42

const Store: React.FC = ({children}) => {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    const middleware = dispatchEffectsMiddleware(dispatch, chromeExtensionApi);
    return (<StoreContext.Provider value={{state, dispatch: middleware}}>{children}</StoreContext.Provider>);
}

export default Store;
