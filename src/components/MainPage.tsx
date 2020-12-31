import React, {useContext, useEffect} from 'react';
import './MainPage.css';
import { Attribute, AttributesHierarchy } from '../helpers/ChromeExtensionApi';
import 'bootstrap/dist/css/bootstrap.min.css';
import { clipboardIcon, eyeIcon, eyeOffIcon, leftArrowsIcon, refreshIcon, rightArrowsIcon } from './Icons';
import { EN } from '../helpers/Localization';
import Settings from './Settings';
import { MatchState, StoreContext } from '../state/Store';
import { AttributeButtonClickAction, ClickCopySelectorToClipboardAction, ClickGetSelectorsAction, ClickNextAction, ClickPrevAction, ToggleDarkModeClickAction, ToggleVisibilityClickAction } from '../state/Actions';
import { buildSelector, getQuerySelectorString } from '../helpers/Helpers';
  
export const MainPage = () => {
    const {state, dispatch} = useContext(StoreContext);

    useEffect(() => {
        dispatch(new ClickGetSelectorsAction());
    }, [] /* only run at startup? */);

    const refreshSelectorsButton = (
        <button
            className="iconButton mr-1"
            onClick={() => dispatch(new ClickGetSelectorsAction())}
            title={EN.REFRESH_BUTTON_TITLE}
        >
            {refreshIcon}
        </button>
    );

    const visibleOnlyButton = (
        <button
            className="iconButton mr-1"
            onClick={() => dispatch(new ToggleVisibilityClickAction(getQuerySelectorString(state.querySelectorState), !state.visibleOnly))}
            title={state.visibleOnly ? EN.VISIBLE_ONLY_OFF_BUTTON_TITLE : EN.VISIBLE_ONLY_BUTTON_TITLE }
        >
            {state.visibleOnly ? eyeIcon : eyeOffIcon}
        </button>
    );

    const copySelectorButton = (
        <button
            className="iconButton"
            onClick={() => dispatch(new ClickCopySelectorToClipboardAction(getQuerySelectorString(state.querySelectorState)))}
            title={EN.COPY_SELECTOR_BUTTON_TITLE}
        >
            {clipboardIcon}
        </button>
    );

    return (
      <div className={PlusDarkTheme('App pl-1 pb-1')}>
          <div className="mb-1">{AttributesHierarchyComponent(state.attributesHierarchies)}</div>
          <hr className={PlusDarkTheme('attributesSectionSeparator')}/>
          <div className="mb-2">
            {MatchCyclerComponent(state.matchState)}
          </div>
          <div className="mb-4">
            {refreshSelectorsButton}
            {visibleOnlyButton}
            {copySelectorButton}
          </div>
          <div>
            <button className="iconButton" onClick={() => dispatch(new ToggleDarkModeClickAction())}>Darkmode</button>
            <Settings
              chromeExtensionApi={state.chromeExtensionApi}
            ></Settings>
          </div>
      </div>
    );
};
  
const AttributesHierarchyComponent = (attributesHierarchies: AttributesHierarchy[]) => {
    return (
        <div>
          {attributesHierarchies.map((attributesHierarchy, rowIdx) => AttributeRow(attributesHierarchy, rowIdx))}
        </div>
    );
};

const AttributeRow = (attributesHierarchy: AttributesHierarchy, rowIdx: number) => {
    return (
        <div className="attributeRow d-flex">
            {attributesHierarchy.map((attribute, buttonIdx) => AttributeButton(attribute, rowIdx, buttonIdx))}
        </div>
    );
};

const AttributeButton = (
    attribute: Attribute,
    rowIdx: number,
    buttonIdx: number
) => {
    const {state, dispatch} = useContext(StoreContext);
    const querySelectorState: string | undefined = state.querySelectorState[rowIdx]?.[buttonIdx];

    const selector = buildSelector(attribute);
    let displaySelector = selector;
    let className = 'attributeButton';
    if (!!querySelectorState) { // is selected?
      className += ' selected';
      const isNotted = querySelectorState.startsWith(':not');
      if (isNotted) {
        className += ' notted';
        displaySelector = `:not(${displaySelector})`;
      }
    }
    return (
      <div className="mr-1">
        <button
          className={className}
          onClick={(event) => dispatch( 
            new AttributeButtonClickAction(
                state.querySelectorState,
                state.visibleOnly,
                event.metaKey || event.altKey || event.ctrlKey || event.shiftKey,
                selector,
                rowIdx,
                buttonIdx
            ))}
          title={EN.META_SELECTOR_BUTTON_TITLE}>
            {displaySelector}
        </button>
      </div>
    );
};

const MatchCyclerComponent = (matchState: MatchState) => {
    const {state, dispatch} = useContext(StoreContext);
    const querySelector = getQuerySelectorString(state.querySelectorState);
    const currentMatch = matchState.currentMatch < 1 ? '-' : matchState.currentMatch;
    const matchCount = matchState.matchCount < 1 ? '-' : matchState.matchCount;
    return (
      <div className="d-flex">
        <button className="iconButton mr-1" onClick={() => dispatch(new ClickPrevAction(
            querySelector,
            state.matchState.currentMatch,
            state.visibleOnly,
        ))} title={EN.PREVIOUS_BUTTON_TITLE}>{leftArrowsIcon}</button>
        <div className="totalMatchesCount mr-1"> {currentMatch} / {matchCount} </div>
        <button className="iconButton" onClick={() => dispatch(new ClickNextAction(
            querySelector,
            state.matchState.currentMatch,
            state.visibleOnly,
        ))} title={EN.NEXT_BUTTON_TITLE}>{rightArrowsIcon}</button>
      </div>
    );
}

// HELPERS

// todo: make this a hook?
const PlusDarkTheme = (classString: string) => {
    const {state} = useContext(StoreContext);
    return classString + (state.darkMode ? ' dark-theme' : '');
}
