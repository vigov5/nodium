const isFirefox = !chrome.app || (window.browser && browser.runtime);


function setupIntercept (urls) {
  function intercept (details) {
    details.requestHeaders = details.requestHeaders.filter(rh => rh.name !== 'Referer');
    details.requestHeaders.push({ name: 'Referer', value: 'http://t.co' });
    return { requestHeaders: details.requestHeaders };
  }

  chrome.webRequest.onBeforeSendHeaders.removeListener(intercept);

  let options = ["blocking", "requestHeaders", "extraHeaders"];
  if (isFirefox) options.pop();

  chrome.webRequest.onBeforeSendHeaders.addListener(
    intercept,
    { urls: urls },
    options
  );
}


chrome.storage.local.get(['urls'], function (result) {
  let DEFAULT_URLS = ['https://medium.com/*'];
  if (!Object.keys(result).length) {
    chrome.storage.local.set({ urls: DEFAULT_URLS });
  } else {
    DEFAULT_URLS = result.urls;
  }

  setupIntercept(DEFAULT_URLS);
});


chrome.webNavigation.onCompleted.addListener(function (details) {
  chrome.tabs.executeScript({ file: "detector.js" }, function (result) {
    let [detected, origin, url] = result[0];

    chrome.storage.local.get(['urls'], function (current) {
      let pattern = `${origin}/*`;

      if (detected && current.urls.indexOf(pattern) == -1) {
        current.urls.push(pattern);
        chrome.storage.local.set({ urls: current.urls });

        chrome.tabs.insertCSS({ file: "notify.css" });

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { origin }, function (response) { });
        });

        setupIntercept(current.urls);
      }
    });
  })

}, {
  url: [{ urlMatches: "https:\/\/*\/*" }, { urlMatches: "http:\/\/*\/*" }],
});
