import './App.css';
import {injectString, testInjectString} from './EvalFunctions';

/**
 * Fill this in as new extension api features are used.
 */
type RawChrome = {
  runtime: object,
  devtools: {
    panels: {
      themeName: 'default' | 'dark',
    },
    inspectedWindow: {
      eval: (evalString: string, callback: ((result: any, isException: boolean) => void)) => void,
    }
  },
};

const mockChrome: RawChrome = {
  runtime: {},
  devtools: {
    panels: {
      themeName: 'default',
    },
    inspectedWindow: {
      eval: (evalStr, callback) => {
        try {
          console.log(window['$0' as any]);
          console.log(window['0' as any]);
          console.log(Object.keys(window));
          // eslint-disable-next-line no-eval
          const result = eval(evalStr);
          callback(result, false);
        } catch(e) {
          callback(e, true);
        }
      },
    }
  },
};

export enum HelperScript {
  getAttributesFromElems = 'getAttributesFromElems',
  selectElem = "selectElem",
  isElemVisible = "isElemVisible",
}

export default class ChromeExtensionApi {
  constructor(private test: boolean){}

  getTheme(): RawChrome["devtools"]["panels"]["themeName"]{
    return this.getRawChromeApi().devtools.panels.themeName;
  }

  async runHelperScript(script: HelperScript, args?: string[]): Promise<any> {
    const alreadyInjectedEval = "(function(){return (typeof " + script + " !== 'undefined');}());";
    const alreadyInjected = await this.runInInspectedWindow(alreadyInjectedEval); // error handling?

    //unroll args into script
    let evalStr = "";
    if (!alreadyInjected) {
      evalStr += this.test ? testInjectString : injectString; // injectString is in evalHelpers.js
    }

    // build args string. Args themselves must be strings.
    let argsStr = '';
    if (!!args && args.length > 0) {
      argsStr = `"${args.join('","')}"`;
    }

    // create function call of script. Eg: myFunc("arg0", "arg1").
    evalStr += `${script}(${argsStr});`;

    return await this.runInInspectedWindow(evalStr);
  }

  private async runInInspectedWindow(evalString: string): Promise<any> {
    const evalF = this.getRawChromeApi().devtools.inspectedWindow.eval;
    return new Promise((resolve, reject) => {
      evalF(evalString, (result, isException) => {
        if (isException) {
          console.error(`Eval string rejected\n${evalString}`)
          reject(result);
        }
        resolve(result);
      });
    });
  }

  private getRawChromeApi(): RawChrome {
    if (this.test) {
      return mockChrome;
    }
    const chrome = (window as any)?.chrome as RawChrome | null;
    if (!chrome) {
      throw new Error('Could not access chrome!');
    }
    return chrome;
  }
}
