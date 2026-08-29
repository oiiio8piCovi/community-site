/**
 * @file 首页内容区交互
 * - 进场动画(IntersectionObserver + .reveal)
 * - 数字 stat 计数动画
 * - 联系按钮涟漪已由 ripple.js 全局接管,本文件不重复实现
 */
(function () {
  "use strict";

  /** 进场动画:元素进入视口时加 is-visible */
  function initReveal() {
    var nodes = document.querySelectorAll(".reveal");
    if (!nodes.length) return;

    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    nodes.forEach(function (el) {
      io.observe(el);
    });
  }

  /** stat 数字滚动 0 -> 目标值,首屏可见时触发 */
  function initStatCounter() {
    var items = document.querySelectorAll(".stat-number");
    if (!items.length) return;

    var prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    items.forEach(function (el) {
      var raw = el.textContent.trim();
      var match = raw.match(/^([\d.]+)\s*([km]?)$/i);
      if (!match) return;
      var target = parseFloat(match[1]);
      var suffix = (match[2] || "").toLowerCase();
      if (isNaN(target)) return;

      // 真实展示值:12 / 1200 / 12000
      var displayMax =
        target * (suffix === "k" ? 1000 : suffix === "m" ? 1000000 : 1);

      el.dataset.target = String(displayMax);
      el.dataset.suffix = suffix;
      el.dataset.displayTarget = String(target);
      if (!prefersReduced) {
        el.textContent = "0" + (suffix || "");
      }
    });

    function run(el) {
      var target = parseFloat(el.dataset.target);
      var suffix = el.dataset.suffix || "";
      var displayTarget = parseFloat(el.dataset.displayTarget);
      if (prefersReduced || isNaN(target)) {
        el.textContent = formatSuffix(target, suffix, displayTarget);
        return;
      }
      var duration = 900;
      var startTs = null;

      function step(ts) {
        if (startTs === null) startTs = ts;
        var p = Math.min((ts - startTs) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var v = target * eased;
        el.textContent = formatSuffix(v, suffix, displayTarget);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    /**
     * 把当前动画值 v 格式化为可展示文本
     * - 无后缀:整数 / 一位小数
     * - 有 k/m 后缀:始终按 displayTarget 的小数位显示,但数值放大
     */
    function formatSuffix(v, suffix, displayTarget) {
      var decimals = (String(displayTarget).split(".")[1] || "").length;
      if (!suffix) {
        return decimals === 0 ? Math.round(v).toString() : v.toFixed(decimals);
      }
      // k/m 后缀:动画过程保留同样的小数位
      var scaled = v / (suffix === "k" ? 1000 : 1000000);
      return scaled.toFixed(decimals) + suffix;
    }

    if (!("IntersectionObserver" in window)) {
      items.forEach(run);
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            run(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.4,
      },
    );

    items.forEach(function (el) {
      io.observe(el);
    });
  }

  /** 阅读整页 footer 年份(自动更新) */
  function initFooterYear() {
    var el = document.querySelector("[data-year]");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initReveal();
      initStatCounter();
      initFooterYear();
    });
  } else {
    initReveal();
    initStatCounter();
    initFooterYear();
  }
})();
