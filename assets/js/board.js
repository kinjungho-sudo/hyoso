/* 하위 페이지 게시판: [data-board="notice|notice-view|archive|gallery|video|branch"] 를 api.js 데이터로 렌더링 */
(function () {
  var api = window.WZ.api;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var PER_PAGE = 10;

  function esc(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function dot(d) { return esc(d).replace(/-/g, '.'); }
  function photo(src, label) {
    return '<div class="ph"><span>' + esc(label || 'IMAGE') + '</span>' +
      (src ? '<img src="' + esc(src) + '" alt="" loading="lazy" onerror="this.remove()">' : '') + '</div>';
  }

  var renderers = {
    /* 공지 목록: 검색 + 페이지네이션 */
    notice: function (el) {
      var form = $('[data-board-search]');
      var input = form && $('input', form);
      var pager = $('[data-board-pager]');
      var countEl = $('[data-board-count]');
      var all = [], page = 1, keyword = '';

      function draw() {
        var list = all.filter(function (n) { return !keyword || n.title.indexOf(keyword) > -1; });
        var pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
        page = Math.min(page, pages);
        var rows = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);
        if (countEl) countEl.textContent = list.length;
        el.innerHTML = rows.length ? rows.map(function (n, i) {
          var num = n.pinned ? '<span class="badge">공지</span>' : (list.length - ((page - 1) * PER_PAGE + i));
          return '<li><a href="' + esc(api.noticeUrl(n.id)) + '">' +
            '<span class="board-num">' + num + '</span>' +
            '<span class="board-title">' + esc(n.title) + '</span>' +
            '<time datetime="' + esc(n.date) + '">' + dot(n.date) + '</time></a></li>';
        }).join('') : '<li class="board-empty">검색 결과가 없습니다.</li>';
        if (pager) {
          var html = '';
          for (var p = 1; p <= pages; p++) {
            html += '<button type="button" data-page="' + p + '"' + (p === page ? ' aria-current="page"' : '') + '>' + p + '</button>';
          }
          pager.innerHTML = html;
        }
      }
      api.getNoticeList().then(function (data) { all = data; draw(); });
      if (form) form.addEventListener('submit', function (e) { e.preventDefault(); keyword = input.value.trim(); page = 1; draw(); });
      if (pager) pager.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-page]'); if (!b) return;
        page = Number(b.dataset.page); draw(); el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    },

    /* 공지 상세 */
    'notice-view': function (el) {
      var id = new URLSearchParams(location.search).get('id');
      api.getNotice(id).then(function (d) {
        if (!d) { el.innerHTML = '<p class="board-empty">존재하지 않는 공지입니다.</p>'; return; }
        var n = d.item;
        document.title = n.title + ' | 공지사항 | 좋은효소 WELLZYME';
        el.innerHTML =
          '<header class="article-head">' +
            (n.pinned ? '<span class="badge">공지</span>' : '') +
            '<h2 class="article-title">' + esc(n.title) + '</h2>' +
            '<p class="article-meta"><time datetime="' + esc(n.date) + '">' + dot(n.date) + '</time> · 좋은효소</p>' +
          '</header>' +
          '<div class="article-body">' +
            '<p>본문은 DB 연동 후 게시판에 등록된 내용이 그대로 표시됩니다.</p>' +
            '<p>공지 관련 문의는 대표번호 <a class="text-link" href="tel:0803114175">080-311-4175</a>로 연락해 주세요.</p>' +
          '</div>' +
          '<nav class="article-nav" aria-label="이전·다음 글">' +
            (d.next ? '<a href="' + esc(api.noticeUrl(d.next.id)) + '"><span>다음 글</span>' + esc(d.next.title) + '</a>' : '<span class="is-empty"><span>다음 글</span>없음</span>') +
            (d.prev ? '<a href="' + esc(api.noticeUrl(d.prev.id)) + '"><span>이전 글</span>' + esc(d.prev.title) + '</a>' : '<span class="is-empty"><span>이전 글</span>없음</span>') +
          '</nav>' +
          '<a class="btn btn-secondary" href="notice.html">목록으로</a>';
      });
    },

    /* 자료실: 파일 목록 */
    archive: function (el) {
      api.getArchive().then(function (list) {
        el.innerHTML = list.map(function (f) {
          return '<li>' +
            '<span class="file-cat">' + esc(f.category) + '</span>' +
            '<span class="file-title">' + esc(f.title) + '</span>' +
            '<time datetime="' + esc(f.date) + '">' + dot(f.date) + '</time>' +
            '<a class="btn btn-secondary btn-sm" href="#" aria-disabled="true">' + esc(f.file) + ' 다운로드</a>' +
          '</li>';
        }).join('');
      });
    },

    /* 사진갤러리 */
    gallery: function (el) {
      api.getGallery().then(function (list) {
        el.innerHTML = list.map(function (g) {
          return '<li><a href="#" class="media-card">' + photo(g.image, 'PHOTO') +
            '<strong>' + esc(g.title) + '</strong><time datetime="' + esc(g.date) + '">' + dot(g.date) + '</time></a></li>';
        }).join('');
      });
    },

    /* 행사영상 */
    video: function (el) {
      api.getVideos().then(function (list) {
        el.innerHTML = list.map(function (v) {
          return '<li><a href="' + esc(v.url) + '" class="media-card media-video">' + photo(v.image, 'VIDEO') +
            '<span class="play" aria-hidden="true"></span><span class="duration">' + esc(v.length) + '</span>' +
            '<strong>' + esc(v.title) + '</strong><time datetime="' + esc(v.date) + '">' + dot(v.date) + '</time></a></li>';
        }).join('');
      });
    },

    /* 본부/센터 */
    branch: function (el) {
      api.getBranches().then(function (list) {
        el.innerHTML = list.map(function (b) {
          return '<li class="branch-card">' +
            '<span class="badge">' + esc(b.type) + '</span>' +
            '<strong>' + esc(b.name) + '</strong>' +
            '<p>' + esc(b.address) + '</p>' +
            '<p class="branch-tel">' + esc(b.tel) + '</p>' +
          '</li>';
        }).join('');
      });
    }
  };

  Array.prototype.forEach.call(document.querySelectorAll('[data-board]'), function (el) {
    var fn = renderers[el.dataset.board];
    if (fn) fn(el);
  });
})();
