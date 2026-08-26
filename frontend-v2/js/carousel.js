(function () {
  'use strict';

  var SWITCH_INTERVAL = 5000;
  var carousels = {};
  var timers = {};
  var isHovering = {};

  function init() {
    // 初始化轮播功能
    initCarousels();
  }

  function initCarousels() {
    var carouselElements = document.querySelectorAll('[data-carousel]');

    carouselElements.forEach(function (carousel) {
      var id = carousel.dataset.carousel;
      carousels[id] = {
        element: carousel,
        slides: carousel.querySelectorAll('.carousel-slide'),
        indicators: carousel.querySelectorAll('.carousel-indicator'),
        current: 0,
        count: 0
      };

      var data = carousels[id];
      data.count = data.slides.length;

      if (data.count === 0) return;

      data.slides.forEach(function (slide, index) {
        if (index === 0) slide.classList.add('active');
      });

      if (data.indicators.length > 0) {
        data.indicators[0].classList.add('active');

        data.indicators.forEach(function (indicator, index) {
          indicator.addEventListener('click', function () {
            goToSlide(id, index);
          });
          indicator.setAttribute('role', 'button');
          indicator.setAttribute('aria-label', '切换到第 ' + (index + 1) + ' 张幻灯片');
        });
      }

      var prevBtn = carousel.querySelector('.carousel-arrow.prev');
      var nextBtn = carousel.querySelector('.carousel-arrow.next');

      if (prevBtn) {
        prevBtn.setAttribute('role', 'button');
        prevBtn.setAttribute('aria-label', '上一张');
        prevBtn.addEventListener('click', function () {
          prevSlide(id);
        });
      }

      if (nextBtn) {
        nextBtn.setAttribute('role', 'button');
        nextBtn.setAttribute('aria-label', '下一张');
        nextBtn.addEventListener('click', function () {
          nextSlide(id);
        });
      }

      carousel.addEventListener('mouseenter', function () {
        isHovering[id] = true;
        stopTimer(id);
      });

      carousel.addEventListener('mouseleave', function () {
        isHovering[id] = false;
        startTimer(id);
      });

      // 添加触摸滑动支持
      var touchStartX = 0;
      var touchEndX = 0;

      carousel.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      carousel.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe(id, touchStartX, touchEndX);
      }, { passive: true });

      startTimer(id);
    });
  }

  function handleSwipe(id, startX, endX) {
    var threshold = 50;
    var diff = startX - endX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextSlide(id);
      } else {
        prevSlide(id);
      }
    }
  }

  function goToSlide(id, index) {
    var data = carousels[id];
    if (!data || data.count === 0) return;

    data.slides[data.current].classList.remove('active');
    if (data.indicators.length > 0) {
      data.indicators[data.current].classList.remove('active');
    }

    data.current = index;

    data.slides[data.current].classList.add('active');
    if (data.indicators.length > 0) {
      data.indicators[data.current].classList.add('active');
    }
  }

  function nextSlide(id) {
    var data = carousels[id];
    if (!data) return;
    var next = (data.current + 1) % data.count;
    goToSlide(id, next);
  }

  function prevSlide(id) {
    var data = carousels[id];
    if (!data) return;
    var prev = (data.current - 1 + data.count) % data.count;
    goToSlide(id, prev);
  }

  function startTimer(id) {
    if (timers[id]) return;
    timers[id] = setInterval(function () {
      if (!isHovering[id]) {
        nextSlide(id);
      }
    }, SWITCH_INTERVAL);
  }

  function stopTimer(id) {
    if (timers[id]) {
      clearInterval(timers[id]);
      timers[id] = null;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 导出公开接口
  window.Carousel = {
    next: nextSlide,
    prev: prevSlide,
    goTo: goToSlide
  };

})();
