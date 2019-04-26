# json2po-stream
Create .po files.

Pipe [ndjson](https://www.npmjs.com/package/ndjson) in and get a .po formatted file out.

The ndjson objects should be entries and look something like this:

```json
{
  "id": "Untranslated string",
  "str": "Translated string"
}
```

Output:

```
msgid "Untranslated string"
msgstr "Translated string"
```

Ok so thats fun...but what about 

## Multi line strings

```json
{
  "id": "",
  "str": [
    "Language: en\\n",
    "Content-Type: text/plain; charset=UTF-8\\n"
  ]
}
```

Output:

```
msgid ""
msgstr ""
"Language: en\n"
"Content-Type: text/plain; charset=UTF-8\n"
```

## Plurals

```json
{
  "id": "found %d fatal error",
  "idPlural": "found %d fatal errors",
  "str": [
    "s'ha trobat %d error fatal",
    "s'han trobat %d errors fatals"
  ]
}
```

Output:

```
msgid "found %d fatal error"
msgid_plural "found %d fatal errors"
msgstr[0] "s'ha trobat %d error fatal"
msgstr[1] "s'han trobat %d errors fatals"
```

## Context

```json
{
  "context": "Languages",
  "id": "2co_enable_fraud_verification",
  "str": "Enable support of fraud notification"
}
```

```
msgctxt "Languages"
msgid "2co_enable_fraud_verification"
msgstr "Enable support of fraud notification"
```

## Comments

```json
{
  "translatorComments": [
    "Base pack of \"English\" language variables",
    "Compiled by computer"
  ],
  "extractedComments": "Enable support of fraud notification",
  "reference": "src/msgcmp.c:338 src/po-lex.c:699",
  "flag": "c-format",
  "id": "found %d fatal error",
  "str": "Status for orders with failed fraud review"
}
```

```
# Base pack of "English" language variables
# Compiled by computer
#. Enable support of fraud notification
#: src/msgcmp.c:338 src/po-lex.c:699
#, c-format
msgid "found %d fatal error"
msgstr "Status for orders with failed fraud review"
```
