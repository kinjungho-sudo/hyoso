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

    slides: [
      {
        eyebrow: 'WELLZYME',
        title: '자연이 만든 효소,\n좋은효소가 담습니다',
        desc: '사업자와 소비자 모두의 풍요를 함께 만드는 기업입니다.',
        cta: { label: '회사 소개', href: 'company.html' },
        link: { label: '브랜드 스토리', href: '/info/osStory' },
        image: { alt: '발효 효소 제품 이미지(교체 예정)' }
      },
      {
        eyebrow: 'BRAND STORY',
        title: '서두르지 않는\n발효의 시간',
        desc: '발효 효소의 탄생과 미리안 이야기를 만나보세요.',
        cta: { label: '브랜드 스토리', href: '/info/osStory' },
        link: { label: '미리안 이야기', href: '/info/osStoryMirian' },
        image: { alt: '발효 과정 이미지(교체 예정)' }
      },
      {
        eyebrow: 'EVENT',
        title: '10월 카드사\n무이자 할부 안내',
        desc: '이달의 무이자 할부 혜택을 확인하세요.',
        cta: { label: '혜택 확인하기', href: '/board/installment' },
        link: { label: '주문/결제 안내', href: '/info/osDeliInfo' },
        image: { alt: '이벤트 이미지(교체 예정)' }
      },
      {
        eyebrow: 'BUSINESS',
        title: '좋은효소와 함께\n성장하는 비즈니스',
        desc: '보상플랜과 회원혜택, 교육자료를 안내합니다.',
        cta: { label: '비즈니스 안내', href: '/info/osMarketing' },
        link: { label: '회원혜택', href: '/info/osBenefit' },
        image: { alt: '비즈니스 이미지(교체 예정)' }
      }
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

  function resolve(value) {
    return Promise.resolve(JSON.parse(JSON.stringify(value)));
  }

  window.WZ = window.WZ || {};
  window.WZ.api = {
    getSession: function () { return resolve(MOCK.session); },
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
