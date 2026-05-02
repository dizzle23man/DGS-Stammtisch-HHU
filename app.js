/* ===================================================
   DGS Stammtisch Hamburg – app.js
   =================================================== */

// ── Daten ──────────────────────────────────────────

const TERMINE = [
  {
    day: "07", month: "Mai", year: 2026,
    title: "Markt König (Rindermarkthalle)",
    info: "1. Donnerstag im Monat",
    ort: "Rindermarkthalle, Hamburg",
    tag: "Monatlich"
  },
  {
    day: "14", month: "Mai", year: 2026,
    title: "Peacetanbul",
    info: "2. Donnerstag im Monat",
    ort: "Peacetanbul, Hamburg",
    tag: "Monatlich"
  },
  {
    day: "21", month: "Mai", year: 2026,
    title: "Villa im Park",
    info: "3. Donnerstag im Monat",
    ort: "Villa im Park, Hamburg",
    tag: "Monatlich"
  },
  {
    day: "15", month: "Mai", year: 2026,
    title: "Lim's – Buchholz",
    info: "3. Freitag im Monat",
    ort: "Lim's, Buchholz",
    tag: "Monatlich"
  },
  {
    day: "28", month: "Mai", year: 2026,
    title: "Schachcafé",
    info: "4. Donnerstag im Monat",
    ort: "Schachcafé, Hamburg",
    tag: "Monatlich"
  },
  {
    day: "04", month: "Jun", year: 2026,
    title: "Markt König (Rindermarkthalle)",
    info: "1. Donnerstag im Monat",
    ort: "Rindermarkthalle, Hamburg",
    tag: "Monatlich"
  },
  {
    day: "11", month: "Jun", year: 2026,
    title: "Peacetanbul",
    info: "2. Donnerstag im Monat",
    ort: "Peacetanbul, Hamburg",
    tag: "Monatlich"
  },
  {
    day: "18", month: "Jun", year: 2026,
    title: "Villa im Park",
    info: "3. Donnerstag im Monat",
    ort: "Villa im Park, Hamburg",
    tag: "Monatlich"
  },
  {
    day: "19", month: "Jun", year: 2026,
    title: "Lim's – Buchholz",
    info: "3. Freitag im Monat",
    ort: "Lim's, Buchholz",
    tag: "Monatlich"
  },
  {
    day: "25", month: "Jun", year: 2026,
    title: "Schachcafé",
    info: "4. Donnerstag im Monat",
    ort: "Schachcafé, Hamburg",
    tag: "Monatlich"
  }
];

const EVENTS = [
  {
    emoji: "🎬",
    date: "24. Mai 2026",
    title: "DGS-Filmabend",
    desc: "Wir schauen gemeinsam einen Film mit DGS-Dolmetscher und besprechen ihn anschließend. Für alle Levels!"
  },
  {
    emoji: "📚",
    date: "07. Jun 2026",
    title: "DGS-Workshop für Anfänger",
    desc: "Zwei Stunden Grundlagen der Deutschen Gebärdensprache – kostenlos, offen für alle."
  },
  {
    emoji: "🚂",
    date: "21. Jun 2026",
    title: "Ausflug Alsterpark",
    desc: "Gemeinsamer Spaziergang und Picknick im Alsterpark. Anmeldung bis 14. Jun per E-Mail."
  },
  {
    emoji: "🎭",
    date: "12. Jul 2026",
    title: "Theater in DGS",
    desc: "Aufführung der Theatergruppe 'Hands & Faces'. Mit Simultanübersetzung in Lautsprache."
  }
];

// Stammtische mit Koordinaten für die Karte
const LOCATIONS = [
  {
    name: "Markt König (Rindermarkthalle)",
    lat: 53.5567, lng: 9.9617,
    info: "Rindermarkthalle, Hamburg<br>1. Donnerstag im Monat"
  },
  {
    name: "Peacetanbul",
    lat: 53.5603, lng: 9.9347,
    info: "Peacetanbul, Hamburg<br>2. Donnerstag im Monat"
  },
  {
    name: "Villa im Park",
    lat: 53.5752, lng: 9.9928,
    info: "Villa im Park, Hamburg<br>3. Donnerstag im Monat"
  },
  {
    name: "Lim's – Buchholz",
    lat: 53.3260, lng: 9.8680,
    info: "Lim's, Buchholz in der Nordheide<br>3. Freitag im Monat"
  },
  {
    name: "Schachcafé",
    lat: 53.5638, lng: 10.0023,
    info: "Schachcafé, Hamburg<br>4. Donnerstag im Monat"
  }
];

// Galerie-Platzhalter (Emoji + Beschriftung bis echte Fotos da sind)
const GALLERY_ITEMS = [
  { emoji: "🤝", label: "Kennenlernrunde" },
  { emoji: "☕", label: "Kaffeepause" },
  { emoji: "👐", label: "Workshop" },
  { emoji: "🎉", label: "Sommerfest 2025" },
  { emoji: "🗺️", label: "Ausflug" },
  { emoji: "🎬", label: "Filmabend" },
  { emoji: "📸", label: "Dein Foto hier?" },
  { emoji: "🌟", label: "Highlight" }
];

// ── Termine rendern ─────────────────────────────────

function renderTermine() {
  const grid = document.getElementById("termineGrid");
  grid.innerHTML = TERMINE.map(t => {
    const dateBadge = t.day
      ? `<div class="termin-card__day">${t.day}</div>
         <div class="termin-card__month">${t.month}</div>`
      : `<div class="termin-card__day" style="font-size:.9rem">?</div>
         <div class="termin-card__month">${t.month}</div>`;
    return `
    <article class="termin-card">
      <div class="termin-card__date">${dateBadge}</div>
      <div class="termin-card__info">
        <h3>${t.title}</h3>
        <p>${t.info}</p>
        <p>${t.ort}</p>
        <span class="termin-card__tag">${t.tag}</span>
      </div>
    </article>`;
  }).join("");
}

// ── Events rendern ──────────────────────────────────

function renderEvents() {
  const grid = document.getElementById("eventsGrid");
  grid.innerHTML = EVENTS.map(e => `
    <article class="event-card">
      <div class="event-card__img" aria-hidden="true">${e.emoji}</div>
      <div class="event-card__body">
        <p class="event-card__date">${e.date}</p>
        <h3>${e.title}</h3>
        <p>${e.desc}</p>
      </div>
    </article>
  `).join("");
}

// ── Galerie rendern + Lightbox ──────────────────────

function renderGallery() {
  const grid = document.getElementById("galleryGrid");
  grid.innerHTML = GALLERY_ITEMS.map((item, i) => `
    <div class="gallery__item"
         tabindex="0"
         role="button"
         aria-label="${item.label} öffnen"
         data-index="${i}">
      <span aria-hidden="true">${item.emoji}</span>
    </div>
  `).join("");

  // Lightbox (einfacher Placeholder – wird mit echten Fotos befüllt)
  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.id = "lightbox";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.setAttribute("aria-label", "Bild vergrößert");
  lb.innerHTML = `
    <button class="lightbox__close" id="lbClose" aria-label="Schließen">✕</button>
    <div style="text-align:center;color:#fff">
      <div id="lbEmoji" style="font-size:8rem;line-height:1"></div>
      <p id="lbLabel" style="font-size:1.25rem;margin-top:1rem;font-weight:700"></p>
      <p style="opacity:.6;margin-top:.5rem;font-size:.9rem">Echte Fotos folgen – schick uns deine Bilder!</p>
    </div>
  `;
  document.body.appendChild(lb);

  grid.addEventListener("click", e => {
    const item = e.target.closest(".gallery__item");
    if (!item) return;
    const idx = +item.dataset.index;
    openLightbox(GALLERY_ITEMS[idx]);
  });

  grid.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      const item = e.target.closest(".gallery__item");
      if (!item) return;
      e.preventDefault();
      openLightbox(GALLERY_ITEMS[+item.dataset.index]);
    }
  });

  document.getElementById("lbClose").addEventListener("click", closeLightbox);
  lb.addEventListener("click", e => { if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });
}

function openLightbox(item) {
  document.getElementById("lbEmoji").textContent = item.emoji;
  document.getElementById("lbLabel").textContent = item.label;
  const lb = document.getElementById("lightbox");
  lb.classList.add("open");
  document.getElementById("lbClose").focus();
}
function closeLightbox() {
  document.getElementById("lightbox").classList.remove("open");
}

// ── Leaflet Karte ───────────────────────────────────

function initMap() {
  const map = L.map("map", { scrollWheelZoom: false }).setView([53.55, 10.00], 11);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18
  }).addTo(map);

  const icon = L.divIcon({
    className: "",
    html: `<div style="
      background:#2563eb;
      color:#fff;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      width:36px;height:36px;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 8px rgba(37,99,235,.4);
      border:3px solid #fff;
    "><span style="transform:rotate(45deg);font-size:1rem">👋</span></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -38]
  });

  LOCATIONS.forEach(loc => {
    L.marker([loc.lat, loc.lng], { icon, title: loc.name })
      .addTo(map)
      .bindPopup(`<strong>${loc.name}</strong><br>${loc.info}`, {
        maxWidth: 220
      });
  });
}

// ── Burger-Menü ─────────────────────────────────────

function initNav() {
  const burger = document.getElementById("burger");
  const links = document.getElementById("navLinks");

  burger.addEventListener("click", () => {
    const open = burger.classList.toggle("open");
    links.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
  });

  // Menü schließen bei Klick auf Link
  links.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      burger.classList.remove("open");
      links.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    });
  });
}

// ── Kontaktformular ─────────────────────────────────

function initForm() {
  const form = document.getElementById("kontaktForm");
  const feedback = document.getElementById("formFeedback");

  form.addEventListener("submit", e => {
    e.preventDefault();
    feedback.className = "form__feedback";
    feedback.textContent = "";

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const msg = form.nachricht.value.trim();

    if (!name || !email || !msg) {
      feedback.textContent = "Bitte alle Felder ausfüllen.";
      feedback.classList.add("error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      feedback.textContent = "Bitte eine gültige E-Mail-Adresse eingeben.";
      feedback.classList.add("error");
      return;
    }

    // Simuliertes Absenden (kein Backend vorhanden)
    feedback.textContent = "✓ Danke! Wir melden uns bald bei dir.";
    feedback.classList.add("success");
    form.reset();
  });
}

// ── Dark Mode ───────────────────────────────────────

function initTheme() {
  const root = document.documentElement;
  const btn  = document.getElementById("themeToggle");

  // Gespeicherte Präferenz oder System-Default
  const saved  = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = saved ?? (prefersDark ? "dark" : "light");
  root.setAttribute("data-theme", initial);

  btn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    btn.setAttribute("aria-label", next === "dark" ? "Lightmode aktivieren" : "Darkmode aktivieren");
  });

  // Auf System-Änderungen reagieren (falls kein gespeicherter Wert)
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
    if (!localStorage.getItem("theme")) {
      root.setAttribute("data-theme", e.matches ? "dark" : "light");
    }
  });
}

// ── PWA: Service Worker + Install-Banner ────────────

function detectBrowser() {
  const ua = navigator.userAgent;
  if (/EdgA?\//.test(ua))   return "edge";
  if (/SamsungBrowser/.test(ua)) return "samsung";
  if (/Firefox/.test(ua))   return "firefox";
  if (/OPR|Opera/.test(ua)) return "opera";
  return "chrome";
}

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches
    || window.navigator.standalone === true;
}

function showEdgeInstructions(banner, installBtn) {
  installBtn.textContent = "Wie installieren?";
  installBtn.addEventListener("click", () => {
    const modal = document.getElementById("edgeModal");
    if (modal) modal.classList.add("open");
  });
  banner.classList.add("visible");
}

function initPWA() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js")
      .catch(err => console.warn("SW-Fehler:", err));
  }

  if (isStandalone()) return;
  if (localStorage.getItem("installDismissed")) return;

  const banner    = document.getElementById("installBanner");
  const installBtn = document.getElementById("installBtn");
  const dismissBtn = document.getElementById("installDismiss");
  const browser   = detectBrowser();

  dismissBtn.addEventListener("click", () => {
    banner.classList.remove("visible");
    localStorage.setItem("installDismissed", "1");
  });

  // iOS: kein beforeinstallprompt → Anleitung anzeigen
  if (isIOS()) {
    installBtn.textContent = "Wie installieren?";
    installBtn.addEventListener("click", () => {
      document.getElementById("iosModal").classList.add("open");
    });
    banner.classList.add("visible");
    return;
  }

  // Alle anderen Browser (Chrome, Edge, Samsung, etc.)
  // beforeinstallprompt abwarten — funktioniert in Chrome und Edge
  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.textContent = "Installieren";
    banner.classList.add("visible");
  });

  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    banner.classList.remove("visible");
    if (outcome === "accepted") {
      installBtn.textContent = "✓ Installiert!";
    }
  });
}

// ── Init ────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  renderTermine();
  renderEvents();
  renderGallery();
  initMap();
  initNav();
  initForm();
  initPWA();
});
