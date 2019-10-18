function getPage(url, cb) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4)
      cb(xhr.responseText);    
  }
  xhr.send();
}

chrome.runtime.onMessage.addListener(async(request, sender, sendResponse) => {
  const resp = getPage(`http://www.google.com/search?q=${request.payload.split(' ').join('+')}`, (resp) => {
    chrome.tabs.getAllInWindow((tabs) => {
      tabs.forEach((tab) => {
        if (tab.id === sender.tab.id) {
          const link = resp.match(/https:\/\/www\.imdb\.com\/title\/tt([0-9]+)/)[0];
          chrome.tabs.sendMessage(sender.tab.id, {
            payload: link
          });
        };
      });
    });
  });
});
