function getPage(url, cb) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4)
      cb(xhr.responseText);    
  }
  xhr.send();
}

function extractStats(imdbPageStr) {
  let rating = imdbPageStr
    .match(/"ratingValue": "[0-9]\.[0-9]"/)[0]
    .match(/[0-9]\.[0-9]/)[0];
  const votes = imdbPageStr
    .match(/"ratingCount": [0-9]*/)[0].split(' ')[1];
    // .match(/[0-9]/);
  return { rating, votes };
}

chrome.runtime.onMessage.addListener(async(request, sender, sendResponse) => {
  const element = request.element;
  getPage(`http://www.google.com/search?q=${request.payload.split(' ').join('+')}`, (resp) => {
    const link = resp.match(/https:\/\/www\.imdb\.com\/title\/tt([0-9]+)/)[0];
    getPage(link, (resp) => {
      const { rating, votes } = extractStats(resp); 
      chrome.tabs.getAllInWindow((tabs) => {
        tabs.forEach((tab) => {
          if (tab.id === sender.tab.id) {
            chrome.tabs.sendMessage(sender.tab.id, {
              payload: { rating, votes, element }
            });
          };
        });
      });
    });
  });
});
