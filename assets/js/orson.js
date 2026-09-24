(function () {
  var track = document.querySelector('.track');
  var mobile = window.matchMedia('(max-width: 900px)');
  var menuLinks = document.querySelectorAll('.menu a[data-target]');

  // Bring any in-page anchor into view: slide the track to its column, then
  // scroll that column down to the anchor.
  function reveal(id) {
    var el = document.getElementById(id);
    if (!el) return false;
    var section = el.closest('.section');
    if (mobile.matches || !section) {
      el.scrollIntoView({ block: 'start' });
    } else {
      var r = section.getBoundingClientRect(), t = track.getBoundingClientRect();
      if (r.left < t.left - 1 || r.right > t.right + 1) track.scrollLeft += r.left - t.left;
      lockUntil = Date.now() + 1000;
      section.scrollTop = el === section ? 0 : el.offsetTop - section.offsetTop - 16;
    }
    setActive(section ? section.id : id);
    return true;
  }

  var lockUntil = 0;  // keep an explicitly chosen menu item while the track animates
  function setActive(id) {
    menuLinks.forEach(function (a) { a.classList.toggle('active', a.dataset.target === id); });
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href*="#"]');
    if (!a || a.origin + a.pathname !== location.origin + location.pathname) return;
    var id = decodeURIComponent(a.hash.slice(1));
    if (id && reveal(id)) {
      e.preventDefault();
      history.replaceState(null, '', '#' + id);
      document.body.classList.remove('menu-open');
    }
  });

  // Highlight the leftmost column in view (desktop) or the one at the top (mobile).
  var sections = Array.prototype.slice.call(document.querySelectorAll('.section[id]'));
  function syncActive() {
    if (Date.now() < lockUntil) return;
    var cur = sections[0];
    sections.forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (mobile.matches ? r.top <= 80 : r.left <= track.getBoundingClientRect().left + 40) cur = s;
    });
    if (!mobile.matches && track.scrollLeft > 0 && track.scrollLeft >= track.scrollWidth - track.clientWidth - 2) cur = sections[sections.length - 1];
    if (cur) setActive(cur.id);
  }
  if (track) track.addEventListener('scroll', syncActive, { passive: true });
  window.addEventListener('scroll', syncActive, { passive: true });
  if (location.hash) setTimeout(function () { reveal(decodeURIComponent(location.hash.slice(1))); }, 50);
  else syncActive();
  window.addEventListener('hashchange', function () { reveal(decodeURIComponent(location.hash.slice(1))); });

  // Vertical wheel over the gap between columns scrolls the track sideways.
  if (track) track.addEventListener('wheel', function (e) {
    if (mobile.matches || e.target.closest('.section')) return;
    track.scrollLeft += e.deltaY;
  }, { passive: true });

  // Mobile menu.
  var toggle = document.querySelector('.menu-toggle');
  if (toggle) toggle.addEventListener('click', function () {
    var open = document.body.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', open);
  });

  // Paper carousels.
  document.querySelectorAll('.carousel').forEach(function (c) {
    var slides = c.querySelector('.slides');
    var prev = c.querySelector('.prev'), next = c.querySelector('.next'), counter = c.querySelector('.counter');
    var n = slides.children.length;
    if (!prev) return;
    function index() { return Math.round(slides.scrollLeft / slides.clientWidth); }
    function update() {
      var i = index();
      prev.disabled = i <= 0;
      next.disabled = i >= n - 1;
      counter.textContent = (i + 1) + ' / ' + n;
    }
    prev.addEventListener('click', function () { slides.scrollLeft -= slides.clientWidth; });
    next.addEventListener('click', function () { slides.scrollLeft += slides.clientWidth; });
    slides.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
    update();
  });
})();
