
async function addTooltip(title) {
  let titleImdb = 'imdb ' + title;
  chrome.runtime.sendMessage({
    payload: titleImdb
  });
}

chrome.runtime.onMessage.addListener((request) => {
  const { rating, votes } = request.payload;
  console.log("rating", rating);
  console.log("votes", votes);
})

const links = document.querySelectorAll('a.slider-refocus');

for (let i = 0; i < links.length; i++) {
  let link = links[i];
  link.addEventListener('mouseover', function () {
    addTooltip(link.innerText);
  })
}
