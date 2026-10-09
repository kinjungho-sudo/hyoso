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
      { label: 'BRAND STORY', title: '서두르지 않는 발효의 시간', href: 'story.html', image: { src: 'assets/img/hero-01.jpg', alt: '발효 과정 이미지' } },
      { label: 'EVENT', title: '10월 카드사 무이자 할부 안내', href: 'installment.html', image: { src: 'assets/img/hero-02.jpg', alt: '이벤트 이미지' } },
      { label: 'WELLZYME', title: '사업자와 소비자 모두의 풍요', href: 'company.html', image: { src: 'assets/img/hero-03.jpg', alt: '회사 이미지' } },
      { label: 'BUSINESS', title: '함께 성장하는 비즈니스', href: 'business.html', image: { src: 'assets/img/hero-04.jpg', alt: '비즈니스 이미지' } }
    ],

    notices: [
      { id: '20250930000000000001', title: '10월 토스 카드사 무이자 할부 이벤트 안내', date: '2025-09-30', pinned: true },
      { id: '20250914000000000001', title: '추석 연휴 기간 배송 지연 안내', date: '2025-09-14', pinned: true },
      { id: '20250831000000000001', title: '09월 카드사 무이자 할부 안내', date: '2025-08-31' },
      { id: '20250731000000000001', title: '08월 카드사 무이자 할부 안내', date: '2025-07-31' },
      { id: '20250715000000000001', title: '하계 휴가 기간 고객센터 운영 안내', date: '2025-07-15' },
      { id: '20250630000000000001', title: '07월 카드사 무이자 할부 안내', date: '2025-06-30' },
      { id: '20250610000000000001', title: '회원 정보 변경 절차 안내', date: '2025-06-10' },
      { id: '20250531000000000001', title: '06월 카드사 무이자 할부 안내', date: '2025-05-31' },
      { id: '20250502000000000001', title: '5월 연휴 배송 일정 안내', date: '2025-05-02' },
      { id: '20250430000000000001', title: '05월 카드사 무이자 할부 안내', date: '2025-04-30' },
      { id: '20250401000000000001', title: '개인정보 취급방침 개정 안내', date: '2025-04-01' },
      { id: '20250331000000000001', title: '04월 카드사 무이자 할부 안내', date: '2025-03-31' }
    ],

    // 아래 목록은 모두 시안용 목업 — DB 연동 시 실제 데이터로 교체
    archive: [
      { id: 'a1', category: '양식', title: '회원 정보 변경 신청서', date: '2025-08-20', file: 'PDF' },
      { id: 'a2', category: '양식', title: '반품·교환 신청서', date: '2025-07-02', file: 'PDF' },
      { id: 'a3', category: '교육', title: '건강기능식품 판매 시 유의사항', date: '2025-06-18', file: 'PDF' },
      { id: 'a4', category: '세무', title: '사업소득 신고 안내', date: '2025-05-01', file: 'PDF' },
      { id: 'a5', category: '교육', title: '제품 교육 자료 (2025 상반기)', date: '2025-03-12', file: 'PDF' },
      { id: 'a6', category: '양식', title: '자동이체 신청서', date: '2025-02-05', file: 'HWP' }
    ],

    gallery: [
      { id: 'g1', title: '2025 하반기 사업자 세미나', date: '2025-09-20', image: 'assets/img/gallery-01.jpg' },
      { id: 'g2', title: '신제품 교육 현장', date: '2025-08-12', image: 'assets/img/gallery-02.jpg' },
      { id: 'g3', title: '우수 회원 시상식', date: '2025-06-28', image: 'assets/img/gallery-03.jpg' },
      { id: 'g4', title: '본부 개소식', date: '2025-05-10', image: 'assets/img/gallery-04.jpg' },
      { id: 'g5', title: '2025 상반기 사업자 세미나', date: '2025-03-22', image: 'assets/img/gallery-05.jpg' },
      { id: 'g6', title: '봉사활동', date: '2025-02-15', image: 'assets/img/gallery-06.jpg' }
    ],

    videos: [
      { id: 'v1', title: '2025 하반기 사업자 세미나 하이라이트', date: '2025-09-25', length: '04:12', image: 'assets/img/video-01.jpg', url: '#' },
      { id: 'v2', title: '발효 효소, 이렇게 만들어집니다', date: '2025-07-04', length: '02:48', image: 'assets/img/video-02.jpg', url: '#' },
      { id: 'v3', title: '우수 회원 인터뷰', date: '2025-06-30', length: '05:31', image: 'assets/img/video-03.jpg', url: '#' },
      { id: 'v4', title: '2025 상반기 사업자 세미나 하이라이트', date: '2025-03-28', length: '03:56', image: 'assets/img/video-04.jpg', url: '#' }
    ],

    branches: [
      { type: '본사', name: '좋은효소 본사', address: '서울특별시 금천구 가산디지털1로 205-15 (가산동 SH 드림타워) 2층 207, 208호', tel: '080-311-4175' },
      { type: '본부', name: '본부명 (DB 연동 예정)', address: '주소 (DB 연동 예정)', tel: '-' },
      { type: '센터', name: '센터명 (DB 연동 예정)', address: '주소 (DB 연동 예정)', tel: '-' }
    ],

    popups: [
      {
        id: 'event-2025-10',
        title: '10월 무이자 할부 이벤트',
        body: '토스 카드사 무이자 할부 혜택을 10월 한 달간 제공합니다.',
        href: 'installment.html',
        image: 'assets/img/popup.jpg'
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
    getNotices: function () { return resolve(MOCK.notices.slice(0, 4)); },
    getPopups: function () { return resolve(MOCK.popups); },
    // 하위 페이지 게시판 — DB 연동 시 페이지·검색어를 쿼리로 넘기도록 교체
    getNoticeList: function () { return resolve(MOCK.notices); },
    getNotice: function (id) {
      var list = MOCK.notices, i = list.findIndex(function (n) { return n.id === id; });
      if (i < 0) return resolve(null);
      return resolve({ item: list[i], prev: list[i + 1] || null, next: list[i - 1] || null });
    },
    getArchive: function () { return resolve(MOCK.archive); },
    getGallery: function () { return resolve(MOCK.gallery); },
    getVideos: function () { return resolve(MOCK.videos); },
    getBranches: function () { return resolve(MOCK.branches); },
    // 공지 상세 경로 — 라우팅이 정해지면 여기만 수정
    noticeUrl: function (id) { return 'notice-view.html?id=' + encodeURIComponent(id); },
    // 법정 조회 팝업 경로 — 원본 windowOpen/2/3() URL 확인 후 교체
    popupUrls: {
      guarantee: 'about:blank',
      allowance: 'about:blank',
      seller: 'about:blank'
    }
  };
})();
