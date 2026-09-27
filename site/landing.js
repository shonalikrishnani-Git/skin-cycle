// The landing page's small bits of life: the phone cycles through the app's screens, sections rise
// in as they scroll into view, and the source count counts up. Without JavaScript (or with reduced
// motion) everything is simply shown.
(() => {
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Phone screens ------------------------------------------------------------------------
  const screen = document.getElementById('screen');
  const dots = document.getElementById('dots');
  if (screen && dots) {
    const shots = [...screen.querySelectorAll('img')];
    let current = 0;
    let timer;
    const show = (n) => {
      current = (n + shots.length) % shots.length;
      shots.forEach((img, i) => img.classList.toggle('on', i === current));
      [...dots.children].forEach((d, i) => d.setAttribute('aria-current', String(i === current)));
    };
    shots.forEach((img, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', img.alt);
      b.addEventListener('click', () => {
        show(i);
        restart();
      });
      dots.appendChild(b);
    });
    const restart = () => {
      clearInterval(timer);
      if (!still) timer = setInterval(() => show(current + 1), 3200);
    };
    show(0);
    restart();
  }

  // --- Reveal on scroll ---------------------------------------------------------------------
  const reveals = document.querySelectorAll('.reveal');
  if (still || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('in');
          io.unobserve(e.target);
          const count = e.target.querySelector('[data-count]');
          if (count) countUp(count);
        }),
      { threshold: 0.2, rootMargin: '0px 0px -40px 0px' },
    );
    reveals.forEach((el) => io.observe(el));
  }

  function countUp(el) {
    const target = Number(el.dataset.count);
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 1200);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
})();
