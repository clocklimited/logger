const colorMap = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  inverse: '\x1b[7m',
  bright: '\x1b[1m\x1b[37m',
  grey: '\x1b[38;0;2m'
}

const color = (color, text) =>
  `${colorMap[color] ? colorMap[color] : ''}${text}\x1b[0m`

module.exports = color
