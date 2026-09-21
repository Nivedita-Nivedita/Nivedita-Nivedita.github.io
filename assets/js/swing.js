(function () {
  var widget = document.getElementById("swing-widget");
  var group = document.getElementById("swing-group");
  if (!widget || !group) return;

  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;

  var isTouch = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;

  var angle = 9;
  var angularVel = 0;
  var stiffness = 10;
  var damping = 2.3;
  var idleAmplitude = 1.6;
  var idlePeriodMs = 4200;
  var pointerTarget = 0;
  var lastTime = null;

  if (!isTouch) {
    document.addEventListener("pointermove", function (e) {
      var rect = widget.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height * 0.25;
      var dx = e.clientX - cx;
      var dy = e.clientY - cy;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var radius = 220;
      var maxPush = 11;
      if (dist < radius) {
        var strength = 1 - dist / radius;
        var t = (dx / radius) * maxPush * strength;
        pointerTarget = Math.max(-maxPush, Math.min(maxPush, t));
      } else {
        pointerTarget = 0;
      }
    }, { passive: true });
  }

  function frame(now) {
    if (lastTime === null) lastTime = now;
    var dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    var idleTarget = idleAmplitude * Math.sin((now / idlePeriodMs) * Math.PI * 2);
    var target = idleTarget + pointerTarget;

    var accel = stiffness * (target - angle) - damping * angularVel;
    angularVel += accel * dt;
    angle += angularVel * dt;

    group.style.transform = "rotate(" + angle.toFixed(2) + "deg)";
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
