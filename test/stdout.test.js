const createStdOutProcessor = require('../lib/processors/stdout')
const { strictEqual, ok } = require('assert')

const color = require('../lib/color')

describe('createStdOutProcessor', () => {
  it('should output as expected without color', done => {
    const mockStdOut = {
      write: value => {
        strictEqual(value, '2001-01-01T00:00:00.000Z	2	3	info  message\n')
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
      'message'
    )
  })

  it('should output as expected with color', done => {
    const mockStdOut = {
      write: value => {
        strictEqual(
          value,
          `${color('grey', '00:00:00')} 2 ${color('cyan', '3')} ${color(
            'green',
            'info '
          )} message\n`
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
        ok(value.includes('Error: No oh!'), value)
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
