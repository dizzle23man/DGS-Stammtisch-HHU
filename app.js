/* ===================================================
   DGS Stammtisch Hamburg – app.js
   =================================================== */

// ── Firebase (RSVP-System) ─────────────────────────
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase, ref, set, remove, onValue, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyARSPCvSXn7KkJc9HSUCAAKDr7jVqi9QJY",
  authDomain: "dgs-stammtisch-hhu.firebaseapp.com",
  databaseURL: "https://dgs-stammtisch-hhu-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "dgs-stammtisch-hhu",
  storageBucket: "dgs-stammtisch-hhu.firebasestorage.app",
  messagingSenderId: "330628209563",
  appId: "1:330628209563:web:3506adcdd29cdeef3a5f3e",
  measurementId: "G-QB9QW6J2HY"
};

let db = null;
try {
  const fbApp = initializeApp(firebaseConfig);
  db = getDatabase(fbApp);
} catch (e) {
  console.warn("Firebase nicht initialisiert:", e);
}

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
    title: "Barmbeker Schachcafé",
    info: "4. Donnerstag im Monat",
    ort: "Barmbeker Schachcafé, Hamburg",
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
    title: "Barmbeker Schachcafé",
    info: "4. Donnerstag im Monat",
    ort: "Barmbeker Schachcafé, Hamburg",
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

// Telegram-Posts für die "Aktuelles"-Sektion
// 👉 Neuer Post? Hier oben die ID einfügen (Format: "kanal/postid")
//    Post-ID findest du in der URL eines Telegram-Posts (t.me/dgs_stammtisch_hhu/3 → 3)
//    Service-Messages (Channel-Erstellung etc.) NICHT eintragen.
const TELEGRAM_POSTS = [
  "dgs_stammtisch_hhu/2"
];
const TELEGRAM_CHANNEL = "dgs_stammtisch_hhu";

// Stammtische mit Koordinaten für die Karte
const LOCATIONS = [
  {
    name: "Markt König (Rindermarkthalle)",
    lat: 53.5566, lng: 9.9618,
    address: "Neuer Kamp 31, 20359 Hamburg",
    info: `<strong>Markt König (Rindermarkthalle)</strong><br>
           Neuer Kamp 31, 20359 Hamburg<br>
           1. Donnerstag im Monat<br>
           📞 <a href="tel:04043096135">040 43096135</a><br>
           🌐 <a href="https://markt-koenig.de" target="_blank">markt-koenig.de</a>`
  },
  {
    name: "Peacetanbul",
    lat: 53.5853, lng: 10.0269,
    address: "Jarrestraße 20, 22303 Hamburg",
    info: `<strong>Peacetanbul</strong><br>
           Jarrestraße 20, 22303 Hamburg<br>
           2. Donnerstag im Monat<br>
           📞 <a href="tel:04069644975">040 69644975</a><br>
           🌐 <a href="https://peacetanbul.de" target="_blank">peacetanbul.de</a>`
  },
  {
    name: "Villa im Park",
    lat: 53.5742, lng: 9.9447,
    address: "Else-Rauch-Platz 1, 20255 Hamburg",
    info: `<strong>Villa im Park</strong><br>
           Else-Rauch-Platz 1, 20255 Hamburg<br>
           3. Donnerstag im Monat<br>
           📞 <a href="tel:04043208844">040 43208844</a><br>
           🌐 <a href="https://villa-im-park.de" target="_blank">villa-im-park.de</a>`
  },
  {
    name: "Lim's – Buchholz",
    lat: 53.3236, lng: 9.8711,
    address: "Breite Str. 10, 21244 Buchholz",
    info: `<strong>Lim's</strong><br>
           Breite Str. 10, 21244 Buchholz<br>
           3. Freitag im Monat<br>
           📞 <a href="tel:04181292011">04181 292011</a><br>
           🌐 <a href="https://lims-restaurant.de" target="_blank">lims-restaurant.de</a>`
  },
  {
    name: "Barmbeker Schachcafé",
    lat: 53.6004, lng: 10.0388,
    address: "Rübenkamp 227, 22307 Hamburg",
    info: `<strong>Barmbeker Schachcafé</strong><br>
           Rübenkamp 227, 22307 Hamburg<br>
           4. Donnerstag im Monat<br>
           📞 <a href="tel:04067106144">040 67106144</a><br>
           🌐 <a href="https://barmbeker-schachcafe.de" target="_blank">barmbeker-schachcafe.de</a>`
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

const MONTH_NUM = { Jan:"01", Feb:"02", "Mär":"03", Apr:"04", Mai:"05", Jun:"06", Jul:"07", Aug:"08", Sep:"09", Okt:"10", Nov:"11", Dez:"12" };

function slugify(s) {
  return s.toLowerCase()
    .replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function terminId(t) {
  return `${t.year}-${MONTH_NUM[t.month] || "00"}-${t.day}_${slugify(t.title)}`;
}

function renderTermine() {
  const grid = document.getElementById("termineGrid");
  grid.innerHTML = TERMINE.map(t => {
    const tid = terminId(t);
    const dateBadge = t.day
      ? `<div class="termin-card__day">${t.day}</div>
         <div class="termin-card__month">${t.month}</div>`
      : `<div class="termin-card__day" style="font-size:.9rem">?</div>
         <div class="termin-card__month">${t.month}</div>`;
    return `
    <article class="termin-card" data-termin-id="${tid}">
      <div class="termin-card__date">${dateBadge}</div>
      <div class="termin-card__info">
        <h3>${t.title}</h3>
        <p>${t.info}</p>
        <p>${t.ort}</p>
        <div class="rsvp">
          <div class="rsvp__buttons">
            <button class="rsvp-btn rsvp-btn--yes"   data-status="yes"   data-termin="${tid}">
              <span class="rsvp-btn__emoji">✅</span><span class="rsvp-btn__label">Komme</span>
            </button>
            <button class="rsvp-btn rsvp-btn--maybe" data-status="maybe" data-termin="${tid}">
              <span class="rsvp-btn__emoji">🤔</span><span class="rsvp-btn__label">Vielleicht</span>
            </button>
            <button class="rsvp-btn rsvp-btn--no"    data-status="no"    data-termin="${tid}">
              <span class="rsvp-btn__emoji">❌</span><span class="rsvp-btn__label">Kann nicht</span>
            </button>
          </div>
          <div class="rsvp__counts">
            <button type="button" class="rsvp-status rsvp-status--yes"   data-status-key="yes"   data-names="[]">✅ <span class="rsvp-count rsvp-count--yes">0</span></button>
            <button type="button" class="rsvp-status rsvp-status--maybe" data-status-key="maybe" data-names="[]">🤔 <span class="rsvp-count rsvp-count--maybe">0</span></button>
            <button type="button" class="rsvp-status rsvp-status--no"    data-status-key="no"    data-names="[]">❌ <span class="rsvp-count rsvp-count--no">0</span></button>
          </div>
          <div class="rsvp__names" hidden></div>
          <button type="button" class="rsvp__cal" data-termin="${tid}" hidden>📅 In Kalender eintragen</button>
        </div>
      </div>
    </article>`;
  }).join("");

  grid.addEventListener("click", e => {
    const rsvpBtn = e.target.closest(".rsvp-btn");
    if (rsvpBtn) {
      handleRsvp(rsvpBtn.dataset.termin, rsvpBtn.dataset.status);
      return;
    }
    const statusBtn = e.target.closest(".rsvp-status");
    if (statusBtn) {
      toggleNamesDisplay(statusBtn);
      return;
    }
    const calBtn = e.target.closest(".rsvp__cal");
    if (calBtn) {
      addToCalendar(calBtn.dataset.termin);
      return;
    }
  });
}

// ── RSVP-Logik ──────────────────────────────────────

async function handleRsvp(tid, status) {
  if (!db) {
    alert("Anmeldung gerade nicht möglich. Bitte später nochmal versuchen.");
    return;
  }
  let name = localStorage.getItem("dgs_name");
  if (!name) {
    name = await askName();
    if (!name) return;
    localStorage.setItem("dgs_name", name);
  }
  const docId = `${tid}_${slugify(name)}`;
  const card = document.querySelector(`.termin-card[data-termin-id="${tid}"]`);
  const isToggleOff = card?.querySelector(`.rsvp-btn.active[data-status="${status}"]`);

  try {
    if (isToggleOff) {
      await remove(ref(db, `rsvps/${docId}`));
    } else {
      await set(ref(db, `rsvps/${docId}`), {
        terminId: tid, name, status, ts: serverTimestamp()
      });
    }
  } catch (e) {
    console.error("RSVP-Fehler:", e);
    alert("Anmeldung fehlgeschlagen. Bitte nochmal versuchen.");
  }
}

const STATUS_EMOJI = { yes: "✅", maybe: "🤔", no: "❌" };

function toggleNamesDisplay(statusBtn) {
  const card = statusBtn.closest(".termin-card");
  const namesEl = card.querySelector(".rsvp__names");
  const key = statusBtn.dataset.statusKey;
  const names = JSON.parse(statusBtn.dataset.names || "[]");

  if (namesEl.dataset.showing === key && !namesEl.hidden) {
    namesEl.hidden = true;
    namesEl.dataset.showing = "";
    return;
  }
  if (names.length === 0) {
    namesEl.innerHTML = `<em>Noch niemand</em>`;
  } else {
    namesEl.innerHTML = `<strong>${STATUS_EMOJI[key]}</strong> ${names.map(escapeHtml).join(", ")}`;
  }
  namesEl.hidden = false;
  namesEl.dataset.showing = key;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

function pad2(n) { return String(n).padStart(2, "0"); }

function addToCalendar(tid) {
  const t = TERMINE.find(x => terminId(x) === tid);
  if (!t) return;
  const monthNum = MONTH_NUM[t.month] || "01";
  const dateStr = `${t.year}${monthNum}${pad2(t.day)}`;
  const dtStart = `${dateStr}T190000`;
  const dtEnd   = `${dateStr}T220000`;

  const now = new Date();
  const dtStamp = `${now.getUTCFullYear()}${pad2(now.getUTCMonth()+1)}${pad2(now.getUTCDate())}T${pad2(now.getUTCHours())}${pad2(now.getUTCMinutes())}${pad2(now.getUTCSeconds())}Z`;

  const loc = LOCATIONS.find(l => l.name === t.title);
  const address = loc?.address || t.ort;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DGS Stammtisch HH//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VTIMEZONE",
    "TZID:Europe/Berlin",
    "BEGIN:STANDARD",
    "DTSTART:19701025T030000",
    "TZOFFSETFROM:+0200",
    "TZOFFSETTO:+0100",
    "TZNAME:CET",
    "RRULE:FREQ=YEARLY;BYDAY=-1SU;BYMONTH=10",
    "END:STANDARD",
    "BEGIN:DAYLIGHT",
    "DTSTART:19700329T020000",
    "TZOFFSETFROM:+0100",
    "TZOFFSETTO:+0200",
    "TZNAME:CEST",
    "RRULE:FREQ=YEARLY;BYDAY=-1SU;BYMONTH=3",
    "END:DAYLIGHT",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:${tid}@dgs-stammtisch-hamburg.de`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART;TZID=Europe/Berlin:${dtStart}`,
    `DTEND;TZID=Europe/Berlin:${dtEnd}`,
    `SUMMARY:DGS Stammtisch – ${t.title}`,
    `LOCATION:${address}`,
    "DESCRIPTION:Stammtisch für Deutsche Gebärdensprache. Mehr Infos: https://dizzle23man.github.io/DGS-Stammtisch-HHU/",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dgs-stammtisch-${dateStr}.ics`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

function askName() {
  return new Promise(resolve => {
    const modal  = document.getElementById("nameModal");
    const input  = document.getElementById("nameInput");
    const okBtn  = document.getElementById("nameOk");
    const cancel = document.getElementById("nameCancel");

    input.value = "";
    modal.classList.add("open");
    setTimeout(() => input.focus(), 50);

    const cleanup = (val) => {
      modal.classList.remove("open");
      okBtn.removeEventListener("click", onOk);
      cancel.removeEventListener("click", onCancel);
      input.removeEventListener("keydown", onKey);
      resolve(val);
    };
    const onOk = () => {
      const v = input.value.trim();
      if (v.length < 2) { input.focus(); return; }
      cleanup(v);
    };
    const onCancel = () => cleanup(null);
    const onKey = (e) => { if (e.key === "Enter") onOk(); if (e.key === "Escape") onCancel(); };

    okBtn.addEventListener("click", onOk);
    cancel.addEventListener("click", onCancel);
    input.addEventListener("keydown", onKey);
  });
}

function initRsvpSubscription() {
  if (!db) return;
  onValue(ref(db, "rsvps"), snapshot => {
    const all = snapshot.val() || {};
    const byTermin = {};
    Object.values(all).forEach(r => {
      if (!r || !r.terminId) return;
      (byTermin[r.terminId] ||= []).push(r);
    });
    document.querySelectorAll(".termin-card[data-termin-id]").forEach(card => {
      updateCardCounts(card, byTermin[card.dataset.terminId] || []);
    });
  });
}

function updateCardCounts(card, rsvps) {
  const counts = { yes:0, maybe:0, no:0 };
  const names  = { yes:[], maybe:[], no:[] };
  rsvps.forEach(r => {
    if (counts[r.status] !== undefined) {
      counts[r.status]++;
      names[r.status].push(r.name);
    }
  });
  ["yes","maybe","no"].forEach(key => {
    card.querySelector(`.rsvp-count--${key}`).textContent = counts[key];
    const btn = card.querySelector(`.rsvp-status--${key}`);
    btn.dataset.names = JSON.stringify(names[key]);
    btn.title = names[key].join(", ") || "Niemand";
  });

  const myName = (localStorage.getItem("dgs_name") || "").toLowerCase();
  const mine   = rsvps.find(r => r.name.toLowerCase() === myName);
  card.querySelectorAll(".rsvp-btn").forEach(btn => {
    btn.classList.toggle("active", !!(mine && btn.dataset.status === mine.status));
  });

  const calBtn = card.querySelector(".rsvp__cal");
  if (calBtn) calBtn.hidden = !(mine && mine.status === "yes");

  // Live-Update der Namen-Anzeige falls offen
  const namesEl = card.querySelector(".rsvp__names");
  const showing = namesEl.dataset.showing;
  if (showing && !namesEl.hidden) {
    const list = names[showing] || [];
    if (list.length === 0) {
      namesEl.innerHTML = `<em>Noch niemand</em>`;
    } else {
      namesEl.innerHTML = `<strong>${STATUS_EMOJI[showing]}</strong> ${list.map(escapeHtml).join(", ")}`;
    }
  }
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
  if (!grid) return; // LightWidget übernimmt jetzt die Galerie
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
      .bindPopup(loc.info, { maxWidth: 240 });
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
    // Telegram-Widgets neu rendern, damit sie das richtige Theme nutzen
    renderTelegramFeed();
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
    navigator.serviceWorker.register("sw.js")
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

function isDarkMode() {
  const t = document.documentElement.dataset.theme;
  if (t === "dark")  return true;
  if (t === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function renderTelegramFeed() {
  const grid = document.getElementById("newsGrid");
  if (!grid) return;

  if (!TELEGRAM_POSTS.length) {
    grid.innerHTML = `<p class="news-empty">Noch keine Posts. <a href="https://t.me/${TELEGRAM_CHANNEL}" target="_blank" rel="noopener">Folge unserem Telegram-Kanal</a> für die ersten News.</p>`;
    return;
  }

  const dark = isDarkMode();
  grid.innerHTML = "";

  TELEGRAM_POSTS.forEach(post => {
    const card = document.createElement("div");
    card.className = "news-card";

    const s = document.createElement("script");
    s.async = true;
    s.src = "https://telegram.org/js/telegram-widget.js?22";
    s.dataset.telegramPost = post;
    s.dataset.width = "100%";
    s.dataset.userpic = "true";
    s.dataset.color = "1e3a8a";
    s.dataset.darkColor = "60a5fa";
    if (dark) s.dataset.dark = "1";

    card.appendChild(s);
    grid.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  renderTelegramFeed();
  renderTermine();
  renderEvents();
  renderGallery();
  initMap();
  initNav();
  initForm();
  initPWA();
  initRsvpSubscription();
  initNavModal();
});

// ── Navigation-App-Auswahl ─────────────────────────

function initNavModal() {
  const modal = document.getElementById("navModal");
  if (!modal) return;
  const closeBtn = document.getElementById("navModalClose");
  const addrEl   = document.getElementById("navModalAddress");

  // Klick auf jeden 🧭-Button öffnet das Modal
  document.addEventListener("click", e => {
    const btn = e.target.closest(".gmaps__nav-btn");
    if (!btn) return;
    const address = btn.dataset.address;
    const lat     = btn.dataset.lat;
    const lng     = btn.dataset.lng;
    const name    = btn.dataset.name || address;

    addrEl.textContent = `📍 ${address}`;
    setNavLinks(modal, { address, lat, lng, name });
    modal.classList.add("open");
  });

  // Schließen
  closeBtn?.addEventListener("click", () => modal.classList.remove("open"));
  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.remove("open");
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") modal.classList.remove("open");
  });
  // Klick auf eine Option schließt Modal (Link öffnet sich im neuen Tab)
  modal.querySelectorAll(".nav-modal__option").forEach(opt => {
    opt.addEventListener("click", () => {
      setTimeout(() => modal.classList.remove("open"), 200);
    });
  });
}

function setNavLinks(modal, { address, lat, lng, name }) {
  const encA = encodeURIComponent(address);
  const encN = encodeURIComponent(name);

  const urls = {
    google:     `https://www.google.com/maps/dir/?api=1&destination=${encA}`,
    apple:      `https://maps.apple.com/?daddr=${encA}&dirflg=d`,
    waze:       `https://www.waze.com/ul?ll=${lat},${lng}&navigate=yes`,
    citymapper: `https://citymapper.com/directions?endcoord=${lat},${lng}&endname=${encN}&endaddress=${encA}`
  };

  Object.entries(urls).forEach(([app, url]) => {
    const link = modal.querySelector(`.nav-modal__option[data-app="${app}"]`);
    if (link) link.href = url;
  });
}
