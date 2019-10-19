function getPage(url, cb) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4)
      cb(xhr.responseText);    
  }
  xhr.send();
}

function extractRating(imdbPageStr) {
  let rating = imdbPageStr.match(/"ratingValue": "[0-9]\.[0-9]"/)
  if (rating) {
    return rating[0].match(/[0-9]\.[0-9]/)[0];
  } else return '?';
}

chrome.runtime.onMessage.addListener(async(request, sender, sendResponse) => {
  getPage(`http://www.google.com/search?q=${request.payload.split(' ').join('+')}`, (resp) => {
    const link = resp.match(/https:\/\/www\.imdb\.com\/title\/tt([0-9]+)/)[0];
    getPage(link, (resp) => {
      const rating = extractRating(resp); 
      chrome.tabs.getAllInWindow((tabs) => {
        tabs.forEach((tab) => {
          if (tab.id === sender.tab.id) {
            chrome.tabs.sendMessage(sender.tab.id, {
              payload: rating,
              id: request.id
            });
          };
        });
      });
    });
  });
});
