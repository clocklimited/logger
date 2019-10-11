module.exports = () => ({
  trace: { rank: 1, color: 'white' },
  debug: { rank: 1, color: 'cyan' },
  info: { rank: 2, color: 'green' },
  warn: { rank: 3, color: 'yellow' },
  error: { rank: 4, color: 'red' },
  fatal: { rank: 4, color: 'inverse' }
})
