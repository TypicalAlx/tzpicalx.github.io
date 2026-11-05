// Shared behaviour for every page: mobile nav, scroll reveals,
// marquee duplication and the languages carousel.

(() => {
  // ---------- Mobile nav ----------
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  if (nav && toggle) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll(".nav__links a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  // ---------- Footer year ----------
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  // ---------- Reveal on scroll ----------
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  // ---------- Marquee: duplicate the group so the loop is seamless ----------
  document.querySelectorAll(".marquee__track").forEach((track) => {
    const group = track.querySelector(".marquee__group");
    if (!group) return;
    const copy = group.cloneNode(true);
    copy.setAttribute("aria-hidden", "true");
    track.appendChild(copy);
  });

  // ---------- Carousel ----------
  document.querySelectorAll("[data-carousel]").forEach((root) => {
    const track = root.querySelector(".carousel__track");
    const prev = root.querySelector("[data-prev]");
    const next = root.querySelector("[data-next]");
    const dotsWrap = root.querySelector(".carousel__dots");
    const cards = [...track.children];
    if (!cards.length) return;

    const step = () => cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 0);
    const pages = () => Math.max(1, Math.ceil((track.scrollWidth - track.clientWidth) / step()) + 1);

    let dots = [];
    const buildDots = () => {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      const n = Math.min(pages(), cards.length);
      dots = Array.from({ length: n }, (_, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", `Go to slide ${i + 1}`);
        b.addEventListener("click", () => track.scrollTo({ left: i * step(), behavior: "smooth" }));
        dotsWrap.appendChild(b);
        return b;
      });
      update();
    };

    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
      const i = Math.round(track.scrollLeft / step());
      dots.forEach((d, j) => d.setAttribute("aria-current", String(j === Math.min(i, dots.length - 1))));
    };

    prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
    next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
    track.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
    window.addEventListener("resize", buildDots);
    track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); next.click(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev.click(); }
    });
    buildDots();
  });

  // ---------- Placeholder images: hide the <img> if the file isn't there yet ----------
  document.querySelectorAll("img[data-optional]").forEach((img) => {
    const fail = () => img.remove();
    if (img.complete && img.naturalWidth === 0) fail();
    else img.addEventListener("error", fail);
  });
})();
