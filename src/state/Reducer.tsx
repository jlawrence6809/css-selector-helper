import { Actions, UpdateQuerySelectorStateType, SetAttributesHierarchyType, ToggleVisibilityClickType, UpdateMatchStateType, ToggleDarkModeClickType, CopyResultActionType, ToggleSettingsExpansionActionType, CustomTagFilterChangeActionType, ShowClassesClickedActionType, ShowIdsClickedActionType, ShowOtherAttributesClickedActionType, ShowTagNamesClickedActionType, CustomTagFilterSaveActionType, CustomTagFilterCancelActionType, ShowQuerySelectorActionType } from "./Actions";
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
        case ToggleSettingsExpansionActionType:
            return {
                ...state,
                settingsExpanded: !state.settingsExpanded,
            };
        case ShowQuerySelectorActionType:
            return {
                ...state,
                showQuerySelector: !state.showQuerySelector,
            };
        case ShowTagNamesClickedActionType:
            return {
                ...state,
                showTagNames: !state.showTagNames,
            };
        case ShowIdsClickedActionType:
            return {
                ...state,
                showIds: !state.showIds,
            };
        case ShowClassesClickedActionType:
            return {
                ...state,
                showClasses: !state.showClasses,
            };
        case ShowOtherAttributesClickedActionType:
            return {
                ...state,
                showOtherAttributes: !state.showOtherAttributes,
            };
        case CustomTagFilterChangeActionType:
            return {
                ...state,
                customTagFiltersUnsaved: action.value,
            };
        case CustomTagFilterCancelActionType:
            return {
                ...state,
                customTagFiltersUnsaved: state.customTagFilters,
            };
        case CustomTagFilterSaveActionType:
            return {
                ...state,
                customTagFilters: state.customTagFiltersUnsaved,
            };
    }
    return state;
}