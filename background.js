function removeSidCookie(tab) {
    chrome.cookies.getAll({ url: tab.url }, function (cookies) {
        for (var i = 0; i < cookies.length; i++) {
            chrome.cookies.remove({ "name": cookies[i].name, "url": tab.url });
        }
    });
}

function onUpdatedListener(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['detector.js']
        },
            (detector) => { if (detector && detector[0].result) removeSidCookie(tab); }
        );
    }
}

function onBeforeNavigateListener(details) {
    chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        files: ['detector.js']
    },
        (detector) => { if (detector && detector[0].result) removeSidCookie(details); }
    );
}

let isEnabled = true;

chrome.storage.sync.get('isEnabled', (data) => {
    isEnabled = data.isEnabled ?? true;
    changeState();
});

chrome.action.onClicked.addListener((tab) => {
    isEnabled = !isEnabled;
    chrome.storage.sync.set({ isEnabled });
    changeState();
});

function changeState() {
    if (isEnabled) {
        chrome.action.setIcon({ path: 'logo.png' });
        chrome.webNavigation.onBeforeNavigate.addListener(onBeforeNavigateListener);
        chrome.tabs.onUpdated.addListener(onUpdatedListener);
    } else {
        chrome.action.setIcon({ path: 'logo-off.png' });
        chrome.webNavigation.onBeforeNavigate.removeListener(onBeforeNavigateListener);
        chrome.tabs.onUpdated.removeListener(onUpdatedListener);
    }
}