window.Spotless = class {
  constructor (config) {
    this.version = 'v0.0.1'
    this.config = config
    this.currentPage = this.getCurrentPage()
    this.blurEvent = document.createEvent('HTMLEvents')
    this.blurEvent.initEvent('blur', false, true)
    if (config.debug) {
      console.log('Spotless: Built and reloaded from dev server')
      console.log('Spotless: Current page: ' + this.currentPage)
    }
  }
  getCurrentPage() {
    try {
      return document.getElementsByClassName('spotlessPage')[0].id
    } catch(e) {
      if (config.debug) console.log('Spotless: Error: spotlessPage is not set for this tab')
      return undefined
    }
  }
  onPage(pageName, callback) {
    if (this.currentPage === pageName) callback()
  }
  messageBox(text) {
    this.sendToProxy('msg', {text: text})
  }
  setDocProp(name, value) {
    let props = {}
    props[name] = value
    this.setDocProps(props)
  }
  setDocProps(docProps) {
    this.sendToProxy('setProps', {"props": docProps})
  }
  callPython(function_name, params) {
    this.sendToProxy('call', {"function": function_name, "params": params})
  }
  domSync(selector, value) {
    let el = spotless.$(selector)
    el.value = value
    el.dispatchEvent(this.blurEvent)
  }
  sendToProxy(action, message) {
    message.version = 1
    message.action = action
    // Cache buster: Spotfire only updates bound Doc Props if new value
    message.uniq = this.randStr()
    let jsonToProxy = JSON.stringify(message)
    if (this.config.debug) console.log(jsonToProxy)
    this.domSync('#spotlessProxy input', jsonToProxy)
  }
  randStr() {
    var result = ""
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (var i = 0; i < 7; i++)
      result += possible.charAt(Math.floor(Math.random() * possible.length))
    return result
  }
  $(selector) {
    return document.querySelector(selector)
  }
}

spotless = new Spotless(spotlessConfig || {})

spotless.onPage('Page1', () => {
  console.log('Hi I am executed on Page 1 and only Page 1.')
  spotless.setDocProps({
    spotlessDebug: 'prop1 ' + spotless.randStr(),
    spotlessDebug2: 'prop2 ' + spotless.randStr()
  })
})

spotless.onPage('Page2', () => {
  console.log('console log from Page 2.')
  spotless.setDocProp('spotlessDebug', 'Page2 set this')
  spotless.callPython('userScript1', {testParam: 'I am a param passed from Javascript.'})
})

spotless.onPage('Page3', () => {
  console.log('console log from Page 3.')
  spotless.messageBox("Javascript tells Python to MessageBox that Page 3 is great.")
})
