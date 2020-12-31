import React from 'react';
import ChromeExtensionApi from '../helpers/ChromeExtensionApi';
import 'bootstrap/dist/css/bootstrap.min.css';
import { downArrowIcon, settingsIcon, upArrowIcon } from './Icons';


interface IProps {
    chromeExtensionApi: ChromeExtensionApi;
    // localStorage: LocalStorage;
}

interface IState {
    settingsExpanded: boolean;
}

class Settings extends React.Component<IProps, IState> {

  chromeExtensionApi = new ChromeExtensionApi();

  constructor(props: any) {
    super(props);
    this.state = {
      settingsExpanded: false,
    };
  }

  onToggleSettingsExpandClick() {
    this.setState({
      settingsExpanded: !this.state.settingsExpanded
    });
  }

    //<input type="checkbox" value={this.props.localStorage.showTagNames}></input>
  render() {
    const settings = (
      <div className="">
          <div>
              <label>Show tag names</label>
          </div>
          <div>
              <input type="checkbox" ></input>
              <label>Show ids</label>
          </div>
          <div>
              <input type="checkbox" ></input>
              <label>Show classes</label>
          </div>
          <div>
              <input type="checkbox" ></input>
              <label>Show other attributes</label>
          </div>
          <div>
            <label>Custom Tag Filters:</label>
            <div>*accepts line separated regex which will filter out tag values</div>
            <textarea></textarea>
          </div>
      </div>
    );
    return (
      <div className="settings">
        <button className="iconButton mb-2" onClick={() => this.onToggleSettingsExpandClick()}>{this.renderSettingsIcon()}</button>
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

//   plusDarkTheme(classString: string) {
//     return classString + (this.state.darkMode ? ' dark-theme' : '');
//   }
}

/*
- color code the parts, eg: div/span/etc are light grey, class is light blue, etc
- add blacklist to filter out things, can either remove parts like element type, classes, ids, specific selectors like href or target or data-reactid, etc. OR disable a specific part type/value combo (eg: [data-reactid='17'])
*/

export default Settings;
