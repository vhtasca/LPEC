const track = document.querySelector('.track');
const viewport = track.parentElement; // container que "corta" o carrossel (overflow hidden)
const nextButton = document.querySelector('.next');
const prevButton = document.querySelector('.prev');

let realCards = Array.from(track.children); // cards reais (SEM clones)
const slidesCount = realCards.length;

let cards = [];            // cards COM clones
let index = 0;             // posição atual (baseada em cards com clones)
let step = 0;              // largura do card + gap
let visibleCount = 1;      // quantos cards aparecem na tela
let isMoving = false;

// ===== DOTS =====
const dotsContainer = document.querySelector('.dots');
dotsContainer.innerHTML = "";

for (let i = 0; i < slidesCount; i++) {
  const dot = document.createElement('div');
  dot.classList.add('dot');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
}
const dots = Array.from(dotsContainer.querySelectorAll('.dot'));

function updateDots() {
  dots.forEach(d => d.classList.remove('active'));

  // converte index (com clones) -> índice real (0..slidesCount-1)
  // como index começa depois dos clones do começo:
  let realIndex = (index - visibleCount) % slidesCount;
  if (realIndex < 0) realIndex += slidesCount;

  dots[realIndex]?.classList.add('active');
}

// ===== MEDIDAS =====
function calcStepAndVisible() {
  // mede um card real (se existir)
  const card = track.querySelector(':scope > *');
  if (!card) return;

  const cardRect = card.getBoundingClientRect();
  const styles = getComputedStyle(track);
  const gap = parseFloat(styles.gap || styles.columnGap || 0) || 0;

  step = cardRect.width + gap;

  const vw = viewport.getBoundingClientRect().width;
  visibleCount = Math.max(1, Math.round(vw / step));
}

// ===== REBUILD (clones corretos p/ PC e mobile) =====
function rebuildCarousel() {
  // remove tudo e recria com clones certos
  track.innerHTML = "";
  realCards.forEach(c => track.appendChild(c));

  calcStepAndVisible();

  // clona N do começo e N do fim
  const startClones = realCards.slice(0, visibleCount).map(n => n.cloneNode(true));
  const endClones = realCards.slice(-visibleCount).map(n => n.cloneNode(true));

  // adiciona clones no começo (do fim real)
  endClones.forEach(clone => track.insertBefore(clone, track.firstChild));
  // adiciona clones no final (do começo real)
  startClones.forEach(clone => track.appendChild(clone));

  cards = Array.from(track.children);

  // começa no primeiro card real (depois dos clones iniciais)
  index = visibleCount;

  setPosition(true);
  updateDots();
}

function setPosition(noAnim = true) {
  if (noAnim) track.style.transition = "none";
  track.style.transform = `translateX(${-step * index}px)`;
}

// ===== MOVIMENTO =====
function moveCarousel() {
  if (isMoving) return;
  isMoving = true;
  track.style.transition = "transform 0.4s ease-in-out";
  track.style.transform = `translateX(${-step * index}px)`;
}

// ===== BOTÕES =====
nextButton.addEventListener("click", () => {
  if (isMoving) return;
  index++;
  moveCarousel();
  updateDots();
});

prevButton.addEventListener("click", () => {
  if (isMoving) return;
  index--;
  moveCarousel();
  updateDots();
});

// ===== DOT CLICK =====
function goToSlide(realSlideIndex) {
  if (isMoving) return;
  index = visibleCount + realSlideIndex;
  moveCarousel();
  updateDots();
}

// ===== LOOP INVISÍVEL =====
track.addEventListener("transitionend", (e) => {
  if (e.propertyName !== "transform") return;

  // se passou do último real e entrou nos clones do começo
  if (index >= visibleCount + slidesCount) {
    index = visibleCount;
    requestAnimationFrame(() => setPosition(true));
  }

  // se voltou antes do primeiro real e entrou nos clones do fim
  if (index < visibleCount) {
    index = visibleCount + slidesCount - 1;
    requestAnimationFrame(() => setPosition(true));
  }

  isMoving = false;
});

// ===== INIT + RESIZE =====
rebuildCarousel();

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // recaptura cards reais (sem clones) antes de rebuild
    realCards = Array.from(track.children).slice(visibleCount, visibleCount + slidesCount);
    rebuildCarousel();
  }, 120);
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

// ===== MENU RESPONSIVO =====
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("header ul");

function toggleMenu() {
  navLinks.classList.toggle("active");
}