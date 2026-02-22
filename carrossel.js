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