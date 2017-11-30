export { legacyVisible }

function currentBrowser () {
  const matches = /.*Cypress\/([^ ]*) Chrome\/([^ ]+) Electron\/([^ ]+) .*/.exec(
    window.navigator.userAgent
  )
  if (!matches) {
    return null
  }
  const cypressVersion = matches[1]
  const chromeVersion = matches[2]
  const electronVersion = matches[3]
  const majorChromeVersion = parseInt(chromeVersion.split('.'))
  return {
    cypressVersion,
    chromeVersion,
    electronVersion,
    majorChromeVersion
  }
}

function isLegacyElectron () {
  const browserInfo = currentBrowser()
  if (!browserInfo) {
    return null
  }
  return browserInfo.majorChromeVersion < 54
}

function legacyVisible (chai, utils) {
  const { Assertion } = chai

  utils.addProperty(Assertion.prototype, 'legacyVisible', function () {
    const el = this._obj
    if (isLegacyElectron() && el.closest('svg').length) {
      console.warn('Legacy Chrome version detected: running custom logic for isVisible of an element inside an SVG DOM node as it doesn\'t compute visibility properly', currentBrowser())
      new Assertion(el.css('display')).to.not.be.equal('none')
      new Assertion(el.css('opacity')).to.be.above(0)
      new Assertion(el.css('visibility')).to.not.be.equal('hidden')
      // We cannot rely on width and height nor on getClientRects() as it is not
      // implemented in this version of Chrome yet:
      // https://bugs.chromium.org/p/chromium/issues/detail?id=643044#c2
      new Assertion(el.closest('svg')).to.be.visible
    } else {
      new Assertion(el).to.be.visible
    }
  })
}
