window.addEventListener("scroll", function () {
  const heroSection = document.querySelector(".hero");
  const content = document.getElementById("content");
  const scrollPosition = window.scrollY;

  if (scrollPosition > 100) {
    // Adjust the value as needed
    heroSection.classList.add("hidden");
    content.classList.add("hidden-content");
  } else {
    heroSection.classList.remove("hidden");
    content.classList.remove("hidden-content");
  }
});

let items = document.querySelectorAll(".slider .item");
let next = document.getElementById("next");
let prev = document.getElementById("prev");

let active = 0;
function loadShow() {
  let stt = 0;
  items[active].style.transform = `translateX(-50%)`;
  items[active].style.zIndex = 1;
  items[active].style.filter = "none";
  items[active].style.opacity = 1;
  for (var i = active + 1; i < items.length; i++) {
    stt++;
    items[i].style.transform = `translateX(calc(-50% + ${120 * stt}px)) scale(${
      1 - 0.2 * stt
    }) perspective(16px) rotateY(-1deg)`;
    items[i].style.zIndex = -stt;
    items[i].style.filter = "blur(5px)";
    items[i].style.opacity = stt > 2 ? 0 : 0.6;
  }
  stt = 0;
  for (var i = active - 1; i >= 0; i--) {
    stt++;
    items[i].style.transform = `translateX(calc(-50% - ${120 * stt}px)) scale(${
      1 - 0.2 * stt
    }) perspective(16px) rotateY(1deg)`;
    items[i].style.zIndex = -stt;
    items[i].style.filter = "blur(5px)";
    items[i].style.opacity = stt > 2 ? 0 : 0.6;
  }
}
loadShow();
next.onclick = function () {
  active = active + 1 < items.length ? active + 1 : active;
  loadShow();
};
prev.onclick = function () {
  active = active - 1 >= 0 ? active - 1 : active;
  loadShow();
};
