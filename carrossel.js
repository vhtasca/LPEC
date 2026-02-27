const track = document.querySelector('.track');
const cards = Array.from(track.children);

const nextButton = document.querySelector('.next');
const prevButton = document.querySelector('.prev');

let index = 0;

function updateCarousel() {
    const cardWidth = cards[0].getBoundingClientRect().width + 20; // 20 = gap
    track.style.transform = `translateX(${-cardWidth * index}px)`;
}

nextButton.addEventListener('click', () => {
    if (index < cards.length - 1) {
        index++;
        updateCarousel();
    }
});

prevButton.addEventListener('click', () => {
    if (index > 0) {
        index--;
        updateCarousel();
    }
});

//esconder navbar
let lastScroll = 0;
const navbar = document.querySelector("header");

window.addEventListener("scroll", () => {

  let currentScroll = window.pageYOffset;

  if (currentScroll > lastScroll) {
    navbar.classList.add("hide");
  } else {
    navbar.classList.remove("hide");
  }

  lastScroll = currentScroll;

});


const sections = document.querySelectorAll("section");
const links = document.querySelectorAll(".botao a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (pageYOffset >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute("id");
    }
  });

  links.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});