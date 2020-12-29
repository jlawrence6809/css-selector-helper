import React from 'react';
import './App.css';
import ChromeExtensionApi, { Attribute, AttributesHierarchy, AttributeType, SelectElementResult } from './ChromeExtensionApi';
import 'bootstrap/dist/css/bootstrap.min.css';

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
      this.getCurrentSelectorString(),
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
      this.getCurrentSelectorString(),
      currentMatch < 1 ? 1 : currentMatch + 1,
      this.state.visibleOnly,
      true
    );
    this.setState({ matchState });
  }

  async onSelectedCounterChange(event: React.FormEvent<HTMLInputElement>) {
    console.log('onSelectedCounterChange');
    console.log(event.currentTarget.value);
    console.log(event);
    const matchState = await this.chromeExtensionApi.runSelectElemScript(
      this.getCurrentSelectorString(),
      parseInt(event.currentTarget.value),
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
    console.log('Copy to clipboard clicked!');
  }

  async onOnlyVisibleToggle(event: any) {
    console.log('On only visible toggle!');
    console.log(event);
  }

  async onAttributeButtonClick(selector: string, rowIdx: number, buttonIdx: number) {
    const selectors = [...this.state.querySelectorState];
    if (!selectors[rowIdx]) {
      selectors[rowIdx] = [];
    }
    if (!!selectors[rowIdx][buttonIdx]) {
      delete selectors[rowIdx][buttonIdx];
    } else {
      selectors[rowIdx][buttonIdx] = selector;
    }
    const querySelector = this.getCurrentSelectorString(selectors);
    let matchCount: number = 0;
    if (!!querySelector) {
      matchCount = await this.chromeExtensionApi.getNumberOfMatches(querySelector, false);
    }
    this.setState({
      querySelectorState: selectors,
      matchState: {
        currentMatch: INITIAL_MATCH_STATE.currentMatch,
        matchCount,
      },
    });
  }

  render() {
    return (
      <div className={this.plusDarkTheme('App')}>
          <div className="mb-2">{this.renderAttributesHierarchySection()}</div>
          <div className="mb-1">
            {this.renderMatchesFields()}
          </div>
          <div className="mb-1">
            {this.renderVisibilityButton()}
          </div>
          <button className="mr-1" onClick={() => this.onClickGetSelectors()}>Get Selectors</button>
          <button onClick={() => this.onClickCopySelectorToClipboard()}>Copy to Clipboard</button>
          <div className="mt-1">
            {this.renderSettings()}
          </div>
          {this.getCurrentSelectorString()}
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
    const currentMatch = this.state.matchState.currentMatch < 1 ? '' : this.state.matchState.currentMatch;
    console.log('renderMatchesFields');
    console.log(currentMatch);
    const currentMatchWidth = `calc(${(currentMatch + '').length || 1}ch + 270px)`; // length in "character" units
    const matchCount = this.state.matchState.matchCount < 1 ? '-' : this.state.matchState.matchCount;
    return (
      <div className="d-flex">
        <button className="mr-1" onClick={() => this.onClickPrev()}>Prev</button>
        <div className="selectedCounter d-flex mr-1">
          <input
            className="selectedCounterInput"
            style={{width: currentMatchWidth}}
            value={currentMatch}
            onChange={ev => this.onSelectedCounterChange(ev)}
            placeholder="-"
            type="number"
          ></input>
          /
          <div className="totalMatchesCount">{matchCount}</div>
        </div>
        <button onClick={() => this.onClickNext()}>Next</button>
      </div>
    );
  }

  renderVisibilityButton() {
    return (
      <div className="d-flex">
        <input type="checkbox" onChange={(event) => this.onOnlyVisibleToggle(event)}></input>
        <div>Only Visible</div>
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
        <button onClick={() => this.toggleState('settingsExpanded')}>{this.renderSettingsIcon()}</button>
        {this.state.settingsExpanded ? settings : null}
      </div>
    );
  }

  renderSettingsIcon() {
    const settingsIcon = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M8.686 4l2.607-2.607a1 1 0 0 1 1.414 0L15.314 4H19a1 1 0 0 1 1 1v3.686l2.607 2.607a1 1 0 0 1 0 1.414L20 15.314V19a1 1 0 0 1-1 1h-3.686l-2.607 2.607a1 1 0 0 1-1.414 0L8.686 20H5a1 1 0 0 1-1-1v-3.686l-2.607-2.607a1 1 0 0 1 0-1.414L4 8.686V5a1 1 0 0 1 1-1h3.686zM6 6v3.515L3.515 12 6 14.485V18h3.515L12 20.485 14.485 18H18v-3.515L20.485 12 18 9.515V6h-3.515L12 3.515 9.515 6H6zm6 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>);
    const downArrow = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z"/></svg>);
    const upArrow = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 10.828l-4.95 4.95-1.414-1.414L12 8l6.364 6.364-1.414 1.414z"/></svg>);
    return (
      <span>
          {settingsIcon}
          {this.state.settingsExpanded ? downArrow : upArrow}
      </span>
    );
  }

  // ~~~~~~~~~~~~~~~~~~~~~ HELPERS ~~~~~~~~~~~~~~~~~~~~~

  getCurrentSelectorString(selectors: QuerySelectorState = this.state.querySelectorState) {
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

  toggleState(stateName: string): void {
    // lots of hacky anys going on here...
    if (typeof (this.state as any)[stateName] === 'undefined') {
      console.error('State not found: ' + stateName);
    }
    this.setState(prevState => ({[stateName]: !(prevState as any)[stateName]} as any));
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
