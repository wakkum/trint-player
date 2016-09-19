(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.trint-player = factory());
}(this, (function () { 'use strict';

function __$styleInject(css, returnValue) {
  if (typeof document === 'undefined') {
    return returnValue;
  }
  css = css || '';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  head.appendChild(style);
  return returnValue;
}
__$styleInject("body{font-weight:400}#hypertranscript .strikethrough{text-decoration:line-through}#hypertranscript .annotation,#hypertranscript .parannotation{opacity:.7}#hypertranscript span.highlight{background-color:#ff0!important}#hypertranscript span.highlight.active{background-color:#90ee90!important}#hypertranscript header{font-size:200%}#hypertranscript a{cursor:pointer;color:#000}#hypertranscript .active~span,#hypertranscript p.active~p span{color:#666}#hypertranscript span.search-match{background-color:pink!important}#hypertranscript sub:before{content:'\\231C'}#hypertranscript sub.highlight-duration:before{content:'\\231D'}a.sharelink{color:#ddd}a.sharelink:hover{color:#fff}", undefined);

// import Core from "./modules/core";
// import HALite from "./modules/hyperaudio-lite";
// import Share from "./modules/share";

function Player() {
  console.log('Hello Trint Player');
}

if (ENV !== 'production') {
  // Enable LiveReload
  document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>');
}

return Player;

})));
//# sourceMappingURL=trint-player.js.map
