document.body.classList.add('loading');

const loader = document.querySelector('.loader');
const loaderCount = document.querySelector('#loader-count');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function finishLoader() {
  loader?.classList.add('done');
  document.body.classList.remove('loading');
  window.setTimeout(() => loader?.remove(), 1100);
}

if (reduceMotion) {
  finishLoader();
} else {
  const start = performance.now();
  const duration = 1800;
  function tick(now) {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    loaderCount.textContent = String(Math.round(eased * 100)).padStart(3, '0');
    if (progress < 1) requestAnimationFrame(tick);
    else window.setTimeout(finishLoader, 250);
  }
  requestAnimationFrame(tick);
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.18 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const siteHeader = document.querySelector('.site-header');
let headerTicking = false;

function updateHeaderGlass() {
  siteHeader?.classList.toggle('is-scrolled', window.scrollY > 48);
  headerTicking = false;
}

window.addEventListener('scroll', () => {
  if (headerTicking) return;
  headerTicking = true;
  requestAnimationFrame(updateHeaderGlass);
}, { passive: true });

updateHeaderGlass();

const instrumentChapters = [...document.querySelectorAll('.instrument-chapter')];
const journeyRail = document.querySelector('.instrument-journey-rail');
const journeyCurrent = journeyRail?.querySelector('.journey-current');
const journeyFill = journeyRail?.querySelector('.journey-track i');

if (instrumentChapters.length) {
  let ticking = false;
  let lastScrollY = window.scrollY;

  function updateInstrumentJourney() {
    const viewport = window.innerHeight;
    const scrollDirection = window.scrollY >= lastScrollY ? 1 : -1;
    let activeIndex = -1;
    let closestDistance = Infinity;

    instrumentChapters.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, rect.height - viewport);
      const progress = Math.max(0, Math.min(1, -rect.top / travel));
      const distance = Math.abs((rect.top + rect.bottom) / 2 - viewport / 2);

      if (rect.bottom > 0 && rect.top < viewport && distance < closestDistance) {
        activeIndex = index;
        closestDistance = distance;
      }

      if (!reduceMotion) {
        const flow = section.dataset.flow === 'down' ? 1 : -1;
        const centered = progress - 0.5;
        const mobile = window.innerWidth <= 800;
        const artShift = centered * (mobile ? 10 : 22) * flow;
        const copyShift = mobile ? 0 : centered * -6 * flow;
        const rotation = centered * 5 * flow + scrollDirection * 0.2;
        const focus = 1 - Math.min(1, Math.abs(centered) * 1.5);

        section.style.setProperty('--art-y', `${artShift}vh`);
        section.style.setProperty('--copy-y', `${copyShift}vh`);
        section.style.setProperty('--art-rotate', `${rotation}deg`);
        section.style.setProperty('--chapter-focus', focus.toFixed(3));
      }
    });

    const journeyIsVisible = instrumentChapters.some((section) => {
      const rect = section.getBoundingClientRect();
      return rect.bottom > viewport * 0.15 && rect.top < viewport * 0.85;
    });

    journeyRail?.classList.toggle('visible', journeyIsVisible);
    if (activeIndex >= 0) {
      journeyCurrent.textContent = String(activeIndex + 1).padStart(2, '0');
      journeyFill.style.transform = `scaleY(${(activeIndex + 1) / instrumentChapters.length})`;
      instrumentChapters.forEach((section, index) => section.classList.toggle('is-active', index === activeIndex));
    }

    lastScrollY = window.scrollY;
    ticking = false;
  }

  function requestJourneyUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateInstrumentJourney);
  }

  window.addEventListener('scroll', requestJourneyUpdate, { passive: true });
  window.addEventListener('resize', requestJourneyUpdate);
  requestJourneyUpdate();
}
