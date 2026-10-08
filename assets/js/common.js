/* 모든 페이지 공통: 헤더·검색·전체메뉴·장바구니·법정 조회 팝업 */
(function () {
  var api = window.WZ.api;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

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
    var cta = $('[data-slot="header-cta"]');
    cta.href = '/shop/osMain';
    cta.textContent = '쇼핑몰';
  });

  /* ---------- 관리자 배너 슬롯 ---------- */
  api.getTopBanner().then(function (b) {
    if (!b) return;
    var slot = $('[data-slot="top-banner"]');
    var inner = b.image
      ? '<img src="' + esc(b.image) + '" alt="' + esc(b.text || '') + '">'
      : '<span>' + esc(b.text) + '</span>';
    slot.innerHTML = '<a class="container" href="' + esc(b.href || '#') + '">' + inner + '</a>';
    slot.hidden = false;
  });

  api.getCart().then(function (cart) {
    $('[data-slot="cart-count"]').textContent = cart.count;
    $('[data-slot="cart-total"]').textContent = won(cart.total);
    $('.cart').setAttribute('aria-label', '장바구니 ' + cart.count + '개, ' + won(cart.total));
  });

  /* ---------- 검색 패널 ---------- */
  var searchForm = $('#searchForm');
  var searchToggle = $('.search-toggle');
  function setSearch(open) {
    searchForm.classList.toggle('is-open', open);
    searchToggle.setAttribute('aria-expanded', String(open));
    searchToggle.setAttribute('aria-label', open ? '검색 닫기' : '검색 열기');
    if (open) $('#q').focus();
  }
  searchToggle.addEventListener('click', function () {
    var open = !searchForm.classList.contains('is-open');
    if (open && !allmenu.hidden) setAllmenu(false);
    setSearch(open);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && searchForm.classList.contains('is-open')) { setSearch(false); searchToggle.focus(); }
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
  allBtn.addEventListener('click', function () {
    if (allmenu.hidden) setSearch(false);
    setAllmenu(allmenu.hidden);
  });
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

  /* ---------- 법정 조회 팝업 ---------- */
  $$('[data-popup]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      window.open(api.popupUrls[a.dataset.popup], a.dataset.popup, 'width=720,height=640,scrollbars=yes');
    });
  });

})();
