import React, {useContext, useReducer} from 'react';
import './App.css';
import ChromeExtensionApi, { Attribute, AttributesHierarchy, AttributeType } from './ChromeExtensionApi';
import 'bootstrap/dist/css/bootstrap.min.css';
import { clipboardIcon, eyeIcon, eyeOffIcon, leftArrowsIcon, refreshIcon, rightArrowsIcon } from './Icons';
import { EN } from './Localization';
import Settings from './Settings';
import { resetLocalStorage } from './LocalStorage';
import { StoreContext } from './Store';

const CHROME_DARK_THEME = 'dark';


const INITIAL_STATE: IAppState = {
  darkMode: false,
};

interface IProps {
}

interface IAppState {
  darkMode: boolean;
}

const plusDarkTheme = () => {
  const {state} = useContext(StoreContext);
  // return classString + (this.state.darkMode ? ' dark-theme' : '');
  return (<div></div>);
}

const App = () => {
  const {state, dispatch} = useContext(StoreContext);


  return (
    <div className={plusDarkTheme('App pl-1 pb-1')}>
        <div className="mb-1">{this.renderAttributesHierarchySection()}</div>
        <hr className={plusDarkTheme('attributesSectionSeparator')}/>
        <div className="mb-2">
          {this.renderMatchCylcerFields()}
        </div>
        <div className="mb-4">
          <button className="iconButton mr-1" onClick={() => this.onClickGetSelectors()} title={EN.REFRESH_BUTTON_TITLE}>{refreshIcon}</button>
          <button
            className="iconButton mr-1"
            onClick={() => this.onToggleVisibilityClick()}
            title={this.state.visibleOnly ? EN.VISIBLE_ONLY_OFF_BUTTON_TITLE : EN.VISIBLE_ONLY_BUTTON_TITLE }
          >
            {this.state.visibleOnly ? eyeIcon : eyeOffIcon}
          </button>
          <button className="iconButton" onClick={() => this.onClickCopySelectorToClipboard()} title={EN.COPY_SELECTOR_BUTTON_TITLE}>{clipboardIcon}</button>
        </div>
        <div>
          <button className="iconButton" onClick={() => this.toggleDarkmodeClick()}>Darkmode</button>
          <Settings
            darkMode={this.state.darkMode}
            chromeExtensionApi={this.chromeExtensionApi}
          ></Settings>
        </div>
    </div>
  );
};

class AppClass extends React.Component<IProps, IAppState> {

  constructor(props: any) {
    super(props);

    this.state = {
      ...INITIAL_STATE,
      darkMode: this.chromeExtensionApi.getTheme() === CHROME_DARK_THEME,
    };

    chromeExtensionApi = new ChromeExtensionApi();

    // the html background is different from the app body. set it's background if dark mode.
    if (this.state.darkMode) {
      document.documentElement.style.backgroundColor = "#282c34";
    }

    resetLocalStorage(this.state.localStorage);
  }

  componentDidMount() {
    this.onClickGetSelectors();
  }

  async onClickPrev() {
    const currentMatch = this.state.matchState.currentMatch;
    const result = await this.context.chromeExtensionApi.runSelectElemScript(
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

  onAttributeButtonClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    selector: string,
    rowIdx: number,
    buttonIdx: number
  ) {
    // pressing a meta key while clicking 
    const metaPressed = event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
    if (metaPressed) {
      selector = `:not(${selector})`;
    }

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

  toggleDarkmodeClick() {
    this.setState({
      darkMode: !this.state.darkMode,
    });
    if (!this.state.darkMode) {
      document.documentElement.style.backgroundColor = "#282c34";
    }
  }

  reducer(state: IAppState, action: any) {
    return state;
  }

  render() {
    const [state, dispatch] = useReducer(this.reducer, INITIAL_STATE);

    return (
      <div className={this.plusDarkTheme('App pl-1 pb-1')}>
          <div className="mb-1">{this.renderAttributesHierarchySection()}</div>
          <hr className={this.plusDarkTheme('attributesSectionSeparator')}/>
          <div className="mb-2">
            {this.renderMatchCylcerFields()}
          </div>
          <div className="mb-4">
            <button className="iconButton mr-1" onClick={() => this.onClickGetSelectors()} title={EN.REFRESH_BUTTON_TITLE}>{refreshIcon}</button>
            <button
              className="iconButton mr-1"
              onClick={() => this.onToggleVisibilityClick()}
              title={this.state.visibleOnly ? EN.VISIBLE_ONLY_OFF_BUTTON_TITLE : EN.VISIBLE_ONLY_BUTTON_TITLE }
            >
              {this.state.visibleOnly ? eyeIcon : eyeOffIcon}
            </button>
            <button className="iconButton" onClick={() => this.onClickCopySelectorToClipboard()} title={EN.COPY_SELECTOR_BUTTON_TITLE}>{clipboardIcon}</button>
          </div>
          <div>
            <button className="iconButton" onClick={() => this.toggleDarkmodeClick()}>Darkmode</button>
            <Settings
              darkMode={this.state.darkMode}
              chromeExtensionApi={this.chromeExtensionApi}
            ></Settings>
          </div>
      </div>
    );
  }

  renderAttributesHierarchySection() {
    return (
      <div>
        {this.state.attributesHierarchies.map((ah: AttributesHierarchy, i) => {
          return (
            <div className="attributeRow d-flex">
              {ah.map((attr, j) => this.renderAttributeButton(attr, i, j))}
            </div>
          );
        })}
      </div>
    );
  }

  renderAttributeButton(attribute: Attribute, rowIdx: number, buttonIdx: number) {
    const selector = this.buildSelector(attribute);
    let displaySelector = selector;
    let className = 'attributeButton';
    const isSelected = !!this.state.querySelectorState?.[rowIdx]?.[buttonIdx];
    if (isSelected) {
      className += ' selected';
      const isNotted = this.state.querySelectorState[rowIdx][buttonIdx].startsWith(':not');
      if (isNotted) {
        className += ' notted';
        displaySelector = `:not(${displaySelector})`;
      }
    }
    return (
      <div className="mr-1">
        <button
          className={className}
          onClick={(event) => this.onAttributeButtonClick(event, selector, rowIdx, buttonIdx)}
          title={EN.META_SELECTOR_BUTTON_TITLE}>
            {displaySelector}
        </button>
      </div>
    );
  }

  renderMatchCylcerFields() {
    const currentMatch = this.state.matchState.currentMatch < 1 ? '-' : this.state.matchState.currentMatch;
    const matchCount = this.state.matchState.matchCount < 1 ? '-' : this.state.matchState.matchCount;
    return (
      <div className="d-flex">
        <button className="iconButton mr-1" onClick={() => this.onClickPrev()} title={EN.PREVIOUS_BUTTON_TITLE}>{leftArrowsIcon}</button>
        <div className="totalMatchesCount mr-1"> {currentMatch} / {matchCount} </div>
        <button className="iconButton" onClick={() => this.onClickNext()} title={EN.NEXT_BUTTON_TITLE}>{rightArrowsIcon}</button>
      </div>
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
