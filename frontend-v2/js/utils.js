/**
 * 通用工具函数
 */
(function (global) {
  'use strict';

  var Utils = {
    /**
     * 防抖函数
     * @param {Function} func - 要防抖的函数
     * @param {number} wait - 等待时间(毫秒)
     * @param {boolean} immediate - 是否立即执行
     */
    debounce: function (func, wait, immediate) {
      var timeout;
      return function () {
        var context = this;
        var args = arguments;
        var later = function () {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    },

    /**
     * 节流函数
     * @param {Function} func - 要节流的函数
     * @param {number} limit - 时间限制(毫秒)
     */
    throttle: function (func, limit) {
      var inThrottle;
      return function () {
        var context = this;
        var args = arguments;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(function () {
            inThrottle = false;
          }, limit);
        }
      };
    },

    /**
     * 本地存储封装
     */
    storage: {
      set: function (key, value) {
        try {
          localStorage.setItem(key, JSON.stringify(value));
          return true;
        } catch (e) {
          console.warn('localStorage not available:', e);
          return false;
        }
      },
      get: function (key, defaultValue) {
        try {
          var item = localStorage.getItem(key);
          return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
          return defaultValue;
        }
      },
      remove: function (key) {
        try {
          localStorage.removeItem(key);
          return true;
        } catch (e) {
          return false;
        }
      }
    },

    /**
     * 日期格式化
     * @param {Date|string} date - 日期对象或日期字符串
     * @param {string} format - 格式化模板
     */
    formatDate: function (date, format) {
      var d = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(d.getTime())) return '';

      var pad = function (n) {
        return n < 10 ? '0' + n : n;
      };

      return format.replace(/YYYY|MM|DD|HH|mm|ss/g, function (key) {
        switch (key) {
          case 'YYYY': return d.getFullYear();
          case 'MM': return pad(d.getMonth() + 1);
          case 'DD': return pad(d.getDate());
          case 'HH': return pad(d.getHours());
          case 'mm': return pad(d.getMinutes());
          case 'ss': return pad(d.getSeconds());
          default: return key;
        }
      });
    }
  };

  // 导出到全局
  global.Utils = Utils;

})(window);
