/* ═══════════════════ CUSTOM CURSOR ═══════════════════ */
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animateCursor() {
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();
document.querySelectorAll('a,button,.track-card,.faq-q,.prize-card').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ═══════════════════ NAV SCROLL ═══════════════════ */
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

/* ═══════════════════ HERO CANVAS (Animated Grid + Particles) ═══════════════════ */
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [], tick = 0;
function resizeCanvas() {
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function spawnParticle() {
  const rand = Math.random();
  let color;
  if (rand > 0.6) {
    color = '0,255,170';
  } else if (rand > 0.3) {
    color = '57,255,20';
  } else {
    color = '0,255,204';
  }
  return {
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.4, vy: -Math.random() * 0.6 - 0.2,
    r: Math.random() * 2.5 + 0.5,
    alpha: 0, fadeIn: true,
    life: 0, maxLife: Math.random() * 300 + 200,
    color: color
  };
}

for (let i = 0; i < 80; i++) {
  const p = spawnParticle();
  p.life = Math.random() * p.maxLife;
  particles.push(p);
}

function drawGrid() {
  const sz = 60;
  ctx.strokeStyle = 'rgba(0,255,170,0.05)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x < W; x += sz) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
  for (let y = 0; y < H; y += sz) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
  ctx.stroke();
}

function drawGlow() {
  const t = tick * 0.005;
  const x1 = W * (0.3 + 0.1 * Math.sin(t)), y1 = H * 0.4;
  const g1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, W * 0.4);
  g1.addColorStop(0, 'rgba(220,20,60,0.08)');
  g1.addColorStop(0.5, 'rgba(139,0,0,0.04)');
  g1.addColorStop(1, 'transparent');
  ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
  const x2 = W * (0.7 - 0.1 * Math.cos(t * 0.7)), y2 = H * 0.5;
  const g2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, W * 0.35);
  g2.addColorStop(0, 'rgba(255,215,0,0.06)');
  g2.addColorStop(0.5, 'rgba(220,20,60,0.03)');
  g2.addColorStop(1, 'transparent');
  ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
}

function drawParticles() {
  particles.forEach((p, i) => {
    p.life++;
    if (p.fadeIn && p.alpha < 0.8) p.alpha += 0.02;
    if (p.life > p.maxLife * 0.8) p.alpha -= 0.02;
    if (p.life >= p.maxLife) { particles[i] = spawnParticle(); return; }
    p.x += p.vx; p.y += p.vy;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color},${Math.max(0, p.alpha)})`;
    ctx.fill();
  });
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 120) {
        const opacity = 0.08 * (1 - d / 120);
        ctx.strokeStyle = `rgba(220,20,60,${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  tick++;
  ctx.clearRect(0, 0, W, H);
  drawGrid();
  drawGlow();
  drawConnections();
  drawParticles();
  requestAnimationFrame(animate);
}
animate();

/* ═══════════════════ COUNTDOWN ═══════════════════ */
const target = new Date('2026-06-06T09:00:00+05:30');
function updateCountdown() {
  const now = new Date();
  const diff = target - now;
  if (diff <= 0) {
    document.getElementById('countdown').innerHTML = '<div style="font-family:var(--font-mono);color:var(--c-crimson);font-size:1.2rem;letter-spacing:0.1em;text-shadow:0 0 20px var(--c-crimson)">DOOMSDAY HAS BEGUN ⚔️</div>';
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  document.getElementById('cd-days').textContent = String(d).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(h).padStart(2, '0');
  document.getElementById('cd-min').textContent = String(m).padStart(2, '0');
  document.getElementById('cd-sec').textContent = String(s).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ═══════════════════ SCROLL REVEAL ═══════════════════ */
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
reveals.forEach(el => observer.observe(el));

/* ═══════════════════ SACRED TIMELINE WAVE DRAW ═══════════════════ */
(function() {
    const sacredTimeline = document.querySelector('.sacred-timeline');
    const wavePath = document.getElementById('sacred-wave-path');
    if (!sacredTimeline || !wavePath) return;

    // Measure actual path length and set dasharray correctly
    function initWave() {
        const len = wavePath.getTotalLength();
        wavePath.style.strokeDasharray = len;
        wavePath.style.strokeDashoffset = len;
        wavePath.style.transition = 'stroke-dashoffset 2s ease 0.3s';
    }
    initWave();

    const waveObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting && !sacredTimeline.classList.contains('wave-drawn')) {
                sacredTimeline.classList.add('wave-drawn');
            }
        });
    }, { threshold: 0.25 });
    waveObserver.observe(sacredTimeline);
})();

/* ═══════════════════ FAQ ACCORDION ═══════════════════ */
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

/* ═══════════════════ SMOOTH SCROLL ═══════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ═══════════════════ PARALLAX HERO ═══════════════════ */
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const hero = document.getElementById('hero');
  if (y < window.innerHeight) {
    canvas.style.transform = `translateY(${y * 0.4}px)`;
    hero.querySelector('.hero-title').style.transform = `translateY(${y * 0.15}px)`;
    hero.querySelector('.hero-sub').style.transform = `translateY(${y * 0.1}px)`;
  }
});
/* ═══════════════════ CAPTAIN AMERICA SHIELD SCROLL TRANSITION ═══════════════════ */
(function () {
  const shield = document.getElementById('shield-transition');
  if (!shield) return;

  const heroSection = document.getElementById('hero');
  const aboutSection = document.getElementById('about');

  let shieldActive = false;
  let shieldComplete = false;
  let lastScrollY = window.scrollY;
  let rafId = null;

  /* 
   * The shield travels left → right across the viewport as the user scrolls
   * from the bottom of #hero into #about.
   * 
   * Trigger zone: from heroSection.bottom - 100px  →  heroSection.bottom + 300px
   * (i.e. the shield appears just before you leave the hero and disappears
   *  once you're comfortably inside the about section)
   */

  function getProgress() {
    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
    const start = heroBottom - window.innerHeight * 0.3;   // trigger early
    const end = heroBottom + window.innerHeight * 0.25;  // complete inside about
    const scrollY = window.scrollY;
    return Math.min(1, Math.max(0, (scrollY - start) / (end - start)));
  }

  function updateShield() {
    const progress = getProgress();

    if (progress <= 0 || progress >= 1) {
      // hide completely when outside the zone
      shield.style.opacity = '0';
      shield.style.left = progress <= 0 ? '-160px' : 'calc(100vw + 160px)';
      shieldActive = false;
      return;
    }

    shieldActive = true;

    // Ease in-out for smoother motion
    const eased = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    // Vertical: dip slightly in the middle for a "thrown arc"
    const arc = Math.sin(progress * Math.PI) * 40; // max 40px dip
    const shieldW = shield.offsetWidth;
    const vpW = window.innerWidth;
    const xPos = -shieldW + (vpW + shieldW * 2) * eased;

    // Spin speed: ramp up mid-flight, slow at start/end
    // const spinSpeed = 0.4 + 1.4 * Math.sin(progress * Math.PI);
    // shield.style.setProperty('--shield-spin-dur', `${Math.max(0.3, 1.8 - spinSpeed).toFixed(2)}s`);

    shield.style.left = `${xPos}px`;
    shield.style.opacity = progress < 0.05
      ? `${progress / 0.05}`          // fade in
      : progress > 0.92
        ? `${(1 - progress) / 0.08}`  // fade out
        : '1';

    // Vertical arc via transform (keep the -50% centering + arc offset)
    const scale = 0.6 + Math.sin(progress * Math.PI) * 0.8;
    // start small → max at center → shrink again

    shield.style.transform = `
  translateY(calc(-50% + ${arc}px))
  scale(${scale})
`;
  }

  function onScroll() {
    lastScrollY = window.scrollY;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(updateShield);
  }

  // window.addEventListener('scroll', onScroll, { passive: true });

  // Initial state
  // updateShield();
})();

function toggleBranch(el) {
  const item = el.closest('.timeline-item');

  document.querySelectorAll('.timeline-item').forEach(i => {
    if (i !== item) i.classList.remove('active-branch');
  });

  item.classList.toggle('active-branch');
}

/* ═══════════════════════════════════════════════════════════
   ARC REACTOR — PRIZES SECTION  (append to end of scripts.js)
   Triggers a "power-on" surge when the section enters viewport,
   and adds a subtle mouse-parallax tilt to the reactor image.
═══════════════════════════════════════════════════════════ */

(function () {
    const prizesSection = document.getElementById('prizes');
    const reactorImg    = document.querySelector('.arc-reactor-img');
    const reactorBg     = document.querySelector('.arc-reactor-bg');
    if (!prizesSection || !reactorImg || !reactorBg) return;

    /* ── 1. Power-on when section scrolls into view ── */
    const reactorObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                /* Short delay so user sees it trigger */
                setTimeout(() => {
                    prizesSection.classList.add('reactor-on');
                }, 200);
                reactorObserver.unobserve(prizesSection); /* fire once */
            }
        });
    }, { threshold: 0.2 });

    reactorObserver.observe(prizesSection);

    /* ── 2. Mouse-parallax: reactor tilts slightly toward cursor ── */
    prizesSection.addEventListener('mousemove', (e) => {
        const rect   = prizesSection.getBoundingClientRect();
        const cx     = rect.left + rect.width  / 2;
        const cy     = rect.top  + rect.height / 2;
        const dx     = (e.clientX - cx) / (rect.width  / 2); /* –1 … +1 */
        const dy     = (e.clientY - cy) / (rect.height / 2);

        /* Gentle tilt — max ±6° */
        const rotX   = -dy * 6;
        const rotY   =  dx * 6;

        reactorBg.style.transform =
            `translate(-50%, -45%) perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    prizesSection.addEventListener('mouseleave', () => {
        /* Ease back to neutral */
        reactorBg.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        reactorBg.style.transform  = 'translate(-50%, -45%)';
        setTimeout(() => { reactorBg.style.transition = ''; }, 800);
    });

    /* ── 3. Energy-burst on prize card hover ── */
    document.querySelectorAll('.prize-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            /* Briefly crank up the reactor glow */
            reactorImg.style.transition = 'filter 0.3s ease';
            reactorImg.style.filter     =
                'drop-shadow(0 0 40px rgba(0,230,255,1)) ' +
                'drop-shadow(0 0 80px rgba(0,200,255,0.8)) ' +
                'drop-shadow(0 0 120px rgba(0,160,255,0.5)) ' +
                'brightness(1.4)';
        });

        card.addEventListener('mouseleave', () => {
            reactorImg.style.filter =
                'drop-shadow(0 0 20px rgba(0,230,255,0.7)) ' +
                'drop-shadow(0 0 50px rgba(0,180,255,0.5)) ' +
                'drop-shadow(0 0 90px rgba(0,140,255,0.3))';
        });
    });
})();

/* ═══════════════════════════════════════════════════════════
   DR STRANGE MAGIC CIRCLE — #sponsors section
   Append this entire block to the END of scripts.js
═══════════════════════════════════════════════════════════ */

(function () {
    const sponsorsSection = document.getElementById('sponsors');
    const strangeBg       = document.querySelector('.strange-bg');
    const sparksContainer = document.getElementById('strange-sparks');
    const outerMandala    = document.querySelector('.strange-outer');
    const innerMandala    = document.querySelector('.strange-inner');

    if (!sponsorsSection || !strangeBg || !sparksContainer) return;

    /* ── 1. Spawn sling-ring ember sparks orbiting the circle ── */
    const SPARK_COUNT = 28;
    const COLORS = [
        '#ff9000', '#ffb700', '#ff6600',
        '#ffcc00', '#ff4500', '#ffd700'
    ];

    for (let i = 0; i < SPARK_COUNT; i++) {
        const spark = document.createElement('div');
        spark.className = 'strange-spark';

        /* Random orbit radius: sit near the outer edge of the mandala */
        const radiusPct = 32 + Math.random() * 14; /* 32–46% of container */
        const containerW = strangeBg.offsetWidth || 860;
        const r = containerW * radiusPct / 100;

        /* Random start angle so they're spread around the circle */
        const startDeg = Math.random() * 360;
        const endDeg   = startDeg + 360; /* full orbit */

        const size  = 2 + Math.random() * 3;   /* 2–5 px */
        const dur   = 3.5 + Math.random() * 5; /* 3.5–8.5 s orbit */
        const delay = -(Math.random() * dur);   /* negative = already in-flight */

        spark.style.setProperty('--sz',    `${size}px`);
        spark.style.setProperty('--r',     `${r}px`);
        spark.style.setProperty('--start', `${startDeg}deg`);
        spark.style.setProperty('--end',   `${endDeg}deg`);
        spark.style.setProperty('--dur',   `${dur}s`);
        spark.style.setProperty('--del',   `${delay}s`);
        spark.style.setProperty('--col',   COLORS[Math.floor(Math.random() * COLORS.length)]);

        sparksContainer.appendChild(spark);
    }

    /* ── 2. Power-on flash when section enters viewport (fires once) ── */
    const strangeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    sponsorsSection.classList.add('strange-on');
                }, 150);
                strangeObserver.unobserve(sponsorsSection);
            }
        });
    }, { threshold: 0.18 });

    strangeObserver.observe(sponsorsSection);

    /* ── 3. Mouse parallax — circle tilts toward cursor ── */
    sponsorsSection.addEventListener('mousemove', (e) => {
        const rect = sponsorsSection.getBoundingClientRect();
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;
        const dx   = (e.clientX - cx) / (rect.width  / 2); /* –1 … +1 */
        const dy   = (e.clientY - cy) / (rect.height / 2);

        /* Gentle tilt max ±5° */
        const rotX = -dy * 5;
        const rotY =  dx * 5;

        strangeBg.style.transform =
            `translate(-50%, -48%) perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    sponsorsSection.addEventListener('mouseleave', () => {
        strangeBg.style.transition = 'transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        strangeBg.style.transform  = 'translate(-50%, -48%)';
        setTimeout(() => { strangeBg.style.transition = ''; }, 900);
    });

    /* ── 4. Sponsor logo hover → energy burst on the circle ── */
    document.querySelectorAll('.sponsor-logo, .sponsor-placeholder').forEach(logo => {
        logo.addEventListener('mouseenter', () => {
            if (!outerMandala || !innerMandala) return;
            outerMandala.style.transition = 'filter 0.3s ease';
            innerMandala.style.transition = 'filter 0.3s ease';
            outerMandala.style.filter =
                'drop-shadow(0 0 35px rgba(255,160,0,1.0)) ' +
                'drop-shadow(0 0 70px rgba(255,100,0,0.85)) ' +
                'drop-shadow(0 0 110px rgba(255,60,0,0.55)) ' +
                'brightness(1.5)';
            innerMandala.style.filter =
                'drop-shadow(0 0 40px rgba(255,220,0,1.0)) ' +
                'drop-shadow(0 0 80px rgba(255,160,0,0.80)) ' +
                'brightness(1.6)';
        });

        logo.addEventListener('mouseleave', () => {
            if (!outerMandala || !innerMandala) return;
            outerMandala.style.filter =
                'drop-shadow(0 0 18px rgba(255,140,0,0.75)) ' +
                'drop-shadow(0 0 45px rgba(255,100,0,0.50)) ' +
                'drop-shadow(0 0 80px rgba(255,60,0,0.30))';
            innerMandala.style.filter =
                'drop-shadow(0 0 22px rgba(255,200,0,0.80)) ' +
                'drop-shadow(0 0 55px rgba(255,140,0,0.55)) ' +
                'drop-shadow(0 0 90px rgba(255,80,0,0.30))';
        });
    });

    /* ── 5. Spin speed reacts to scroll velocity ── */
    let lastScrollY  = window.scrollY;
    let spinMult     = 1;
    let spinRafId    = null;

    window.addEventListener('scroll', () => {
        const delta    = Math.abs(window.scrollY - lastScrollY);
        lastScrollY    = window.scrollY;
        spinMult       = Math.min(4, 1 + delta * 0.08); /* max 4× faster */

        if (outerMandala) outerMandala.style.animationDuration = `${28 / spinMult}s`;
        if (innerMandala) innerMandala.style.animationDuration = `${18 / spinMult}s`;

        /* Ease back to normal speed */
        if (spinRafId) clearTimeout(spinRafId);
        spinRafId = setTimeout(() => {
            if (outerMandala) outerMandala.style.animationDuration = '28s';
            if (innerMandala) innerMandala.style.animationDuration = '18s';
        }, 600);
    }, { passive: true });

})();

/* ════════════════════════════════════════════════════════════════
   TIME STONE FAQ — MYSTIC PORTAL JS
   Append this entire block to the END of scripts.js.
   Replaces the old toggleFaq() — keep the function name if called
   elsewhere; togglePortal() is used by the new HTML.
════════════════════════════════════════════════════════════════ */

/* ── 1. Toggle logic — one open at a time ── */
function togglePortal(qEl) {
    const item    = qEl.closest('.faq-portal-item');
    const isOpen  = item.classList.contains('faq-open');
    const allItems = document.querySelectorAll('.faq-portal-item');

    /* Close all */
    allItems.forEach(i => {
        i.classList.remove('faq-open');
        i.querySelector('.faq-portal-q').setAttribute('aria-expanded', 'false');
    });

    /* If it wasn't already open, open it + trigger effects */
    if (!isOpen) {
        item.classList.add('faq-open');
        qEl.setAttribute('aria-expanded', 'true');
        _portalBurst(item);
        _mandalaReact();
    }
}

/* Keyboard support — Enter / Space toggles */
document.querySelectorAll('.faq-portal-q').forEach(q => {
    q.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            togglePortal(q);
        }
    });
});

/* ── 2. Portal burst effect on open ── */
function _portalBurst(item) {
    /* Brief glow flash on the item itself */
    item.style.transition = 'box-shadow 0.12s ease';
    item.style.boxShadow  = '0 0 40px rgba(0,255,166,0.35), inset 0 0 20px rgba(0,255,166,0.08)';
    setTimeout(() => {
        item.style.boxShadow  = '';
        item.style.transition = '';
    }, 380);

    /* Emit 6 burst sparks from the clicked item */
    const rect       = item.getBoundingClientRect();
    const faqRect    = document.getElementById('faq').getBoundingClientRect();
    const cx         = rect.left + rect.width  / 2 - faqRect.left;
    const cy         = rect.top  + rect.height / 2 - faqRect.top;
    const container  = document.getElementById('faq');

    for (let i = 0; i < 6; i++) {
        const spark  = document.createElement('div');
        const angle  = (i / 6) * 360;
        const dist   = 30 + Math.random() * 60;
        const size   = 2 + Math.random() * 3;
        const dur    = 0.5 + Math.random() * 0.4;

        Object.assign(spark.style, {
            position:     'absolute',
            left:         `${cx}px`,
            top:          `${cy}px`,
            width:        `${size}px`,
            height:       `${size}px`,
            borderRadius: '50%',
            background:   Math.random() > 0.5 ? '#00ffa6' : '#39ff14',
            boxShadow:    '0 0 8px #00ffa6',
            pointerEvents:'none',
            zIndex:       '10',
            opacity:      '1',
            transition:   `transform ${dur}s ease-out, opacity ${dur}s ease-out`,
            transform:    'translate(-50%, -50%) scale(1)',
        });

        container.appendChild(spark);

        const rad = angle * Math.PI / 180;
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                spark.style.transform  = `translate(calc(-50% + ${Math.cos(rad)*dist}px), calc(-50% + ${Math.sin(rad)*dist}px)) scale(0)`;
                spark.style.opacity    = '0';
            });
        });

        setTimeout(() => spark.remove(), (dur + 0.1) * 1000);
    }
}

/* ── 3. Mandala reacts when any FAQ opens — brief speed-up ── */
const _faqOuter = document.querySelector('.faq-mandala--outer');
const _faqInner = document.querySelector('.faq-mandala--inner');
let   _mandalaTimer = null;

function _mandalaReact() {
    if (_faqOuter) _faqOuter.style.animationDuration = '12s';
    if (_faqInner) _faqInner.style.animationDuration = '8s';

    clearTimeout(_mandalaTimer);
    _mandalaTimer = setTimeout(() => {
        if (_faqOuter) _faqOuter.style.animationDuration = '40s';
        if (_faqInner) _faqInner.style.animationDuration = '26s';
    }, 700);
}

/* ── 4. Spawn ambient sparks orbiting the background mandala ── */
(function _spawnFaqSparks() {
    const container = document.getElementById('faq-sparks');
    const bg        = document.querySelector('.faq-magic-bg');
    if (!container || !bg) return;

    const COLORS = ['#00ffa6', '#39ff14', '#00ffcc', '#80ffc0', '#00e5ff'];
    const COUNT  = 22;

    for (let i = 0; i < COUNT; i++) {
        const spark     = document.createElement('div');
        spark.className = 'faq-spark';

        const containerW = bg.offsetWidth || 780;
        const radiusFrac = 0.33 + Math.random() * 0.14;  /* 33–47% of container */
        const r          = containerW * radiusFrac;
        const startDeg   = Math.random() * 360;
        const endDeg     = startDeg + 360;
        const size       = 1.5 + Math.random() * 2.5;
        const dur        = 4 + Math.random() * 6;
        const delay      = -(Math.random() * dur);

        spark.style.setProperty('--sz',    `${size}px`);
        spark.style.setProperty('--r',     `${r}px`);
        spark.style.setProperty('--start', `${startDeg}deg`);
        spark.style.setProperty('--end',   `${endDeg}deg`);
        spark.style.setProperty('--dur',   `${dur}s`);
        spark.style.setProperty('--del',   `${delay}s`);
        spark.style.setProperty('--col',   COLORS[Math.floor(Math.random() * COLORS.length)]);

        container.appendChild(spark);
    }
})();

/* ── 5. Mouse parallax on the mandala ── */
(function _faqParallax() {
    const section = document.getElementById('faq');
    const bg      = document.querySelector('.faq-magic-bg');
    if (!section || !bg) return;

    section.addEventListener('mousemove', e => {
        const rect = section.getBoundingClientRect();
        const dx   = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2);
        const dy   = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2);
        bg.style.transform =
            `translate(-50%, -50%) perspective(900px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
    });

    section.addEventListener('mouseleave', () => {
        bg.style.transition = 'transform 1s cubic-bezier(0.25,0.46,0.45,0.94)';
        bg.style.transform  = 'translate(-50%, -50%)';
        setTimeout(() => { bg.style.transition = ''; }, 1000);
    });
})();

/* ════════════════════════════════════════════════════════════════
   THOR STORM LIGHTNING ENGINE — #tracks section
   Append this entire block to the END of scripts.js.
   Zero external dependencies. Scoped entirely to #tracks.
════════════════════════════════════════════════════════════════ */

(function ThorStormEngine() {

    /* ── DOM refs ── */
    const section    = document.getElementById('tracks');
    const canvas     = document.getElementById('thunder-bg');
    const flashEl    = document.getElementById('thunder-flash');
    const stormLevel = document.getElementById('thor-storm-level');
    if (!section || !canvas) return;

    const ctx        = canvas.getContext('2d');
    const cards      = section.querySelectorAll('.track-card');

    /* ── Resize canvas to match section ── */
    function resizeThunder() {
        const r = section.getBoundingClientRect();
        canvas.width  = r.width;
        canvas.height = r.height;
    }
    resizeThunder();

    const ro = new ResizeObserver(resizeThunder);
    ro.observe(section);

    /* ════════════════════════════════
       1. LIGHTNING BOLT GENERATOR
    ════════════════════════════════ */

    /* Recursive jagged bolt from (x1,y1) → (x2,y2) */
    function buildBolt(x1, y1, x2, y2, roughness, depth) {
        if (depth === 0) return [[x1, y1], [x2, y2]];

        const mx  = (x1 + x2) / 2 + (Math.random() - 0.5) * roughness;
        const my  = (y1 + y2) / 2 + (Math.random() - 0.5) * roughness * 0.4;
        const seg1 = buildBolt(x1, y1, mx, my, roughness * 0.6, depth - 1);
        const seg2 = buildBolt(mx, my, x2, y2, roughness * 0.6, depth - 1);

        return [...seg1.slice(0, -1), ...seg2];
    }

    /* Draw a bolt with optional branch, then fade it out */
    function drawBolt(x1, y1, x2, y2, options = {}) {
        const {
            color      = 'rgba(120,200,255,1)',
            glowColor  = 'rgba(0,180,255,0.6)',
            lineWidth  = 1.5,
            roughness  = (canvas.height * 0.25),
            depth      = 6,
            withBranch = true,
            opacity    = 1,
        } = options;

        const pts = buildBolt(x1, y1, x2, y2, roughness, depth);

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';

        /* Glow pass */
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        pts.slice(1).forEach(p => ctx.lineTo(p[0], p[1]));
        ctx.strokeStyle = glowColor;
        ctx.lineWidth   = lineWidth * 5;
        ctx.shadowBlur  = 20;
        ctx.shadowColor = glowColor;
        ctx.stroke();

        /* Core bright pass */
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        pts.slice(1).forEach(p => ctx.lineTo(p[0], p[1]));
        ctx.strokeStyle = color;
        ctx.lineWidth   = lineWidth;
        ctx.shadowBlur  = 8;
        ctx.shadowColor = color;
        ctx.stroke();

        /* Optional branch bolt */
        if (withBranch && pts.length > 4) {
            const branchStart = Math.floor(pts.length * (0.3 + Math.random() * 0.35));
            const bp          = pts[branchStart];
            const bx2         = bp[0] + (Math.random() - 0.5) * 120;
            const by2         = bp[1] + canvas.height * (0.1 + Math.random() * 0.15);
            const bPts        = buildBolt(bp[0], bp[1], bx2, by2, roughness * 0.4, depth - 2);

            ctx.globalAlpha = opacity * 0.45;
            ctx.beginPath();
            ctx.moveTo(bPts[0][0], bPts[0][1]);
            bPts.slice(1).forEach(p => ctx.lineTo(p[0], p[1]));
            ctx.strokeStyle = glowColor;
            ctx.lineWidth   = lineWidth * 3;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(bPts[0][0], bPts[0][1]);
            bPts.slice(1).forEach(p => ctx.lineTo(p[0], p[1]));
            ctx.strokeStyle = color;
            ctx.lineWidth   = lineWidth * 0.7;
            ctx.stroke();
        }

        ctx.restore();
    }

    /* Animated bolt: draws then fades over ~duration ms */
    function animateBolt(x1, y1, x2, y2, opts = {}) {
        const duration = opts.duration || 600;
        const start    = performance.now();

        /* Store bolt path so every frame redraws the same shape */
        const roughness = opts.roughness || canvas.height * 0.25;
        const depth     = opts.depth     || 6;
        const pts       = buildBolt(x1, y1, x2, y2, roughness, depth);
        /* Build optional branch once */
        let bPts = null;
        if (opts.withBranch !== false && pts.length > 4) {
            const bi = Math.floor(pts.length * (0.3 + Math.random() * 0.35));
            const bp = pts[bi];
            bPts = buildBolt(bp[0], bp[1],
                bp[0] + (Math.random() - 0.5) * 120,
                bp[1] + canvas.height * (0.1 + Math.random() * 0.15),
                roughness * 0.4, depth - 2);
        }

        function frame(now) {
            const t   = Math.min(1, (now - start) / duration);
            /* Fast in, slow out — most lightning is brief then lingers faintly */
            const op  = t < 0.15 ? t / 0.15 : 1 - ((t - 0.15) / 0.85);

            /* Draw onto the canvas (additive — we don't clear here, clearing is
               handled by the idle fade loop) */
            const color     = opts.color     || 'rgba(160,220,255,1)';
            const glowColor = opts.glowColor || 'rgba(0,180,255,0.7)';
            const lw        = opts.lineWidth  || 1.5;

            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.globalAlpha = op * (opts.maxOpacity || 0.95);
            ctx.lineCap  = 'round';
            ctx.lineJoin = 'round';

            /* Glow */
            ctx.beginPath();
            pts.forEach((p, i) => i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]));
            ctx.strokeStyle = glowColor;
            ctx.lineWidth   = lw * 6;
            ctx.shadowBlur  = 24;
            ctx.shadowColor = glowColor;
            ctx.stroke();

            /* Core */
            ctx.beginPath();
            pts.forEach((p, i) => i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]));
            ctx.strokeStyle = color;
            ctx.lineWidth   = lw;
            ctx.shadowBlur  = 6;
            ctx.shadowColor = color;
            ctx.stroke();

            /* Branch */
            if (bPts) {
                ctx.globalAlpha = op * 0.4;
                ctx.beginPath();
                bPts.forEach((p, i) => i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]));
                ctx.strokeStyle = glowColor;
                ctx.lineWidth   = lw * 2.5;
                ctx.stroke();

                ctx.beginPath();
                bPts.forEach((p, i) => i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]));
                ctx.strokeStyle = color;
                ctx.lineWidth   = lw * 0.6;
                ctx.stroke();
            }
            ctx.restore();

            if (t < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

    /* Continuous fade: prevents old strokes from building up */
    let lastFade = 0;
    function fadeLoop(ts) {
        if (ts - lastFade > 32) {  /* ~30fps clear pass */
            ctx.fillStyle = 'rgba(0,0,0,0.18)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            lastFade = ts;
        }
        requestAnimationFrame(fadeLoop);
    }
    requestAnimationFrame(fadeLoop);


    /* ════════════════════════════════
       2. THUNDER FLASH
    ════════════════════════════════ */

    let flashTimer = null;
    function triggerFlash(intensity = 1) {
        if (!flashEl) return;
        flashEl.classList.remove('thor-flash-active');
        void flashEl.offsetWidth; /* reflow to restart animation */
        flashEl.style.opacity = 0;
        flashEl.classList.add('thor-flash-active');
        clearTimeout(flashTimer);
        flashTimer = setTimeout(() => {
            flashEl.classList.remove('thor-flash-active');
        }, 500);
    }


    /* ════════════════════════════════
       3. RANDOM AMBIENT BOLTS
    ════════════════════════════════ */

    let sectionVisible = false;

    const visObs = new IntersectionObserver(entries => {
        sectionVisible = entries[0].isIntersecting;
    }, { threshold: 0.1 });
    visObs.observe(section);

    /* Strike colors matching the four card themes */
    const BOLT_PALETTES = [
        { color: 'rgba(160,230,255,0.95)', glowColor: 'rgba(0,200,255,0.7)'  }, /* cyan    */
        { color: 'rgba(255,240,140,0.95)', glowColor: 'rgba(255,210,0,0.7)'  }, /* gold    */
        { color: 'rgba(255,255,255,0.95)', glowColor: 'rgba(180,220,255,0.7)'},  /* white   */
        { color: 'rgba(255,160,80,0.95)',  glowColor: 'rgba(220,100,0,0.6)'  }, /* orange  */
    ];

    function ambientStrike() {
        if (!sectionVisible) return;

        const pal  = BOLT_PALETTES[Math.floor(Math.random() * BOLT_PALETTES.length)];
        const x1   = canvas.width * (0.1 + Math.random() * 0.8);
        const y1   = 0;
        const x2   = x1 + (Math.random() - 0.5) * 200;
        const y2   = canvas.height * (0.5 + Math.random() * 0.5);

        animateBolt(x1, y1, x2, y2, {
            ...pal,
            duration:   500 + Math.random() * 400,
            roughness:  canvas.height * (0.15 + Math.random() * 0.2),
            depth:      5 + Math.floor(Math.random() * 2),
            maxOpacity: 0.55 + Math.random() * 0.35,
        });

        /* 30% chance of a double-strike 120ms later */
        if (Math.random() < 0.3) {
            setTimeout(() => {
                animateBolt(
                    x1 + (Math.random() - 0.5) * 80, y1,
                    x2 + (Math.random() - 0.5) * 80, y2,
                    { ...pal, duration: 350, maxOpacity: 0.35, withBranch: false }
                );
            }, 120);
        }

        /* Update storm level label */
        if (stormLevel) {
            const levels = ['GATHERING', 'BUILDING', 'RAGING', 'UNLEASHED', 'MJOLNIR!'];
            stormLevel.textContent = levels[Math.floor(Math.random() * levels.length)];
            stormLevel.classList.add('thor-storm-active');
            setTimeout(() => {
                if (stormLevel) {
                    stormLevel.textContent = 'GATHERING';
                    stormLevel.classList.remove('thor-storm-active');
                }
            }, 1800);
        }
    }

    /* Schedule ambient bolts every 3–6s */
    function scheduleAmbient() {
        ambientStrike();
        const delay = 3000 + Math.random() * 3000;
        setTimeout(scheduleAmbient, delay);
    }
    /* First strike after 1s so section has time to paint */
    setTimeout(scheduleAmbient, 1000);

    /* First big flash on section entry */
    const entryObs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            setTimeout(() => {
                ambientStrike();
                triggerFlash(1);
            }, 300);
            entryObs.unobserve(section);
        }
    }, { threshold: 0.2 });
    entryObs.observe(section);


    /* ════════════════════════════════
       4. CARD HOVER INTERACTIONS
    ════════════════════════════════ */

    cards.forEach(card => {
        const ripple = card.querySelector('.thor-ripple');

        card.addEventListener('mouseenter', () => {
            /* Strike bolt from top of viewport to the card's centre-top */
            const sr = section.getBoundingClientRect();
            const cr = card.getBoundingClientRect();

            const x1 = cr.left + cr.width  / 2 - sr.left;
            const y1 = 0;
            const x2 = x1 + (Math.random() - 0.5) * 60;
            const y2 = cr.top + 10 - sr.top;

            /* Color from the card's CSS custom property */
            const raw     = getComputedStyle(card).getPropertyValue('--thor-card-color').trim();
            const color   = `rgba(${raw || '0,200,255'},0.95)`;
            const glow    = `rgba(${raw || '0,200,255'},0.65)`;

            animateBolt(x1, y1, x2, y2, {
                color, glowColor: glow,
                duration: 380,
                roughness: y2 * 0.3,
                depth: 5,
                maxOpacity: 0.9,
                withBranch: true,
            });

            triggerFlash(0.6);

            /* Ripple wave */
            if (ripple) {
                ripple.classList.remove('thor-ripple-active');
                void ripple.offsetWidth;
                ripple.classList.add('thor-ripple-active');
                setTimeout(() => ripple.classList.remove('thor-ripple-active'), 850);
            }

            /* Storm level reacts */
            if (stormLevel) {
                const charged = ['CHARGING!', 'MJOLNIR!', 'UNLEASHED', 'OVERLOAD!'];
                stormLevel.textContent = charged[Math.floor(Math.random() * charged.length)];
                stormLevel.classList.add('thor-storm-active');
            }
        });

        card.addEventListener('mouseleave', () => {
            if (stormLevel) {
                stormLevel.textContent = 'GATHERING';
                stormLevel.classList.remove('thor-storm-active');
            }
        });
    });


    /* ════════════════════════════════
       5. CLICK — MEGA STRIKE
    ════════════════════════════════ */

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const sr  = section.getBoundingClientRect();
            const cr  = card.getBoundingClientRect();
            const cx  = cr.left + cr.width  / 2 - sr.left;
            const cy  = cr.top  + cr.height / 2 - sr.top;
            const raw = getComputedStyle(card).getPropertyValue('--thor-card-color').trim();
            const col = `rgba(${raw || '0,200,255'},1)`;
            const glw = `rgba(${raw || '0,200,255'},0.8)`;

            /* 3-bolt simultaneous fan strike */
            [-60, 0, 60].forEach((offset, i) => {
                setTimeout(() => {
                    animateBolt(cx + offset, 0, cx, cy, {
                        color: col, glowColor: glw,
                        duration: 500, roughness: cy * 0.25,
                        depth: 6, maxOpacity: 1,
                        withBranch: i === 1,
                    });
                }, i * 40);
            });

            triggerFlash(1);
        });
    });

})();