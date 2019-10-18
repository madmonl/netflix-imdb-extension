
async function addTooltip(title) {
  let rating;
  let voters;
  let titleImdb = 'imdb ' + title;
  // console.log('here')
  // const text = await resp.text();
  // console.log("resp body type", typeof resp.body);
  // console.log("resp body", text);
  // console.log("text", text);
  chrome.runtime.sendMessage({
    operation: "fetch google imdb",
    payload: titleImdb
  });
}

chrome.runtime.onMessage.addListener((request) => {
  console.log(request.payload);
})

const links = document.querySelectorAll('a.slider-refocus');

for (let i = 0; i < links.length; i++) {
  let link = links[i];
  link.addEventListener('mouseover', function () {
    addTooltip(link.innerText);
  })
}
