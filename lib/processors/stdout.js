const { format } = require('util')
const color = require('../color')
const levels = require('../levels')()
const parse = arg => {
  if (arg instanceof Error) {
    return '\n\n' + format(arg) + '\n'
  }
  return format(arg)
}

const pad = value => String(value).padStart(2, '0')

const formatTime = date =>
  pad(date.getHours()) +
  ':' +
  pad(date.getMinutes()) +
  ':' +
  pad(date.getSeconds())

const createStdOutProcessor = (stdout = process.stdout) => (
  { date, pid, scope, level },
  ...args
) => {
  stdout.write(
    [
      stdout.isTTY
        ? [
            color('grey', formatTime(date)),
            pid,
            color('cyan', scope),
            color(levels[level].color, level.padEnd(5, ' '))
          ].join(' ')
        : [date.toISOString(), pid, scope, level.padEnd(5, ' ')].join('\t'),
      [...args].map(parse)
    ].join(' ') + '\n'
  )
}

module.exports = createStdOutProcessor
