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

/* ═══════════════════ TIMELINE FILL ═══════════════════ */
const timelineFill = document.getElementById('timeline-fill');
const timelineSection = document.getElementById('timeline');
const fillObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { setTimeout(() => { timelineFill.style.width = '40%'; }, 300); }
  });
}, { threshold: 0.3 });
fillObserver.observe(timelineSection);

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