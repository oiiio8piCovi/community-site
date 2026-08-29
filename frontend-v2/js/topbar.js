(function () {
  "use strict";

  var topbar = document.getElementById("topbar");
  if (!topbar) return;

  var lastScrollY = 0;
  var ticking = false;

  function updateTopbar() {
    var currentScrollY = window.scrollY;

    if (currentScrollY <= 0) {
      topbar.classList.remove("topbar--hidden");
    } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
      topbar.classList.add("topbar--hidden");
    } else if (currentScrollY < lastScrollY) {
      topbar.classList.remove("topbar--hidden");
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateTopbar);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
})();
