(function () {
  var d = document, b = d.body, root = d.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasG = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  var WA = 'https://wa.me/79020111156?text=';
  var wa = function (t) { return WA + encodeURIComponent(t); };

  /* --- меню и шапка --- */
  var top = d.getElementById('top'), menu = d.getElementById('menu'), bur = d.getElementById('burger');
  var scrolled = false;
  function setTop() { top.classList.toggle('on', scrolled || !menu.hidden); }
  function setMenu(open) {
    bur.setAttribute('aria-expanded', open);
    bur.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    menu.hidden = !open; setTop();
    b.style.overflow = open ? 'hidden' : '';
    if (window.__lenis) open ? window.__lenis.stop() : window.__lenis.start();
  }
  bur.addEventListener('click', function () { setMenu(bur.getAttribute('aria-expanded') !== 'true'); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });

  d.querySelectorAll('[data-wa]').forEach(function (a) { a.href = wa(a.getAttribute('data-wa')); });

  /* --- открыто ли сейчас (Абакан, UTC+7) --- */
  var on = d.getElementById('openNow');
  if (on) {
    var now = new Date(Date.now() + 7 * 3600e3), day = now.getUTCDay(), h = now.getUTCHours() + now.getUTCMinutes() / 60;
    if (day === 0) on.textContent = 'Выходной, завтра с 9:00';
    else if (h >= 9 && h < 18) on.textContent = 'Открыто до 18:00';
    else if (h < 9) on.textContent = 'Откроемся в 9:00';
    else on.textContent = day === 6 ? 'Закрыто, в понедельник с 9:00' : 'Закрыто, завтра с 9:00';
  }

  /* --- что с машиной --- */
  var S = [
    ['Развал-схождение 3D', 'Камеры стенда читают мишени на колёсах и сверяют углы с базой параметров вашей модели. Выставляем в допуск завода.', 'Цена', '1 200 ₽', 'Развал-схождение', 0],
    ['Диагностика и ремонт ходовой', 'Найдём, что стучит: стойки, рычаги, сайлент-блоки, шаровые, ступичные подшипники. Диагностика бесплатна, если ремонтируете у нас.', 'Диагностика', '0 ₽', 'Стук в подвеске', 1],
    ['Замена масла и фильтров', 'Масло в двигателе, АКПП и МКПП, жидкость вариатора и ГУР, тормозная и охлаждающая. Фильтры подберём под машину.', 'Работа от', '400 ₽', 'Замена масла', 2],
    ['Заправка кондиционера', 'Проверим систему на утечки, заправим и проверим, как холодит. Если нужно — заменим компрессор.', 'Цена', '2 500 ₽', 'Кондиционер', 3],
    ['Проточка тормозных дисков', 'Протачиваем диски прямо на ступице, без снятия, — биение уходит, руль перестаёт дёргаться. Колодки и диски тоже меняем.', 'Цена', '2 200 ₽', 'Тормоза', 4],
    ['Промывка форсунок', 'Чистим форсунки на профессиональном стенде и проверяем факел распыла. Если дело не в них — продиагностируем двигатель.', 'Цена', '2 500 ₽', 'Двигатель', 5],
    ['Компьютерная диагностика', 'Сканируем ошибки электронных систем, читаем параметры двигателя в работе и объясняем, что значит каждая ошибка.', 'Цена', 'по звонку', 'Компьютерная диагностика', 6],
    ['Стартер и генератор', 'Ремонтируем стартеры и генераторы, проверяем зарядку и проводку. Автоэлектрика — отдельное направление сервиса.', 'Цена', 'по звонку', 'Стартер или генератор', 7]
  ];
  var sBtns = d.querySelectorAll('#symList button'), sFigs = d.querySelectorAll('#symStage .ss');
  var card = d.getElementById('symCard'), scH = d.getElementById('scH'), scP = d.getElementById('scP'),
      scPk = d.getElementById('scPk'), scPr = d.getElementById('scPrice'), scW = d.getElementById('scWant'), bWhat = d.getElementById('bWhat');
  var cur = -1, swapT;
  var nb = function (s) { return s.replace(/ (₽|—)/g, ' $1').replace(/(\d) (\d)/g, '$1 $2'); };
  function pick(i, focus) {
    if (i === cur) return; cur = i;
    sBtns.forEach(function (bt, k) { bt.setAttribute('aria-selected', k === i); bt.tabIndex = k === i ? 0 : -1; });
    sFigs.forEach(function (f, k) { f.classList.toggle('is-on', k === i); });
    var s = S[i];
    scW.href = wa('Здравствуйте! Хочу записаться: ' + s[0].toLowerCase() + '. Машина: ');
    if (bWhat) bWhat.selectedIndex = s[5];
    var apply = function () { scH.textContent = s[0]; scP.textContent = nb(s[1]); scPk.textContent = s[2]; scPr.textContent = nb(s[3]); card.classList.remove('swap'); };
    if (reduce || !hasG) { apply(); return; }
    card.classList.add('swap'); clearTimeout(swapT); swapT = setTimeout(apply, 220);
    if (focus) { sBtns[i].focus(); sBtns[i].scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
  }
  sBtns.forEach(function (bt, i) {
    bt.addEventListener('click', function () { pick(i); });
    bt.addEventListener('keydown', function (e) {
      var n = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
      if (n) { e.preventDefault(); pick((i + n + sBtns.length) % sBtns.length, true); }
    });
  });
  // подгрузить все кадры заранее, чтобы смена была мгновенной
  window.addEventListener('load', function () { sFigs.forEach(function (f) { var im = f.querySelector('img'); if (im) im.loading = 'eager'; }); });
  if (sBtns.length) pick(0);

  /* --- запись: открываем WhatsApp с готовым текстом --- */
  var form = d.getElementById('bform');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var car = form.car.value.trim(), what = form.what.value, when = form.querySelector('input[name=when]:checked').value;
    var t = 'Здравствуйте! Хочу записаться в ЦентрАвто.\nЧто нужно: ' + what + '\nМашина: ' + (car || '—') + '\nКогда удобно: ' + when;
    window.open(wa(t), '_blank', 'noopener');
  });

  /* --- отзывы: бесшовная лента --- */
  var mq = d.querySelector('.mq-track');
  if (mq && !reduce) {
    Array.prototype.slice.call(mq.children).forEach(function (n) { var c = n.cloneNode(true); c.setAttribute('aria-hidden', 'true'); mq.appendChild(c); });
    mq.classList.add('run');
  }

  /* --- шапка становится стеклом после первого экрана --- */
  var sentinel = d.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:40px;pointer-events:none';
  b.prepend(sentinel);
  new IntersectionObserver(function (es) { scrolled = !es[0].isIntersecting; setTop(); }).observe(sentinel);

  /* --- плавающая кнопка на телефоне: видна между первым экраном и формой --- */
  var fab = d.querySelector('.fab'), heroOut = false, bookIn = false;
  function setFab() { fab.classList.toggle('show', heroOut && !bookIn); }
  new IntersectionObserver(function (es) { heroOut = !es[0].isIntersecting; setFab(); }, { rootMargin: '-40% 0px 0px 0px' }).observe(d.querySelector('.hero-cta'));
  new IntersectionObserver(function (es) { bookIn = es.some(function (x) { return x.isIntersecting; }); setFab(); }).observe(d.getElementById('zapis'));

  var gauge = d.getElementById('gauge'), gBar = d.getElementById('gaugeBar');
  if (!hasG || reduce) {
    root.classList.remove('js'); root.classList.add('rm');
    if (gauge) gauge.textContent = '0°00′';
    if (gBar) gBar.style.transform = 'none';
    return;
  }

  /* --- движение --- */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) window.scrollTo(0, 0);
  gsap.registerPlugin(ScrollTrigger);
  var ease = 'expo.out';

  if (typeof window.Lenis !== 'undefined') {
    var lenis = new Lenis({ duration: 1.1, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    d.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href'); if (id.length < 2) return;
        var el = d.querySelector(id); if (!el) return;
        e.preventDefault(); lenis.scrollTo(el, { offset: id === '#hero' ? 0 : -60, duration: 1.4 });
      });
    });
  }

  // первый экран: картинка проявляется, строки выезжают, стенд выставляет схождение в ноль
  var heroImg = d.querySelector('.hero-img');
  gsap.set(heroImg, { scale: 1.12, opacity: 0 });
  var g = { v: 47 };
  gsap.timeline({ defaults: { ease: ease } })
    .to(heroImg, { opacity: 1, duration: 1.4, ease: 'power2.out' })
    .to(heroImg, { scale: 1, duration: 2.6 }, 0)
    .to('.hero-title .ln>span', { y: 0, duration: 1.3, stagger: 0.1 }, 0.25)
    .to('.h-fade', { opacity: 1, duration: 1.1, stagger: 0.1 }, 0.8)
    .to(g, { v: 0, duration: 1.8, ease: 'power3.inOut', onUpdate: function () {
      var m = Math.round(g.v); gauge.textContent = '0°' + (m < 10 ? '0' : '') + m + '′';
      gBar.style.transform = 'translateX(' + (g.v / 47 * 68).toFixed(1) + 'px)';
    } }, 1.1);

  gsap.to(heroImg, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // заголовки разделов и блоки — мягкое появление
  gsap.utils.toArray('.sec-head, .sym-grid, .svc-cols, .price, .park-in, .rev-head, .book-in, .visit-in').forEach(function (el) {
    gsap.from(el, { y: 44, opacity: 0, duration: 1.2, ease: ease, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });
  gsap.utils.toArray('.ptab tr, .ctab tr').forEach(function (el, i) {
    gsap.from(el, { opacity: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 94%', once: true } });
  });
  // крупные кадры — лёгкий параллакс внутри рамки
  gsap.utils.toArray('.park-img, .visit-media img').forEach(function (im) {
    gsap.fromTo(im, { scale: 1.1, yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: im, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  gsap.from('.foot-word', { yPercent: 40, opacity: 0, duration: 1.6, ease: ease, scrollTrigger: { trigger: '.foot', start: 'top 92%', once: true } });

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
