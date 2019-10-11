const createStdOutProcessor = require('../lib/processors/stdout')
const { strictEqual, ok } = require('assert')
describe('createStdOutProcessor', () => {
  it('should output as expected without color', done => {
    const mockStdOut = {
      write: value => {
        strictEqual(value, '2001-01-01T00:00:00.000Z:2:3:4	message\n')
        done()
      }
    }
    createStdOutProcessor(mockStdOut)(
      {
        date: new Date('2001'),
        pid: 2,
        scope: 3,
        level: 4
      },
      'message'
    )
  })

  it('should output as expected with color', done => {
    const mockStdOut = {
      write: value => {
        strictEqual(
          value,
          '2001-01-01T00:00:00.000Z:2:3:\x1b[32minfo\x1b[0m	message\n'
        )
        done()
      },
      isTTY: true
    }
    createStdOutProcessor(mockStdOut)(
      {
        date: new Date('2001'),
        pid: 2,
        scope: 3,
        level: 'info'
      },
      'message'
    )
  })

  it('should output error', done => {
    const mockStdOut = {
      write: value => {
        ok(
          value.includes(
            '2001-01-01T00:00:00.000Z:2:3:info\t\n\nError: No oh!'
          ),
          value
        )
        done()
      }
    }
    createStdOutProcessor(mockStdOut)(
      {
        date: new Date('2001'),
        pid: 2,
        scope: 3,
        level: 'info'
      },
      new Error('No oh!')
    )
  })
})
