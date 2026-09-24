// Owner-only visitor stats panel backed by the GoatCounter API.
// Nothing renders for visitors. The site owner opens /#owner once, pastes a
// read-only GoatCounter API token, and it is kept in this browser's
// localStorage only (never in the repo). While logged in, the owner's own
// visits are excluded from counting via GoatCounter's `skipgc` flag.
(function () {
  var GC = (document.querySelector('script[data-goatcounter]') || {}).dataset;
  var site = window.GC_SITE || (GC && GC.goatcounter && GC.goatcounter.replace(/\/count$/, ''));
  var KEY = 'owner_gc_token';
  function store(k, v) { try { v === undefined ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} }
  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  var css = [
    '.os-btn{position:fixed;right:18px;bottom:18px;z-index:50;width:44px;height:44px;border-radius:50%;border:0;background:#2b303b;color:#fff;font-size:17px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.25)}',
    '.os-panel{position:fixed;right:18px;bottom:72px;z-index:50;width:360px;max-width:calc(100vw - 32px);max-height:calc(100vh - 100px);overflow:auto;background:#fff;border:1px solid #e3e5ea;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.18);font:14px/1.5 "Open Sans",system-ui,sans-serif;color:#333;padding:16px 18px}',
    '.os-panel h4{margin:0;font:700 15px Lato,sans-serif;color:#1b4682;display:flex;justify-content:space-between;align-items:center}',
    '.os-panel h5{margin:16px 0 6px;font:700 12px Lato,sans-serif;text-transform:uppercase;letter-spacing:.5px;color:#888}',
    '.os-tabs{display:flex;gap:6px;margin:10px 0 4px}.os-tabs button{flex:1;border:1px solid #d9dde5;background:#fff;border-radius:6px;padding:4px 0;cursor:pointer;font-size:12px}',
    '.os-tabs button.on{background:#1b4682;color:#fff;border-color:#1b4682}',
    '.os-big{font:700 30px Lato,sans-serif;color:#222;margin:8px 0 0}.os-big small{font:400 12px "Open Sans";color:#888;margin-left:6px}',
    '.os-row{display:flex;justify-content:space-between;gap:10px;padding:3px 0;border-bottom:1px solid #f1f2f5;font-size:13px}.os-row span:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.os-row b{color:#1b4682}.os-muted{color:#999;font-size:12px}.os-link{color:#1b4682;font-size:12px;cursor:pointer;text-decoration:underline;background:none;border:0;padding:0}',
    '.os-form input{width:100%;box-sizing:border-box;padding:8px;border:1px solid #d9dde5;border-radius:6px;margin:8px 0;font:13px monospace}',
    '.os-form button{background:#1b4682;color:#fff;border:0;border-radius:6px;padding:7px 14px;cursor:pointer}',
    '.os-err{color:#c0392b;font-size:12px;margin-top:6px}'
  ].join('');

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ymd(d) { return d.toISOString().slice(0, 10); }

  function api(path, token) {
    return fetch(site + '/api/v0' + path, { headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error(r.status === 401 || r.status === 403 ? 'Token rejected (' + r.status + ')' : 'HTTP ' + r.status); return r.json(); });
  }

  function mount() {
    if (!site) return;
    var st = el('style'); st.textContent = css; document.head.appendChild(st);
    var token = load(KEY);
    if (location.hash === '#owner' && !token) return showLogin();
    if (token) { store('skipgc', 't'); showButton(token); }
  }

  function showLogin() {
    var p = el('div', 'os-panel os-form');
    p.innerHTML = '<h4>Owner stats login</h4><p class="os-muted">Paste a GoatCounter API token with <b>read statistics</b> permission. It is saved only in this browser.</p>' +
      '<input type="password" autocomplete="off" placeholder="GoatCounter API token"><button>Save</button> <button class="os-link" data-x>Cancel</button><div class="os-err"></div>';
    document.body.appendChild(p);
    var input = p.querySelector('input'), err = p.querySelector('.os-err');
    p.querySelector('[data-x]').onclick = function () { p.remove(); history.replaceState(null, '', location.pathname); };
    p.querySelector('button').onclick = function () {
      var t = input.value.trim();
      if (!t) { err.textContent = 'Enter a token first.'; return; }
      err.textContent = 'Checking…';
      api('/stats/total?start=' + ymd(new Date(Date.now() - 864e5)), t).then(function () {
        store(KEY, t); store('skipgc', 't'); p.remove(); history.replaceState(null, '', location.pathname); showButton(t, true);
      }).catch(function (e) { err.textContent = e.message; });
    };
    input.oninput = function () { err.textContent = ''; };
    input.focus();
  }

  function showButton(token, open) {
    var b = el('button', 'os-btn', '📊'); b.title = 'Visitor stats (only you can see this)';
    document.body.appendChild(b);
    var panel = null;
    b.onclick = function () { if (panel) { panel.remove(); panel = null; } else { panel = render(token, function () { panel = null; }); } };
    if (open) b.onclick();
  }

  function render(token, onClose) {
    var p = el('div', 'os-panel');
    p.innerHTML = '<h4>Visitor stats <button class="os-link" data-close>close</button></h4>' +
      '<div class="os-tabs"><button data-d="1">24h</button><button data-d="7" class="on">7d</button><button data-d="30">30d</button><button data-d="365">1y</button></div>' +
      '<div data-body><p class="os-muted">Loading…</p></div>' +
      '<p class="os-muted" style="margin-top:14px">Only visible in this browser. <a class="os-link" href="' + site + '" target="_blank" rel="noopener">Full dashboard</a> · <button class="os-link" data-out>Log out</button></p>';
    document.body.appendChild(p);
    var body = p.querySelector('[data-body]');
    p.querySelector('[data-close]').onclick = function () { p.remove(); onClose(); };
    p.querySelector('[data-out]').onclick = function () { store(KEY); store('skipgc'); location.reload(); };
    p.querySelectorAll('[data-d]').forEach(function (t) {
      t.onclick = function () { p.querySelectorAll('[data-d]').forEach(function (x) { x.classList.toggle('on', x === t); }); load_(+t.dataset.d); };
    });
    function load_(days) {
      body.innerHTML = '<p class="os-muted">Loading…</p>';
      var q = '?start=' + ymd(new Date(Date.now() - days * 864e5)) + '&end=' + ymd(new Date(Date.now() + 864e5));
      Promise.all([
        api('/stats/total' + q, token),
        api('/stats/hits' + q + '&limit=8', token),
        api('/stats/toprefs' + q + '&limit=6', token),
        api('/stats/locations' + q + '&limit=6', token)
      ]).then(function (r) {
        var total = r[0], hits = r[1].hits || [], refs = r[2].stats || [], locs = r[3].stats || [];
        var days_ = (total.stats || []).map(function (s) { return s.daily || 0; });
        body.innerHTML = '<div class="os-big">' + (total.total || 0) + '<small>visits</small></div>' + spark(days_) +
          list('Top pages', hits.map(function (h) { return [h.title || h.path, h.count, h.path]; })) +
          list('Referrers', refs.map(function (s) { return [s.name || '(direct / unknown)', s.count]; })) +
          list('Locations', locs.map(function (s) { return [s.name || '(unknown)', s.count]; }));
      }).catch(function (e) {
        body.innerHTML = '<p class="os-err">' + esc(e.message) + '</p>' + (/Token/.test(e.message) ? '<p class="os-muted">Log out and log in again with a valid token.</p>' : '');
      });
    }
    load_(7);
    return p;
  }

  function spark(v) {
    if (v.length < 2) return '';
    var w = 320, h = 48, max = Math.max.apply(null, v.concat([1]));
    var pts = v.map(function (y, i) { return (i * w / (v.length - 1)).toFixed(1) + ',' + (h - 4 - y / max * (h - 8)).toFixed(1); }).join(' ');
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" height="' + h + '" style="margin-top:6px"><polyline points="' + pts + '" fill="none" stroke="#1b4682" stroke-width="2"/></svg>';
  }
  function list(title, rows) {
    return '<h5>' + title + '</h5>' + (rows.length ? rows.map(function (r) {
      return '<div class="os-row"><span title="' + esc(r[2] || r[0]) + '">' + esc(r[0]) + '</span><b>' + r[1] + '</b></div>';
    }).join('') : '<p class="os-muted">Nothing yet</p>');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
  window.addEventListener('hashchange', function () { if (location.hash === '#owner' && !load(KEY) && !document.querySelector('.os-form')) showLogin(); });
})();
