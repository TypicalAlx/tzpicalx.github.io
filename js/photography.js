// Photography page: gallery, category filters and the full-screen lightbox.
//
// ADD A PHOTO: drop the file in assets/photos/ and add an entry below.
// "category" creates a filter button automatically (e.g. "Street", "Portraits").

const CAMERA = "Fujifilm X100VI";

const PHOTOS = [
  { src: "assets/photos/concert-spotlights.jpg", title: "Spotlights", location: "Live show", year: 2026, category: "Concerts" },
  { src: "assets/photos/concert-nebula.jpg", title: "Under the nebula", location: "Live show", year: 2026, category: "Concerts" },
  { src: "assets/photos/concert-stage.jpg", title: "Center stage", location: "Live show", year: 2026, category: "Concerts" },
];

(() => {
  const gallery = document.querySelector("[data-gallery]");
  const filtersEl = document.querySelector("[data-filters]");
  const lb = document.querySelector("[data-lightbox]");
  if (!gallery || !lb) return;

  // ---------- Gallery ----------
  gallery.innerHTML = "";
  PHOTOS.forEach((p, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "gallery__item reveal";
    btn.dataset.index = i;
    btn.dataset.category = p.category;
    btn.setAttribute("aria-label", `Open ${p.title} full screen`);
    btn.innerHTML = `<img src="${p.src}" alt="${p.title}, ${p.location}" loading="lazy"><figcaption>${p.title}</figcaption>`;
    btn.addEventListener("click", () => open(i));
    gallery.appendChild(btn);
  });
  // let main.js reveal observer pick these up
  requestAnimationFrame(() => gallery.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in")));

  // ---------- Filters ----------
  let active = "All";
  const categories = ["All", ...new Set(PHOTOS.map((p) => p.category))];
  const empty = document.createElement("p");
  empty.className = "gallery__empty";
  empty.hidden = true;
  empty.textContent = "No photos in this category yet.";
  gallery.after(empty);

  if (filtersEl) {
    filtersEl.innerHTML = "";
    categories.forEach((c) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "filter";
      b.textContent = c;
      b.setAttribute("aria-pressed", String(c === active));
      b.addEventListener("click", () => setFilter(c));
      filtersEl.appendChild(b);
    });
  }

  function setFilter(c) {
    active = c;
    filtersEl.querySelectorAll(".filter").forEach((b) => b.setAttribute("aria-pressed", String(b.textContent === c)));
    let shown = 0;
    gallery.querySelectorAll(".gallery__item").forEach((el) => {
      const show = c === "All" || el.dataset.category === c;
      el.classList.toggle("is-hidden", !show);
      if (show) shown++;
    });
    empty.hidden = shown > 0;
  }

  // visible photos (respecting the filter) — the lightbox steps through these
  const visible = () => PHOTOS.map((p, i) => i).filter((i) => active === "All" || PHOTOS[i].category === active);

  // ---------- Lightbox ----------
  const img = lb.querySelector(".lightbox__img");
  const count = lb.querySelector("[data-count]");
  const title = lb.querySelector("[data-title]");
  const cam = lb.querySelector("[data-camera]");
  let current = 0;
  let lastFocus = null;

  function show(i) {
    current = i;
    const p = PHOTOS[i];
    const list = visible();
    const pos = list.indexOf(i) + 1;
    img.classList.add("is-loading");
    img.onload = () => img.classList.remove("is-loading");
    img.src = p.src;
    img.alt = `${p.title}, ${p.location}`;
    count.textContent = `${String(pos).padStart(2, "0")} / ${String(list.length).padStart(2, "0")}`;
    title.textContent = `${p.title} · ${p.location}`;
    cam.textContent = `${CAMERA} · ${p.year}`;
  }

  function open(i) {
    if (!visible().includes(i)) setFilter("All");
    lastFocus = document.activeElement;
    show(i);
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    lb.querySelector(".lightbox__close").focus();
  }

  function close() {
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (lastFocus) lastFocus.focus();
  }

  function step(dir) {
    const list = visible();
    const pos = list.indexOf(current);
    show(list[(pos + dir + list.length) % list.length]);
  }

  lb.querySelector(".lightbox__close").addEventListener("click", close);
  lb.querySelector(".lightbox__prev").addEventListener("click", () => step(-1));
  lb.querySelector(".lightbox__next").addEventListener("click", () => step(1));
  lb.addEventListener("click", (e) => {
    if (e.target === lb || e.target.classList.contains("lightbox__stage")) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "Tab") {
      // keep focus inside the lightbox
      const f = [...lb.querySelectorAll("button")];
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // swipe on phones
  let x0 = null;
  lb.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    x0 = null;
  });

  // Anything with data-open="<src>" (featured photo, series covers) opens the lightbox too
  document.querySelectorAll("[data-open]").forEach((el) => {
    const i = PHOTOS.findIndex((p) => p.src === el.dataset.open);
    if (i > -1) el.addEventListener("click", () => open(i));
  });
})();
