(this["webpackJsonpcss-selector-helper"]=this["webpackJsonpcss-selector-helper"]||[]).push([[0],{14:function(e,t,n){},15:function(e,t,n){},16:function(e,t,n){"use strict";n.r(t);var s=n(0),i=n(1),a=n.n(i),c=n(3),r=n.n(c),l=(n(14),n(4)),d=n(5),o=n(6),h=n(8),j=n(7),u=(n(15),function(e){Object(h.a)(n,e);var t=Object(j.a)(n);function n(e){var s,i,a,c;return Object(d.a)(this,n),(c=t.call(this,e)).state={settingsExpanded:!1,darkMode:"dark"===(null===(s=window.chrome)||void 0===s||null===(i=s.devtools)||void 0===i||null===(a=i.panels)||void 0===a?void 0:a.themeName)},c}return Object(o.a)(n,[{key:"toggleState",value:function(e){"undefined"===typeof this.state[e]&&console.error("State not found: "+e),this.setState((function(t){return Object(l.a)({},e,!t[e])}))}},{key:"plusDarkTheme",value:function(e){return e+(this.state.darkMode?" dark-theme":"")}},{key:"render",value:function(){return Object(s.jsxs)("div",{className:this.plusDarkTheme("App"),children:[Object(s.jsx)("div",{children:"hello world"}),Object(s.jsx)("div",{children:this.renderSettings()})]})}},{key:"renderSettings",value:function(){var e=this,t=Object(s.jsx)("div",{className:"darkmode-setting",children:"todo settings"});return Object(s.jsxs)("div",{className:"settings",children:[Object(s.jsx)("button",{onClick:function(){return e.toggleState("settingsExpanded")},children:this.renderSettingsIcon()}),this.state.settingsExpanded?t:null]})}},{key:"renderSettingsIcon",value:function(){var e=Object(s.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",width:"24",height:"24",children:[Object(s.jsx)("path",{fill:"none",d:"M0 0h24v24H0z"}),Object(s.jsx)("path",{d:"M8.686 4l2.607-2.607a1 1 0 0 1 1.414 0L15.314 4H19a1 1 0 0 1 1 1v3.686l2.607 2.607a1 1 0 0 1 0 1.414L20 15.314V19a1 1 0 0 1-1 1h-3.686l-2.607 2.607a1 1 0 0 1-1.414 0L8.686 20H5a1 1 0 0 1-1-1v-3.686l-2.607-2.607a1 1 0 0 1 0-1.414L4 8.686V5a1 1 0 0 1 1-1h3.686zM6 6v3.515L3.515 12 6 14.485V18h3.515L12 20.485 14.485 18H18v-3.515L20.485 12 18 9.515V6h-3.515L12 3.515 9.515 6H6zm6 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"})]}),t=Object(s.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",width:"24",height:"24",children:[Object(s.jsx)("path",{fill:"none",d:"M0 0h24v24H0z"}),Object(s.jsx)("path",{d:"M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z"})]}),n=Object(s.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",width:"24",height:"24",children:[Object(s.jsx)("path",{fill:"none",d:"M0 0h24v24H0z"}),Object(s.jsx)("path",{d:"M12 10.828l-4.95 4.95-1.414-1.414L12 8l6.364 6.364-1.414 1.414z"})]});return Object(s.jsxs)("span",{children:[e,this.state.settingsExpanded?t:n]})}}]),n}(a.a.Component)),v=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,17)).then((function(t){var n=t.getCLS,s=t.getFID,i=t.getFCP,a=t.getLCP,c=t.getTTFB;n(e),s(e),i(e),a(e),c(e)}))};r.a.render(Object(s.jsx)(a.a.StrictMode,{children:Object(s.jsx)(u,{})}),document.getElementById("root")),v()}},[[16,1,2]]]);