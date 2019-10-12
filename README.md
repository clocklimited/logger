# logger - Simple Logging

[![build status](https://secure.travis-ci.org/serby/logger.png)](http://travis-ci.org/serby/logger)
[![dependency status](https://david-dm.org/serby/logger.svg)](https://david-dm.org/serby/logger)

## Installation

    npm install @serby/logger
    yarn add @serby/logger

## Usage

### Basic

```js
const createLogger = require('@serby/logger')
const logger = createLogger('app', {
  logLevel: 'info' // Will default to no logging
})
logger.trace('foo trace')
logger.debug('foo debug')
logger.info('foo info')
logger.warn('foo warn')
logger.error('foo error')
logger.fatal('foo fatal')
```

### Extra Context

```js
const createLogger = require('@serby/logger')
const logger = createLogger('app', { logLevel: 'info' })
logger.info('No context')

const userLogger = logger.setContext({ user: 'Paul' })

userLogger.info('New login') // This will log with the captured context
```

### Multiple Processors

```js
const const createLogger = require('@serby/logger')

// Get the default stdout processor
const { createStdOutProcessor } = createLogger

const processors = [
  { processor: createStdOutProcessor(), level: 'info' },

  // `createStdOutProcessor` can take an alternative write stream
  { processor: createStdOutProcessor(fs.createFileStream('/var/logs/foo/info.log')) }

  // Write errors to separate file
  { processor: createStdOutProcessor(fs.createFileStream('/var/logs/foo/errors.log')), level: 'error' },

  // Or you can make your own with this interface
  { processor: (meta, data) => console.debug(meta, data), level: 'debug' }
]

const logger = createLogger('app', {
  processors, // this will default to a single stdout processor
  logLevel: 'info'
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
