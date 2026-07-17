(function () {
  "use strict";

  var prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var isMobile =
    /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);

  function generateWaveElements() {
    var seas = document.querySelectorAll(".sea");
    seas.forEach(function (sea) {
      for (var i = 0; i < 121; i++) {
        var wave = document.createElement("div");
        wave.className = "wave";
        wave.style.setProperty("--i", i);
        sea.appendChild(wave);
      }
    });
  }

  function launchIntoFullscreen(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      launchIntoFullscreen(document.documentElement);
    }

    document.querySelector("#monitor").style.backgroundColor = "#161913";

    var nodisplays = document.querySelectorAll(".nodisplay");
    for (var i = 0; i < nodisplays.length; i++) {
      nodisplays[i].classList.remove("nodisplay");
    }

    document.querySelector(".enter-text").classList.add("nodisplay");
    document.querySelector(".background-image").classList.add("nodisplay");

    var promptKey = document.querySelector(".prompt-key");
    promptKey.textContent = "B C F E\tB C E D\tB C F E D C";

    if (isMobile) {
      var mobileKb = document.querySelector(".mobile-keyboard");
      if (mobileKb) mobileKb.classList.remove("nodisplay");
    }
  }

  function playAudio(keyCode) {
    var audio = document.querySelector('audio[data-key="' + keyCode + '"]');
    if (!audio) return;
    audio.currentTime = 0;
    var playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(function () {});
    }
  }

  function flashKey(keyCode) {
    var keyEl = document.querySelector('.mobile-key[data-key="' + keyCode + '"]');
    if (keyEl) {
      keyEl.classList.add("active");
      setTimeout(function () {
        keyEl.classList.remove("active");
      }, 150);
    }

    var waves = document.querySelectorAll(".wave");
    var count = Math.min(waves.length, 20);
    for (var i = 0; i < count; i++) {
      (function (w) {
        w.classList.add("flash");
        setTimeout(function () {
          w.classList.remove("flash");
        }, 200);
      })(waves[Math.floor(Math.random() * waves.length)]);
    }
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.keyCode === 13) {
      toggleFullScreen();
      return;
    }

    var keyMap = { B: 66, C: 67, D: 68, E: 69, F: 70 };
    var code = keyMap[e.key.toUpperCase()] || e.keyCode;
    if (keyMap[e.key.toUpperCase()]) {
      e.preventDefault();
      playAudio(code);
      flashKey(code);
    }
  });

  if (isMobile) {
    document.addEventListener("touchstart", function (e) {
      if (!document.fullscreenElement && !document.querySelector("#monitor").classList.contains("revealed")) {
        toggleFullScreen();
        document.querySelector("#monitor").classList.add("revealed");
        return;
      }

      var keyEl = e.target.closest(".mobile-key");
      if (keyEl) {
        var code = parseInt(keyEl.getAttribute("data-key"), 10);
        playAudio(code);
        flashKey(code);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    generateWaveElements();
  });
})();
