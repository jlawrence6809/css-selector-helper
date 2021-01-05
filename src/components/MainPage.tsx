import React, {useContext, useEffect} from 'react';
import './MainPage.css';
import { Attribute, AttributesHierarchy, ChromeTheme, CopyResult } from '../helpers/ChromeExtensionApi';
import 'bootstrap/dist/css/bootstrap.min.css';
import { alertCircleIcon, checkIcon, clipboardIcon, eyeIcon, eyeOffIcon, leftArrowsIcon, refreshIcon, rightArrowsIcon } from './Icons';
import Settings from './Settings';
import { MatchState, StoreContext } from '../state/Store';
import { AttributeButtonClickAction, ClickCopySelectorToClipboardAction, ClickGetSelectorsAction, ClickNextAction, ClickPrevAction, ToggleDarkModeClickAction, ToggleVisibilityClickAction } from '../state/Actions';
import { buildSelector, getQuerySelectorString } from '../helpers/Helpers';
import PlusDarkTheme from './PlusDarkTheme';
  
export const MainPage = () => {
    const {state, dispatch} = useContext(StoreContext);

    useEffect(() => {
        dispatch(new ClickGetSelectorsAction());
        if (state.chromeExtensionApi.getTheme() === ChromeTheme.DARK) {
          dispatch(new ToggleDarkModeClickAction());
        }
    }, [] /* only run at startup? */);

    const refreshSelectorsButton = (
        <button
            className="iconButton mr-1"
            onClick={() => dispatch(new ClickGetSelectorsAction())}
            title={state.localization.REFRESH_BUTTON_TITLE}
        >
            {refreshIcon}
        </button>
    );

    const visibleOnlyButton = (
        <button
            className="iconButton mr-1"
            onClick={() => dispatch(new ToggleVisibilityClickAction(getQuerySelectorString(state.querySelectorState), !state.visibleOnly))}
            title={state.visibleOnly ? state.localization.VISIBLE_ONLY_OFF_BUTTON_TITLE : state.localization.VISIBLE_ONLY_BUTTON_TITLE }
        >
            {state.visibleOnly ? eyeIcon : eyeOffIcon}
        </button>
    );

    const currentQuerySelector = getQuerySelectorString(state.querySelectorState);
    const copySelectorButton = (
        <button
            className={'iconButton' + (state.copyResult === CopyResult.FAIL ? ' error' : '')}
            onClick={() => dispatch(new ClickCopySelectorToClipboardAction(currentQuerySelector))}
            disabled={currentQuerySelector === '' || state.copyResult !== CopyResult.DEFAULT}
            title={state.copyResult === CopyResult.FAIL ? state.localization.COPY_SELECTOR_BUTTON_TITLE_ERROR : state.localization.COPY_SELECTOR_BUTTON_TITLE}
        >
            {state.copyResult === CopyResult.DEFAULT ? clipboardIcon : state.copyResult === CopyResult.SUCCESS ? checkIcon : alertCircleIcon}
        </button>
    );

    return (
      <div className={PlusDarkTheme('App pl-1 pb-1')}>
          <div className="mb-1">{AttributesHierarchyComponent(state.attributesHierarchies)}</div>
          <hr className={PlusDarkTheme('attributesSectionSeparator')}/>
          <div>
            <div className="mb-2">
              {MatchCyclerComponent(state.matchState)}
            </div>
            <div className="mb-2">
              {refreshSelectorsButton}
              {visibleOnlyButton}
              {copySelectorButton}
            </div>
            {
              state.showQuerySelector ?
              (<div className="mb-2">
                {CurrentQueryDisplayComponent(currentQuerySelector)}
              </div>) : null
            }
          </div>
          <div>
            {Settings()}
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
          title={state.localization.META_SELECTOR_BUTTON_TITLE}>
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
        ))} title={state.localization.PREVIOUS_BUTTON_TITLE}>{leftArrowsIcon}</button>
        <div className="totalMatchesCount mr-1"> {currentMatch} / {matchCount} </div>
        <button className="iconButton" onClick={() => dispatch(new ClickNextAction(
            querySelector,
            state.matchState.currentMatch,
            state.visibleOnly,
        ))} title={state.localization.NEXT_BUTTON_TITLE}>{rightArrowsIcon}</button>
      </div>
    );
}

const CurrentQueryDisplayComponent = (currentQuerySelector: string) => {
  const {state} = useContext(StoreContext);
  const styles = {
    backgroundColor: '#ccc',
    resize: 'vertical',
  } as React.CSSProperties;

  const onCurrentQueryDisplayFocus = (event: React.MouseEvent<HTMLTextAreaElement, MouseEvent>) => {
    const currentQueryDisplayInput = event.target as HTMLTextAreaElement;
    currentQueryDisplayInput.select();
  };
  return (
    <div className="pr-2">
      <textarea
        className="currentQueryDisplay w-100"
        value={currentQuerySelector}
        style={styles}
        readOnly={true}
        title={state.localization.CURRENT_QUERY_DISPLAY_TITLE}
        placeholder={state.localization.CURRENT_QUERY_DISPLAY_PLACEHOLDER}
        onClick={(ev) => onCurrentQueryDisplayFocus(ev)}
        onContextMenu={(ev) => onCurrentQueryDisplayFocus(ev)}
      ></textarea>
    </div>
  );
  
};
