function injectJS(attr, value) {
  var s = document.createElement('script')
  s[attr] = value
  s.onload = function () {
    this.remove()
  }
  ;(document.head || document.documentElement).appendChild(s)
}

injectJS('textContent', `window.NODIUM_ID = '${chrome.runtime.id}'`)
injectJS('src', chrome.runtime.getURL('preload_hook.js'))
