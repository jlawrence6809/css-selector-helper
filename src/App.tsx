import React from 'react';
import './App.css';
import ChromeExtensionApi, { Attribute, AttributesHierarchy, AttributeType, SelectElementResult } from './ChromeExtensionApi';
import 'bootstrap/dist/css/bootstrap.min.css';
import { downArrowIcon, eyeIcon, eyeOffIcon, settingsIcon, upArrowIcon } from './Icons';

const CHROME_DARK_THEME = 'dark';

const INITIAL_MATCH_STATE: SelectElementResult = {
  currentMatch: -1,
  matchCount: -1
};

interface IProps {
}

interface IState {
  settingsExpanded: boolean;
  darkMode: boolean;
  matchState: SelectElementResult;
  attributesHierarchies: AttributesHierarchy[];
  querySelectorState: QuerySelectorState;
  visibleOnly: boolean;
}

type QuerySelectorState = string[][];

class App extends React.Component<IProps, IState> {

  chromeExtensionApi = new ChromeExtensionApi();

  constructor(props: any) {
    super(props);
    this.state = {
      settingsExpanded: false,
      darkMode: this.chromeExtensionApi.getTheme() === CHROME_DARK_THEME,
      matchState: INITIAL_MATCH_STATE,
      attributesHierarchies: [],
      querySelectorState: [],
      visibleOnly: false,
    };
  }

  async onClickPrev() {
    const currentMatch = this.state.matchState.currentMatch;
    const result = await this.chromeExtensionApi.runSelectElemScript(
      this.getQuerySelectorString(),
      currentMatch - 1,
      this.state.visibleOnly,
      true
    );
    this.setState({
      matchState: result,
    });
  }

  async onClickNext() {
    const currentMatch = this.state.matchState.currentMatch;
    const matchState = await this.chromeExtensionApi.runSelectElemScript(
      this.getQuerySelectorString(),
      currentMatch < 1 ? 1 : currentMatch + 1,
      this.state.visibleOnly,
      true
    );
    this.setState({ matchState });
  }

  async onClickGetSelectors() {
    const result: AttributesHierarchy[] = await this.chromeExtensionApi.getAttributesHierarchyForCurrentlySelectedElementOnPage();
    result.forEach(arr => arr.sort(this.compareAttributesForSort));
    this.setState({
      attributesHierarchies: result,
      querySelectorState: [],
      matchState: INITIAL_MATCH_STATE,
    });
  }

  async onClickCopySelectorToClipboard() {
    await this.chromeExtensionApi.copyTextToClipboard(this.getQuerySelectorString());
  }

  onAttributeButtonClick(selector: string, rowIdx: number, buttonIdx: number) {
    const selectors = [...this.state.querySelectorState];
    if (!selectors[rowIdx]) {
      selectors[rowIdx] = [];
    }
    if (!!selectors[rowIdx][buttonIdx]) {
      delete selectors[rowIdx][buttonIdx];
    } else {
      selectors[rowIdx][buttonIdx] = selector;
    }
    this.setState({
      querySelectorState: selectors,
    }, this.refreshMatchesState);
  }

  onToggleVisibilityClick() {
    this.setState({
      visibleOnly: !this.state.visibleOnly
    }, this.refreshMatchesState);
  }

  async onToggleSettingsExpandClick() {
    this.setState({
      settingsExpanded: !this.state.settingsExpanded
    });
  }

  render() {
    return (
      <div className={this.plusDarkTheme('App')}>
          <div className="mb-2">{this.renderAttributesHierarchySection()}</div>
          <div className="d-flex mb-1">
            <div className="mr-2">
              {this.renderMatchesFields()}
            </div>
            <div>
              {this.renderVisibilityButton()}
            </div>
          </div>
          <button className="mr-1" onClick={() => this.onClickGetSelectors()}>Get Selectors</button>
          <button onClick={() => this.onClickCopySelectorToClipboard()}>Copy to Clipboard</button>
          <div className="mt-1">
            {this.renderSettings()}
          </div>
          {this.getQuerySelectorString()}
      </div>
    );
  }

  renderAttributesHierarchySection() {
    return (
      <div>
        {this.state.attributesHierarchies.map((ah: AttributesHierarchy, i) => {
          return (
            <div className="attributeRow d-flex mb-1">
              {ah.map((attr, j) => this.renderAttributeButton(attr, i, j))}
            </div>
          );
        })}
      </div>
    );
  }

  renderAttributeButton(attribute: Attribute, rowIdx: number, buttonIdx: number) {
    const selector = this.buildSelector(attribute);
    return (
      <div className="mr-1">
        <button onClick={() => this.onAttributeButtonClick(selector, rowIdx, buttonIdx)}>{selector}</button>
      </div>
    );
  }

  renderMatchesFields() {
    const currentMatch = this.state.matchState.currentMatch < 1 ? '-' : this.state.matchState.currentMatch;
    const matchCount = this.state.matchState.matchCount < 1 ? '-' : this.state.matchState.matchCount;
    return (
      <div className="d-flex">
        <button className="mr-1" onClick={() => this.onClickPrev()}>Prev</button>
        <div className="totalMatchesCount mr-1"> {currentMatch} / {matchCount} </div>
        <button onClick={() => this.onClickNext()}>Next</button>
      </div>
    );
  }

  renderVisibilityButton() {
    return (
      <div className="d-flex">
        <button onClick={() => this.onToggleVisibilityClick()} title="Only selenium visible">
          {this.state.visibleOnly ? eyeIcon : eyeOffIcon}
        </button>
      </div>
    );
  }

  renderSettings() {
    const settings = (
      <div className="darkmode-setting">
        todo settings
      </div>
    );
    return (
      <div className="settings">
        <button onClick={() => this.onToggleSettingsExpandClick()}>{this.renderSettingsIcon()}</button>
        {this.state.settingsExpanded ? settings : null}
      </div>
    );
  }

  renderSettingsIcon() {
    return (
      <span>
          {settingsIcon}
          {this.state.settingsExpanded ? downArrowIcon : upArrowIcon}
      </span>
    );
  }

  // ~~~~~~~~~~~~~~~~~~~~~ HELPERS ~~~~~~~~~~~~~~~~~~~~~

  getQuerySelectorString() {
    const selectors: QuerySelectorState = this.state.querySelectorState;
    return selectors.filter(arr => !!arr)
      .map(rowSelectors => rowSelectors.join(''))
      .filter(sel => !!sel)
      .join(' ');
  }

  compareAttributesForSort(a: Attribute, b: Attribute): number {
    if (a.name === b.name) {
      // should only apply to classes and "other"
      return a.value > b.value ? 1 : -1;
    }
    const getOrder = (type: AttributeType | string) => {
      switch(type) {
        case AttributeType.TagName:
          return 3;
        case AttributeType.Id:
          return 2;
        case AttributeType.Class:
          return 1;
      }
      return 0;
    };
    const orderA = getOrder(a.name);
    const orderB = getOrder(b.name);
    if (orderA === 0 && orderB === 0) {
      // when they are both type "other" we should sort by the name instead
      return a.name > b.name ? 1 : -1;
    }
    return orderB - orderA;
  }

  buildSelector(attribute: Attribute): string {
    switch(attribute.name){
      case AttributeType.TagName:
        return attribute.value;
      case AttributeType.Id:
        return '#' + attribute.value;
      case AttributeType.Class:
        return '.' + attribute.value;
    }
    return "[" + attribute.name + "='" + attribute.value + "']";
  }

  async refreshMatchesState(): Promise<void> {
    const querySelector = this.getQuerySelectorString();
    let matchCount: number = INITIAL_MATCH_STATE.matchCount;
    if (!!querySelector) {
      matchCount = await this.chromeExtensionApi.getNumberOfMatches(querySelector, this.state.visibleOnly);
    }
    this.setState({
      matchState: {
        currentMatch: INITIAL_MATCH_STATE.currentMatch,
        matchCount,
      },
    });
  }

  plusDarkTheme(classString: string) {
    return classString + (this.state.darkMode ? ' dark-theme' : '');
  }
}

/*

- color code the parts, eg: div/span/etc are light grey, class is light blue, etc
- add blacklist to filter out things, can either remove parts like element type, classes, ids, specific selectors like href or target or data-reactid, etc. OR disable a specific part type/value combo (eg: [data-reactid='17'])
*/

export default App;
