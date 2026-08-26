/**
 * 主题切换模块（昼夜切换动画）
 * - 持久化到 localStorage
 * - DOMContentLoaded 前预先恢复主题，避免闪烁
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'app-theme';
  var docElement = document.documentElement;

  /**
   * 在 <head> 渲染前预先应用主题，防止 FOUC
   */
  function applyThemeEarly() {
    try {
      var theme = localStorage.getItem(STORAGE_KEY);
      if (theme === 'dark') {
        docElement.classList.add('dark');
      }
    } catch (e) {
      console.warn('[theme] 无法读取本地存储的主题设置', e);
    }
  }

  /**
   * 更新主题
   */
  function updateTheme(isDark) {
    docElement.classList.toggle('dark', isDark);
    var themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.setAttribute('aria-checked', String(isDark));
      themeBtn.setAttribute('aria-label', isDark ? '切换到日间主题' : '切换到暗色主题');
    }

    // 同步外部"日间模式 / 夜间模式"标签文字
    var labelEl = document.getElementById('theme-toggle-label');
    if (labelEl) {
      labelEl.textContent = isDark ? '夜间模式' : '日间模式';
    }

    try {
      localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch (e) {
      console.warn('[theme] 无法保存主题到本地存储', e);
    }
  }

  /**
   * 绑定按钮事件
   */
  function bindToggle() {
    var btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;

    btn.addEventListener('click', function () {
      docElement.classList.add('is-animating');
      var isDark = docElement.classList.contains('dark');
      updateTheme(!isDark);
    });

    /* test 同款：监听容器 background-color 过渡完成，移除 is-animating */
    var container = btn.querySelector('.theme-toggle__container');
    if (container) {
      container.addEventListener('transitionend', function (event) {
        if (
          event.target !== container ||
          event.propertyName !== 'background-color'
        ) {
          return;
        }
        docElement.classList.remove('is-animating');
      });
    }
  }

  /**
   * 初始化：同步按钮的初始状态
   */
  function init() {
    var isDark = docElement.classList.contains('dark');
    updateTheme(isDark);
    bindToggle();
  }

  // 在 DOM 解析前尽早应用主题（防闪烁）
  applyThemeEarly();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 导出公开 API
  window.ThemeToggle = {
    toggle: function () {
      updateTheme(!docElement.classList.contains('dark'));
    },
    setDark: function (v) { updateTheme(!!v); },
    isDark: function () { return docElement.classList.contains('dark'); }
  };
})();