chrome.storage.local.get(['urls'], function (result) {
  console.log('Popup currently is ', result);
  fillPopupInfo(result.urls);
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (var key in changes) {
    if (key == 'urls') {
      fillPopupInfo(changes[key].newValue);
      break;
    }
  }
});

var sanitizeHTML = function (str) {
  var temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
};

function fillPopupInfo (urls) {
  var summary = document.getElementById('summary')
  summary.innerHTML = `Total: ${urls.length} sites`;
  var content = urls.map((u) => `<span>${sanitizeHTML(u)}</span>`).join('<br>');
  var listUrl = document.getElementById('list-urls');
  listUrl.innerHTML = content;
}
