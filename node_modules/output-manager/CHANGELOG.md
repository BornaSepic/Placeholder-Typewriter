# 2017-04-03 - v3.0.0
- Update [Jest](https://www.npmjs.com/package/jest) version.
- Update [string-utilz](https://github.com/MaddHacker/string-utilz) version.
- Add [date-utilz](https://github.com/MaddHacker/date-utilz) dependency.
- Refactor all of [out.js](https://github.com/MaddHacker/output-manager/blob/master/lib/out.js) into ES6 functions.
  - _**Breaking changes**_ to functionality/APIs (thus the major version jump)
  - Better naming convention to make things easier
  - Easier to override/modify
  - Old functionality moved to [out.old.js](https://github.com/MaddHacker/output-manager/blob/master/lib/out.old.js)

# 2017-02-26 - v2.1.0
- Externalize stringz into [string-utilz](https://github.com/MaddHacker/string-utilz)

# 2017-02-25 - v2.0.3
- Add formal changelog
- Rework structures to be more ES6-ish (no functional changes)
- Change default output to `process.stdout.write(msg + os.EOL);` from `console.log(msg)`

# 2017-01-25 - v2.0.2
- Code coverage analysis automation with [TravisCI](https://travis-ci.org/) and [CodeClimate](https://codeclimate.com)
- [Slack](https://maddhacker.slack.com) integrations over email

# 2017-01-24 - v2.0.1
- Integrate [CodeClimate](https://codeclimate.com)
- Small tweaks based on feedback there

# 2017-01-23 - v2.0.0
- Large rework of the core [Out](https://github.com/MaddHacker/output-manager/blob/master/lib/out.js) functionality forces major version bump.
- Support string formatting with `Stringz#fmt`
- Update tests
- Update documentation

# 2017-01-23 - v1.0.2
- Move from [Mocha](https://www.npmjs.com/package/mocha) to [Jest](https://www.npmjs.com/package/jest) framework

# 2017-01-21 - v1.0.1
- Documentation updates
- [TravisCI](https://travis-ci.org/) support

# 2017-01-20 - v1.0.0
- Initial release