import { AttributesHierarchy } from "../helpers/ChromeExtensionApi";
import { MatchState, QuerySelectorState } from "./Store";

interface Action {
    type: string;
}

export const AttributeButtonClickType = 'AttributeButtonClick';
export class AttributeButtonClickAction implements Action {
    readonly type = AttributeButtonClickType;
    constructor(
        public querySelectorState: QuerySelectorState,
        public visibleOnly: boolean,
        public metaPressed: boolean,
        public selector: string,
        public rowIdx: number,
        public buttonIdx: number,
    ) {}
}

export const ClickGetSelectorsType = 'ClickGetSelectors';
export class ClickGetSelectorsAction implements Action {
    readonly type = ClickGetSelectorsType;
}

export const ToggleVisibilityClickType = 'ToggleVisibilityClick';
export class ToggleVisibilityClickAction implements Action {
    readonly type = ToggleVisibilityClickType;
    constructor(
        public querySelector: string,
        public visibleOnly: boolean,
    ) {}
}

export const ClickCopySelectorToClipboardType = 'ClickCopySelectorToClipboard';
export class ClickCopySelectorToClipboardAction implements Action {
    readonly type = ClickCopySelectorToClipboardType;
    constructor(public selector: string) {}
}

export const ToggleDarkModeClickType = 'ToggleDarkModeClick';
export class ToggleDarkModeClickAction implements Action {
    readonly type = ToggleDarkModeClickType;
}

export const ClickPrevType = 'ClickPrev';
export class ClickPrevAction implements Action {
    readonly type = ClickPrevType;
    constructor(
        public querySelector: string,
        public currentMatch: number,
        public visibleOnly: boolean,
    ){}
}

export const ClickNextType = 'ClickNext';
export class ClickNextAction implements Action {
    readonly type = ClickNextType;
    constructor(
        public querySelector: string,
        public currentMatch: number,
        public visibleOnly: boolean,
    ){}
}

export const SetAttributesHierarchyType = 'SetAttributeHierarchy';
export class SetAttributesHierarchyAction implements Action {
    readonly type = SetAttributesHierarchyType;
    constructor(
        public attributesHierarchy: AttributesHierarchy[],
    ) {}
}

export const UpdateMatchStateType = 'UpdateMatchState';
export class UpdateMatchStateAction implements Action {
    readonly type = UpdateMatchStateType;
    constructor(
        public matchState: MatchState,
    ) {}
}

export const UpdateQuerySelectorStateType = 'UpdateQuerySelectorStateType';
export class UpdateQuerySelectorStateAction implements Action {
    readonly type = UpdateQuerySelectorStateType;
    constructor(
        public querySelectorState: QuerySelectorState,
    ) {}
}

export type Actions = 
    AttributeButtonClickAction
    | ClickGetSelectorsAction
    | ToggleVisibilityClickAction
    | ClickCopySelectorToClipboardAction
    | ToggleDarkModeClickAction
    | ClickPrevAction
    | ClickNextAction
    | SetAttributesHierarchyAction
    | UpdateMatchStateAction
    | UpdateQuerySelectorStateAction;
