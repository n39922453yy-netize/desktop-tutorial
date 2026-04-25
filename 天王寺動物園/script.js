const viewers = document.querySelectorAll(".viewer");

let current = 0;
let startX = 0;
let moveX = 0;
let isDragging = false;

/* 表示更新 */
function updateCards() {
viewers.forEach((viewer, i) => {
viewer.classList.remove("active", "prev", "next");

if (i === current) {
viewer.classList.add("active");
} else if (i === (current - 1 + viewers.length) % viewers.length) {
viewer.classList.add("prev");
} else if (i === (current + 1) % viewers.length) {
viewer.classList.add("next");
}
});
}

/* 次 */
function nextImage() {
current++;
if (current >= viewers.length) current = 0;
updateCards();
}

/* 前 */
function prevImage() {
current--;
if (current < 0) current = viewers.length - 1;
updateCards();
}

/* スワイプ開始 */
function startSwipe(x) {
startX = x;
moveX = x;
isDragging = true;
}

/* スワイプ中 */
function moveSwipe(x) {
if (!isDragging) return;

moveX = x;
const diff = moveX - startX;
const activeCard = viewers[current].querySelector(".card");

activeCard.style.transform = `
rotateY(${diff / 12}deg)
rotateZ(${diff / 45}deg)
scale(1.04)
`;
}

/* スワイプ終了 */
function endSwipe() {
if (!isDragging) return;

const diff = moveX - startX;
const activeCard = viewers[current].querySelector(".card");

activeCard.style.transform = "rotateY(0deg) rotateZ(0deg) scale(1)";

if (diff < -60) {
nextImage();
} else if (diff > 60) {
prevImage();
}

isDragging = false;

/* ← ここが自動スライドリセット */
clearInterval(autoSlide);
autoSlide = setInterval(nextImage, 3000);
}

/* スマホ */
viewers.forEach((viewer) => {
viewer.addEventListener("touchstart", (e) => {
startSwipe(e.touches[0].clientX);
});

viewer.addEventListener("touchmove", (e) => {
moveSwipe(e.touches[0].clientX);
});

viewer.addEventListener("touchend", endSwipe);
});

/* PC */
viewers.forEach((viewer) => {
viewer.addEventListener("mousedown", (e) => {
startSwipe(e.clientX);
});

viewer.addEventListener("mousemove", (e) => {
moveSwipe(e.clientX);
});

viewer.addEventListener("mouseup", endSwipe);
viewer.addEventListener("mouseleave", endSwipe);
});

/* 初期表示 */
updateCards();

/* 自動スライド（3秒） */
let autoSlide = setInterval(nextImage, 3000);