import { Actions, UpdateQuerySelectorStateType, SetAttributesHierarchyType, ToggleVisibilityClickType, UpdateMatchStateType, ToggleDarkModeClickType } from "./Actions";
import { IState } from "./Store";

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
            document.documentElement.style.backgroundColor = state.darkMode ? '#FFFFFF' : '#282c34';
            return {
                ...state,
                darkMode: !state.darkMode,
            };
    }
    return state;
}