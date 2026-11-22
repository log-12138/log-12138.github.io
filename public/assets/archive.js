/* 案例工作台：渲染图纸索引、筛选、横向比较 */
(function () {
  "use strict";

  var dataEl = document.getElementById("awData");
  var grid = document.getElementById("awGrid");
  if (!dataEl || !grid) return;

  var data = JSON.parse(dataEl.textContent);
  var items = (data.items || []).slice();
  var selected = [];          // 选中的 id，最多 3 个

  var searchEl = document.getElementById("awSearch");
  var archEl = document.getElementById("awArch");
  var yearEl = document.getElementById("awYear");
  var countEl = document.getElementById("awCount");
  var compareEl = document.getElementById("awCompare");
  var tableEl = document.getElementById("awTable");
  var clearEl = document.getElementById("awClear");

  var CLUE_LABELS = [
    ["circulation", "动线"],
    ["structure", "结构"],
    ["light", "采光"],
    ["scale", "尺度"]
  ];

  if (!items.length) {
    grid.innerHTML = '<div class="aw-empty">还没有图纸。<br>把图放进 public/archive/，按页面底部的格式加一条就好。</div>';
    if (countEl) countEl.textContent = "";
    return;
  }

  /* ---------- 筛选下拉：从数据里长出来 ---------- */
  function uniq(list) {
    var seen = {}, out = [];
    list.forEach(function (v) {
      if (v !== undefined && v !== null && v !== "" && !seen[v]) { seen[v] = 1; out.push(v); }
    });
    return out;
  }

  uniq(items.map(function (i) { return i.architect; })).forEach(function (a) {
    var o = document.createElement("option");
    o.value = a; o.textContent = a;
    archEl.appendChild(o);
  });

  uniq(items.map(function (i) { return i.year; })).sort().forEach(function (y) {
    var o = document.createElement("option");
    o.value = String(y); o.textContent = y + " 年代";
    yearEl.appendChild(o);
  });

  /* ---------- 卡片（一次性渲染，之后只隐藏，不重建） ---------- */
  var cards = {};

  items.forEach(function (it) {
    var card = document.createElement("article");
    card.className = "aw-card";
    card.dataset.id = it.id;
    card.dataset.search = [
      it.architect, it.title, it.en, it.place, it.source,
      it.clues.circulation, it.clues.structure, it.clues.light, it.clues.scale
    ].join(" ").toLowerCase();

    var thumb;
    if (it.drawingSrc) {
      thumb = document.createElement("button");
      thumb.type = "button";
      thumb.className = "aw-thumb";
      thumb.setAttribute("data-full", it.drawingSrc);
      thumb.setAttribute("data-cap", it.architect + " · " + it.title + " · " + it.drawingKind);
      thumb.innerHTML = '<img src="' + it.drawingSrc + '" alt="' + it.title + '" loading="lazy">';
    } else {
      thumb = document.createElement("div");
      thumb.className = "aw-thumb empty";
      thumb.textContent = "图纸待放";
    }
    card.appendChild(thumb);

    var meta = document.createElement("div");
    meta.className = "aw-meta";
    meta.innerHTML = '<span>' + it.architect + '</span><span>' + it.year + '</span>';
    card.appendChild(meta);

    var h = document.createElement("h3");
    h.textContent = it.title;
    var badgeText = it.demo ? "示例" : (it.draft ? "待填" : (it.ghost ? "AI 初稿" : ""));
    if (badgeText) {
      var badge = document.createElement("span");
      badge.className = "aw-badge";
      badge.textContent = badgeText;
      h.appendChild(badge);
    }
    card.appendChild(h);

    if (it.en) {
      var en = document.createElement("span");
      en.className = "en";
      en.textContent = it.en;
      card.appendChild(en);
    }

    var src = document.createElement("p");
    src.className = "aw-src";
    src.textContent = "出处：" + it.source;
    card.appendChild(src);

    var ul = document.createElement("ul");
    ul.className = "aw-clues";
    CLUE_LABELS.forEach(function (pair) {
      var text = it.clues && it.clues[pair[0]];
      if (!text) return;
      var li = document.createElement("li");
      li.innerHTML = "<b>" + pair[1] + "</b><span>" + text + "</span>";
      ul.appendChild(li);
    });

    if (ul.children.length) {
      card.appendChild(ul);
    } else {
      var hint = document.createElement("p");
      hint.className = "aw-hint";
      hint.textContent = "← 写下你看到的动线 / 结构 / 采光 / 尺度";
      card.appendChild(hint);
    }

    var pick = document.createElement("label");
    pick.className = "aw-pick";
    pick.innerHTML = '<input type="checkbox" value="' + it.id + '"> 加入对比';
    card.appendChild(pick);

    grid.appendChild(card);
    cards[it.id] = card;
  });

  /* ---------- 筛选 ---------- */
  function apply() {
    var q = (searchEl.value || "").trim().toLowerCase();
    var a = archEl.value;
    var y = yearEl.value;
    var shown = 0;

    Object.keys(cards).forEach(function (id) {
      var c = cards[id];
      var ok =
        (!q || c.dataset.search.indexOf(q) !== -1) &&
        (!a || c.querySelector(".aw-meta span").textContent === a) &&
        (!y || c.querySelector(".aw-meta span:last-child").textContent === y);
      c.hidden = !ok;
      if (ok) shown++;
    });

    countEl.textContent = shown + " / " + items.length + " 张";
  }

  searchEl.addEventListener("input", apply);
  archEl.addEventListener("change", apply);
  yearEl.addEventListener("change", apply);

  /* ---------- 横向比较 ---------- */
  function renderCompare() {
    if (selected.length < 2) {
      compareEl.classList.remove("on");
      tableEl.innerHTML = "";
      return;
    }
    compareEl.classList.add("on");

    var picked = selected.map(function (id) {
      return items.filter(function (i) { return i.id === id; })[0];
    });

    var html = "<table><thead><tr><th></th>";
    picked.forEach(function (p) {
      html += "<th>" + p.title + "<br><span class='aw-th-sub'>" + p.architect + " · " + p.year + "</span></th>";
    });
    html += "</tr></thead><tbody>";

    CLUE_LABELS.forEach(function (pair) {
      html += "<tr><th>" + pair[1] + "</th>";
      picked.forEach(function (p) {
        html += "<td>" + ((p.clues && p.clues[pair[0]]) || "—") + "</td>";
      });
      html += "</tr>";
    });

    html += "<tr><th>出处</th>";
    picked.forEach(function (p) { html += "<td>" + p.source + "</td>"; });
    html += "</tr></tbody></table>";

    tableEl.innerHTML = html;
  }

  grid.addEventListener("change", function (e) {
    var box = e.target;
    if (!box || box.type !== "checkbox") return;

    if (box.checked) {
      if (selected.length >= 3) { box.checked = false; return; }
      selected.push(box.value);
    } else {
      selected = selected.filter(function (id) { return id !== box.value; });
    }
    renderCompare();
  });

  clearEl.addEventListener("click", function () {
    selected = [];
    grid.querySelectorAll('input[type="checkbox"]').forEach(function (b) { b.checked = false; });
    renderCompare();
  });

  apply();
})();
