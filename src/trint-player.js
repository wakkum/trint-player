// import Core from "./modules/core";
// import HALite from "./modules/hyperaudio-lite";
// import Share from "./modules/share";

import './themes/default/theme.css';

export default function Player() {
  console.log('Hello Trint Player');
}

if (ENV !== 'production') {
  // Enable LiveReload
  document.write(
    '<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>'
  );
}
