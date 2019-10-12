const createStdOutProcessor = require('./lib/processors/stdout')
const levels = require('./lib/levels')()

const createLogger = (scope, options) => {
  if (!scope) throw new Error('You must provide a scope')
  const { logLevel, processors, context } = {
    context: {},
    processors: [createStdOutProcessor(process.stdout)],
    ...options
  }

  const logger = {}

  const write = (level, ...args) => {
    const meta = {
      date: new Date(),
      pid: process.pid,
      scope,
      level,
      ...context
    }
    processors.forEach(processor => {
      if (typeof processor === 'function') {
        if (!logLevel || levels[level].rank < levels[logLevel].rank) return null
        processor(meta, ...args)
      } else if (
        processor.processor &&
        typeof processor.processor === 'function'
      ) {
        if (
          !logLevel ||
          levels[level].rank < levels[processor.level || logLevel].rank
        )
          return null
        processor.processor(meta, ...args)
      }
    })
  }

  Object.keys(levels).forEach(level => {
    logger[level] = write.bind(null, level)
  })

  const setContext = context => {
    return createLogger(scope, { ...options, context })
  }

  return { ...logger, setContext }
}
createLogger.createStdOutProcessor = createStdOutProcessor
module.exports = createLogger
