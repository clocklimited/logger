const createLogger = require('..')
const { strictEqual } = require('assert')
const mockdate = require('mockdate')
const PassThrough = require('stream').PassThrough

describe('logger', () => {
  beforeEach(() => mockdate.set('2001'))
  afterEach(() => mockdate.reset())
  it('should contain scope and level ', done => {
    const outputStream = new PassThrough()

    outputStream.on('data', value =>
      strictEqual(
        value.toString(),
        `2001-01-01T00:00:00.000Z:${process.pid}:app:info\t["foo"]\n`
      )
    )

    const logger = createLogger('app', {
      logLevel: 'info',
      outputStream,
      colors: false
    })
    logger.info('foo')
    outputStream.end(done)
  })

  it('should not log by default', done => {
    const outputStream = new PassThrough()

    outputStream.on('data', value => done(new Error('Must never get called')))

    const logger = createLogger('app', {
      outputStream
    })
    logger.info('foo')
    outputStream.end(done)
  })

  it('should error on missing scope', done => {
    try {
      createLogger()
      throw new Error('Must not be called')
    } catch (e) {
      strictEqual(e.message, 'You must provide a scope')
      done()
    }
  })

  it('should allow colors', done => {
    const outputStream = new PassThrough()

    outputStream.on('data', value =>
      strictEqual(
        value.toString(),
        `2001-01-01T00:00:00.000Z:${
          process.pid
        }:app:\x1b[32minfo\x1b[0m\t["foo"]\n`
      )
    )

    const logger = createLogger('app', {
      outputStream,
      logLevel: 'info',
      colors: true
    })
    logger.info('foo')
    outputStream.end(done)
  })
})
