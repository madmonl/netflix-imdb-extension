const globalRatings = {}
let id = 0;

function waitForGlobalRating(id, cb) {
  console.log("trying:", globalRatings[id])
  if(typeof globalRatings[id] !== "undefined"){
    cb();
  } else {
      setTimeout(() => waitForGlobalRating(id, cb), 250);
  }
}

async function addTooltip(title, id) {
  let titleImdb = 'imdb ' + title;
  chrome.runtime.sendMessage({
    id,
    payload: titleImdb
  });
}

chrome.runtime.onMessage.addListener((request) => {
  globalRatings[request.id] = request.payload; 
})

const links = document.querySelectorAll('a.slider-refocus');



for (let i = 0; i < links.length; i++) {
  let link = links[i];

  const video = link.parentElement.nextSibling.firstChild

  link.addEventListener('mouseover', function () {
    const currId = id++ + '';
    addTooltip(link.innerText, currId);
    waitForGlobalRating(currId, () => {
      setTimeout(function() {
        const ratingBoxElement = document.createElement('div');
        ratingBoxElement.textContent += globalRatings[currId];
        ratingBoxElement.className = 'rating';
        ratingBoxElement.style.textAlign = 'center';
        ratingBoxElement.style.lineHeight = '50px';
        ratingBoxElement.style.verticalAlign = 'middle';
        ratingBoxElement.style.fontWeight = '700';
        ratingBoxElement.style.position = "absolute";
        ratingBoxElement.style.width = "50px";
        ratingBoxElement.style.height = "50px";
        ratingBoxElement.style.top = "-127px";
        ratingBoxElement.style.left = "50%";
        ratingBoxElement.style.borderRadius = "30px";
        ratingBoxElement.style.transform = "translateX(-50%)";
        ratingBoxElement.style.background = "yellow";
        ratingBoxElement.style.color = "black";
        const triangle = document.createElement('div');
        triangle.className = 'triangle';
        triangle.style.position = "absolute";
        triangle.style.top = "-80px";
        triangle.style.left = "50%";
        triangle.style.transform = "translateX(-50%)";
        triangle.style.borderLeft = "10px solid transparent";
        triangle.style.borderRight = "10px solid transparent";
        triangle.style.borderTop = "10px solid yellow";
        if (video.querySelector(':hover')) {
          video.appendChild(ratingBoxElement);
          video.appendChild(triangle);
        }
        video.addEventListener('mouseout', function () {
            const triangles = document.getElementsByClassName('triangle');
            const ratingBoxes = document.getElementsByClassName('rating');
            for (let triangle of triangles) {
              triangle.remove();
            }
            for (let ratingBox of ratingBoxes) {
              ratingBox.remove();
            }
        })
      }, 0)
    });
  })
}
