var test = require('tape')
var TestHelpers = require('../TestHelpers')

test('HaikuTimeline', (t) => {
  t.test('gotoAndStop', (t) => {
    const template = {
      elementName: 'div',
      attributes: { 'haiku-id': 'abcde' },
      children: []
    }

    const timelines = {
      Default: {
        'haiku:abcde': {
          'opacity': {
            0: { value: 0, curve: 'linear' },
            1000: { value: 1 }
          }
        }
      }
    }

    TestHelpers.createRenderTest(
      template,
      timelines,
      undefined,
      function (err, mount, renderer, context, component, teardown) {
        if (err) throw err
        component.getDefaultTimeline().play()
        t.equal(mount.firstChild.haiku.virtual.layout.opacity, 0, 'initial opacity is 0')
        component.getDefaultTimeline().seek(750)
        context.tick()
        t.equal(mount.firstChild.haiku.virtual.layout.opacity, 0.75, 'seek to 750ms')
        setTimeout(() => {
          t.notEqual(mount.firstChild.haiku.virtual.layout.opacity, 0.75, 'playhead is moving')
          component.getDefaultTimeline().gotoAndStop(500)
          setTimeout(() => {
            t.equal(mount.firstChild.haiku.virtual.layout.opacity, 0.5, 'stopped at 500ms')
            setTimeout(() => {
              t.equal(mount.firstChild.haiku.virtual.layout.opacity, 0.5, 'still stopped at 500ms')
              teardown()
              t.end()
            }, 100)
          }, 100)
        }, 100)
      }
    )
  })

  t.end()
})
