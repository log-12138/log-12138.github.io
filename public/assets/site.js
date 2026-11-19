(function () {
  "use strict";

  var lb = document.getElementById("lb");
  if (!lb) return;

  var lbImg = document.getElementById("lbImg");
  var lbCap = document.getElementById("lbCap");
  var lbCount = document.getElementById("lbCount");
  var all = Array.prototype.slice.call(document.querySelectorAll("[data-full]"));
  if (!all.length) return;

  // the marquee repeats every certificate; keep one entry per image and map the copies onto it
  var order = [];
  var indexOf = {};
  all.forEach(function (el) {
    var src = el.getAttribute("data-full");
    if (!(src in indexOf)) {
      indexOf[src] = order.length;
      order.push(el);
    }
  });
  var triggers = order;
  var current = -1;

  function caption(el) {
    var c = el.getAttribute("data-cap");
    if (c) return c;
    var img = el.tagName === "IMG" ? el : el.querySelector("img");
    return img ? (img.getAttribute("alt") || "") : "";
  }

  function show(i) {
    if (i < 0) i = triggers.length - 1;
    if (i >= triggers.length) i = 0;
    current = i;
    var el = triggers[i];
    lbImg.src = el.getAttribute("data-full");
    lbImg.alt = caption(el);
    lbCap.textContent = caption(el);
    lbCount.textContent =
      ("0" + (i + 1)).slice(-2) + " / " + ("0" + triggers.length).slice(-2);
  }

  function open(i) {
    show(i);
    lb.classList.add("on");
    document.body.classList.add("lb-open");
    document.body.style.overflow = "hidden";
    document.getElementById("lbClose").focus();
  }

  function close() {
    lb.classList.remove("on");
    document.body.classList.remove("lb-open");
    document.body.style.overflow = "";
    if (current >= 0 && triggers[current]) {
      triggers[current].focus({ preventScroll: true });
    }
  }

  all.forEach(function (el) {
    el.addEventListener("click", function (ev) {
      ev.preventDefault();
      open(indexOf[el.getAttribute("data-full")]);
    });
  });

  document.getElementById("lbClose").addEventListener("click", close);
  document.getElementById("lbPrev").addEventListener("click", function (e) {
    e.stopPropagation(); show(current - 1);
  });
  document.getElementById("lbNext").addEventListener("click", function (e) {
    e.stopPropagation(); show(current + 1);
  });
  lb.addEventListener("click", function (e) {
    if (e.target === lb || e.target === lbImg) close();
  });

  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("on")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(current - 1);
    else if (e.key === "ArrowRight") show(current + 1);
  });
})();
