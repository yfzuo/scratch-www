var child_process = require('child_process');

module.exports = function getSubmodules (callback) {
  child_process.exec('git submodule', function (err, resp) {
    if (err) return callback(err);
    return callback(null, resp.split('\n').filter(Boolean).map(function (line) {
      return line.trim().split(' ')[1];
    }));
  });
};
