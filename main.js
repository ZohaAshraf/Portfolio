/* ===== External profile links ===== */
const EXTERNAL_LINKS = {
  vercelPortfolio: "https://vercel.com/zohaashrafs-projects"
};

document.querySelectorAll("#vercelHomeLink, #vercelContactLink, #vercelNavLink").forEach(el => {
  el.href = EXTERNAL_LINKS.vercelPortfolio;
});

/* ===== Typing animation (rotating titles) ===== */
var typed = new Typed(".text", {
  strings: [
    "AI Engineer",
    "Machine Learning Engineer",
    "Data Scientist",
    "Generative AI Developer",
    "Python Developer",
    "NLP Enthusiast"
  ],
  typeSpeed: 80,
  backSpeed: 50,
  backDelay: 1200,
  loop: true
});

/* ===== Mobile nav toggle ===== */
const menuIcon = document.getElementById("menu-icon");
const navbar = document.querySelector(".navbar");

if (menuIcon) {
  menuIcon.addEventListener("click", () => {
    navbar.classList.toggle("active");
  });

  document.querySelectorAll(".navbar a").forEach(link => {
    link.addEventListener("click", () => navbar.classList.remove("active"));
  });
}

/* ===== Smooth scrolling ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId.length > 1) {
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
});

/* ===== Fade-up on scroll ===== */
const fadeTargets = document.querySelectorAll(
  ".skill-card, .project-card, .cert-card, .stat-box, .github-card, .achieve-card, .timeline-item"
);
fadeTargets.forEach(el => el.classList.add("fade-up"));

const fadeObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
fadeTargets.forEach(el => fadeObserver.observe(el));

/* ===== Animated counters ===== */
const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

function animateCounter(el) {
  const target = parseInt(el.getAttribute("data-target"), 10) || 0;
  const duration = 1200;
  const startTime = performance.now();

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target + "+";
    }
  }
  requestAnimationFrame(step);
}
counters.forEach(el => counterObserver.observe(el));

/* ===== Project filtering ===== */
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.getAttribute("data-filter");

    projectCards.forEach(card => {
      const match = filter === "all" || card.getAttribute("data-category") === filter;
      card.classList.toggle("hidden", !match);
    });

    resetCarousel(projectTrack, projectArrows);
  });
});

/* ===== Generic carousel logic (Projects + Certifications) ===== */
function setupCarousel(trackId, prevId, nextId, autoSlide) {
  const track = document.getElementById(trackId);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  if (!track) return null;

  let index = 0;
  let timer = null;

  function visibleCards() {
    return Array.from(track.children).filter(c => !c.classList.contains("hidden"));
  }

  function cardWidth() {
    const cards = visibleCards();
    if (!cards.length) return 0;
    const style = getComputedStyle(track);
    const gap = parseInt(style.gap || "30", 10);
    return cards[0].getBoundingClientRect().width + gap;
  }

  function update() {
    const cards = visibleCards();
    if (index >= cards.length) index = 0;
    if (index < 0) index = cards.length - 1;
    track.style.transform = `translateX(-${index * cardWidth()}px)`;
  }

  function next() {
    const cards = visibleCards();
    if (!cards.length) return;
    index = (index + 1) % cards.length;
    update();
  }

  function prev() {
    const cards = visibleCards();
    if (!cards.length) return;
    index = (index - 1 + cards.length) % cards.length;
    update();
  }

  function startAuto() {
    if (autoSlide) {
      timer = setInterval(next, 4000);
    }
  }
  function stopAuto() {
    if (timer) clearInterval(timer);
  }

  if (nextBtn) nextBtn.addEventListener("click", () => { next(); stopAuto(); startAuto(); });
  if (prevBtn) prevBtn.addEventListener("click", () => { prev(); stopAuto(); startAuto(); });

  track.addEventListener("mouseenter", stopAuto);
  track.addEventListener("mouseleave", startAuto);

  window.addEventListener("resize", update);

  startAuto();

  return { reset: () => { index = 0; update(); } };
}

const projectArrows = setupCarousel("projectTrack", "prevProject", "nextProject", true);
const certArrows = setupCarousel("certTrack", "prevCert", "nextCert", true);

const projectTrack = document.getElementById("projectTrack");
function resetCarousel(track, controller) {
  if (controller && controller.reset) controller.reset();
}

/* ===== Timeline scroll animation (extra trigger for connecting line feel) ===== */
const timelineItems = document.querySelectorAll(".timeline-item");
timelineItems.forEach((item, i) => {
  item.style.transitionDelay = `${i * 0.1}s`;
});

/* ===== Copy to clipboard ===== */
document.querySelectorAll(".copy-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const text = btn.getAttribute("data-copy");
    navigator.clipboard.writeText(text).then(() => {
      const icon = btn.querySelector("i");
      const originalClass = icon.className;
      icon.className = "bx bx-check";
      btn.classList.add("copied");
      setTimeout(() => {
        icon.className = originalClass;
        btn.classList.remove("copied");
      }, 1500);
    });
  });
});

/* ===== Contact form (real email submission via FormSubmit) ===== */
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", async e => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector(".send");
    const originalLabel = submitBtn.value;
    submitBtn.value = "Sending...";
    submitBtn.disabled = true;

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" }
      });

      if (response.ok) {
        alert("Thanks for reaching out! Your message has been sent — I'll get back to you soon.");
        contactForm.reset();
      } else {
        alert("Something went wrong sending your message. Please email zoha14ashraf@gmail.com directly.");
      }
    } catch (err) {
      alert("Something went wrong sending your message. Please email zoha14ashraf@gmail.com directly.");
    } finally {
      submitBtn.value = originalLabel;
      submitBtn.disabled = false;
    }
  });
}
