# ㈜좋은효소 홈페이지 분석 — design.md

> 대상: `https://www.wellzyme.co.kr/myofficePlus/os/1/home/osHome` (비로그인 메인)
> 분석일: 2026-10-08 · 분석 방법: 브라우저 DOM 구조 · 계산된 CSS(computed style) · 스크린샷 측정
> 목적: 선제안 프로토타입용으로 동일한 레이아웃·기능을 재현할 수 있을 수준의 명세

---

## 0. 한눈에 보기

| 항목 | 내용 |
|---|---|
| 플랫폼 | **MyOffice Plus** (네트워크마케팅/직판 업계용 솔루션, `/myofficePlus/os/1/...` 경로 체계) |
| 렌더링 | 서버사이드 JSP 계열 + jQuery 1.8.2. SPA 아님. 폼 POST(`form#frmNotice…`) 기반 페이지 이동 |
| 레이아웃 | 고정폭 **1200px 컨테이너** 중앙정렬, 히어로만 2000px 와이드 |
| 문서 높이 | 약 3,055px (PC, 1페이지 스크롤 6구역) |
| 폰트 | **Pretendard** (Regular 기본, 500/600/700 사용) |
| 대표색 | 코랄 레드 `#F05438` + 다크 네이비 `#2B2937` |
| 반응형 | PC 전용 마크업 (viewport meta 없음). `goMobi()` 함수로 모바일 별도 사이트 분기 |
| 텍스트 상태 | 섹션 카드 설명이 **"이것은 시연을 위한 샘플 단락입니다."** 템플릿 더미 문구 그대로 노출 중 → 개선 제안 포인트 |

---

## 1. 페이지 구조 (위→아래)

```
┌──────────────────────────────────────────────┐ y=0
│ ① Top Bar (44px, 다크)  홈페이지 | 로그인 신규가입 │
├──────────────────────────────────────────────┤ y=44
│ ② Functional Header (130px)                   │
│   [로고]            [검색창 + 버튼]  [장바구니]   │
├──────────────────────────────────────────────┤ y=175
│ ③ Main Menu (104px, 아이콘+라벨 6칸)            │
│   [전체보기■][회사소개][브랜드][비즈니스][공지][고객센터] │
│   └ 전체보기 클릭 시 메가 드롭다운 (absolute)       │
├──────────────────────────────────────────────┤ y=279
│ ④ Main Visual 슬라이더 (480px, 폭 2000px)        │
├──────────────────────────────────────────────┤ y=759
│ ⑤ Section-1 회사 소개 카드 3개                   │
├──────────────────────────────────────────────┤ y=1642
│ ⑥ Section-2 서비스 안내 아이콘 카드 4개            │
├──────────────────────────────────────────────┤ y=2215
│ ⑦ Notices 공지사항 (다크 배경, 4건)               │
├──────────────────────────────────────────────┤ y=2627
│ ⑧ Footer  nav(64) / info(290) / copyright(74)  │
└──────────────────────────────────────────────┘ y≈3055
  ⑨ 우측 고정 퀵메뉴 (pill, fixed)
```

| # | 영역 | DOM | 높이 | 폭 |
|---|---|---|---|---|
| ① | Top Bar | `header#HomeHeader > #top-menu` | 44 | 100% / 내부 1200 |
| ② | 기능 헤더 | `#functional-menu` | 130 | 100% / 1200 |
| ③ | 메인 메뉴 | `.main-menu-wrapper > #main-menu.container` | 104 | 100% / 1200 |
| ③' | 메가 드롭다운 | `#dropdown-menu.closed` | ~210 | 100% / 1200 |
| ④ | 메인 비주얼 | `#mainVisual > .visualslide > .bx-wrapper` | 480 | 2000 |
| ⑤ | 회사 소개 | `section#section-1` | 883 | 1200 |
| ⑥ | 서비스 | `section#section-2` | 573 | 1200 |
| ⑦ | 공지사항 | `section#notices` | 412 | 100% / 1200 |
| ⑧ | 푸터 | `footer#main-footer` | 428 | 100% / 1200 |
| ⑨ | 퀵메뉴 | `div#sidebar-menu` | 308 | 56 |

---

## 2. 디자인 토큰

### 2.1 컬러

| 토큰 | 값 | 용도 |
|---|---|---|
| `--primary` | `#F05438` (rgb 240,84,56) | 활성 메뉴, 검색 버튼, '전체보기' 탭 배경, 섹션 라벨(WELLZYME), 장바구니 뱃지 |
| `--dark` | `#2B2937` (rgb 43,41,55) | 본문 텍스트, Top Bar, 공지 섹션 배경, 카피라이트 바 |
| `--white` | `#FFFFFF` | 기본 배경 |
| `--text-muted` | `rgba(0,0,0,.5)` | 섹션 서브카피, 카드 설명 |
| `--footer-nav-bg` | `rgba(43,41,55,.1)` | 푸터 링크 바 |
| `--menu-tint` | `#FFF7EF` | 메가메뉴 짝수 열 배경(피치톤) |
| `--line` | `rgba(0,0,0,.1)` 추정 | 메인메뉴 하단 0.67px 보더, 공지 행 구분선 |
| 레인보우 1 | `#0091FF` | 공지 상단 보더 1/4 (파랑) |
| 레인보우 2 | `#8BDB10` | 2/4 (연두) |
| 레인보우 3 | `#FFCB44` | 3/4 (노랑) |
| 레인보우 4 | `#FF6230` | 4/4 (주황) |

> 레인보우 4색은 로고의 세로 막대 색(파/초/노/주)을 모티프로 함 → 브랜드 시그니처 요소.

### 2.2 타이포그래피

| 요소 | size | weight | color | 비고 |
|---|---|---|---|---|
| body | 16px | 400 | `--dark` | `font-family: Pretendard-Regular, -apple-system, ...` |
| Top Bar 링크 | 14px | 400 | #fff / 활성 `--primary` | 패딩 10px |
| 메인 메뉴 라벨 | 16px | 500 | `--dark` | 아이콘 아래 |
| 섹션 아이브로(WELLZYME) | 16px | 700 | `--primary` | 영문 대문자 |
| Section-1 h2 | 24px | 700 | `--dark` | |
| Section-2 h2 | 32px | 700 | `--dark` | ※ 섹션 간 h2 크기 불일치 |
| 섹션 서브카피 p | 16px | 400 | `--text-muted` | |
| 카드 제목 h4 | 18px | 600 | `--dark` | |
| 카드 설명 | 14px 내외 | 400 | `--text-muted` | 중앙정렬, 2~3줄 |
| 메가메뉴 1뎁스 | 16px | 400 | `--dark` | |
| 메가메뉴 2뎁스 | 14px | 400 | 회색 톤 | 보상플랜·세무가이드 등 |
| 푸터 회사명 | ~24px | 600 | `--dark` | |
| 푸터 대표번호 | ~24px | 600 | `--dark` | `080-311-4175` |
| 카피라이트 | 14px | 400 | #fff(투명도↓) | |

### 2.3 간격·형태

| 항목 | 값 |
|---|---|
| 컨테이너 | `max-width:1200px; margin:0 auto` |
| 섹션 상하 패딩 | 60px (section-1: 컨테이너 y가 섹션 +60) |
| 섹션 헤딩 ↔ 콘텐츠 | 60px |
| 검색 input | h45, `padding:6px 20px`, `border-radius:25px 4px 4px 25px` |
| 검색 button | h45, bg `--primary`, `border-radius:0 50px 50px 0` → input과 합쳐 알약형 |
| 퀵메뉴 | `padding:30px 7.5px; border-radius:100px; background:#fff`, 연한 그림자 |
| 카드 이미지 | 직각(radius 0) |
| 메뉴 탭 높이 | 탭 내부 64px + 상하 패딩 20px |

---

## 3. 컴포넌트 명세

### ① Top Bar
| 위치 | 요소 | 동작 |
|---|---|---|
| 좌 | `홈페이지` (활성, 하단 2px `--primary` 언더라인) | `/home/osHome` |
| 우 | 🔒 로그인 | `go_login('')` → 로그인 레이어/페이지 |
| 우 | 👤 신규가입 | `/member/osNotUseCondAgree` (약관 동의 단계부터) |

- 아이콘: 라인 아이콘(자물쇠, 사람) 12~14px + 텍스트 14px, 컬러 #fff 70% 톤

### ② Functional Header
| 요소 | 스펙 |
|---|---|
| 로고 | `h1.col-logo > a > img(logo.svg)` 폭 211px·높이 70px 영역(실제 이미지 약 145×50). 홈 링크 |
| 배너 슬롯 | `#bannerCntsPc.TopBn` — 현재 비어 있음(0px). 관리자 배너 노출용 자리 |
| 검색 | input(placeholder "검색어를 입력하세요") + 돋보기 버튼. 폭 약 275px, 우측 정렬 그룹 |
| 장바구니 | 카트 SVG + 우상단 원형 뱃지(`--primary`, 흰 숫자 `0`) + 우측 2줄 텍스트 `장바구니 / 0원`. → `/shop/osOrderCart` |

### ③ Main Menu (아이콘 탭 6개)
| 순서 | 라벨 | 아이콘(라인 SVG ~35px) | 링크 |
|---|---|---|---|
| 1 | **전체보기** (기본 활성: bg `--primary`, 흰 아이콘/텍스트) | 리스트 | 드롭다운 토글 `#toggle-dropdown` |
| 2 | 회사소개 | 빌딩 | `/info/osCompany` |
| 3 | 브랜드 스토리 | 펼친 책 | `/info/osStory` |
| 4 | 비즈니스 | 막대그래프 | `/info/osMarketing` |
| 5 | 공지사항 | 메가폰 | `/board/.../BoardMain/{boardId}` |
| 6 | 고객센터 | 손+사람 | `/info/osBranch` |

- 전체보기 탭 폭 약 75px, 나머지 탭은 균등 분할(각 ~146px), 아이콘 위·라벨 아래 세로 스택, 중앙정렬

### ③' 메가 드롭다운 (`#dropdown-menu`)
- `position:absolute; z-index:1000; background:#fff; width:100%`, `.closed` 클래스 토글로 열고 닫음
- 6열 그리드(첫 열은 '전체보기' 아래 빈칸 104px, 이후 5열 각 219px). **짝수 열 배경 `#FFF7EF`**로 줄무늬
- 열 내 항목 가운데 정렬, 1뎁스 16px / 2뎁스 14px 회색(들여쓰기 없이 작게)

| 열 | 1뎁스(하위 2뎁스) |
|---|---|
| 회사소개 | 좋은효소 · CEO 인사말 · 연혁 · CI · 오시는 길 |
| 브랜드 스토리 | 발효 효소의 탄생 · 미리안 이야기 |
| 비즈니스 | 비즈니스 소개(보상플랜, 판매원 수첩) · 회원혜택 · 비즈니스양식(세무 가이드, 건강기능식품 교육 가이드, 좋은효소 양식) · 상품 교육자료 |
| 공지사항 | 공지사항 · 주문/결제/배송 안내 · 반품/환불 안내 · 신용카드 할부 안내 · 개인정보 취급방침 · 회원약관&규정 · 자료실 |
| 고객센터 | 본부/센터 안내 · 운영위원회 · 사진갤러리 · 행사영상 |

### ④ Main Visual 슬라이더
| 항목 | 값 |
|---|---|
| 라이브러리 | **bxSlider** (`jquery.bxslider.min.js`) — swiper도 로드되나 미사용 추정 |
| 크기 | 2000×480, 화면 중앙 정렬(1463px 뷰포트에선 좌우 잘림 없이 1292px로 축소 표시) |
| 슬라이드 | 4장: `main_vis_0621_01~03.png`, `_04.jpg` (카피가 이미지에 **합성된 형태**, HTML 텍스트 아님) |
| 예시 카피 | "사업자와 소비자 모두의 풍요창조를 지향하는 기업이 되겠습니다." (흰색, 2줄 중앙) |
| 페이저 | 하단 좌측(약 x+280px) 흰 점 8px, **활성은 40px 가로 알약**형 |
| 컨트롤 | Prev/Next, Start/Stop 존재(시각적으로 숨김) → auto 재생 |

### ⑤ Section-1 회사 소개
- 헤딩(중앙정렬): 아이브로 `WELLZYME` → h2 `주식회사 좋은효소는` → p `주식회사 좋은효소는 다양한 정보를확인하세요.`(오탈자: 띄어쓰기 누락)
- `ul.flex.content` 3열 카드, 카드 폭 약 242px(1200 기준 3열 + 갭 40px), **세로형 이미지 약 242×323(3:4)**

| 카드 | 이미지 | 제목 h4 | 설명 | 링크 |
|---|---|---|---|---|
| 1 | 황금 들판의 나무 (`main-company-01.jpg`) | WELLZYME | 주식회사 좋은효소는 + 더미문구 | `/info/osCompany` |
| 2 | 자연 속 고층빌딩 (`-02`) | BRAND STORY | 비즈니스 소개 + 더미문구 | `/info/osStory` |
| 3 | 노트북 든 여성 (`-03`) | BUSINESS | 회사소식 + 더미문구 | `/info/osMarketing` |

> ⚠ 카드 제목과 설명 첫 줄이 서로 어긋남(BRAND STORY ↔ "비즈니스 소개", BUSINESS ↔ "회사소식") — 개선 제안 포인트

### ⑥ Section-2 서비스 안내
- h2 `다양한 서비스를 이용하세요.` (32px, 중앙)
- 4열 아이콘 카드, 3D 클레이 스타일 일러스트(보라/핑크 톤) 약 100px, 투명 배경

| 카드 | 일러스트 | 링크 |
|---|---|---|
| 주문/결제/배송 안내 | 쇼핑카트 | `/info/osDeliInfo` |
| 신용카드 할부 안내 | 카드 든 손+폰 | `/board/.../BoardMain/20170802092703803980` |
| 개인정보 취급방침 | 체크된 문서 | `/info/osUseCond` |
| 회원약관 & 규정 | 사람 2명 | `/info/osRules` |

- 설명 전부 더미문구 2줄

### ⑦ Notices 공지사항 (다크 섹션)
| 요소 | 스펙 |
|---|---|
| 배경 | `--dark` 전폭, 상하 60px |
| 헤더 | 좌 `공지사항`(흰색 ~18px) / 우 `더보기 >` |
| 구분선 | `.colorful-border` 2px — `div×4` 각 300px, 파·연두·노·주 |
| 리스트 | `ul#board-list` 4행, 행 `padding:12.5px 0`, 행 사이 얇은 라인 |
| 행 | 좌 제목(회색-흰 70%), 우 날짜 `YYYY-MM-DD` |
| 클릭 | `goNoticeView('{게시글ID 20자리 타임스탬프}')` → 숨은 폼 `#frmNoticeView` POST |

현재 데이터 예: 10월 토스 카드사 무이자 할부 이벤트(09-30) · 추석연휴 배송 지연(09-14) · 09월 무이자 할부(08-31) · 08월 무이자 할부(07-31)

### ⑧ Footer
**⑧-1 링크 바** (h64, bg `rgba(43,41,55,.1)`, 14px 회색, 가로 나열 갭 20px)

| 링크 | 동작 |
|---|---|
| 개인정보취급방침 | `/info/osUseCond` |
| 공정거래위원회 | ftc.go.kr (외부) |
| 한국특수판매공제조합 | kossa.or.kr |
| 한국직접판매협회 | kdsa.or.kr |
| 한국건강기능식품협회 | khsa.or.kr |
| 보증서조회 | `windowOpen()` 팝업 |
| 평균후원수당공지 | `windowOpen3()` 팝업 |
| 판매원조회 | `windowOpen2()` 팝업 |

> 방문판매법상 직판업체 필수 고지 링크 세트 → 복제 시 반드시 유지

**⑧-2 회사 정보** (h290)
- 1행 flex: 좌 `(주)좋은효소` · 우측 `080-311-4175` + 로고(136×45), 하단 1px 라인
- 2행 `table.contacts`(라벨 굵게 `--dark` / 값 회색, 13~14px)

| 라벨 | 값 |
|---|---|
| 대표 | 구 금 숙 |
| 주소 | 서울특별시 금천구 가산디지털1로 205-15 (가산동 SH 드림타워) 2층 207, 208호 |
| 이메일 | wellzyme@naver.com |
| 팩스 | 02-6499-1237 |
| 통신판매업 신고번호 | 제2013-서울금천-0995호 |
| 건강기능식품 등록번호 | 제 2013-0084391호 |
| 사업자 등록번호 | 615-86-02143 |

**⑧-3 카피라이트** (h74, bg `--dark`) `COPYRIGHT ⓒ 2015 (주)좋은효소 RIGHTS RESERVED.`

### ⑨ 우측 고정 퀵메뉴 (`#sidebar-menu`)
- `position:fixed; right:~16px; top:~50%` 세로 pill(폭 56, 높이 308), 흰 배경 + 연한 그림자, radius 100px
- 아이콘(라인 SVG 28px) + 12px 라벨, 항목 간 ~5px

| 항목 | 링크 |
|---|---|
| 장바구니 | `/shop/osOrderCart` |
| 주문조회 | `/order/osOrderSearch` |
| 배송조회 | `/order/osOrdDetailSearch` |
| 업무협조전 | `/main/osWorkHelpList` |
| 결제 | `/order/osFrontAmt` |
| (로고 50px) | `/shop/osMain` — 쇼핑몰 메인 |

---

## 4. 기능·인터랙션

| 기능 | 구현 방식(원본) | 재현 권장 |
|---|---|---|
| 메가메뉴 열기/닫기 | `#toggle-dropdown` 클릭 → `#dropdown-menu`의 `.closed` 토글 | 버튼 click → `aria-expanded` 토글 + 외부클릭/ESC 닫기 |
| 히어로 자동 슬라이드 | bxSlider auto + pager | Swiper 또는 CSS scroll-snap + setInterval(5s) |
| 검색 | `#frmSearchList` 폼 → `goSearchDetail()` | 상품 검색 결과 페이지로 GET `?q=` |
| 장바구니 수량/금액 | 서버 렌더(세션) | 상태 스토어 바인딩 |
| 공지 상세 | `goNoticeView(id)` → 숨은 폼 POST | `/notice/:id` 라우트 |
| 로그인 | `go_login('')` | 모달 또는 `/login` |
| 팝업 공지 | `bpopup` 플러그인 + `getCookie/setCookie`(오늘 하루 안 보기) | 모달 + localStorage |
| 법정 조회 팝업 | `windowOpen/2/3()` → 새 창 | `window.open` 유지 |
| 디바이스 분기 | `goPc()/goMobi()` | 반응형 단일 코드로 대체 |
| 로딩 바 | `img#loadingBar`, `processLayer.js` | 전역 스피너 |

로드된 주요 스크립트: jQuery 1.8.2, jQuery UI 1.9.2(datepicker-ko), validate, maskedinput, autoNumeric, bpopup, bxSlider, easing, swiper-bundle, FusionCharts, postcode.v2(다음 우편번호) → **회원·주문 백오피스와 같은 코드베이스**를 공유하는 구조.

---

## 5. 정보구조(IA) — 사이트맵

```
홈(osHome)
├─ 회사소개: 좋은효소 / CEO 인사말 / 연혁 / CI / 오시는 길
├─ 브랜드 스토리: 발효 효소의 탄생 / 미리안 이야기
├─ 비즈니스: 비즈니스 소개(보상플랜·판매원 수첩) / 회원혜택
│           비즈니스양식(세무 가이드·건강기능식품 교육 가이드·좋은효소 양식) / 상품 교육자료
├─ 공지사항: 공지 / 주문·결제·배송 / 반품·환불 / 카드 할부 / 개인정보 / 약관·규정 / 자료실
├─ 고객센터: 본부·센터 안내 / 운영위원회 / 사진갤러리 / 행사영상
├─ 회원: 로그인 / 신규가입(약관동의→가입)
└─ 쇼핑·주문(로그인 영역): 쇼핑몰 메인 / 장바구니 / 주문조회 / 배송조회 / 결제 / 업무협조전
```

---

## 6. 재현용 HTML 골격

```html
<header id="HomeHeader">
  <div id="top-menu"><div class="container">
    <ul class="left-nav"><li class="active"><a href="/">홈페이지</a></li></ul>
    <ul class="right-nav"><li><a>로그인</a></li><li><a>신규가입</a></li></ul>
  </div></div>
  <div id="functional-menu"><div class="container flex">
    <h1 class="logo"><a href="/"><img src="logo.svg" alt="좋은효소"></a></h1>
    <div class="search"><input placeholder="검색어를 입력하세요"><button>🔍</button></div>
    <a class="cart"><img src="cart.svg"><b class="badge">0</b><span>장바구니<br>0원</span></a>
  </div></div>
  <nav class="main-menu-wrapper"><ul id="main-menu" class="container flex">
    <li id="toggle-dropdown" class="active"><button>☰<span>전체보기</span></button></li>
    <!-- 회사소개 / 브랜드 스토리 / 비즈니스 / 공지사항 / 고객센터 -->
  </ul>
  <div id="dropdown-menu" class="closed"><!-- 6열 메가메뉴 --></div></nav>
</header>
<main>
  <section id="mainVisual"><!-- 4 slides + pager --></section>
  <section id="section-1"><div class="heading">…</div><ul class="cards-3">…</ul></section>
  <section id="section-2"><h2>…</h2><ul class="cards-4">…</ul></section>
  <section id="notices"><div class="container">
    <div class="heading"><h2>공지사항</h2><a>더보기 ›</a></div>
    <div class="colorful-border"><i></i><i></i><i></i><i></i></div>
    <ul id="board-list">…</ul></div></section>
</main>
<footer id="main-footer">…</footer>
<aside id="sidebar-menu">…</aside>
```

```css
:root{--primary:#F05438;--dark:#2B2937;--muted:rgba(0,0,0,.5);--tint:#FFF7EF;
      --rb1:#0091FF;--rb2:#8BDB10;--rb3:#FFCB44;--rb4:#FF6230}
body{font-family:Pretendard,-apple-system,sans-serif;color:var(--dark)}
.container{max-width:1200px;margin:0 auto}
#top-menu{background:var(--dark);height:44px;font-size:14px;color:#fff}
.search input{height:45px;padding:6px 20px;border-radius:25px 4px 4px 25px;border:1px solid #ddd}
.search button{height:45px;background:var(--primary);border-radius:0 50px 50px 0}
#toggle-dropdown{background:var(--primary);color:#fff}
#dropdown-menu{position:absolute;z-index:1000;width:100%;background:#fff}
#dropdown-menu li:nth-child(odd):not(:first-child){background:var(--tint)}
.colorful-border{display:flex;height:2px}.colorful-border i{flex:1}
.colorful-border i:nth-child(1){background:var(--rb1)} /* …2,3,4 */
#notices{background:var(--dark);color:#fff;padding:60px 0}
#sidebar-menu{position:fixed;right:16px;top:50%;transform:translateY(-50%);
  width:56px;padding:30px 7.5px;border-radius:100px;background:#fff;box-shadow:0 2px 12px rgba(0,0,0,.08)}
```

---

## 7. 선제안 시 개선 포인트 (관찰 기반)

| # | 현 상태 | 개선 방향 |
|---|---|---|
| 1 | 카드 설명 7곳이 템플릿 더미 문구 | 실제 회사·서비스 소개 문구로 교체 |
| 2 | 카드 제목 ↔ 설명 불일치(BRAND STORY/비즈니스 소개 등) | 정보 매핑 재정리 |
| 3 | 히어로 카피가 이미지에 합성 | HTML 텍스트화 → SEO·접근성·수정 용이 |
| 4 | 반응형 없음(viewport 미설정, 모바일 별도 사이트) | 단일 반응형 |
| 5 | h2 크기 불일치(24 vs 32), 서브카피 띄어쓰기 오류 | 타이포 스케일 통일 |
| 6 | 이미지 alt 비어 있음 | 접근성 보완 |
| 7 | jQuery 1.8.2(2012) 등 레거시 의존 | 보안·성능 측면 현대화 |
| 8 | 메인에 **상품 노출 영역 없음** (쇼핑몰은 로그인 후 별도) | 대표 상품/이벤트 섹션 추가 검토 |

---

## 8. 복제 시 유의사항

- 로고·사진·3D 일러스트는 좋은효소(또는 원 제작사·스톡사) 자산 → **프로토타입은 플레이스홀더로 제작**하고, 실제 적용은 고객 측 원본 자산 제공을 받아 진행
- 푸터의 사업자 정보·법정 고지 링크는 실서비스 적용 시 원본 그대로 유지(직판법 고지 의무)
- 미확인 항목: 각 요소 hover 효과, 슬라이드 전환 속도·간격, 모바일 사이트(`goMobi`) 디자인 — 필요 시 추가 조사
