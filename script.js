'use strict';

const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = matchMedia('(pointer: fine)').matches;

/* ─── Nav: blur/border once a top sentinel scrolls out (IntersectionObserver, no scroll listener) ─── */
const nav = document.getElementById('nav');
const sentinel = document.createElement('div');
sentinel.style.cssText = 'position:absolute;top:0;left:0;height:16px;width:1px;pointer-events:none;';
document.body.prepend(sentinel);
new IntersectionObserver(
    ([e]) => nav.classList.toggle('scrolled', !e.isIntersecting),
    { threshold: 0 }
).observe(sentinel);

/* ─── Mobile menu ─── */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

function setMenu(open) {
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navLinks.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
}

navToggle.addEventListener('click', () => setMenu(navToggle.getAttribute('aria-expanded') !== 'true'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') setMenu(false);
});

/* ─── Active nav link ─── */
const linkFor = new Map(
    [...navLinks.querySelectorAll('a')].map(l => [l.getAttribute('href').slice(1), l])
);
const RAINBOW = 'linear-gradient(90deg, var(--blue), var(--coral), var(--amber), var(--green))';
const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        linkFor.forEach(l => l.classList.remove('active'));
        linkFor.get(e.target.id)?.classList.add('active');
        const hue = getComputedStyle(e.target).getPropertyValue('--hue').trim();
        document.documentElement.style.setProperty(
            '--progress-hue',
            e.target.id === 'about' || !hue ? RAINBOW : hue
        );
    });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));

/* ─── Reveal on scroll, staggered within each sibling group ─── */
const revealer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        const group = [...e.target.parentElement.querySelectorAll('.fade-in')];
        e.target.style.transitionDelay = `${group.indexOf(e.target) * 85}ms`;
        e.target.classList.add('visible');
        revealer.unobserve(e.target);
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade-in').forEach(el => revealer.observe(el));

/* ─── Hero name: scramble-decode on load ─── */
(function scrambleName() {
    const el = document.getElementById('heroName');
    if (!el || REDUCE) return;
    const finalText = el.textContent;
    const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    el.style.display = 'inline-block';
    el.style.minWidth = el.getBoundingClientRect().width + 'px';

    const start = performance.now();
    const settleGap = 45;
    const lead = 180;

    function frame(now) {
        const t = now - start;
        let out = '';
        let done = true;
        for (let i = 0; i < finalText.length; i++) {
            const ch = finalText[i];
            if (ch === ' ') { out += ' '; continue; }
            if (t >= lead + i * settleGap) {
                out += ch;
            } else {
                out += glyphs[(Math.random() * glyphs.length) | 0];
                done = false;
            }
        }
        el.textContent = out;
        if (done) {
            el.textContent = finalText;
            el.style.minWidth = '';
        } else {
            requestAnimationFrame(frame);
        }
    }
    requestAnimationFrame(frame);
})();

/* ─── Hero: full-bleed interactive dot field, colour flowing through the palette ─── */
(function dotField() {
    const canvas = document.getElementById('grid');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const host = canvas.parentElement;                 // .hero section
    const css = getComputedStyle(document.documentElement);
    const PAL = ['--blue-rgb', '--coral-rgb', '--amber-rgb', '--green-rgb'].map(v => {
        const p = css.getPropertyValue(v).trim().split(',').map(n => parseFloat(n));
        return p.length === 3 && p.every(n => !Number.isNaN(n)) ? p : [27, 68, 224];
    });

    const REACH = 150;
    let dots = [];
    let cols = 0, rows = 0, w = 0, h = 0;
    let raf = 0, running = false;
    const ptr = { x: -9999, y: -9999, on: false };

    const lerp = (a, b, t) => a + (b - a) * t;

    function wheel(v) {                                // v -> smooth colour cycling around PAL
        const s = ((v % 1) + 1) % 1 * PAL.length;
        const i = Math.floor(s) % PAL.length;
        const j = (i + 1) % PAL.length;
        const f = s - Math.floor(s);
        return [
            lerp(PAL[i][0], PAL[j][0], f) | 0,
            lerp(PAL[i][1], PAL[j][1], f) | 0,
            lerp(PAL[i][2], PAL[j][2], f) | 0
        ];
    }

    function build() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = host.getBoundingClientRect();
        w = rect.width;
        h = rect.height;
        if (!w || !h) return;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const gap = Math.max(24, Math.round(Math.sqrt((w * h) / 2000)));
        cols = Math.floor(w / gap) + 1;
        rows = Math.floor(h / gap) + 1;
        const ox = (w - (cols - 1) * gap) / 2;
        const oy = (h - (rows - 1) * gap) / 2;

        dots = new Array(cols * rows);
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = ox + c * gap;
                const y = oy + r * gap;
                const nz = (Math.sin(x * 0.008 + y * 0.004) + Math.sin(y * 0.011 - x * 0.0032) + 2) / 4;
                dots[r * cols + c] = { x, y, nz, ph: (x + y) * 0.02 };
            }
        }
        if (!running) draw(0);
    }

    function draw(time) {
        ctx.clearRect(0, 0, w, h);
        const drift = REDUCE ? 0 : time * 0.00004;
        const t = REDUCE ? 0 : time * 0.0016;

        if (ptr.on) {
            ctx.lineWidth = 1;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const d = dots[r * cols + c];
                    const f = 1 - Math.hypot(d.x - ptr.x, d.y - ptr.y) / REACH;
                    if (f <= 0) continue;
                    const col = wheel(d.nz + drift);
                    const stroke = `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${(f * 0.22).toFixed(3)})`;
                    const right = c + 1 < cols ? dots[r * cols + c + 1] : null;
                    const down = r + 1 < rows ? dots[(r + 1) * cols + c] : null;
                    if (right && Math.hypot(right.x - ptr.x, right.y - ptr.y) < REACH) {
                        ctx.strokeStyle = stroke;
                        ctx.beginPath();
                        ctx.moveTo(d.x, d.y);
                        ctx.lineTo(right.x, right.y);
                        ctx.stroke();
                    }
                    if (down && Math.hypot(down.x - ptr.x, down.y - ptr.y) < REACH) {
                        ctx.strokeStyle = stroke;
                        ctx.beginPath();
                        ctx.moveTo(d.x, d.y);
                        ctx.lineTo(down.x, down.y);
                        ctx.stroke();
                    }
                }
            }
        }

        for (let k = 0; k < dots.length; k++) {
            const d = dots[k];
            const wave = REDUCE ? 0.5 : (Math.sin(d.ph + t) + 1) / 2;
            let radius = 0.8 + wave * 0.95;
            let alpha = 0.13 + wave * 0.1;
            let px = d.x;
            let py = d.y;
            const col = wheel(d.nz + drift);

            if (ptr.on) {
                const dx = d.x - ptr.x;
                const dy = d.y - ptr.y;
                const dist = Math.hypot(dx, dy);
                if (dist < REACH) {
                    const f = 1 - dist / REACH;
                    radius += f * 3.6;
                    alpha = Math.min(0.95, alpha + f * 0.72);
                    px += (dx / (dist || 1)) * f * 12;
                    py += (dy / (dist || 1)) * f * 12;
                    ctx.beginPath();
                    ctx.arc(px, py, radius * 2.6, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${(f * 0.12).toFixed(3)})`;
                    ctx.fill();
                }
            }

            ctx.beginPath();
            ctx.arc(px, py, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${alpha.toFixed(3)})`;
            ctx.fill();
        }
    }

    function loop(time) {
        draw(time);
        raf = requestAnimationFrame(loop);
    }
    function start() {
        if (running || REDUCE) return;
        running = true;
        raf = requestAnimationFrame(loop);
    }
    function stop() {
        running = false;
        cancelAnimationFrame(raf);
    }

    new ResizeObserver(build).observe(host);
    build();

    if (FINE && !REDUCE) {
        host.addEventListener('pointermove', e => {
            const rect = host.getBoundingClientRect();
            ptr.x = e.clientX - rect.left;
            ptr.y = e.clientY - rect.top;
            ptr.on = true;
        });
        host.addEventListener('pointerleave', () => {
            ptr.on = false;
            ptr.x = ptr.y = -9999;
        });
    }

    new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0 }).observe(host);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
})();

/* ─── Projects: cursor spotlight + 3D tilt ─── */
if (FINE && !REDUCE) {
    document.querySelectorAll('.work__item').forEach(item => {
        const media = item.querySelector('.work__media');
        let queued = false;
        let last = null;

        item.addEventListener('pointermove', e => {
            last = e;
            if (queued) return;
            queued = true;
            requestAnimationFrame(() => {
                const r = item.getBoundingClientRect();
                const mx = (last.clientX - r.left) / r.width;
                const my = (last.clientY - r.top) / r.height;
                item.style.setProperty('--mx', (mx * 100).toFixed(1) + '%');
                item.style.setProperty('--my', (my * 100).toFixed(1) + '%');
                if (media) {
                    const rx = (0.5 - my) * 6;
                    const ry = (mx - 0.5) * 6;
                    media.style.transform = `perspective(760px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(1.02)`;
                }
                queued = false;
            });
        });

        item.addEventListener('pointerleave', () => {
            if (media) media.style.transform = '';
        });
    });

    /* ─── Magnetic buttons ─── */
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('pointermove', e => {
            const r = btn.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top - r.height / 2;
            btn.style.transform = `translate(${(x * 0.15).toFixed(1)}px, ${(y * 0.22).toFixed(1)}px)`;
        });
        btn.addEventListener('pointerleave', () => {
            btn.style.transform = '';
        });
    });
}

/* ─── Experience: hide a company logo that has not been added yet, revealing the monogram chip ─── */
document.querySelectorAll('.xp__logo img').forEach(img => {
    const hide = () => { img.style.display = 'none'; };
    img.addEventListener('error', hide);
    if (img.complete && img.naturalWidth === 0) hide();
});
