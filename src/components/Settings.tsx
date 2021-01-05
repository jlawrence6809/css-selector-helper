import React, { useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Settings.css';
import { cancelXIcon, checkIcon, downArrowIcon, helpCircleIcon, settingsIcon, upArrowIcon } from './Icons';
import { CustomTagFilterCancelAction, CustomTagFilterChangeAction, CustomTagFilterSaveAction, ShowClassesClickedAction, ShowIdsClickedAction, ShowOtherAttributesClickedAction, ShowQuerySelectorAction, ShowTagNamesClickedAction, ToggleDarkModeClickAction, ToggleSettingsExpansionAction } from '../state/Actions';
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

  const settings = (
    <div className={PlusDarkTheme("settingsBody ml-2 pl-3 mb-3")}>
        <div className="checkbox">
          <input type="checkbox" className="mr-2" checked={state.showQuerySelector} onClick={() => dispatch(new ShowQuerySelectorAction())}></input>
          <label className="mb-0">{state.localization.SETTINGS_SHOW_QUERY_SELECTOR}</label>
        </div>
        <div className="checkbox">
          <input type="checkbox" className="mr-2" checked={state.showTagNames} onClick={() => dispatch(new ShowTagNamesClickedAction())}></input>
          <label className="mb-0">{state.localization.SETTINGS_SHOW_TAG_NAMES}</label>
        </div>
        <div className="checkbox">
          <input type="checkbox" className="mr-2" checked={state.showIds} onClick={() => dispatch(new ShowIdsClickedAction())}></input>
          <label className="mb-0">{state.localization.SETTINGS_SHOW_IDS}</label>
        </div>
        <div className="checkbox">
          <input type="checkbox" className="mr-2" checked={state.showClasses} onClick={() => dispatch(new ShowClassesClickedAction())}></input>
          <label className="mb-0">{state.localization.SETTINGS_SHOW_CLASSES}</label>
        </div>
        <div className="checkbox">
          <input type="checkbox" className="mr-2" checked={state.showOtherAttributes} onClick={() => dispatch(new ShowOtherAttributesClickedAction())}></input>
          <label className="mb-0">{state.localization.SETTINGS_SHOW_OTHER_ATTRIBUTES}</label>
        </div>
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
