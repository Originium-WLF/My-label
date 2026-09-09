/* =========================================================================
   Originium_WLF — логика сайта
   ========================================================================= */
(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp  = (a, b, t) => a + (b - a) * t;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ------------------------------------------------------------------ */
  /* ИКОНКИ                                                              */
  /* ------------------------------------------------------------------ */
  const ICONS = {
    github: '<svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.7A5.2 5.2 0 0 0 19.9 5a4.9 4.9 0 0 0-.1-3.6s-1.1-.3-3.7 1.4a12.6 12.6 0 0 0-6.6 0C6.9 1.1 5.8 1.4 5.8 1.4A4.9 4.9 0 0 0 5.7 5a5.2 5.2 0 0 0-1.4 3.6c0 5.2 3.2 6.4 6.2 6.7a3.4 3.4 0 0 0-.9 2.6V22"/></svg>',
    telegram: '<svg viewBox="0 0 24 24"><path d="M21.7 3.3 2.9 10.6c-1 .4-1 1.2 0 1.5l4.7 1.5 1.8 5.5c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.5c.3-1.2-.5-1.8-1.3-1.5Z"/><path d="m7.6 13.6 10.6-6.5-8.4 7.6"/></svg>',
    discord: '<svg viewBox="0 0 24 24"><path d="M8.3 6.4A16 16 0 0 1 12 6a16 16 0 0 1 3.7.4c1.9.3 3.6 1 3.6 1 1.6 2.4 2.4 5 2.2 8.1a14 14 0 0 1-4.3 2.2l-1-1.6a9 9 0 0 0 1.6-.8 12 12 0 0 1-11.6 0 9 9 0 0 0 1.6.8l-1 1.6a14 14 0 0 1-4.3-2.2c-.2-3 .6-5.7 2.2-8.1 0 0 1.7-.7 3.6-1Z"/><ellipse cx="9.2" cy="13" rx="1.3" ry="1.6"/><ellipse cx="14.8" cy="13" rx="1.3" ry="1.6"/></svg>',
    mail: '<svg viewBox="0 0 24 24"><rect x="2.5" y="4.5" width="19" height="15" rx="3"/><path d="m3.5 7 7.4 5.3a2 2 0 0 0 2.2 0L20.5 7"/></svg>',
    link: '<svg viewBox="0 0 24 24"><path d="M14 11a4.5 4.5 0 0 0-6.6-.3L4.8 13.3a4.5 4.5 0 0 0 6.4 6.4l1.4-1.4"/><path d="M10 13a4.5 4.5 0 0 0 6.6.3l2.6-2.6a4.5 4.5 0 0 0-6.4-6.4l-1.4 1.4"/></svg>',
    code: '<svg viewBox="0 0 24 24"><path d="m8.5 8.5-4 3.5 4 3.5M15.5 8.5l4 3.5-4 3.5M13.5 5l-3 14"/></svg>',
    box:  '<svg viewBox="0 0 24 24"><path d="m12 2.6 8.4 4.7v9.4L12 21.4 3.6 16.7V7.3Z"/><path d="M3.8 7.2 12 12l8.2-4.8M12 12v9.4"/></svg>',
    bot:  '<svg viewBox="0 0 24 24"><rect x="3.5" y="7.5" width="17" height="12" rx="4"/><path d="M12 3.5v4M2 12.5h1.5M20.5 12.5H22"/><circle cx="9" cy="13" r="1.3"/><circle cx="15" cy="13" r="1.3"/></svg>',
    brush:'<svg viewBox="0 0 24 24"><path d="M14.5 3.5 20.5 9.5 11 19a4.2 4.2 0 0 1-6-6Z"/><path d="m12.5 5.5 6 6M4 20c1.5.6 3 .3 4-1"/></svg>',
    tool: '<svg viewBox="0 0 24 24"><path d="M15.5 3.6a5 5 0 0 0-6 6.6L3.7 16a2.3 2.3 0 0 0 3.2 3.2l5.8-5.8a5 5 0 0 0 6.6-6l-3 3-2.6-2.6Z"/></svg>',
    server:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="6.5" rx="2.2"/><rect x="3" y="13.5" width="18" height="6.5" rx="2.2"/><path d="M7 7.2h.01M7 16.8h.01"/></svg>',
  };
  const PROJECT_ICONS = ['code', 'box', 'bot', 'brush', 'tool', 'server'];

  /* ------------------------------------------------------------------ */
  /* ТЕМА                                                                */
  /* ------------------------------------------------------------------ */
  const Theme = {
    KEY: 'owlf-theme',
    init() {
      const saved = localStorage.getItem(this.KEY);
      // тёмная тема — по умолчанию
      this.set(saved === 'light' ? 'light' : 'dark', false);

      const toggle = $('#themeToggle');
      if (toggle) toggle.addEventListener('click', () => this.toggle());

      document.addEventListener('keydown', (e) => {
        const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName || '');
        if (!typing && (e.key === 't' || e.key === 'е' || e.key === 'T' || e.key === 'Е')) this.toggle();
      });
    },
    set(theme, animate = true) {
      if (animate) document.documentElement.style.setProperty('--theme-switching', '1');
      document.documentElement.setAttribute('data-theme', theme);
      document.querySelector('meta[name="color-scheme"]')
        ?.setAttribute('content', theme === 'light' ? 'light dark' : 'dark light');
      try { localStorage.setItem(this.KEY, theme); } catch (_) {}
      window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    },
    get current() { return document.documentElement.getAttribute('data-theme'); },
    toggle() { this.set(this.current === 'light' ? 'dark' : 'light'); },
  };

  /* ------------------------------------------------------------------ */
  /* КАСТОМНЫЙ КУРСОР                                                    */
  /* ------------------------------------------------------------------ */
  const Cursor = {
    init() {
      if (!finePointer) return;
      this.dot   = $('#cursorDot');
      this.ring  = $('#cursorRing');
      this.label = $('#cursorLabel');
      if (!this.dot || !this.ring) return;

      this.pos  = { x: innerWidth / 2, y: innerHeight / 2 };
      this.dotP = { ...this.pos };
      this.ringP= { ...this.pos };
      this.scale = 1;
      this.targetScale = 1;

      document.body.classList.add('cursor-ready');

      addEventListener('mousemove', (e) => {
        this.pos.x = e.clientX;
        this.pos.y = e.clientY;
      }, { passive: true });

      addEventListener('mousedown', () => { this.targetScale = .75; });
      addEventListener('mouseup',   () => { this.targetScale = 1;  });
      document.addEventListener('mouseleave', () => document.body.classList.add('cursor-hidden'));
      document.addEventListener('mouseenter', () => document.body.classList.remove('cursor-hidden'));

      this.bindTargets();
      this.raf();
    },

    setState(state, label) {
      document.body.classList.remove('cursor--link', 'cursor--button', 'cursor--card', 'cursor--text');
      if (state) document.body.classList.add('cursor--' + state);
      if (this.label) this.label.textContent = label || '';
    },

    bindTargets() {
      const enter = (e) => {
        const el = e.currentTarget;
        const type = el.dataset.cursor || 'link';
        this.setState(type, el.dataset.cursorLabel || (type === 'card' ? 'открыть' : ''));
      };
      const leave = () => this.setState(null);

      const attach = (root = document) => {
        $$('[data-cursor]', root).forEach((el) => {
          if (el.__cursorBound) return;
          el.__cursorBound = true;
          el.addEventListener('mouseenter', enter);
          el.addEventListener('mouseleave', leave);
        });
        $$('p, h1, h2, h3, li', root).forEach((el) => {
          if (el.__cursorText || el.closest('[data-cursor]')) return;
          el.__cursorText = true;
          el.addEventListener('mouseenter', () => {
            if (!document.body.className.includes('cursor--')) this.setState('text');
          });
          el.addEventListener('mouseleave', () => {
            if (document.body.classList.contains('cursor--text')) this.setState(null);
          });
        });
      };
      attach();
      this.attach = attach;
    },

    raf() {
      const tick = () => {
        this.dotP.x  = lerp(this.dotP.x,  this.pos.x, .34);
        this.dotP.y  = lerp(this.dotP.y,  this.pos.y, .34);
        this.ringP.x = lerp(this.ringP.x, this.pos.x, .16);
        this.ringP.y = lerp(this.ringP.y, this.pos.y, .16);
        this.scale   = lerp(this.scale, this.targetScale, .2);

        this.dot.style.transform  = `translate3d(${this.dotP.x}px, ${this.dotP.y}px, 0)`;
        this.ring.style.transform = `translate3d(${this.ringP.x}px, ${this.ringP.y}px, 0) scale(${this.scale})`;
        requestAnimationFrame(tick);
      };
      tick();
    },
  };

  /* ------------------------------------------------------------------ */
  /* ФОН: ЧАСТИЦЫ                                                        */
  /* ------------------------------------------------------------------ */
  const Particles = {
    init() {
      const canvas = $('#bgCanvas');
      if (!canvas || reduceMotion) return;
      const ctx = canvas.getContext('2d');
      let w, h, dpr, parts = [];
      const mouse = { x: -9999, y: -9999 };

      const readColors = () => {
        const cs = getComputedStyle(document.documentElement);
        this.rgb  = (cs.getPropertyValue('--accent-rgb') || '124,92,255').trim();
        this.rgb2 = (cs.getPropertyValue('--accent-2-rgb') || '34,224,200').trim();
        this.light = document.documentElement.getAttribute('data-theme') === 'light';
      };

      const resize = () => {
        dpr = Math.min(devicePixelRatio || 1, 2);
        w = canvas.width  = innerWidth  * dpr;
        h = canvas.height = innerHeight * dpr;
        canvas.style.width  = innerWidth + 'px';
        canvas.style.height = innerHeight + 'px';

        const count = clamp(Math.round((innerWidth * innerHeight) / 22000), 30, 95);
        parts = Array.from({ length: count }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - .5) * .22 * dpr,
          vy: (Math.random() - .5) * .22 * dpr,
          r: (Math.random() * 1.6 + .6) * dpr,
          t: Math.random(),
        }));
      };

      addEventListener('mousemove', (e) => {
        mouse.x = e.clientX * (dpr || 1);
        mouse.y = e.clientY * (dpr || 1);
      }, { passive: true });

      const draw = () => {
        ctx.clearRect(0, 0, w, h);
        const linkDist = 130 * dpr;

        for (const p of parts) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x = w; else if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h; else if (p.y > h) p.y = 0;

          const dx = p.x - mouse.x, dy = p.y - mouse.y;
          const md = Math.hypot(dx, dy);
          if (md < 150 * dpr && md > 0) {
            p.x += (dx / md) * .7;
            p.y += (dy / md) * .7;
          }

          const rgb = p.t > .65 ? this.rgb2 : this.rgb;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb}, ${this.light ? .40 : .55})`;
          ctx.fill();
        }

        for (let i = 0; i < parts.length; i++) {
          for (let j = i + 1; j < parts.length; j++) {
            const a = parts[i], b = parts[j];
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < linkDist) {
              const alpha = (1 - d / linkDist) * (this.light ? .14 : .20);
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `rgba(${this.rgb}, ${alpha})`;
              ctx.lineWidth = dpr * .7;
              ctx.stroke();
            }
          }
        }
        requestAnimationFrame(draw);
      };

      readColors();
      resize();
      addEventListener('resize', resize);
      addEventListener('themechange', () => setTimeout(readColors, 60));
      draw();
    },
  };

  /* ------------------------------------------------------------------ */
  /* ПРЕЛОАДЕР                                                           */
  /* ------------------------------------------------------------------ */
  const Preloader = {
    init(done) {
      const el = $('#preloader');
      const fill = $('#preloaderFill');
      const pct  = $('#preloaderPct');
      if (!el) { done(); return; }

      let value = 0;
      const timer = setInterval(() => {
        value = Math.min(100, value + Math.random() * 18 + 6);
        if (fill) fill.style.width = value + '%';
        if (pct)  pct.textContent = Math.round(value);
        if (value >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            el.classList.add('is-done');
            document.body.classList.remove('is-locked');
            done();
            setTimeout(() => el.remove(), 800);
          }, 260);
        }
      }, reduceMotion ? 30 : 130);

      document.body.classList.add('is-locked');
    },
  };

  /* ------------------------------------------------------------------ */
  /* ЗАГОЛОВОК: РАЗБИВКА НА БУКВЫ                                        */
  /* ------------------------------------------------------------------ */
  function splitTitle() {
    let index = 0;
    $$('[data-splittable]').forEach((word) => {
      const text = word.textContent;
      word.textContent = '';
      for (const ch of text) {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = ch;
        span.style.animationDelay = (index * 45) + 'ms';
        word.appendChild(span);
        index++;
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* ГЛИТЧ НА ЗАГОЛОВКЕ                                                  */
  /* ------------------------------------------------------------------ */
  function glitchLoop() {
    const el = $('.glitch');
    if (!el || reduceMotion) return;
    const run = () => {
      el.classList.add('is-glitching');
      setTimeout(() => el.classList.remove('is-glitching'), 220 + Math.random() * 200);
      setTimeout(run, 2600 + Math.random() * 4200);
    };
    setTimeout(run, 2200);
    el.addEventListener('mouseenter', () => {
      el.classList.add('is-glitching');
      setTimeout(() => el.classList.remove('is-glitching'), 380);
    });
  }

  /* ------------------------------------------------------------------ */
  /* ПЕЧАТНАЯ МАШИНКА                                                    */
  /* ------------------------------------------------------------------ */
  function typewriter() {
    const el = $('#typewriter');
    if (!el) return;
    const words = (typeof ROLES !== 'undefined' && ROLES.length) ? ROLES : ['Разработчик'];

    if (reduceMotion) { el.textContent = words[0]; return; }

    let w = 0, c = 0, deleting = false;
    const step = () => {
      const word = words[w];
      c += deleting ? -1 : 1;
      el.textContent = word.slice(0, c);

      let delay = deleting ? 40 : 78;
      if (!deleting && c === word.length) { delay = 1900; deleting = true; }
      else if (deleting && c === 0)       { deleting = false; w = (w + 1) % words.length; delay = 420; }
      setTimeout(step, delay);
    };
    setTimeout(step, 900);
  }

  /* ------------------------------------------------------------------ */
  /* РЕВИЛЫ ПРИ СКРОЛЛЕ                                                  */
  /* ------------------------------------------------------------------ */
  const Reveal = {
    io: null,
    init() {
      this.io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          this.io.unobserve(entry.target);
        });
      }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });

      this.observe();
    },
    observe(root = document) {
      $$('.reveal, .project', root).forEach((el) => this.io.observe(el));
    },
  };

  /* ------------------------------------------------------------------ */
  /* СЧЁТЧИКИ                                                            */
  /* ------------------------------------------------------------------ */
  function counters() {
    const items = $$('.counter');
    if (!items.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        io.unobserve(el);
        const to = parseInt(el.dataset.to, 10) || 0;
        const suffix = el.dataset.suffix || '';
        if (reduceMotion) { el.textContent = to + suffix; return; }

        const dur = 1500;
        const start = performance.now();
        const tick = (now) => {
          const p = clamp((now - start) / dur, 0, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(to * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: .5 });

    items.forEach((el) => io.observe(el));
  }

  /* ------------------------------------------------------------------ */
  /* 3D-НАКЛОН + СВЕЧЕНИЕ ЗА КУРСОРОМ                                    */
  /* ------------------------------------------------------------------ */
  function bindTilt(root = document) {
    if (!finePointer || reduceMotion) return;
    $$('.tilt', root).forEach((el) => {
      if (el.__tilt) return;
      el.__tilt = true;
      let raf = null;

      const move = (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--mx', (px * 100) + '%');
        el.style.setProperty('--my', (py * 100) + '%');

        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = null;
          const rx = (.5 - py) * 9;
          const ry = (px - .5) * 11;
          el.style.transform =
            `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-6px)`;
        });
      };
      const leave = () => { el.style.transform = ''; };

      el.addEventListener('mousemove', move);
      el.addEventListener('mouseleave', leave);
    });
  }

  /* ------------------------------------------------------------------ */
  /* РЕНДЕР: ПРОЕКТЫ                                                     */
  /* ------------------------------------------------------------------ */
  const STATUS_TEXT = { live: 'в проде', wip: 'в работе', archived: 'архив' };

  function renderProjects() {
    const grid = $('#projectsGrid');
    const filtersBox = $('#filters');
    const empty = $('#projectsEmpty');
    if (!grid) return;

    const list = (typeof PROJECTS !== 'undefined' ? PROJECTS : []);
    if (!list.length) { if (empty) empty.hidden = false; return; }

    grid.innerHTML = list.map((p, i) => {
      const icon = ICONS[PROJECT_ICONS[i % PROJECT_ICONS.length]] || ICONS.code;
      const status = p.status || 'live';
      const tags = (p.tags || []).map((t) => `<li class="tag">${t}</li>`).join('');
      const links = (p.links || []).map((l) => `
        <a class="project__link" href="${l.url}" target="_blank" rel="noopener noreferrer" data-cursor="button">
          ${ICONS.link}<span>${l.label}</span>
        </a>`).join('');

      return `
      <article class="card project tilt" data-cursor="card" data-cursor-label="${(p.tags && p.tags[0]) || 'проект'}"
               data-tags="${(p.tags || []).join('|')}" style="transition-delay:${(i % 3) * 70}ms">
        <div class="card__glow" aria-hidden="true"></div>
        <div class="project__top">
          <span class="project__icon" aria-hidden="true">${icon}</span>
          <span class="badge badge--${status}"><i aria-hidden="true"></i>${STATUS_TEXT[status] || status}</span>
        </div>
        <h3 class="project__title">${p.title}</h3>
        <p class="project__tagline">${p.tagline || ''}</p>
        <p class="project__desc">${p.description || ''}</p>
        <ul class="project__tags">${tags}</ul>
        <div class="project__foot">
          <span class="project__year">${p.year || ''}</span>
          <div class="project__links">${links}</div>
        </div>
      </article>`;
    }).join('');

    /* фильтры по первому тегу */
    if (filtersBox) {
      const cats = ['Все', ...Array.from(new Set(list.map((p) => (p.tags && p.tags[0]) || 'Разное')))];
      filtersBox.innerHTML = cats.map((c, i) => `
        <button type="button" class="filter${i === 0 ? ' is-active' : ''}"
                role="tab" aria-selected="${i === 0}" data-filter="${c}" data-cursor="button">${c}</button>`).join('');

      filtersBox.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter');
        if (!btn) return;
        $$('.filter', filtersBox).forEach((b) => {
          const on = b === btn;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-selected', String(on));
        });
        applyFilter(btn.dataset.filter);
      });
    }

    function applyFilter(cat) {
      const cards = $$('.project', grid);
      let visible = 0;
      cards.forEach((card, i) => {
        const tags = (card.dataset.tags || '').split('|');
        const show = cat === 'Все' || tags[0] === cat;
        card.classList.toggle('is-hidden', !show);
        if (show) {
          visible++;
          card.classList.remove('is-in');
          card.style.transitionDelay = (visible * 55) + 'ms';
          requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('is-in')));
        }
      });
      if (empty) empty.hidden = visible !== 0;
    }
  }

  /* ------------------------------------------------------------------ */
  /* РЕНДЕР: СТЕК                                                        */
  /* ------------------------------------------------------------------ */
  function renderStack() {
    const grid = $('#stackGrid');
    const track = $('#marqueeTrack');
    const groups = (typeof STACK !== 'undefined' ? STACK : []);

    if (grid) {
      grid.innerHTML = groups.map((g) => `
        <div class="card stack__group tilt reveal" data-cursor="card" data-cursor-label="${g.group}">
          <div class="card__glow" aria-hidden="true"></div>
          <h3 class="stack__name">${g.group}</h3>
          <ul class="stack__items">${g.items.map((i) => `<li>${i}</li>`).join('')}</ul>
        </div>`).join('');
    }

    if (track) {
      const all = groups.flatMap((g) => g.items);
      const row = all.map((i) => `<span class="marquee__item">${i}</span>`).join('');
      track.innerHTML = row + row; // дубль для бесшовной прокрутки
    }
  }

  /* ------------------------------------------------------------------ */
  /* РЕНДЕР: КОНТАКТЫ                                                    */
  /* ------------------------------------------------------------------ */
  function renderContacts() {
    const box = $('#contactLinks');
    if (!box) return;
    const list = (typeof CONTACTS !== 'undefined' ? CONTACTS : []);
    box.innerHTML = list.map((c) => `
      <a class="contact__link" href="${c.url}" target="_blank" rel="noopener noreferrer" data-cursor="button">
        ${ICONS[c.icon] || ICONS.link}
        <span class="contact__link-text"><b>${c.label}</b><span>${c.handle}</span></span>
      </a>`).join('');
  }

  /* ------------------------------------------------------------------ */
  /* СКРОЛЛ: ПРОГРЕСС, ШАПКА, АКТИВНЫЙ ПУНКТ                             */
  /* ------------------------------------------------------------------ */
  function scrollUI() {
    const bar = $('#scrollBar');
    const header = $('#header');
    const links = $$('.nav a');
    const sections = links
      .map((a) => document.querySelector(a.getAttribute('href')))
      .filter(Boolean);

    let ticking = false;
    const update = () => {
      ticking = false;
      const y = scrollY;
      const max = document.documentElement.scrollHeight - innerHeight;
      if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
      if (header) header.classList.toggle('is-stuck', y > 24);

      let activeIdx = -1;
      sections.forEach((sec, i) => {
        if (sec.getBoundingClientRect().top <= innerHeight * 0.35) activeIdx = i;
      });
      links.forEach((a, i) => a.classList.toggle('is-active', i === activeIdx));
    };

    addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ------------------------------------------------------------------ */
  /* МЕНЮ И КНОПКА «НАВЕРХ»                                              */
  /* ------------------------------------------------------------------ */
  function menu() {
    const burger = $('#burger');
    const nav = $('.nav');
    if (burger && nav) {
      const close = () => {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      };
      burger.addEventListener('click', () => {
        const open = nav.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', String(open));
      });
      $$('a', nav).forEach((a) => a.addEventListener('click', close));
      addEventListener('resize', () => { if (innerWidth > 780) close(); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    }

    const toTop = $('#toTop');
    if (toTop) {
      toTop.addEventListener('click', () => {
        scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* СТАРТ                                                               */
  /* ------------------------------------------------------------------ */
  function boot() {
    Theme.init();
    renderProjects();
    renderStack();
    renderContacts();

    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    Reveal.init();
    counters();
    scrollUI();
    menu();
    glitchLoop();
    Particles.init();

    Preloader.init(() => {
      splitTitle();
      typewriter();
      Cursor.init();
      bindTilt();
      if (Cursor.attach) Cursor.attach();
      Reveal.observe();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
