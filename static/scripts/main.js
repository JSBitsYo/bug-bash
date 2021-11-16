window.mobileMediaQuery = '(max-width: 400px)';

document.addEventListener('click', trackCTAs);
function trackCTAs(e) {
  if (e.target.matches('.cta')) {
    e.preventDefault();
    google_analytics.push('cta-clicked');
  }
}

const slickSettings = {
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 2,
  autoplay: true,
  responsive: [
    {
      breakpoint: 400,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        arrows: false
      }
    }
  ]
};

const $clientSlider = $('.client-slider');
$clientSlider.slick(slickSettings);
$clientSlider.on('afterChange', () => {
  const mediaQueryList = window.matchMedia(mobileMediaQuery);
  if (mediaQueryList.matches) $clientSlider[0].scrollIntoView();
});

$(document).ready(function() {
  $('.clients-reset').click(function() {
    $('.client-slider').slick('slickGoTo', 0);
  });
});


renderGemList();
const gemCardImages = document.querySelectorAll('.card-image');
gemCardImages.forEach(image => {
  image.addEventListener('click', toggleGemImageZoom);
});

function toggleGemImageZoom(e) {
  e.target.closest('.gem-card').classList.toggle('zoom');
}


function renderGemList() {
  const gemGrid = document.querySelector('.gem-grid');
  const gemGridHTML = window.gems.map((gemObj, i) => {
    const overflowClass = (i >= 12) ? 'overflow' : '';
    return `<div class="gem-card ${overflowClass}">
      <div class="card-title-price">
        <div class="card-title">${gemObj.title}</div>
        <div class="card-price">${gemObj.price}</div>
      </div>
      <div class="card-image-container">
        <img class="card-image" src="https://res.cloudinary.com/dzynqn10l/image/upload/v1629166095/Bug%20Bash/${gemObj.image}">
      </div>
    </div>`;
  }).join('');
  gemGrid.innerHTML = gemGridHTML;
}

document.querySelectorAll('.gem-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    const direction = (btn.dataset.sort === 'a-z') ? -1 : 1;

    window.gems.sort((a, b) => {
      if (a.title < b.title) return direction;
      else if (a.title > b.title) return -1 * direction;
      else return 0;
    });

    renderGemList();
  });
});


const loadMore = document.querySelector('.load-more');
loadMore.addEventListener('click', () => {
  const gemCards = document.querySelectorAll('.gem-card');
  gemCards.forEach(card => card.classList.remove('overflow'));
  loadMore.style.display = 'none';
});


if (isFreeShipping()) {
  showBanner();
} 

window.shipping = true;
const timeout = 3000;
setTimeout(checkShipping, timeout);

function checkShipping() {
  if (isFreeShipping) showBanner();
}

function isFreeShipping() {
  return Boolean(window.shipping);
}

function showBanner() {
  document.body.classList.add('show-banner');
}


const VIPLevels = {
  pearl: 'pearl',
  platinum: 'platinum',
  emerald: 'emerald',
  gold: 'gold',
  default: function() { return this.pearl }
};

function showVIPLevel() {
  const VIPLevel = getVIPCookieVal() || VIPLevels.default();
  const blockToShow = document.querySelector(`.${VIPLevel}`);
  blockToShow.classList.add('show');
}

function getVIPCookieVal() {
  return getCookie('vipCustomerLevel');
}

// Set VIP cookie to platinum on load
window.setCookie('vipCustomerLevel', VIPLevels.platinum);
showVIPLevel();


const quickAdd = document.querySelector('.gotd-cta');
quickAdd.addEventListener('click', initStripe);

function initStripe() {
  if (window.location.pathname === '/' &&
      !window.StripeCheckout) {
    document.head.insertAdjacentHTML('beforeend', `<script src="https://checkout.stripe.com/checkout.js">`);
    addToCart();
  }
}

function addToCart() {
  StripeCheckout.addProduct = ({ name }) => { 
    alert(`${name} added to cart!`);
  };

  const product = { name: 'Gem of the Day', price: '100e' }
  StripeCheckout.addProduct(product);
}



document.querySelector('.add-back-to-top').addEventListener('click', () => {
  const backToTopScript = document.createElement('script');
  backToTopScript.src = './scripts/back-to-top.js';
  document.head.insertAdjacentElement('beforeend', backToTopScript);
});


window.onscroll = () => {
  const chat = document.querySelector('.chat-container');
  chat.style.bottom = `-${window.scrollY - 50}px`;
};


const moreReviewsBtn = document.querySelector('.reviews-cta');
const reivewsContent = document.querySelector('.reviews-content');
moreReviewsBtn.addEventListener('click', getReview);

function getReview(e) {
  e.target.disabled = true;
  reivewsContent.classList.add('loading');


  const indices = [];
  for (var i = 0; i < 9; i++) {

    // Delay to show animation
    setTimeout(() => {
      indices.push(i);
    }, 500);
  }

  setTimeout(() => {
    const randomIndex = getRandomIndex(indices);

    fetch(`/reviews/${randomIndex}`)
      .then(response => response.json())
      .then(handleRes.bind(null, e));
  }, 1000);
}

function handleRes(e, data) {
  const reviewTextEl = document.querySelector('.review-text');
  const reviewAuthorEl = document.querySelector('.review-author-name');

  reviewTextEl.textContent = data.review.review;
  reviewAuthorEl.textContent = data.review.author;

  e.target.disabled = false;
  reivewsContent.classList.remove('loading');
}

function getRandomIndex(arr) {
  const random = Math.random();
  const arrLength = arr.length;

  return arr[Math.floor(random * arrLength)];
}

const copyrightYear = document.querySelector('.copyright-year');
copyrightYear.textContent = new Date().getFullYear(); 
