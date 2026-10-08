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
  function won(n) { return Number(n).toLocaleString('ko-KR') + '원'; }

  /* ---------- 헤더: 스크롤 상태 ---------- */
  var header = $('#siteHeader');
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 로그인 상태 / 장바구니 ---------- */
  api.getSession().then(function (user) {
    if (!user) return;
    var html = '<li><span>' + esc(user.name) + '님</span></li><li><a href="/logout">로그아웃</a></li>';
    $$('[data-slot="auth"], [data-slot="auth-mobile"]').forEach(function (el) { el.innerHTML = html; });
  });

  api.getCart().then(function (cart) {
    $('[data-slot="cart-count"]').textContent = cart.count;
    $('[data-slot="cart-total"]').textContent = won(cart.total);
  });

  /* ---------- 검색 (모바일 토글) ---------- */
  var searchForm = $('#searchForm');
  var searchToggle = $('.search-toggle');
  searchToggle.addEventListener('click', function () {
    var open = searchForm.classList.toggle('is-open');
    searchToggle.setAttribute('aria-expanded', String(open));
    if (open) $('#q').focus();
  });
  searchForm.addEventListener('submit', function (e) {
    if (!$('#q').value.trim()) { e.preventDefault(); $('#q').focus(); }
  });

  /* ---------- 전체메뉴 ---------- */
  var allBtn = $('#allmenuBtn');
  var allmenu = $('#allmenu');

  function setAllmenu(open) {
    allmenu.hidden = !open;
    allBtn.setAttribute('aria-expanded', String(open));
    allBtn.setAttribute('aria-label', open ? '전체메뉴 닫기' : '전체메뉴 열기');
    document.body.classList.toggle('menu-open', open);
  }
  allBtn.addEventListener('click', function () { setAllmenu(allmenu.hidden); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !allmenu.hidden) { setAllmenu(false); allBtn.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (!allmenu.hidden && !allmenu.contains(e.target) && !allBtn.contains(e.target)) setAllmenu(false);
  });

  // 모바일 아코디언
  $$('.acc-btn', allmenu).forEach(function (btn) {
    btn.addEventListener('click', function () {
      var col = btn.closest('.allmenu-col');
      var open = col.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

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
      return (
        '<article class="hero-slide tone-' + esc(s.tone) + '" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + ' / ' + data.length + '">' +
          '<div class="hero-media ph" aria-hidden="true"><span>IMAGE</span></div>' +
          '<div class="container hero-content">' +
            '<p class="eyebrow">' + esc(s.eyebrow) + '</p>' +
            '<h2 class="hero-title">' + esc(s.title).replace(/\n/g, '<br>') + '</h2>' +
            '<p class="hero-desc">' + esc(s.desc) + '</p>' +
            '<a class="btn" href="' + esc(s.cta.href) + '">' + esc(s.cta.label) + '</a>' +
          '</div>' +
        '</article>'
      );
    }).join('');
    pager.innerHTML = data.map(function (s, i) {
      return '<button type="button" role="tab" aria-label="' + (i + 1) + '번 슬라이드"><i></i></button>';
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

  /* ---------- 법정 조회 팝업 ---------- */
  $$('[data-popup]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      window.open(api.popupUrls[a.dataset.popup], a.dataset.popup, 'width=720,height=640,scrollbars=yes');
    });
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
      '<div class="ph ph-popup tone-brand" aria-hidden="true"><span>IMAGE</span></div>' +
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
