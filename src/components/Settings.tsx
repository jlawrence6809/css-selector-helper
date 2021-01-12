import React, { useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Settings.css';
import { cancelXIcon, checkIcon, downArrowIcon, helpCircleIcon, settingsIcon, upArrowIcon } from './Icons';
import { Actions, CustomTagFilterCancelAction, CustomTagFilterChangeAction, CustomTagFilterSaveAction, ShowClassesClickedAction, ShowIdsClickedAction, ShowOtherAttributesClickedAction, ShowQuerySelectorAction, ShowTagNamesClickedAction, ToggleDarkModeClickAction, ToggleSettingsExpansionAction } from '../state/Actions';
import { StoreContext } from '../state/Store';
import PlusDarkTheme from './PlusDarkTheme';

const devmode = false;

const HelpIconComponent = (text: string) => {
  return (
    <span>
      {helpCircleIcon}
    </span>
  );
};

const Settings = () => {
  const {state, dispatch} = useContext(StoreContext);

  const expand = () => {
    dispatch(new ToggleSettingsExpansionAction());

    setTimeout(() => {
      document.querySelector('.settings')
        ?.scrollIntoView({
          block: 'start', // scroll such that the settings is at the top, with smooth transitioin
          inline: 'nearest',
          behavior: 'smooth',
        });
    }, 100);
  };

  const getCheckbox = (checked: boolean, action: Actions, label: string) => {

    <div className="checkbox">
    <input type="checkbox" className="mr-2" checked={checked} onClick={() => dispatch(action)}></input>
    <label className="mb-0">{label}</label>
  </div>
  };

  const settings = (
    <div className={PlusDarkTheme("settingsBody ml-2 pl-3 mb-3")}>
        {getCheckbox(state.showQuerySelector, new ShowQuerySelectorAction(), state.localization.SETTINGS_SHOW_QUERY_SELECTOR)}
        {getCheckbox(state.showTagNames, new ShowTagNamesClickedAction(), state.localization.SETTINGS_SHOW_TAG_NAMES)}
        {getCheckbox(state.showIds, new ShowIdsClickedAction(), state.localization.SETTINGS_SHOW_IDS)}
        {getCheckbox(state.showClasses, new ShowClassesClickedAction(), state.localization.SETTINGS_SHOW_CLASSES)}
        {getCheckbox(state.showOtherAttributes, new ShowOtherAttributesClickedAction(), state.localization.SETTINGS_SHOW_OTHER_ATTRIBUTES)}
        <div className="customTagFilters mt-2">
          <label>{state.localization.SETTINGS_CUSTOM_TAG_FILTERS}:</label>
          <div className="ml-3 mr-2">
            <div className="helpText mb-1">{state.localization.SETTINGS_CUSTOM_TAG_FILTERS_HELP}</div>
            <textarea
              className="w-100"
              wrap="soft"
              placeholder="target='_blank'"
              value={state.customTagFiltersUnsaved}
              onChange={(event) => dispatch(new CustomTagFilterChangeAction(event.target.value))}
            ></textarea>
            <div>
              <button
                className="iconButton mr-2"
                disabled={state.customTagFilters === state.customTagFiltersUnsaved}
                onClick={() => dispatch(new CustomTagFilterCancelAction())}
              > {cancelXIcon} </button>
              <button
                className="iconButton"
                disabled={state.customTagFilters === state.customTagFiltersUnsaved}
                onClick={() => dispatch(new CustomTagFilterSaveAction())}
              > {checkIcon} </button>
              <div>{state.customTagFiltersError}</div>
            </div>
          </div>
        </div>
        {devmode ? (<button onClick={() => dispatch(new ToggleDarkModeClickAction())}>Darkmode</button>) : null }
    </div>
  );
  return (
    <div className="settings">
      <button className="iconButton mb-2" onClick={() => expand()}>
        <span>
            {settingsIcon}
            {state.settingsExpanded ? downArrowIcon : upArrowIcon}
        </span>
      </button>
      {state.settingsExpanded ? settings : null}
    </div>
  );
};
export default Settings;

/*
- color code the parts, eg: div/span/etc are light grey, class is light blue, etc
- add blacklist to filter out things, can either remove parts like element type, classes, ids, specific selectors like href or target or data-reactid, etc. OR disable a specific part type/value combo (eg: [data-reactid='17'])
*/
