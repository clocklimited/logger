const createStdOutProcessor = require('./lib/processors/stdout')
const levels = require('./lib/levels')()

const createLogger = (scope, options) => {
  if (!scope) throw new Error('You must provide a scope')
  const { logLevel, log } = {
    log: createStdOutProcessor(process.stdout),
    ...options
  }

  const logger = {}

  const write = (level, ...args) => {
    if (!logLevel || levels[level].rank < levels[logLevel].rank) return null
    log({ date: new Date(), pid: process.pid, scope, level }, ...args)
  }

  Object.keys(levels).forEach(level => {
    logger[level] = write.bind(null, level)
  })

  return logger
}
createLogger.createStdOutProcessor = createStdOutProcessor
module.exports = createLogger
