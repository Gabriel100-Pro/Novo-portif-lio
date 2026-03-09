const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");
const navLinks = Array.from(document.querySelectorAll(".nav__link"));
const toTopBtn = document.querySelector(".to-top");
const ano = document.querySelector("#ano");

const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-toggle__icon");

if (ano) ano.textContent = String(new Date().getFullYear());

function setMenu(open) {
  if (!menuBtn || !nav) return;
  nav.classList.toggle("is-open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
}

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    setMenu(!expanded);
  });
}

navLinks.forEach((a) => {
  a.addEventListener("click", () => setMenu(false));
});

if (toTopBtn) {
  toTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

window.addEventListener("scroll", () => {
  const show = window.scrollY > 600;
  if (toTopBtn) toTopBtn.classList.toggle("is-visible", show);
});

const sections = ["sobre", "skills", "projetos", "contato"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const byId = new Map(navLinks.map((a) => [a.getAttribute("href")?.replace("#", ""), a]));

const obs = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((e) => e.isIntersecting)
    .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

  if (!visible) return;

  navLinks.forEach((a) => a.classList.remove("is-active"));
  const id = visible.target.id;
  const link = byId.get(id);
  if (link) link.classList.add("is-active");
}, { root: null, threshold: [0.2, 0.35, 0.5] });

sections.forEach((s) => obs.observe(s));

function getPreferredTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark" || saved === "light") return saved;

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  return prefersDark ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  if (themeToggle) themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  if (themeIcon) themeIcon.textContent = theme === "dark" ? "🌙" : "☀️";
}

applyTheme(getPreferredTheme());

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    applyTheme(next);
  });
}