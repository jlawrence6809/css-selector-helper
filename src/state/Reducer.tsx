import { Actions, UpdateQuerySelectorStateType, SetAttributesHierarchyType, ToggleVisibilityClickType, UpdateMatchStateType, ToggleDarkModeClickType, CopyResultActionType } from "./Actions";
import { INITIAL_STATE, IState } from "./Store";

export function reducer(state: IState, action: Actions): IState {
    switch(action.type) {
        case UpdateQuerySelectorStateType:
            return {
                ...state,
                querySelectorState: action.querySelectorState,
            };
        case SetAttributesHierarchyType:
            return {
                ...state,
                querySelectorState: INITIAL_STATE.querySelectorState,
                attributesHierarchies: action.attributesHierarchy,
            };
        case ToggleVisibilityClickType:
            return {
                ...state,
                visibleOnly: !state.visibleOnly,
            }
        case UpdateMatchStateType:
            return {
                ...state,
                matchState: action.matchState,
            };
        case ToggleDarkModeClickType:
            const newDarkMode = !state.darkMode;
            document.documentElement.style.backgroundColor = newDarkMode ? '#282c34' : '#FFFFFF';
            return {
                ...state,
                darkMode: newDarkMode,
            };
        case CopyResultActionType:
            return {
                ...state,
                copyResult: action.copyResult,
            };
    }
    return state;
}