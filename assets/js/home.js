/* 메인 페이지 전용: 메인 비주얼·공지사항·팝업 공지 */
(function () {
  var api = window.WZ.api;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- 메인 비주얼 슬라이더 ---------- */
  var track = $('[data-slot="slides"]');
  var pager = $('[data-slot="pager"]');
  var hero = $('.hero');
  var toggleBtn = $('[data-action="toggle"]', hero);
  var slides = [];
  var dots = [];
  var current = 0;
  var timer = null;
  var playing = !reduceMotion;
  var INTERVAL = 6000;

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function go(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach(function (s, idx) {
      var active = idx === current;
      s.classList.toggle('is-active', active);
      s.setAttribute('aria-hidden', String(!active));
      $$('a', s).forEach(function (a) { a.tabIndex = active ? 0 : -1; });
    });
    dots.forEach(function (d, idx) {
      d.classList.toggle('is-active', idx === current);
      d.setAttribute('aria-selected', String(idx === current));
    });
    $('[data-slot="slide-current"]').textContent = pad(current + 1);
    restartProgress();
  }

  function restartProgress() {
    var bar = dots[current] && $('i', dots[current]);
    if (!bar) return;
    bar.style.animation = 'none';
    void bar.offsetWidth;
    bar.style.animation = '';
  }

  function play() {
    stop();
    if (!playing) return;
    timer = setInterval(function () { go(current + 1); }, INTERVAL);
  }
  function stop() { clearInterval(timer); timer = null; }

  function setPlaying(p) {
    playing = p;
    hero.classList.toggle('is-paused', !p);
    toggleBtn.setAttribute('aria-label', p ? '자동 재생 정지' : '자동 재생 시작');
    p ? play() : stop();
  }

  api.getSlides().then(function (data) {
    track.innerHTML = data.map(function (s, i) {
      var media = s.image && s.image.src
        ? '<img src="' + esc(s.image.src) + '" alt="' + esc(s.image.alt || '') + '">'
        : '<div class="art art--' + esc(s.tone || 'moss') + '" role="img" aria-label="' + esc((s.image && s.image.alt) || '') + '"><span class="art-note">Image</span></div>';
      return (
        '<article class="hero-slide" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + ' / ' + data.length + '">' +
          media +
          '<a class="hero-caption" href="' + esc(s.href) + '">' +
            '<span class="hero-caption-label">' + esc(s.label) + '</span>' +
            '<span class="hero-caption-title">' + esc(s.title) + '</span>' +
          '</a>' +
        '</article>'
      );
    }).join('');
    pager.innerHTML = data.map(function (s, i) {
      return '<button type="button" role="tab" aria-label="' + (i + 1) + '번 슬라이드: ' + esc(s.title) + '"><i></i><span>' + pad(i + 1) + '</span><em>' + esc(s.label) + '</em></button>';
    }).join('');

    slides = $$('.hero-slide', track);
    dots = $$('button', pager);
    $('[data-slot="slide-total"]').textContent = pad(slides.length);
    dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); play(); }); });

    go(0);
    setPlaying(playing);
  });

  $('[data-action="prev"]', hero).addEventListener('click', function () { go(current - 1); play(); });
  $('[data-action="next"]', hero).addEventListener('click', function () { go(current + 1); play(); });
  toggleBtn.addEventListener('click', function () { setPlaying(!playing); });
  hero.addEventListener('mouseenter', function () { stop(); hero.classList.add('is-hover'); });
  hero.addEventListener('mouseleave', function () { hero.classList.remove('is-hover'); play(); });
  hero.addEventListener('focusin', stop);
  hero.addEventListener('focusout', play);

  // 터치 스와이프
  var startX = null;
  track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) { go(current + (dx < 0 ? 1 : -1)); play(); }
    startX = null;
  });

  /* ---------- 공지사항 ---------- */
  api.getNotices().then(function (list) {
    var el = $('[data-slot="notices"]');
    if (!list.length) { el.innerHTML = '<li class="notice-empty">등록된 공지사항이 없습니다.</li>'; return; }
    el.innerHTML = list.map(function (n) {
      return '<li><a href="' + esc(api.noticeUrl(n.id)) + '">' +
        '<span class="notice-title">' + esc(n.title) + '</span>' +
        '<time datetime="' + esc(n.date) + '">' + esc(n.date.replace(/-/g, '.')) + '</time>' +
      '</a></li>';
    }).join('');
  });

  /* ---------- 팝업 공지 (오늘 하루 보지 않기) ---------- */
  var layer = $('#popupLayer');
  var popupKey = function (id) { return 'wz-popup-hide-' + id; };
  function today() { return new Date().toISOString().slice(0, 10); }
  function hiddenToday(id) {
    try { return localStorage.getItem(popupKey(id)) === today(); } catch (e) { return false; }
  }

  api.getPopups().then(function (list) {
    var p = list.filter(function (x) { return !hiddenToday(x.id); })[0];
    if (!p) return;
    $('[data-slot="popup"]', layer).innerHTML =
      '<div class="art art--moss ph-popup" aria-hidden="true"><span class="art-note">Image</span></div>' +
      '<h2 id="popupTitle">' + esc(p.title) + '</h2>' +
      '<p>' + esc(p.body) + '</p>' +
      '<a class="btn btn-dark" href="' + esc(p.href) + '">자세히 보기</a>';
    layer.hidden = false;

    function close(hideToday) {
      if (hideToday) { try { localStorage.setItem(popupKey(p.id), today()); } catch (e) {} }
      layer.hidden = true;
    }
    $('[data-action="popup-today"]', layer).addEventListener('click', function () { close(true); });
    $('[data-action="popup-close"]', layer).addEventListener('click', function () { close(false); });
    layer.addEventListener('click', function (e) { if (e.target === layer) close(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !layer.hidden) close(false); });
  });
})();
