function initScrollReveals(root = document) {
  const targets = root.querySelectorAll(".birthday-counter, .survival-card, .tool-card, .news-card, .announcement-article, .privacy-notice, .privacy-details, .link-button");
  if (!targets.length) return;

  targets.forEach((target, index) => {
    target.classList.add("reveal-on-scroll");
    target.style.transitionDelay = `${Math.min(index % 6, 5) * 55}ms`;
  });

  if (!("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  targets.forEach((target) => observer.observe(target));
}

initScrollReveals();
window.initScrollReveals = initScrollReveals;
