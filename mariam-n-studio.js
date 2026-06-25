window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("is-loaded");
  let entering = false;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("video.motion-video").forEach((video) => {
    const hasSource = video.querySelector("source[src]");

    if (!hasSource || reduceMotion) {
      video.hidden = true;
      video.pause();
      return;
    }

    video.hidden = false;
    video.play().catch(() => {
      video.hidden = true;
    });
  });

  function leaveFor(href) {
    if (entering) return;
    entering = true;
    document.body.classList.add("is-leaving");
    window.setTimeout(() => {
      window.location.href = href;
    }, 320);
  }

  const enterTarget = document.body.dataset.enterTarget;

  if (enterTarget) {
    window.addEventListener(
      "wheel",
      (event) => {
        if (Math.abs(event.deltaY) > 18) {
          leaveFor(enterTarget);
        }
      },
      { passive: true }
    );

    window.addEventListener("keydown", (event) => {
      if (["ArrowDown", "PageDown", "Enter", " "].includes(event.key)) {
        leaveFor(enterTarget);
      }
    });

    let touchStartY = 0;
    window.addEventListener("touchstart", (event) => {
      touchStartY = event.touches[0].clientY;
    }, { passive: true });

    window.addEventListener("touchmove", (event) => {
      const delta = touchStartY - event.touches[0].clientY;
      if (delta > 24) {
        leaveFor(enterTarget);
      }
    }, { passive: true });
  }

  const revealItems = document.querySelectorAll("[data-reveal]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));

  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    const isLocalPage = href && /\.html($|#)/.test(href);

    if (!isLocalPage) return;

    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      event.preventDefault();
      leaveFor(href);
    });
  });
});
