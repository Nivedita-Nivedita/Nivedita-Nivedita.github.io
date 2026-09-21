(function () {
  var PHASE_NAMES = [
    "New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous",
    "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"
  ];
  var SYNODIC_MONTH = 29.530588853;
  var FALLBACK = { lat: 43.4643, lon: -80.5204, label: "Shown for Waterloo, ON — allow location for your current location" };

  function moonLitPathData(phase, r, cx, cy) {
    var theta = phase * 2 * Math.PI;
    var rx = Math.abs(r * Math.cos(theta));
    var outerSweep = phase < 0.5 ? 1 : 0;
    var innerSweep = Math.floor(phase * 4) % 2;
    return [
      "M", cx, cy - r,
      "A", r, r, 0, 0, outerSweep, cx, cy + r,
      "A", rx, r, 0, 0, innerSweep, cx, cy - r,
      "Z"
    ].join(" ");
  }

  function phaseName(phase) {
    var idx = Math.round(phase * 8) % 8;
    return PHASE_NAMES[idx];
  }

  function daysToNextFullMoon(phase) {
    var target = phase < 0.5 ? 0.5 : 1.5;
    return Math.round((target - phase) * SYNODIC_MONTH);
  }

  function formatTime(date) {
    if (!date) return "—";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function renderMoon(lat, lon, locationLabel) {
    if (typeof SunCalc === "undefined") return;

    var now = new Date();
    var illum = SunCalc.getMoonIllumination(now);
    var times = SunCalc.getMoonTimes(now, lat, lon);

    var path = document.getElementById("moon-lit-path");
    if (path) path.setAttribute("d", moonLitPathData(illum.phase, 48, 50, 50));

    setText("moon-phase-name", phaseName(illum.phase));
    setText("moon-illumination", Math.round(illum.fraction * 100) + "%");
    setText("moon-moonrise", formatTime(times.rise));
    setText("moon-moonset", formatTime(times.set));

    var days = daysToNextFullMoon(illum.phase);
    setText("moon-nextfull", days === 0 ? "Today" : days === 1 ? "1 day" : days + " days");
    setText("moon-location", locationLabel);
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("moon-widget")) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          renderMoon(pos.coords.latitude, pos.coords.longitude, "Shown for your current location");
        },
        function () {
          renderMoon(FALLBACK.lat, FALLBACK.lon, FALLBACK.label);
        },
        { timeout: 5000 }
      );
    } else {
      renderMoon(FALLBACK.lat, FALLBACK.lon, FALLBACK.label);
    }
  });
})();
