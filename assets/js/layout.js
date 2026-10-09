/**
 * 공통 레이아웃 — 헤더(①②③)와 푸터(⑧)·퀵메뉴(⑨)를 모든 페이지에 렌더링한다.
 * 페이지에는 <div data-layout="header"></div>, <div data-layout="footer"></div> 자리만 둔다.
 * 현재 위치 표시는 <body data-section="company" data-page="ceo">로 지정한다.
 * (서버 템플릿/프레임워크로 옮길 때는 이 두 덩어리를 include 파일로 그대로 옮기면 된다)
 */
(function () {
  var HEADER = `
<header class="site-header" id="siteHeader">
  <!-- 관리자 배너 슬롯 (원본 #bannerCntsPc) — api.getTopBanner()가 값이 있을 때만 노출 -->
  <div class="top-banner" id="bannerCntsPc" data-slot="top-banner" hidden></div>
  <!-- ① 상단 바(홈페이지·로그인·신규가입)는 내비 오른쪽 클러스터로 통합 -->
  <div class="container nav">
    <h1 class="logo">
      <a href="index.html" aria-label="좋은효소 홈페이지" data-section="home">
        <!-- TODO: 고객사 원본 로고(logo.svg)로 교체 -->
        <span class="logo-ko">좋은효소</span>
        <span class="logo-en">WELLZYME</span>
      </a>
    </h1>

    <nav class="gnb" aria-label="주 메뉴">
      <ul>
        <li><a data-section="company" href="company.html">회사소개</a></li>
        <li><a data-section="story" href="story.html">브랜드 스토리</a></li>
        <li><a data-section="business" href="business.html">비즈니스</a></li>
        <li><a data-section="notice" href="notice.html">공지사항</a></li>
        <li><a data-section="support" href="branch.html">고객센터</a></li>
      </ul>
    </nav>

    <div class="header-actions">
      <button class="icon-btn search-toggle" type="button" aria-label="검색 열기" aria-controls="searchForm" aria-expanded="false">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
      </button>
      <a class="icon-btn cart" href="/shop/osOrderCart" aria-label="장바구니">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>
        <b class="cart-count" data-slot="cart-count">0</b>
      </a>
      <span class="cart-total" data-slot="cart-total" aria-hidden="true">0원</span>
      <span class="nav-auth" data-slot="auth">
        <!-- 로그인 상태에 따라 common.js에서 렌더링 -->
        <a class="nav-link" href="/login">로그인</a>
      </span>
      <a class="btn btn-secondary nav-btn nav-shop" href="/shop/osMain">쇼핑몰</a>
      <a class="btn btn-primary nav-btn" href="/member/osNotUseCondAgree" data-slot="header-cta">회원가입</a>
      <button class="icon-btn allmenu-btn" type="button" id="allmenuBtn" aria-controls="allmenu" aria-expanded="false" aria-label="전체메뉴 열기">
        <span class="burger" aria-hidden="true"><i></i><i></i><i></i></span>
      </button>
    </div>
  </div>

  <form class="search" id="searchForm" action="/search" method="get" role="search">
    <div class="container search-inner">
      <label for="q" class="sr-only">검색</label>
      <input id="q" name="q" type="search" placeholder="검색어를 입력하세요" autocomplete="off">
      <button type="submit" class="btn btn-primary">검색</button>
    </div>
  </form>

  <!-- ③' 전체보기 메가 메뉴 (모바일에서는 전체 화면 드로어) -->
  <div class="allmenu" id="allmenu" hidden>
    <div class="container allmenu-inner">
      <div class="allmenu-mobile-top">
        <ul class="allmenu-auth" data-slot="auth-mobile">
          <li><a href="/login">로그인</a></li>
          <li><a href="/member/osNotUseCondAgree">회원가입</a></li>
        </ul>
      </div>
      <div class="allmenu-grid">
        <section class="allmenu-col">
          <h2><a href="company.html">회사소개</a><button type="button" class="acc-btn" aria-expanded="false" aria-label="회사소개 하위 메뉴"></button></h2>
          <ul>
            <li><a href="company.html">좋은효소</a></li>
            <li><a href="ceo.html">CEO 인사말</a></li>
            <li><a href="history.html">연혁</a></li>
            <li><a href="ci.html">CI</a></li>
            <li><a href="location.html">오시는 길</a></li>
          </ul>
        </section>
        <section class="allmenu-col">
          <h2><a href="story.html">브랜드 스토리</a><button type="button" class="acc-btn" aria-expanded="false" aria-label="브랜드 스토리 하위 메뉴"></button></h2>
          <ul>
            <li><a href="story.html">발효 효소의 탄생</a></li>
            <li><a href="mirian.html">미리안 이야기</a></li>
          </ul>
        </section>
        <section class="allmenu-col">
          <h2><a href="business.html">비즈니스</a><button type="button" class="acc-btn" aria-expanded="false" aria-label="비즈니스 하위 메뉴"></button></h2>
          <ul>
            <li><a href="business.html">비즈니스 소개</a>
              <ul class="depth3"><li><a href="plan.html">보상플랜</a></li><li><a href="handbook.html">판매원 수첩</a></li></ul>
            </li>
            <li><a href="benefit.html">회원혜택</a></li>
            <li><a href="forms.html">비즈니스양식</a>
              <ul class="depth3"><li><a href="forms.html#tax">세무 가이드</a></li><li><a href="forms.html#edu-guide">건강기능식품 교육 가이드</a></li><li><a href="forms.html#docs">좋은효소 양식</a></li></ul>
            </li>
            <li><a href="edu.html">상품 교육자료</a></li>
          </ul>
        </section>
        <section class="allmenu-col">
          <h2><a href="notice.html">공지사항</a><button type="button" class="acc-btn" aria-expanded="false" aria-label="공지사항 하위 메뉴"></button></h2>
          <ul>
            <li><a href="notice.html">공지사항</a></li>
            <li><a href="delivery.html">주문/결제/배송 안내</a></li>
            <li><a href="return.html">반품/환불 안내</a></li>
            <li><a href="installment.html">신용카드 할부 안내</a></li>
            <li><a href="privacy.html">개인정보 취급방침</a></li>
            <li><a href="terms.html">회원약관 &amp; 규정</a></li>
            <li><a href="archive.html">자료실</a></li>
          </ul>
        </section>
        <section class="allmenu-col">
          <h2><a href="branch.html">고객센터</a><button type="button" class="acc-btn" aria-expanded="false" aria-label="고객센터 하위 메뉴"></button></h2>
          <ul>
            <li><a href="branch.html">본부/센터 안내</a></li>
            <li><a href="committee.html">운영위원회</a></li>
            <li><a href="gallery.html">사진갤러리</a></li>
            <li><a href="video.html">행사영상</a></li>
          </ul>
        </section>
      </div>
      <div class="allmenu-quick">
        <a href="/main/osWorkHelpList">업무협조전</a>
        <a href="tel:0803114175">대표번호 080-311-4175</a>
      </div>
    </div>
  </div>
</header>
`;

  var FOOTER = `
<!-- ⑧ 푸터 -->
<footer class="site-footer">
  <nav class="footer-links" aria-label="법정 고지 및 관련 기관">
    <div class="container">
      <ul>
        <li><a href="privacy.html"><strong>개인정보취급방침</strong></a></li>
        <li><a href="https://www.ftc.go.kr" target="_blank" rel="noopener">공정거래위원회</a></li>
        <li><a href="https://www.kossa.or.kr" target="_blank" rel="noopener">한국특수판매공제조합</a></li>
        <li><a href="https://www.kdsa.or.kr" target="_blank" rel="noopener">한국직접판매협회</a></li>
        <li><a href="https://www.khsa.or.kr" target="_blank" rel="noopener">한국건강기능식품협회</a></li>
        <!-- TODO: 원본 windowOpen/2/3()의 실제 팝업 URL로 교체 -->
        <li><a href="#" data-popup="guarantee">보증서조회</a></li>
        <li><a href="#" data-popup="allowance">평균후원수당공지</a></li>
        <li><a href="#" data-popup="seller">판매원조회</a></li>
      </ul>
    </div>
  </nav>
  <div class="container footer-main">
    <div class="footer-brand">
      <!-- TODO: 고객사 원본 로고(logo.svg)로 교체 -->
      <a class="footer-logo" href="index.html" aria-label="좋은효소 홈">
        <span class="logo-ko">좋은효소</span>
        <span class="logo-en">WELLZYME</span>
      </a>
      <p class="footer-company">(주)좋은효소</p>
      <a class="footer-tel" href="tel:0803114175">
        <span>대표번호</span>
        <strong>080-311-4175</strong>
      </a>
    </div>
    <dl class="footer-info">
      <div><dt>대표</dt><dd>구금숙</dd></div>
      <div><dt>주소</dt><dd>서울특별시 금천구 가산디지털1로 205-15 (가산동 SH 드림타워) 2층 207, 208호</dd></div>
      <div><dt>이메일</dt><dd><a href="mailto:wellzyme@naver.com">wellzyme@naver.com</a></dd></div>
      <div><dt>팩스</dt><dd>02-6499-1237</dd></div>
      <div><dt>통신판매업 신고번호</dt><dd>제2013-서울금천-0995호</dd></div>
      <div><dt>건강기능식품 등록번호</dt><dd>제 2013-0084391호</dd></div>
      <div><dt>사업자 등록번호</dt><dd>615-86-02143</dd></div>
    </dl>
  </div>
  <div class="footer-copy">
    <div class="container">COPYRIGHT © 2015 (주)좋은효소 ALL RIGHTS RESERVED.</div>
  </div>
</footer>

<!-- 전역 로딩 바 (원본 #loadingBar) — 요청이 300ms 이상 걸리면 표시 -->
<div class="loading-bar" id="loadingBar" role="progressbar" aria-label="불러오는 중" hidden></div>

<!-- ⑨ 퀵메뉴 (PC: 우측 고정 / 모바일: 하단 탭바) -->
<button type="button" class="icon-btn icon-btn-outline quick-toggle" aria-controls="quickMenu" aria-expanded="false" aria-label="빠른 메뉴 열기">
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
</button>
<nav class="quick" id="quickMenu" aria-label="빠른 메뉴">
  <ul>
    <li><a href="/shop/osOrderCart">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.2 11h10.6L20 7H6.2"/><circle cx="9" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/></svg>
      <span>장바구니</span></a></li>
    <li><a href="/order/osOrderSearch">
      <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3.5" width="14" height="17" rx="1.5"/><path d="M9 8h6M9 12h6M9 16h3"/></svg>
      <span>주문조회</span></a></li>
    <li><a href="/order/osOrdDetailSearch">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.5"/><circle cx="17" cy="17.5" r="1.5"/></svg>
      <span>배송조회</span></a></li>
    <li class="quick-pc"><a href="/main/osWorkHelpList">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H8l-4 4z"/></svg>
      <span>업무협조전</span></a></li>
    <li><a href="/order/osFrontAmt">
      <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="1.5"/><path d="M3 10h18"/></svg>
      <span>결제</span></a></li>
    <li><a href="/shop/osMain" class="quick-shop">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h16l-1 11H5zM8 9V7a4 4 0 0 1 8 0v2"/></svg>
      <span>쇼핑몰</span></a></li>
  </ul>
</nav>
`;

  function mount(name, html) {
    var slot = document.querySelector('[data-layout="' + name + '"]');
    if (!slot) return;
    slot.insertAdjacentHTML('beforebegin', html);
    slot.remove();
  }
  mount('header', HEADER);
  mount('footer', FOOTER);

  // 현재 위치 표시
  var section = document.body.dataset.section || 'home';
  var page = document.body.dataset.page;
  document.querySelectorAll('a[data-section="' + section + '"]').forEach(function (a) {
    a.classList.add('is-current');
    if (section === 'home') a.setAttribute('aria-current', 'page');
  });
  if (page) {
    var file = page + '.html';
    document.querySelectorAll('.allmenu a[href="' + file + '"]').forEach(function (a) {
      a.classList.add('is-current');
    });
  }
})();
