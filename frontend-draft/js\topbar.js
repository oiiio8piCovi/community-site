(function () {
  const topbar = document.getElementById("topbar");
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateTopbar() {
    const currentScrollY = window.scrollY;

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

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        requestAnimationFrame(updateTopbar);
        ticking = true;
      }
    },
    { passive: true }
  );
})();
