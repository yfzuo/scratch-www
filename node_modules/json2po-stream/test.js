var test = require('tape')
var json2po = require('./')

test('Creates an entry', function (t) {
  t.plan(1)

  var expected = [
    'msgid "TEST 1"',
    'msgstr "TESTING 123"'
  ].join('\n') + '\n'

  var out = ''

  var stream = json2po()

  stream.on('data', function (data) { out += data })

  stream.write(JSON.stringify({id: 'TEST 1', str: 'TESTING 123'}) + '\n')

  stream.end(function () {
    console.log(out)
    t.equal(out, expected, 'Output was expected')
    t.end()
  })
})
