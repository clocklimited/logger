# logger - Simple Logging

[![build status](https://secure.travis-ci.org/serby/logger.png)](http://travis-ci.org/serby/logger)
[![dependency status](https://david-dm.org/serby/logger.svg)](https://david-dm.org/serby/logger)

## Installation

    npm install @serby/logger
    yarn add @serby/logger

## Usage

```js
const logger = createLogger('app', {
  outputStream: process.stdout, // this is the default
  logLevel: 'info', // Will default to no logging
  colors: true // defaults to true on tty
})
logger.trace('foo trace')
logger.debug('foo debug')
logger.info('foo info')
logger.warn('foo warn')
logger.error('foo error')
logger.fatal('foo fatal')
```

## Credits

[Paul Serby](https://github.com/serby/) follow me on [twitter](http://twitter.com/serby)

## License

Licensed under the [ISC](http://opensource.org/licenses/isc)