const track = document.querySelector('.track');
const nextButton = document.querySelector('.next');
const prevButton = document.querySelector('.prev');

let cards = Array.from(track.children);
let index = 1;
let cardWidth;
let isMoving = false;

// ===== BOLINHAS =====
const dotsContainer = document.querySelector('.dots');

// cria as bolinhas dinamicamente
cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');

    if (i === 0) dot.classList.add('active');

    dot.addEventListener('click', () => {
        goToSlide(i);
    });

    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

function updateDots() {
    dots.forEach(dot => dot.classList.remove('active'));
    let realIndex = index - 1;
    if (index === 0) {
        realIndex = dots.length - 1;
    }
    if (index === cards.length - 1) {
        realIndex = 0;
    }
    dots[realIndex].classList.add('active');
}

// ===== CLONES =====
const firstClone = cards[0].cloneNode(true);
const lastClone = cards[cards.length - 1].cloneNode(true);

track.appendChild(firstClone);
track.insertBefore(lastClone, cards[0]);

cards = Array.from(track.children);

// ===== CONFIGURA POSIÇÃO =====
function setPosition() {
    cardWidth = cards[0].offsetWidth;; // ajuste se necessário
    track.style.transition = "none";
    track.style.transform = `translateX(${-cardWidth * index}px)`;
}

setPosition();
window.addEventListener("resize", setPosition);

// ===== MOVIMENTO =====
function moveCarousel() {
    if (isMoving) return;
    isMoving = true;

    track.style.transition = "transform 0.4s ease-in-out";
    track.style.transform = `translateX(${-cardWidth * index}px)`;
}

// ===== BOTÕES =====
nextButton.addEventListener("click", () => {
    index++;
    moveCarousel();
    updateDots();
});

prevButton.addEventListener("click", () => {
    index--;
    moveCarousel();
    updateDots();
});

// ===== LOOP INVISÍVEL =====
track.addEventListener("transitionend", () => {

    // se for clone final
    if (index === cards.length - 1) {
        track.style.transition = "none";
        index = 1;
        track.style.transform = `translateX(${-cardWidth * index}px)`;
    }

    // se for clone inicial
    if (index === 0) {
        track.style.transition = "none";
        index = cards.length - 2;
        track.style.transform = `translateX(${-cardWidth * index}px)`;
    }

    isMoving = false;
});

// ===== NAVBAR =====
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