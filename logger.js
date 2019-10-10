const { format } = require('util')

const levels = {
  trace: { rank: 1, color: 'white' },
  debug: { rank: 1, color: 'cyan' },
  info: { rank: 2, color: 'green' },
  warn: { rank: 3, color: 'yellow' },
  error: { rank: 4, color: 'red' },
  fatal: { rank: 4, color: 'inverse' }
}
const colorMap = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  inverse: '\x1b[7m'
}

const createLogger = (
  scope,
  { logLevel, outputStream = process.stdout, colors = process.stdout.isTTY } = {
    outputStream: process.stdout,
    colors: process.stdout.isTTY
  }
) => {
  if (!scope) throw new Error('You must provide a scope')
  const colorize = level =>
    colors ? `${colorMap[levels[level].color]}${level}\x1b[0m` : level
  const log = {}

  const writeLog = (level, ...args) => {
    if (!logLevel || levels[level].rank < levels[logLevel].rank) return null
    outputStream.write(
      [
        `${new Date().toISOString()}:${process.pid}:${scope}:${colorize(
          level
        )}`,
        JSON.stringify([...args].map(arg => format(arg)))
      ].join('\t') + '\n'
    )
  }

  Object.keys(levels).forEach(level => {
    log[level] = writeLog.bind(null, level)
  })

  return log
}

module.exports = createLogger
