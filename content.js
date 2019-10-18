
async function addTooltip(title, element) {
  let titleImdb = 'imdb ' + title;
  chrome.runtime.sendMessage({
    element,
    payload: titleImdb
  });
}

chrome.runtime.onMessage.addListener((request) => {
  const { rating, votes, element } = request.payload;
  // console.log("rating", rating);
  // console.log("votes", votes);
  // console.log(element);
})

const links = document.querySelectorAll('a.slider-refocus');

for (let i = 0; i < links.length; i++) {
  let link = links[i];

  // console.log('link', link.parentElement.nextSibling.firstChild)
  link.addEventListener('mouseover', function () {
    setTimeout(function() {
      const video = link.parentElement.nextSibling.firstChild
      const rating = document.createElement("div")
      rating.style.cssText = "z-index: 1000; width: 30; height: 30; backgound-color: #666;"
      video.appendChild(rating);
      const copyOfVideo = video.cloneNode(true);
      console.log("video", copyOfVideo);
    }, 1000)
    addTooltip(link.innerText);
  })

  link.addEventListener('mouseout', function () {
    setTimeout(function() {
      const video = link.parentElement.nextSibling.firstChild
      video.removeChild(video.lastChild);
      // console.log(video)
      // const copyOfVideo = video.cloneNode(true);
      // console.log("video", copyOfVideo);
    }, 1000)
    addTooltip(link.innerText);
  })
}
