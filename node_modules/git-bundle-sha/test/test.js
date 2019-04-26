var assert = require('assert'),
    child_process = require('child_process'),
    sinon = require('sinon'),
    gitsha = require('../'),

    exec = sinon.stub(),

    fixtures = {
      HEAD_SHA: '79ed879fc3f870f04994a8e8aa6d9a987d5407dd',
      BUNDLE_SHA: '0d826a2a873ce46e81acd19d7c54302ede2b1926',
      SUBMODULE: ' 6ec2759e4e3628c3a59994f098ee5471563c4938 path/to/submodule (remotes/origin/branch)\n',
      SUBMODULE_SHA: '6ec2759e4e3628c3a59994f098ee5471563c4938'
    };

// Stub the child_process.exec built-in
exec.withArgs('git log -1 --format=%H')
  .callsArgWith(1, null, fixtures.HEAD_SHA);
exec.withArgs('git log -1 --format=%H -- fileA.js fileB.js')
  .callsArgWith(1, null, fixtures.BUNDLE_SHA);
exec.withArgs('git submodule')
  .callsArgWith(1, null, fixtures.SUBMODULE);
exec.withArgs('git log -1 --format=%H -- fileA.js path/to/submodule/fileC.js')
  .callsArgWith(1, null, fixtures.SUBMODULE_SHA);
child_process.exec = exec;

describe('git-bundle-sha', function() {
  describe('defaults', function () {
    it('should return HEAD revision with no arguments', function (done) {
      gitsha(function (err, sha) {
        assert.equal(fixtures.HEAD_SHA, sha);
        done();
      });
    });

    it('should return SHA for a given bundle', function (done) {
      gitsha(['fileA.js', 'fileB.js'], function (err, sha) {
        assert.equal(fixtures.BUNDLE_SHA, sha);
        done();
      });
    });

    it('should return SHA for bundle using submodules', function (done) {
      gitsha(['fileA.js', 'path/to/submodule/fileC.js'], function (err, sha) {
        assert.equal(fixtures.SUBMODULE_SHA, sha);
        done();
      });
    });
  });

  describe('with variable SHA length', function () {
    var shaLength = 7;

    it('should return trimmed HEAD revision', function (done) {
      gitsha({length: shaLength}, function(err, sha) {
        assert.equal(fixtures.HEAD_SHA.slice(0, shaLength), sha);
        done();
      });
    });

    it('should return trimmed bundle revision', function (done) {
      gitsha(['fileA.js', 'fileB.js'], {length: shaLength}, function (err, sha) {
        assert.equal(fixtures.BUNDLE_SHA.slice(0, shaLength), sha);
        done();
      });
    });
  });
});

