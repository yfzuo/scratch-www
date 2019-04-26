var ndjson = require('ndjson')
var duplexer = require('duplexer2')
var through = require('through2')
var Joi = require('joi')

var schema = Joi.alternatives().try(
  Joi.object().keys({
    translatorComments: Joi.array().items(Joi.string()).single().default([]),
    extractedComments: Joi.array().items(Joi.string()).single().default([]),
    reference: Joi.array().items(Joi.string()).single().default([]),
    flag: Joi.array().items(Joi.string()).single().default([]),
    prevId: Joi.string(),
    context: Joi.string(),
    id: Joi.array().items(Joi.string()).min(1).single().required(),
    str: Joi.array().items(Joi.string()).min(1).single().required()
  }),
  Joi.object().keys({
    translatorComments: Joi.array().items(Joi.string()).single().default([]),
    extractedComments: Joi.array().items(Joi.string()).single().default([]),
    reference: Joi.array().items(Joi.string()).single().default([]),
    flag: Joi.array().items(Joi.string()).single().default([]),
    prevId: Joi.string(),
    context: Joi.string(),
    id: Joi.array().items(Joi.string()).min(1).single().required(),
    prevIdPlural: Joi.string(),
    idPlural: Joi.array().items(Joi.string()).single().required(),
    str: Joi.array().items(
      Joi.array().items(Joi.string()).min(1).single()
    ).min(1).single().required()
  })
).required()

function escapeQuotes (str) {
  return str.replace(/"/g, '\\"')
}

module.exports = function () {
  var writeable = ndjson()

  var readable = through.obj(function (chunk, enc, cb) {
    var self = this

    schema.validate(chunk, function (err, entry) {
      if (err) return cb(err)

      entry.translatorComments.forEach(function (comment) {
        self.push('# ' + comment + '\n')
      })

      entry.extractedComments.forEach(function (comment) {
        self.push('#. ' + comment + '\n')
      })

      entry.reference.forEach(function (ref) {
        self.push('#: ' + ref + '\n')
      })

      entry.flag.forEach(function (flag) {
        self.push('#, ' + flag + '\n')
      })

      if (entry.prevId) {
        self.push('#| msgid "' + escapeQuotes(entry.prevId) + '"\n')
      }

      if (entry.prevIdPlural) {
        self.push('#| msgid_plural "' + escapeQuotes(entry.prevIdPlural) + '"\n')
      }

      if (entry.context) {
        self.push('msgctxt "' + escapeQuotes(entry.context) + '"\n')
      }

      if (entry.id.length == 1) {
        self.push('msgid "' + escapeQuotes(entry.id[0]) + '"\n')
      } else {
        self.push('msgid ""\n')
        entry.id.forEach(function (line) {
          self.push('"' + escapeQuotes(line) + '"\n')
        })
      }

      if (entry.idPlural) {
        if (entry.idPlural.length == 1) {
          self.push('msgid_plural "' + escapeQuotes(entry.idPlural[0]) + '"\n')
        } else {
          self.push('msgid_plural ""\n')
          entry.idPlural.forEach(function (line) {
            self.push('"' + escapeQuotes(line) + '"\n')
          })
        }

        entry.str.forEach(function (str, i) {
          if (str.length == 1) {
            self.push('msgstr[' + i + '] "' + escapeQuotes(str[0]) + '"\n')
          } else {
            self.push('msgstr[' + i + '] ""\n')
            str.forEach(function (line) {
              self.push('"' + escapeQuotes(line) + '"\n')
            })
          }
        })

      } else {
        if (entry.str.length == 1) {
          self.push('msgstr "' + escapeQuotes(entry.str[0]) + '"\n')
        } else {
          self.push('msgstr ""\n')
          entry.str.forEach(function (line) {
            self.push('"' + escapeQuotes(line) + '"\n')
          })
        }
      }

      cb(null, '\n')
    })
  })

  writeable.pipe(readable)

  return duplexer(writeable, readable)
}