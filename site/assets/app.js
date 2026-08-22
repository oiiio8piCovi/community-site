/* AC社区 演示站脚本 —— 前端只管"要数据"，后端接口就在旁边 */
(function () {
  "use strict";

  // ---- 页面加载：探测健康 + 拉计数 + 拉留言 ----
  window.addEventListener("DOMContentLoaded", async () => {
    // /api/health —— 问后端：你活着吗
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      document.getElementById("health-line").textContent =
        "后端：" + data.status + " ｜ " + data.project + " v" + data.version;
    } catch (e) {
      document.getElementById("health-line").textContent = "后端没响应！";
    }
    loadVisit();
    loadMessages();
  });

  // ---- /api/visit/count —— 每次加载 +1（刷新页面数就涨） ----
  async function loadVisit() {
    try {
      const res = await fetch("/api/visit/count");
      const data = await res.json();
      document.getElementById("total-visit").textContent = data.total_visit;
      document.getElementById("today-visit").textContent = data.today_visit;
    } catch (e) { /* 后端挂了不报错，页面照常 */ }
  }

  // ---- /api/message/list —— 拉留言列表，最新在最上面 ----
  async function loadMessages() {
    try {
      const res = await fetch("/api/message/list?limit=20");
      const data = await res.json();
      const ul = document.getElementById("msg-list");
      ul.innerHTML = "";
      if (!data.length) {
        ul.innerHTML = '<li class="msg-text empty-tip">还没有留言，来发第一条！</li>';
        return;
      }
      data.forEach(function (m) {
        const li = document.createElement("li");
        li.className = "msg-item";
        li.innerHTML =
          '<span class="msg-meta">#' + m.msg_id + '</span>' +
          '<span class="msg-nick">' + m.nickname + '</span>' +
          '<span class="msg-meta">' + m.create_time + '</span>' +
          '<div class="msg-text">' + m.content + '</div>';
        ul.appendChild(li);
      });
    } catch (e) { /* 同上 */ }
  }

  // ---- /api/message/add —— 提交留言（POST = 交数据） ----
  document.getElementById("msg-form").addEventListener("submit", async function (ev) {
    ev.preventDefault();
    const payload = {
      nickname: document.getElementById("msg-nickname").value,
      content: document.getElementById("msg-content").value
    };
    const res = await fetch("/api/message/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      document.getElementById("msg-nickname").value = "";
      document.getElementById("msg-content").value = "";
      loadMessages(); // 重新拉列表，新留言自然在最上面
    }
  });

  // ---- /api/search/query —— 关键词搜文章 ----
  document.getElementById("search-form").addEventListener("submit", async function (ev) {
    ev.preventDefault();
    const keyword = document.getElementById("search-keyword").value;
    const box = document.getElementById("search-result");
    const res = await fetch("/api/search/query?keyword=" + encodeURIComponent(keyword));
    const data = await res.json();
    box.innerHTML = "";
    if (!data.count) {
      box.innerHTML = '<p class="empty-tip">搜「' + keyword + '」：一条没有。换词试试？</p>';
      return;
    }
    box.innerHTML = '<p class="empty-tip">搜「' + keyword + '」：找到 ' + data.count + ' 条</p>';
    data.data.forEach(function (item) {
      const div = document.createElement("div");
      div.className = "search-hit";
      div.innerHTML =
        '<div class="hit-title">' + item.title + '</div>' +
        '<div class="msg-text">' + item.content + '</div>';
      box.appendChild(div);
    });
  });

  // ---- 手动刷新计数按钮 ----
  document.getElementById("refresh-count").addEventListener("click", loadVisit);
})();
