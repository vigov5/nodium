chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (!document.getElementById('nodium-root')) {
    const element = document.createElement('div')
    element.setAttribute('id', 'nodium-root')
    element.innerHTML = `Nodium | <strong>${message.origin}</strong> added. Please reload 👍`
    document.body.appendChild(element)

    setTimeout(function () {
      document.getElementById('nodium-root').remove()
    }, 5000)
  }
})
