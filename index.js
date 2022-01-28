"use strict";

const { type } = require("os");

const supportedPlatforms = new Set([
  "aix",
  "android",
  "darwin",
  "freebsd",
  "linux",
  "openbsd",
  "sunos",
  "win32"
]);

if (supportedPlatforms.has(process.platform)) {
  const m = (() => {
    switch (process.platform) {
      case 'android': return require('./android');
      case 'darwin': return require('./darwin');
      case 'freebsd': return require('./freebsd');
      case 'linux': return require('./linux');
      case 'openbsd': return require('./openbsd');
      case 'win32': return require('./win32');
      case 'aix':
        return type() === 'OS400' ? require('./ibmi') : require('./sunos');
    }
  })();

  module.exports.v4 = () => m.v4();
  module.exports.v6 = () => m.v6();
  module.exports.v4.sync = () => m.v4.sync();
  module.exports.v6.sync = () => m.v6.sync();
} else {
  const err = new Error(`Unsupported Platform: ${process.platform}`);
  module.exports.v4 = () => Promise.reject(err);
  module.exports.v6 = () => Promise.reject(err);
  module.exports.v4.sync = () => { throw err; };
  module.exports.v6.sync = () => { throw err; };
}
