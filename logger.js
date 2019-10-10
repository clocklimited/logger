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

const parse = arg => {
  if (arg instanceof Error) {
    return '\n\n' + format(arg) + '\n'
  }
  return format(arg)
}
const stdout = ({ date, pid, scope, level }, ...args) =>
  process.stdout.write(
    [
      [date, pid, scope, colorize(level)].join(':'),
      process.stdout.isTTY
        ? [...args].map(parse)
        : JSON.stringify([...args].map(arg => format(arg))),
      '\n'
    ].join('\t')
  )
const colorize = level =>
  process.stdout.isTTY
    ? `${colorMap[levels[level].color]}${level}\x1b[0m`
    : level

const createLogger = (
  scope,
  { logLevel, log = stdout, colors = process.stdout.isTTY } = {
    outputStream: process.stdout
  }
) => {
  if (!scope) throw new Error('You must provide a scope')

  const logger = {}

  const writeLog = (level, ...args) => {
    if (!logLevel || levels[level].rank < levels[logLevel].rank) return null
    log(
      { date: new Date().toISOString(), pid: process.pid, scope, level },
      ...args
    )
  }

  Object.keys(levels).forEach(level => {
    logger[level] = writeLog.bind(null, level)
  })

  return logger
}

module.exports = createLogger
