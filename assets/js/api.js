/**
 * 데이터 레이어
 * DB 연동 전까지 모든 동적 데이터는 이 파일의 목업에서 나온다.
 * DB를 받으면 각 함수 안의 `return MOCK.xxx` 부분만 fetch 호출로 바꾸면 된다.
 *   예) getNotices: () => fetch('/api/notices?limit=4').then(r => r.json())
 */
(function () {
  var MOCK = {
    session: null, // 로그인 시 { name: '홍길동' }

    cart: { count: 0, total: 0 },

    // 관리자 배너 (원본 #bannerCntsPc). 평소엔 null → 숨김
    // 예) { text: '추석 연휴 배송 일정 안내', href: '/board/notice/…', image: null }
    topBanner: null,

    // 메인 비주얼 오른쪽 이미지 슬라이드 (카피·회원가입 CTA는 index.html에 고정)
    slides: [
      { label: 'BRAND STORY', title: '서두르지 않는 발효의 시간', href: '/info/osStory', image: { alt: '발효 과정 이미지(교체 예정)' } },
      { label: 'EVENT', title: '10월 카드사 무이자 할부 안내', href: '/board/installment', image: { alt: '이벤트 이미지(교체 예정)' } },
      { label: 'WELLZYME', title: '사업자와 소비자 모두의 풍요', href: 'company.html', image: { alt: '회사 이미지(교체 예정)' } },
      { label: 'BUSINESS', title: '함께 성장하는 비즈니스', href: '/info/osMarketing', image: { alt: '비즈니스 이미지(교체 예정)' } }
    ],

    notices: [
      { id: '20250930000000000001', title: '10월 토스 카드사 무이자 할부 이벤트 안내', date: '2025-09-30' },
      { id: '20250914000000000001', title: '추석 연휴 기간 배송 지연 안내', date: '2025-09-14' },
      { id: '20250831000000000001', title: '09월 카드사 무이자 할부 안내', date: '2025-08-31' },
      { id: '20250731000000000001', title: '08월 카드사 무이자 할부 안내', date: '2025-07-31' }
    ],

    popups: [
      {
        id: 'event-2025-10',
        title: '10월 무이자 할부 이벤트',
        body: '토스 카드사 무이자 할부 혜택을 10월 한 달간 제공합니다.',
        href: '/board/installment'
      }
    ]
  };

  /* 전역 로딩 바: 진행 중인 요청이 300ms 넘게 걸리면 #loadingBar 표시 */
  var pending = 0, timer = null;
  function loading(delta) {
    var bar = document.getElementById('loadingBar');
    pending = Math.max(0, pending + delta);
    clearTimeout(timer);
    if (!bar) return;
    if (pending > 0) timer = setTimeout(function () { bar.hidden = false; }, 300);
    else bar.hidden = true;
  }

  // DB 연동 시: return track(fetch(url).then(r => r.json()))
  function track(promise) {
    loading(1);
    return promise.then(
      function (v) { loading(-1); return v; },
      function (e) { loading(-1); throw e; }
    );
  }

  function resolve(value) {
    return track(Promise.resolve(JSON.parse(JSON.stringify(value))));
  }

  window.WZ = window.WZ || {};
  window.WZ.loading = { start: function () { loading(1); }, end: function () { loading(-1); } };
  window.WZ.api = {
    getSession: function () { return resolve(MOCK.session); },
    getTopBanner: function () { return resolve(MOCK.topBanner); },
    getCart: function () { return resolve(MOCK.cart); },
    getSlides: function () { return resolve(MOCK.slides); },
    getNotices: function () { return resolve(MOCK.notices); },
    getPopups: function () { return resolve(MOCK.popups); },
    // 공지 상세 경로 — 라우팅이 정해지면 여기만 수정
    noticeUrl: function (id) { return '/board/notice/' + encodeURIComponent(id); },
    // 법정 조회 팝업 경로 — 원본 windowOpen/2/3() URL 확인 후 교체
    popupUrls: {
      guarantee: 'about:blank',
      allowance: 'about:blank',
      seller: 'about:blank'
    }
  };
})();
