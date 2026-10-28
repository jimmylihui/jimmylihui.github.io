(function () {
  'use strict';
  document.querySelectorAll('[data-avatar-evolution]').forEach(function (root) {
    var frame = root.querySelector('.avatar-evolution-frame');
    var original = root.querySelector('.about-photo');
    var overlay = root.querySelector('.avatar-evolution-overlay');
    var controls = root.querySelector('.avatar-evolution-controls');
    var range = root.querySelector('input');
    var output = root.querySelector('output');
    var status = root.querySelector('[role="status"]');
    var zh = root.dataset.lang === 'zh';
    var cache = {};
    var request = 0;
    var drag = null;
    var originalLabel = zh ? '原照' : 'Original';

    function load(stage) {
      if (!cache[stage]) cache[stage] = new Promise(function (resolve, reject) {
        var image = new Image();
        image.onload = function () { resolve(image.src); };
        image.onerror = reject;
        image.src = root.dataset.stageBase + stage + '.webp';
      });
      return cache[stage];
    }

    function label(stage) {
      return stage === 0 ? originalLabel : (zh ? '第 ' + stage + ' 档' : 'Stage ' + stage);
    }

    function select() {
      var stage = Math.max(0, Math.min(8, Number(range.value)));
      var ticket = ++request;
      status.textContent = '';
      range.setAttribute('aria-valuetext', label(stage));
      if (stage === 0) {
        overlay.hidden = true;
        original.alt = zh ? '李佳晖' : 'Jiahui Li';
        output.textContent = originalLabel;
        return;
      }
      output.textContent = zh ? '加载中…' : 'Loading…';
      load(stage).then(function (src) {
        if (ticket !== request) return;
        overlay.src = src;
        overlay.hidden = false;
        original.alt = (zh ? '李佳晖，GigaChad 第 ' + stage + ' 档' : 'Jiahui Li, GigaChad stage ' + stage);
        output.textContent = stage + ' / 8';
      }).catch(function () {
        if (ticket !== request) return;
        range.value = '0';
        overlay.hidden = true;
        output.textContent = originalLabel;
        range.setAttribute('aria-valuetext', originalLabel);
        original.alt = zh ? '李佳晖' : 'Jiahui Li';
        status.textContent = zh ? '此档图片暂不可用，已显示原照。' : 'Image unavailable. Showing original.';
      });
      // Warm the remaining small local frames once the visitor interacts.
      for (var i = 1; i <= 8; i++) load(i).catch(function () {});
    }

    range.addEventListener('input', function () {
      original.alt = zh ? '李佳晖' : 'Jiahui Li';
      select();
    });

    // Horizontal photo gestures leave vertical touch scrolling to the browser.
    frame.addEventListener('pointerdown', function (event) {
      if (!event.isPrimary || event.button !== 0) return;
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY, value: Number(range.value), active: false };
    });
    frame.addEventListener('pointermove', function (event) {
      if (!drag || drag.id !== event.pointerId) return;
      var dx = event.clientX - drag.x, dy = event.clientY - drag.y;
      if (!drag.active) {
        if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 6) { drag = null; return; }
        if (Math.abs(dx) < 6) return;
        drag.active = true;
        frame.setPointerCapture(event.pointerId);
        frame.classList.add('is-dragging');
      }
      range.value = String(Math.max(0, Math.min(8, Math.round(drag.value + dx / frame.clientWidth * 8))));
      select();
    });
    function endDrag() { drag = null; frame.classList.remove('is-dragging'); }
    frame.addEventListener('pointerup', endDrag);
    frame.addEventListener('pointercancel', endDrag);
    frame.addEventListener('lostpointercapture', function (event) {
      // Touch starts with implicit capture on the image. Ignore its bubbling
      // loss when horizontal dragging transfers capture to the frame.
      if (event.target === frame) endDrag();
    });
    frame.addEventListener('pointerleave', function () { if (drag && !drag.active) endDrag(); });
    controls.hidden = false;
    range.value = '0';
    select();
  });
})();
