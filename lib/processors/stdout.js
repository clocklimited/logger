const { format } = require('util')
const levels = require('../levels')()
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

const createStdOutProcessor = stdout => (
  { date, pid, scope, level },
  ...args
) => {
  const colorize = level =>
    stdout.isTTY ? `${colorMap[levels[level].color]}${level}\x1b[0m` : level

  stdout.write(
    [
      [date.toISOString(), pid, scope, colorize(level)].join(':'),
      [...args].map(parse)
    ].join('\t') + '\n'
  )
}

module.exports = createStdOutProcessor
