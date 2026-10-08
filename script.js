const sections = [...document.querySelectorAll('section')];
const navLinks = document.querySelectorAll('.nav-link');
let currentId = null;

function setActive(id) {
  if (id === currentId) return;
  currentId = id;

  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('active', isActive);

    if (!isActive) {
      link.removeAttribute('aria-current');
      return;
    }

    link.setAttribute('aria-current', 'true');
    const bar = link.closest('#mobile-navbar ul');
    if (bar) {
      bar.scrollTo({
        left: link.offsetLeft - (bar.clientWidth - link.offsetWidth) / 2,
        behavior: 'smooth',
      });
    }
  });
}

// The active section is whichever one sits under a reading line just above mid-screen,
// so very tall sections still register. Short first/last sections may never reach that
// line on tall screens, so the top and bottom of the page win.
function updateActive() {
  const doc = document.documentElement;
  if (window.innerHeight + window.scrollY >= doc.scrollHeight - 2) {
    setActive(sections[sections.length - 1].id);
    return;
  }
  if (window.scrollY < 10) {
    setActive(sections[0].id);
    return;
  }

  const line = window.innerHeight * 0.45;
  const hit = sections.find((s) => {
    const r = s.getBoundingClientRect();
    return r.top <= line && r.bottom > line;
  });
  if (hit) setActive(hit.id);
}

let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateActive();
    ticking = false;
  });
}, { passive: true });
window.addEventListener('resize', updateActive);
updateActive();

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('video[autoplay]').forEach((video) => {
    video.pause();
    video.removeAttribute('autoplay');
    video.controls = true;
  });
}
