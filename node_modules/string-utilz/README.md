# String Utilz
String management, tools and tricks for JavaScript.

## The Fun Stuff
[![Build Status](https://secure.travis-ci.org/MaddHacker/string-utilz.svg?branch=master)](http://travis-ci.org/MaddHacker/string-utilz)

[![Code Climate](https://codeclimate.com/github/MaddHacker/string-utilz/badges/gpa.svg)](https://codeclimate.com/github/MaddHacker/string-utilz)

[![Issue Count](https://codeclimate.com/github/MaddHacker/string-utilz/badges/issue_count.svg)](https://codeclimate.com/github/MaddHacker/string-utilz)

[![Test Coverage](https://codeclimate.com/github/MaddHacker/string-utilz/badges/coverage.svg)](https://codeclimate.com/github/MaddHacker/string-utilz/coverage)

[![Dependency Status](https://david-dm.org/MaddHacker/string-utilz/status.svg)](https://david-dm.org/MaddHacker/string-utilz)

[![npm Version](https://badge.fury.io/js/string-utilz.svg)](https://badge.fury.io/js/string-utilz)

## Why *Another* String formatting tool?
Several npms utilize multiple dependencies, and lead to code bloat.  There are also several modules on the market that are very opinionated (e.g. force you to do certain things) or are focused on a single form of string management.  This tool aims to be a lightweight, flexible solution that allows for infinitely customizable options to suit user needs.

## Getting Started
- Install [the npm](https://www.npmjs.com/package/string-utilz) in your project: `npm install --save string-utilz`
- Require the library where needed: `const stringz = require('string-utilz');`
- Manage strings in a much more seamless way.

# Default behavior
By default, you will need to use the object returned from the `require` statement to manage strings.  As an example:
```
const stringz = require('string-utilz');
stringz.startsWith('Bob','B'); // true
stringz.endsWith('Bob','o'); // false
```

## #addStringPrototypes()
If you are so inclined to let `string-utilz` try to prototype the `String` object, feel free to call the `stringz.addStringPrototypes()` method.  This will *non-destructively* add each of the functions to the `String` object, if there is no existing definition.  This can safely be called multiple times, without concern.

# String helpers
Depending on the version of Node.js (or where your application is running), you might or might not have access to `String#startsWith(str)` and `String#endsWith(str)`.  This module adds that functionality, as well as methods for `String#containsIgnoreCase(str)` and `String#replaceAll(oldStr,newStr)`.  These are documented below:
- `string#startsWith(str)` => returns `true` if `str` *exactly* matches the first part of `String`, `false` otherwise.
- `string#endsWith(str)` => returns `true` if `str` *exactly* matches the last part of `String`, `false` otherwise.
- `string#containsIgnoreCase(str)` => returns `true` if `str` matches any part of `String`, no matter the case, `false` otherwise.
- `string#replaceAll(oldStr,newStr)` => replaces all instances of `oldStr` with `newStr` and returns a new `String`.  It is important to note that this will replace all instances, the existing `String#replace(oldStr,newStr)` only replaces the **first** instance.
- `string#replaceAllIgnoreCase(oldStr,newStr)` => replaces all instances of `oldStr` with `newStr` and returns a new `String`.  It is important to note that this will replace all instances - without case sensitivity - the existing `String#replace(oldStr,newStr)` only replaces the **first** instance.
- `string#escapeRegEx()` => escapes all special RegEx characters
- `string#times(size)` => returns the `String` multipled by `size`, multiplying by 0 => `null` and muliplying by 1 or any negative number returns the `String`
- `string#pad(size,char)` => pads the given `String` `size` times using the given `char`.  `char` can be one or more characters, and is optional (default value is an empty space (`' '`)).  Negative `size` pads left, postive `size` pads right, and `0` as `size` doesn't pad.
- `string#chop(size)` => chops the given `String` `size` characters from the end (`size` > 0) or from the beginnning (`size` < 0).
- `string#fixSize(size, char)` => pads or chops the given `String` as needed, to make `string.length == Math.abs(size)`.  Positive values of `size` chop from the right or pad on the right, negative values of `size` chop from the left or pad to the left
- `string#fmt(args...)` => extends the string object to support formatting.  This formatting can be done using simple `%{s}` replacements (in order of the `args...`) or the `args...` can be referenced using their 0-based indicies (e.g. `%{0}` or `%{2}`)  
- `String.fmt(fmtString, args...)` => same functionality as `string#fmt(args...)`, just an extension of the `String` class, rather than object.

Usage examples:
```
// startsWith
'Bob'.startsWith('B'); // true
'Bob'.startsWith('b'); // false
'Franklin'.startsWith('Frank'); // true

// endsWith
'Bob'.endsWith('B'); // false
'Bob'.endsWith('b'); // true
'Franklin'.endsWith('lin'); // true

// containsIgnoreCase
'The quick brown fox'.containsIgnoreCase('quick'); // true
'The quick brown fox'.containsIgnoreCase('QUICK'); // true
'The quick brown fox'.containsIgnoreCase('ck BR'); // true
'The quick brown fox'.containsIgnoreCase('lazy'); // false

// replaceAll
'Bobby'.replaceAll('b','d'); // 'Boddy'
'Bobby'.replaceAll('B','d'); // 'dobby'
'Bobby'.replaceAll('n','d'); // 'Bobby'
'Meow meow meow, said the cat'.replaceAll('meow','woof') // 'Meow woof woof, said the cat'

// replaceAllIgnoreCase
'Bobby'.replaceAll('b','d'); // 'doddy'
'Bobby'.replaceAll('B','d'); // 'doddy'
'Bobby'.replaceAll('n','d'); // 'Bobby'
'Meow meow meow, said the cat'.replaceAll('meow','woof') // 'woof woof woof, said the cat'

// escapeRegEx
'-'.escapeRegEx(); // '\-' 
'{'.escapeRegEx(); // '\{'

// times
'*'.times(2); // '**'
'bob'.times(3); // 'bobbobbob'
'frank'.times(0); // null
'frank'.times(-2); // 'frank'

// pad
'-'.pad(1); // '- '
'frank'.pad(2, '-'); // 'frank--'
'frank'.pad(-2,'-'); // '--frank'
'bob'.pad(0); // 'bob'
'bob'.pad(1 'frank'); // 'bobfrank'

// chop
'testing'.chop(3); // 'test'
'testing'.chop(-4); // 'ing'

// fixSize
'testing'.fixSize(4); // 'test'
'testing'.fixSize(-3); // 'ing'
'testing'.fixSize(10, '-'); // 'testing---'
'testing'.fixSize(-10, '-'); // '---testing'
'testing'.fixSize(8); // 'testing '

// fmt
'The quick brown fox'.fmt('bob', 'frank') // 'The quick brown fox'
'The %{2} %{0} %{1}'.fmt('quick', 'brown', 'fox'); // 'The fox quick brown'
'The %{0} %{0} %{0}'.fmt('quick', 'brown', 'fox'); // 'The quick quick quick'
'The %{s} %{s} %{s}'.fmt('quick', 'brown', 'fox'); // 'The quick brown fox'

// String.fmt
String.fmt('The quick brown fox', 'bob', 'frank'); // 'The quick brown fox'
String.fmt('The %{2} %{0} %{1}', 'quick', 'brown', 'fox'); // 'The fox quick brown'
String.fmt('The %{0} %{0} %{0}', 'quick', 'brown', 'fox'); // 'The quick quick quick'
String.fmt('The %{s} %{s} %{s}', 'quick', 'brown', 'fox'); // 'The quick brown fox'

```

# Slack
This is one of several projects that are in the works, so feel free to reach out on [Slack](https://maddhacker.slack.com/).  Please email `slack at maddhacker dot com` for an invite.

# Issues
Please use the [Issues tab](../../issues) to report any problems or feature requests.

# Change Log
All change history can be found in the [CHANGELOG.md](CHANGELOG.md) file.
