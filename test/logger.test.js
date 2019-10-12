const createLogger = require('..')
const { strictEqual, deepStrictEqual, ok } = require('assert')
const mockdate = require('mockdate')

describe('logger', () => {
  beforeEach(() => mockdate.set('2001'))
  afterEach(() => mockdate.reset())
  it('should not log by default', done => {
    const logger = createLogger('app', {
      processors: [value => done(new Error())]
    })
    logger.info('foo')
    done()
  })

  it('should contain date, scope, pid and level in meta', done => {
    const logger = createLogger('app', {
      logLevel: 'info',
      processors: [
        meta => {
          deepStrictEqual(meta, {
            date: new Date('2001-01-01T00:00:00.000Z'),
            level: 'info',
            pid: process.pid,
            scope: 'app'
          })
          done()
        }
      ]
    })
    logger.info('foo')
  })

  it('should contain extra data', done => {
    const logger = createLogger('app', {
      logLevel: 'info',
      processors: [
        (meta, extra) => {
          deepStrictEqual(extra, 'foo')
          done()
        }
      ]
    })
    logger.info('foo')
  })

  it('should allow many extra data arguments as objects and arrays', done => {
    const logger = createLogger('app', {
      logLevel: 'info',
      processors: [
        (meta, ...extra) => {
          deepStrictEqual(extra, [
            { foo: 'bar' },
            42,
            'foobar',
            [3, 1, 4, 1, 5]
          ])
          done()
        }
      ]
    })
    logger.info({ foo: 'bar' }, 42, 'foobar', [3, 1, 4, 1, 5])
  })

  it('should allow extra data as error', done => {
    const logger = createLogger('app', {
      logLevel: 'info',
      processors: [
        (meta, extra) => {
          ok(extra instanceof Error)
          done()
        }
      ]
    })
    logger.info(new Error('Oh no!'))
  })

  it('should allow multiple processors', done => {
    const logger = createLogger('app', {
      logLevel: 'info',
      processors: [
        (meta, extra) => {
          deepStrictEqual(meta, {
            date: new Date('2001-01-01T00:00:00.000Z'),
            level: 'info',
            pid: process.pid,
            scope: 'app'
          })
          strictEqual(extra, 'Hello')
        },
        (meta, extra) => {
          deepStrictEqual(meta, {
            date: new Date('2001-01-01T00:00:00.000Z'),
            level: 'info',
            pid: process.pid,
            scope: 'app'
          })
          strictEqual(extra, 'Hello')
          done()
        }
      ]
    })
    logger.info('Hello')
  })

  it('should allow processor to set a level', done => {
    const logger = createLogger('app', {
      logLevel: 'info',
      processors: [
        {
          processor: (meta, extra) => {
            done(new Error('Should not run with warn level'))
          },
          level: 'warn'
        },
        (meta, extra) => {
          deepStrictEqual(meta, {
            date: new Date('2001-01-01T00:00:00.000Z'),
            level: 'info',
            pid: process.pid,
            scope: 'app'
          })
          strictEqual(extra, 'Hello')
          done()
        }
      ]
    })
    logger.info('Hello')
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

  it('should export stdoutProcessor', () => {
    strictEqual(typeof createLogger.createStdOutProcessor, 'function')
  })

  it('should allow setting of context', done => {
    const logger = createLogger('app', {
      logLevel: 'info',
      processors: [
        (meta, extra) => {
          deepStrictEqual(meta, {
            date: new Date('2001-01-01T00:00:00.000Z'),
            level: 'info',
            pid: process.pid,
            scope: 'app',
            tags: {
              application: 'site'
            }
          })
          strictEqual(extra, 'Hello')
          done()
        }
      ]
    })

    const contextualLogger = logger.setContext({
      tags: { application: 'site' }
    })
    contextualLogger.info('Hello')
  })
})
