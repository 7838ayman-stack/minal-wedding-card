(function () {
  "use strict";

  var body = document.body;
  var scene = document.getElementById("envelopeScene");
  var envelope = document.getElementById("envelope");
  var seal = document.getElementById("waxSeal");

  function openInvitation() {
    if (scene.dataset.opening === "true") return;
    scene.dataset.opening = "true";

    scene.classList.add("is-opening");

    window.setTimeout(function () {
      envelope.classList.add("is-open");
    }, 420);

    window.setTimeout(function () {
      envelope.classList.add("is-exit");
      scene.classList.add("is-exiting");
    }, 2320);

    window.setTimeout(function () {
      scene.classList.add("is-done");
      body.classList.remove("is-locked");
      window.scrollTo(0, 0);
      initReveal();
    }, 3280);
  }

  seal.addEventListener("click", openInvitation);

  function initReveal() {
    var elements = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      elements.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initScratchHeart() {
    var stage = document.getElementById("heartStage");
    var canvas = document.getElementById("scratchCanvas");
    if (!stage || !canvas) return;

    var ctx = canvas.getContext("2d", { willReadFrequently: true });
    var drawing = false;
    var revealed = false;
    var lastPoint = null;
    var strokeCount = 0;
    var revealThreshold = 0.6;

    function heartPath(w, h) {
      var pts = [
        [0.5, 0.995],
        [0.02, 0.775],
        [0.0, 0.585],
        [0.0, 0.385],
        [0.0, 0.18],
        [0.145, 0.07],
        [0.29, 0.07],
        [0.40, 0.145],
        [0.47, 0.245],
        [0.5, 0.30],
        [0.53, 0.245],
        [0.60, 0.145],
        [0.71, 0.07],
        [0.855, 0.07],
        [1.0, 0.18],
        [1.0, 0.385],
        [1.0, 0.585],
        [0.98, 0.775]
      ];

      function P(i) {
        return (pts[i][0] * w).toFixed(2) + " " + (pts[i][1] * h).toFixed(2);
      }

      var d =
        "M " + P(0) +
        " C " + P(1) + ", " + P(2) + ", " + P(3) +
        " C " + P(4) + ", " + P(5) + ", " + P(6) +
        " C " + P(7) + ", " + P(8) + ", " + P(9) +
        " C " + P(10) + ", " + P(11) + ", " + P(12) +
        " C " + P(13) + ", " + P(14) + ", " + P(15) +
        " C " + P(16) + ", " + P(17) + ", " + P(0) + " Z";

      return d;
    }

    function sizeCanvas() {
      var rect = stage.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      stage.style.clipPath = "path(\"" + heartPath(rect.width, rect.height) + "\")";

      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = Math.round(rect.width * dpr);
      var h = Math.round(rect.height * dpr);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        paintScratch(rect.width, rect.height);
      }
    }

    function paintScratch(w, h) {
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(canvas.width / w, canvas.height / h);

      var gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, "#eaf3f8");
      gradient.addColorStop(0.22, "#b9cdd9");
      gradient.addColorStop(0.45, "#dfeaf1");
      gradient.addColorStop(0.68, "#a8bfd0");
      gradient.addColorStop(0.86, "#d3e0e8");
      gradient.addColorStop(1, "#9fb6c6");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      ctx.globalAlpha = 0.3;
      for (var i = 0; i < 26; i++) {
        var sx = (i / 26) * (w + h) - h;
        var band = ctx.createLinearGradient(sx, 0, sx + 60, h);
        band.addColorStop(0, "rgba(255,255,255,0)");
        band.addColorStop(0.5, "rgba(255,255,255,0.9)");
        band.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = band;
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx + 46, 0);
        ctx.lineTo(sx + 46 + h, h);
        ctx.lineTo(sx + h, h);
        ctx.closePath();
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      var sparkles = Math.round((w * h) / 110);
      for (var s = 0; s < sparkles; s++) {
        var x = Math.random() * w;
        var y = Math.random() * h;
        var r = Math.random() * 1.7 + 0.4;
        var tone = Math.random();
        ctx.fillStyle =
          tone > 0.72
            ? "rgba(255,255,255,0.95)"
            : tone > 0.4
              ? "rgba(234,246,255,0.8)"
              : "rgba(196,214,226,0.85)";
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (var g = 0; g < 34; g++) {
        var gx = Math.random() * w;
        var gy = Math.random() * h;
        var gr = Math.random() * 5 + 2;
        var glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
        glow.addColorStop(0, "rgba(255,255,255,0.75)");
        glow.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(gx, gy, gr, 0, Math.PI * 2);
        ctx.fill();
      }

      var mask = new Path2D();
      mask.rect(0, 0, w, h);
      mask.addPath(new Path2D(heartPath(w, h)));
      ctx.fillStyle = "#000";
      ctx.globalCompositeOperation = "destination-out";
      ctx.fill(mask, "evenodd");
      ctx.globalCompositeOperation = "source-over";

      var sample = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      var inside = 0;
      var counted = 0;
      for (var p = 3; p < sample.length; p += 4 * 24) {
        counted++;
        if (sample[p] > 10) inside++;
      }
      var heartFraction = counted ? inside / counted : 0.7;
      revealThreshold = 1 - heartFraction * 0.55;

      ctx.restore();
    }

    function pointFrom(event) {
      var rect = canvas.getBoundingClientRect();
      var source = event.touches && event.touches.length ? event.touches[0] : event;
      return {
        x: source.clientX - rect.left,
        y: source.clientY - rect.top
      };
    }

    function scratchAt(a, b) {
      ctx.save();
      ctx.fillStyle = "#000";
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = 42;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(b.x, b.y, 21, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function checkProgress() {
      if (revealed) return;
      var data;
      try {
        data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      } catch (err) {
        return;
      }

      var total = 0;
      var cleared = 0;
      for (var i = 3; i < data.length; i += 4 * 24) {
        total++;
        if (data[i] < 110) cleared++;
      }

      if (total > 0 && cleared / total >= revealThreshold) {
        revealed = true;
        stage.classList.add("is-revealed");
      }
    }

    function startDrawing(event) {
      if (revealed) return;
      drawing = true;
      lastPoint = pointFrom(event);
      scratchAt(lastPoint, lastPoint);
      strokeCount++;
      event.preventDefault();
    }

    function moveDrawing(event) {
      if (!drawing || revealed) return;
      var point = pointFrom(event);
      scratchAt(lastPoint, point);
      lastPoint = point;
      strokeCount++;
      if (strokeCount % 7 === 0) checkProgress();
      event.preventDefault();
    }

    function stopDrawing() {
      if (!drawing) return;
      drawing = false;
      lastPoint = null;
      checkProgress();
    }

    canvas.addEventListener("mousedown", startDrawing);
    window.addEventListener("mousemove", moveDrawing);
    window.addEventListener("mouseup", stopDrawing);
    window.addEventListener("blur", stopDrawing);

    canvas.addEventListener("touchstart", startDrawing, { passive: false });
    canvas.addEventListener("touchmove", moveDrawing, { passive: false });
    canvas.addEventListener("touchend", stopDrawing);
    canvas.addEventListener("touchcancel", stopDrawing);

    canvas.addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });

    var resizeTimer = null;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        var wasRevealed = revealed;
        sizeCanvas();
        if (wasRevealed) {
          ctx.save();
          ctx.globalCompositeOperation = "destination-out";
          ctx.fillStyle = "#000";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.restore();
          stage.classList.add("is-revealed");
        }
      }, 160);
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(sizeCanvas);
    }
    sizeCanvas();
    window.addEventListener("load", sizeCanvas);
  }

  function initCountdown() {
    var target = new Date("Jan 30, 2027 10:30:00").getTime();
    var daysEl = document.getElementById("cdDays");
    var hoursEl = document.getElementById("cdHours");
    var minutesEl = document.getElementById("cdMinutes");
    var secondsEl = document.getElementById("cdSeconds");
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    function pad(value) {
      return value < 10 ? "0" + value : String(value);
    }

    function tick() {
      var diff = target - Date.now();
      if (diff < 0) diff = 0;

      var days = Math.floor(diff / 86400000);
      var hours = Math.floor(diff / 3600000) % 24;
      var minutes = Math.floor(diff / 60000) % 60;
      var seconds = Math.floor(diff / 1000) % 60;

      daysEl.textContent = pad(days);
      hoursEl.textContent = pad(hours);
      minutesEl.textContent = pad(minutes);
      secondsEl.textContent = pad(seconds);
    }

    tick();
    window.setInterval(tick, 1000);
  }

  function initRsvp() {
    var form = document.getElementById("rsvpForm");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = form.querySelector("#guestName");
      var attendance = form.querySelector("#attendance");

      if (!name.value.trim()) {
        name.focus();
        return;
      }
      if (!attendance.value) {
        attendance.focus();
        return;
      }

      window.alert("Thank you, " + name.value.trim() + "! Your response has been received.");
      form.reset();
    });
  }

  function initSaveDate() {
    var button = document.getElementById("saveDateBtn");
    if (!button) return;
    var original = button.textContent;
    var timer = null;

    button.addEventListener("click", function () {
      if (button.classList.contains("is-saved")) return;
      button.classList.add("is-saved");
      button.textContent = "Date Saved ✓";
      timer = window.setTimeout(function () {
        button.classList.remove("is-saved");
        button.textContent = original;
        timer = null;
      }, 2600);
    });

    window.addEventListener("beforeunload", function () {
      if (timer) window.clearTimeout(timer);
    });
  }

  initScratchHeart();
  initCountdown();
  initRsvp();
  initSaveDate();
})();
