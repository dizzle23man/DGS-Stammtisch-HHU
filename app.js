/* ===================================================
   DGS Stammtisch Hamburg – app.js
   =================================================== */

// ── Firebase (RSVP-System) ─────────────────────────
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase, ref, set, push, remove, onValue, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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
let auth = null;
let fbApp = null;
try {
  fbApp = initializeApp(firebaseConfig);
  db = getDatabase(fbApp);
  auth = getAuth(fbApp);
  setPersistence(auth, browserLocalPersistence).catch(()=>{});
} catch (e) {
  console.warn("Firebase nicht initialisiert:", e);
}

// ── Admin-Auth ──────────────────────────────────────
const ADMIN_EMAIL = "admin@dgs-stammtisch-hhu.de"; // ← falls du eine andere Mail genommen hast, hier anpassen
let isAdmin = false;

function setupAuthObserver() {
  if (!auth) return;
  onAuthStateChanged(auth, user => {
    isAdmin = !!user;
    document.body.classList.toggle("is-admin", isAdmin);
    updateAdminFab();
    // Alles neu rendern, damit Admin-Buttons erscheinen/verschwinden
    renderTermine();
    renderEvents();
    renderTreffpunkte();
  });
}

async function adminLogin(password) {
  if (!auth) return { ok: false, error: "Firebase nicht verfügbar" };
  try {
    await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: humanizeAuthError(e.code) };
  }
}

async function adminLogout() {
  if (!auth) return;
  await signOut(auth);
}

function humanizeAuthError(code) {
  const map = {
    "auth/invalid-credential": "Falsches Passwort",
    "auth/wrong-password":     "Falsches Passwort",
    "auth/user-not-found":     "Admin-Account nicht eingerichtet (siehe Firebase Console)",
    "auth/too-many-requests":  "Zu viele Versuche – kurz warten",
    "auth/network-request-failed": "Keine Internetverbindung"
  };
  return map[code] || ("Login-Fehler: " + (code || "unbekannt"));
}

function updateAdminFab() {
  const fab = document.getElementById("adminFab");
  if (!fab) return;
  fab.textContent = isAdmin ? "🛠️" : "🔐";
  fab.title = isAdmin ? "Admin-Modus aktiv" : "Admin-Login";
}

// ── Daten ──────────────────────────────────────────

// Initial-Termine: werden beim ersten Admin-Login auf Knopfdruck nach Firebase übernommen.
// Danach pflegt das Admin-Team alles direkt über die Website.
const INITIAL_TERMINE = [
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

// Live-Termine aus Firebase (werden via subscribeTermine() aktualisiert)
let TERMINE = INITIAL_TERMINE.slice();

const INITIAL_EVENTS = [
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

let EVENTS = INITIAL_EVENTS.slice();

// Telegram-Posts für die "Aktuelles"-Sektion
// 👉 Neuer Post? Hier oben die ID einfügen (Format: "kanal/postid")
//    Post-ID findest du in der URL eines Telegram-Posts (t.me/dgs_stammtisch_hhu/3 → 3)
//    Service-Messages (Channel-Erstellung etc.) NICHT eintragen.
const TELEGRAM_POSTS = [
  "dgs_stammtisch_hhu/2"
];
const TELEGRAM_CHANNEL = "dgs_stammtisch_hhu";

// Stammtische mit Koordinaten für die Karte
const INITIAL_LOCATIONS = [
  {
    name: "Markt König (Rindermarkthalle)",
    icon: "🥩", iconFile: "markt-koenig.png",
    schedule: "1. Donnerstag im Monat",
    address: "Neuer Kamp 31, 20359 Hamburg",
    lat: 53.5566, lng: 9.9618,
    phone: "040 43096135",
    website: "https://markt-koenig.de",
    order: 1
  },
  {
    name: "Peacetanbul",
    icon: "🌿", iconFile: "peacetanbul.png",
    schedule: "2. Donnerstag im Monat",
    address: "Jarrestraße 20, 22303 Hamburg",
    lat: 53.5853, lng: 10.0269,
    phone: "040 69644975",
    website: "https://peacetanbul.de",
    order: 2
  },
  {
    name: "Villa im Park",
    icon: "🌳", iconFile: "villa-im-park.png",
    schedule: "3. Donnerstag im Monat",
    address: "Else-Rauch-Platz 1, 20255 Hamburg",
    lat: 53.5742, lng: 9.9447,
    phone: "040 43208844",
    website: "https://villa-im-park.de",
    order: 3
  },
  {
    name: "Lim's – Buchholz",
    icon: "🎸", iconFile: "lims.png",
    schedule: "3. Freitag im Monat",
    address: "Breite Str. 10, 21244 Buchholz",
    lat: 53.3236, lng: 9.8711,
    phone: "04181 292011",
    website: "https://lims-restaurant.de",
    order: 4
  },
  {
    name: "Barmbeker Schachcafé",
    icon: "♟️", iconFile: "schachcafe.png",
    schedule: "4. Donnerstag im Monat",
    address: "Rübenkamp 227, 22307 Hamburg",
    lat: 53.6004, lng: 10.0388,
    phone: "040 67106144",
    website: "https://barmbeker-schachcafe.de",
    order: 5
  }
];

let LOCATIONS = INITIAL_LOCATIONS.slice();

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
  if (!grid) return;

  // Filter: Termine ab heute - 1 Tag (Vergangene blenden wir aus)
  const cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setDate(cutoff.getDate() - 1);

  const visible = (TERMINE || [])
    .filter(t => {
      const m = MONTH_NUM[t.month];
      if (!m) return true;
      const d = new Date(`${t.year}-${m}-${String(t.day).padStart(2,"0")}`);
      return isNaN(d) ? true : d >= cutoff;
    })
    .sort((a, b) => {
      const am = MONTH_NUM[a.month] || "00";
      const bm = MONTH_NUM[b.month] || "00";
      return `${a.year}-${am}-${String(a.day).padStart(2,"0")}`
        .localeCompare(`${b.year}-${bm}-${String(b.day).padStart(2,"0")}`);
    });

  const adminToolbar = isAdmin
    ? `<div class="admin-toolbar"><button class="btn btn--primary" id="terminAddBtn">➕ Neuer Termin</button>${TERMINE.length === 0 ? ' <button class="btn btn--outline" id="initialMigrateBtn">📥 Initial-Daten laden</button>' : ''}</div>`
    : "";

  if (!visible.length && !isAdmin) {
    grid.innerHTML = `<p class="termine-empty">Aktuell keine Termine geplant. Schau bald wieder vorbei!</p>`;
    return;
  }

  grid.innerHTML = adminToolbar + visible.map(t => {
    const tid = terminId(t);
    const dateBadge = t.day
      ? `<div class="termin-card__day">${t.day}</div>
         <div class="termin-card__month">${t.month}</div>`
      : `<div class="termin-card__day" style="font-size:.9rem">?</div>
         <div class="termin-card__month">${t.month}</div>`;
    const adminBtns = isAdmin && t.id ? `
        <div class="termin-card__admin">
          <button type="button" class="card-btn" data-action="edit-termin" data-id="${t.id}" title="Bearbeiten">✏️</button>
          <button type="button" class="card-btn card-btn--danger" data-action="delete-termin" data-id="${t.id}" title="Löschen">🗑️</button>
        </div>` : "";
    return `
    <article class="termin-card" data-termin-id="${tid}">
      ${adminBtns}
      <div class="termin-card__date">${dateBadge}</div>
      <div class="termin-card__info">
        <h3>${escapeHtml(t.title)}</h3>
        <p>${escapeHtml(t.info || "")}</p>
        <p>${escapeHtml(t.ort || "")}</p>
        ${t.note ? `<p class="termin-card__note">📌 ${escapeHtml(t.note)}</p>` : ""}
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

  // Admin-Toolbar-Buttons
  document.getElementById("terminAddBtn")?.addEventListener("click", () => openTerminEditor());
  document.getElementById("initialMigrateBtn")?.addEventListener("click", initialMigrate);

  // Re-attach RSVP- und Admin-Click-Listener
  if (!grid.dataset.bound) {
    grid.dataset.bound = "1";
    grid.addEventListener("click", e => {
      const rsvpBtn = e.target.closest(".rsvp-btn");
      if (rsvpBtn) { handleRsvp(rsvpBtn.dataset.termin, rsvpBtn.dataset.status); return; }
      const statusBtn = e.target.closest(".rsvp-status");
      if (statusBtn) { toggleNamesDisplay(statusBtn); return; }
      const calBtn = e.target.closest(".rsvp__cal");
      if (calBtn) { addToCalendar(calBtn.dataset.termin); return; }
      const editBtn = e.target.closest('[data-action="edit-termin"]');
      if (editBtn) { openTerminEditor(editBtn.dataset.id); return; }
      const delBtn = e.target.closest('[data-action="delete-termin"]');
      if (delBtn) { deleteTermin(delBtn.dataset.id); return; }
    });
  }

  // Live-Aktualisierung: RSVP-Counts neu binden
  if (typeof rsvpsCache !== "undefined") {
    document.querySelectorAll(".termin-card[data-termin-id]").forEach(card => {
      updateCardCounts(card, rsvpsCache[card.dataset.terminId] || []);
    });
  }
}

// ── Admin: Termine CRUD ─────────────────────────────

function subscribeTermine() {
  if (!db) return;
  onValue(ref(db, "termine"), snapshot => {
    const data = snapshot.val();
    if (data && typeof data === "object") {
      TERMINE = Object.entries(data).map(([id, t]) => ({ id, ...t }));
    } else {
      // Firebase noch leer → INITIAL_TERMINE als Fallback (nur Anzeige, nicht Firebase-gesichert)
      TERMINE = INITIAL_TERMINE.slice();
    }
    renderTermine();
  });
}

async function initialMigrate() {
  if (!isAdmin || !db) return;
  if (!confirm("Initial-Daten in Firebase laden? (10 Termine werden angelegt)")) return;
  try {
    for (const t of INITIAL_TERMINE) {
      const newRef = push(ref(db, "termine"));
      await set(newRef, { ...t, createdAt: serverTimestamp() });
    }
    alert("Fertig – Termine sind jetzt in Firebase. Du kannst sie ab jetzt direkt auf der Website verwalten.");
  } catch (e) {
    console.error(e);
    alert("Fehler beim Hochladen: " + e.message);
  }
}

function openTerminEditor(id = null) {
  const modal = document.getElementById("terminModal");
  if (!modal) return;
  const form = document.getElementById("terminForm");
  form.reset();
  document.getElementById("terminId").value = id || "";
  document.getElementById("terminModalTitle").textContent = id ? "Termin bearbeiten" : "Neuer Termin";

  // Treffpunkt-Dropdown füllen
  const sel = document.getElementById("terminLocation");
  sel.innerHTML = `<option value="">— Treffpunkt wählen —</option>` +
    LOCATIONS.map(l => `<option value="${escapeHtml(l.name)}" data-info="${escapeHtml(l.info?.replace(/<[^>]+>/g,"").split("\n")[0] || "")}" data-address="${escapeHtml(l.address || "")}">${escapeHtml(l.name)}</option>`).join("") +
    `<option value="__custom__">Eigener Treffpunkt …</option>`;

  if (id) {
    const t = TERMINE.find(x => x.id === id);
    if (t) {
      const m = MONTH_NUM[t.month] || "01";
      document.getElementById("terminDate").value = `${t.year}-${m}-${String(t.day).padStart(2,"0")}`;
      // Match Treffpunkt
      const known = LOCATIONS.find(l => l.name === t.title);
      if (known) {
        sel.value = known.name;
        document.getElementById("terminCustom").classList.add("hidden");
      } else {
        sel.value = "__custom__";
        document.getElementById("terminCustom").classList.remove("hidden");
        document.getElementById("terminCustomTitle").value = t.title || "";
        document.getElementById("terminCustomInfo").value  = t.info || "";
        document.getElementById("terminCustomOrt").value   = t.ort || "";
      }
      document.getElementById("terminNote").value = t.note || "";
    }
  } else {
    document.getElementById("terminCustom").classList.add("hidden");
  }

  sel.onchange = () => {
    document.getElementById("terminCustom").classList.toggle("hidden", sel.value !== "__custom__");
  };

  modal.classList.add("open");
}

function closeTerminEditor() {
  document.getElementById("terminModal")?.classList.remove("open");
}

async function saveTerminFromForm(e) {
  e.preventDefault();
  if (!isAdmin || !db) { alert("Nicht eingeloggt"); return; }
  const id   = document.getElementById("terminId").value;
  const date = document.getElementById("terminDate").value;
  const sel  = document.getElementById("terminLocation").value;
  const note = document.getElementById("terminNote").value.trim();

  if (!date || !sel) { alert("Datum und Treffpunkt sind Pflicht."); return; }

  const [y, m, d] = date.split("-");
  const monthNames = { "01":"Jan","02":"Feb","03":"Mär","04":"Apr","05":"Mai","06":"Jun","07":"Jul","08":"Aug","09":"Sep","10":"Okt","11":"Nov","12":"Dez" };

  let title, info, ort;
  if (sel === "__custom__") {
    title = document.getElementById("terminCustomTitle").value.trim();
    info  = document.getElementById("terminCustomInfo").value.trim();
    ort   = document.getElementById("terminCustomOrt").value.trim();
    if (!title) { alert("Titel des Treffpunkts fehlt."); return; }
  } else {
    const loc = LOCATIONS.find(l => l.name === sel);
    title = sel;
    info  = inferTerminInfo(date);
    ort   = loc?.address || sel;
  }

  const data = {
    day: d, month: monthNames[m] || "Mai", year: parseInt(y, 10),
    title, info, ort, tag: "Monatlich",
    note: note || null,
    createdAt: serverTimestamp()
  };

  try {
    if (id) {
      await set(ref(db, `termine/${id}`), { ...data });
    } else {
      const newRef = push(ref(db, "termine"));
      await set(newRef, data);
    }
    closeTerminEditor();
  } catch (err) {
    console.error(err);
    alert("Speichern fehlgeschlagen: " + err.message);
  }
}

function inferTerminInfo(isoDate) {
  // Generiert z.B. "1. Donnerstag im Monat" automatisch aus dem Datum
  const d = new Date(isoDate);
  const dayOfMonth = d.getDate();
  const ordinal = Math.ceil(dayOfMonth / 7);
  const ordinals = ["1.", "2.", "3.", "4.", "5."];
  const weekdays = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];
  return `${ordinals[ordinal-1] || ordinal+"."} ${weekdays[d.getDay()]} im Monat`;
}

async function deleteTermin(id) {
  if (!isAdmin || !db) return;
  const t = TERMINE.find(x => x.id === id);
  if (!confirm(`Termin "${t?.title}" am ${t?.day}. ${t?.month} wirklich löschen?`)) return;
  try {
    await remove(ref(db, `termine/${id}`));
  } catch (e) {
    alert("Löschen fehlgeschlagen: " + e.message);
  }
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
    "PRODID:-//DGS Stammtisch HHU//DE",
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

let rsvpsCache = {};
function initRsvpSubscription() {
  if (!db) return;
  onValue(ref(db, "rsvps"), snapshot => {
    const all = snapshot.val() || {};
    const byTermin = {};
    Object.values(all).forEach(r => {
      if (!r || !r.terminId) return;
      (byTermin[r.terminId] ||= []).push(r);
    });
    rsvpsCache = byTermin;
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
  if (!grid) return;

  // Sortieren nach Datum (ISO oder Free-Text egal: ISO geht alphabetisch sauber)
  const sorted = (EVENTS || []).slice().sort((a, b) => (a.iso || "").localeCompare(b.iso || ""));

  const adminToolbar = isAdmin
    ? `<div class="admin-toolbar"><button class="btn btn--primary" id="eventAddBtn">➕ Neues Event</button>${EVENTS.length === 0 ? ' <button class="btn btn--outline" id="eventInitBtn">📥 Initial-Daten laden</button>' : ''}</div>`
    : "";

  if (!sorted.length && !isAdmin) {
    grid.innerHTML = `<p class="termine-empty">Aktuell keine besonderen Events geplant.</p>`;
    return;
  }

  grid.innerHTML = adminToolbar + sorted.map(e => {
    const adminBtns = isAdmin && e.id ? `
      <div class="termin-card__admin">
        <button type="button" class="card-btn" data-action="edit-event" data-id="${e.id}" title="Bearbeiten">✏️</button>
        <button type="button" class="card-btn card-btn--danger" data-action="delete-event" data-id="${e.id}" title="Löschen">🗑️</button>
      </div>` : "";
    return `
    <article class="event-card">
      ${adminBtns}
      <div class="event-card__img" aria-hidden="true">${escapeHtml(e.emoji || "🎉")}</div>
      <div class="event-card__body">
        <p class="event-card__date">${escapeHtml(e.date)}</p>
        <h3>${escapeHtml(e.title)}</h3>
        <p>${escapeHtml(e.desc)}</p>
      </div>
    </article>`;
  }).join("");

  document.getElementById("eventAddBtn")?.addEventListener("click", () => openEventEditor());
  document.getElementById("eventInitBtn")?.addEventListener("click", initialMigrateEvents);

  if (!grid.dataset.bound) {
    grid.dataset.bound = "1";
    grid.addEventListener("click", ev => {
      const editBtn = ev.target.closest('[data-action="edit-event"]');
      if (editBtn) { openEventEditor(editBtn.dataset.id); return; }
      const delBtn = ev.target.closest('[data-action="delete-event"]');
      if (delBtn) { deleteEvent(delBtn.dataset.id); return; }
    });
  }
}

// ── Admin: Events CRUD ─────────────────────────────

function subscribeEvents() {
  if (!db) return;
  onValue(ref(db, "events"), snapshot => {
    const data = snapshot.val();
    if (data && typeof data === "object") {
      EVENTS = Object.entries(data).map(([id, e]) => ({ id, ...e }));
    } else {
      EVENTS = INITIAL_EVENTS.slice();
    }
    renderEvents();
  });
}

async function initialMigrateEvents() {
  if (!isAdmin || !db) return;
  if (!confirm("Initial-Events in Firebase laden? (4 Events werden angelegt)")) return;
  try {
    for (const e of INITIAL_EVENTS) {
      const newRef = push(ref(db, "events"));
      await set(newRef, { ...e, iso: dateToIso(e.date), createdAt: serverTimestamp() });
    }
    alert("Fertig – Events sind jetzt in Firebase und können direkt auf der Website verwaltet werden.");
  } catch (e) {
    alert("Fehler beim Hochladen: " + e.message);
  }
}

function dateToIso(freeText) {
  // Versucht "07. Jun 2026" → "2026-06-07" zu parsen
  const months = { jan:"01", feb:"02", "mär":"03", mar:"03", apr:"04", mai:"05", jun:"06", jul:"07", aug:"08", sep:"09", okt:"10", nov:"11", dez:"12" };
  const m = String(freeText || "").match(/(\d{1,2})\.\s*([a-zäöü]{3})\.?\s*(\d{4})/i);
  if (!m) return "";
  const d = m[1].padStart(2, "0"), mo = months[m[2].toLowerCase()] || "01", y = m[3];
  return `${y}-${mo}-${d}`;
}

function isoToFreeText(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" }).replace(/\.$/, "");
}

function openEventEditor(id = null) {
  const modal = document.getElementById("eventModal");
  if (!modal) return;
  const form = document.getElementById("eventForm");
  form.reset();
  document.getElementById("eventId").value = id || "";
  document.getElementById("eventModalTitle").textContent = id ? "Event bearbeiten" : "Neues Event";

  if (id) {
    const e = EVENTS.find(x => x.id === id);
    if (e) {
      document.getElementById("eventEmoji").value = e.emoji || "";
      document.getElementById("eventDate").value  = e.iso || dateToIso(e.date);
      document.getElementById("eventTitle").value = e.title || "";
      document.getElementById("eventDesc").value  = e.desc || "";
    }
  }
  modal.classList.add("open");
}

function closeEventEditor() {
  document.getElementById("eventModal")?.classList.remove("open");
}

async function saveEventFromForm(ev) {
  ev.preventDefault();
  if (!isAdmin || !db) return;
  const id    = document.getElementById("eventId").value;
  const emoji = document.getElementById("eventEmoji").value.trim() || "🎉";
  const iso   = document.getElementById("eventDate").value;
  const title = document.getElementById("eventTitle").value.trim();
  const desc  = document.getElementById("eventDesc").value.trim();

  if (!iso || !title || !desc) { alert("Datum, Titel und Beschreibung sind Pflicht."); return; }

  const data = {
    emoji, iso, title, desc,
    date: isoToFreeText(iso),
    createdAt: serverTimestamp()
  };

  try {
    if (id) {
      await set(ref(db, `events/${id}`), data);
    } else {
      const newRef = push(ref(db, "events"));
      await set(newRef, data);
    }
    closeEventEditor();
  } catch (err) {
    alert("Speichern fehlgeschlagen: " + err.message);
  }
}

async function deleteEvent(id) {
  if (!isAdmin || !db) return;
  const e = EVENTS.find(x => x.id === id);
  if (!confirm(`Event "${e?.title}" wirklich löschen?`)) return;
  try {
    await remove(ref(db, `events/${id}`));
  } catch (err) {
    alert("Löschen fehlgeschlagen: " + err.message);
  }
}

// ── Treffpunkte (Locations) rendern + CRUD ─────────

function renderTreffpunkte() {
  const grid = document.getElementById("treffpunkteGrid");
  if (!grid) return;

  const sorted = (LOCATIONS || []).slice().sort((a, b) => (a.order || 99) - (b.order || 99));

  const adminToolbar = isAdmin
    ? `<div class="admin-toolbar"><button class="btn btn--primary" id="locationAddBtn">➕ Neuer Treffpunkt</button>${LOCATIONS.length === 0 ? ' <button class="btn btn--outline" id="locationInitBtn">📥 Initial-Daten laden</button>' : ''}</div>`
    : "";

  grid.innerHTML = adminToolbar + sorted.map(l => {
    const adminBtns = isAdmin && l.id ? `
      <div class="termin-card__admin">
        <button type="button" class="card-btn" data-action="edit-location" data-id="${l.id}" title="Bearbeiten">✏️</button>
        <button type="button" class="card-btn card-btn--danger" data-action="delete-location" data-id="${l.id}" title="Löschen">🗑️</button>
      </div>` : "";
    const iconHtml = l.iconFile
      ? `<img class="gmaps__icon gmaps__icon--img" src="icons/${escapeHtml(l.iconFile)}" alt="${escapeHtml(l.name)} Logo" loading="lazy" onerror="this.style.display='none'" />`
      : `<span class="gmaps__icon">${escapeHtml(l.icon || "📍")}</span>`;
    const addrEnc = encodeURIComponent(l.address || l.name);
    return `
    <div class="gmaps__card">
      ${adminBtns}
      <div class="gmaps__header">
        ${iconHtml}
        <div>
          <p class="gmaps__when">${escapeHtml(l.schedule || "")}</p>
          <h3>${escapeHtml(l.name)}</h3>
          <p class="gmaps__address">${escapeHtml(l.address || "")}</p>
        </div>
      </div>
      <div class="gmaps__frame-wrap">
        <iframe src="https://maps.google.com/maps?q=${addrEnc}&output=embed&z=16"
          title="Karte ${escapeHtml(l.name)}" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
      <button type="button" class="gmaps__nav-btn"
        data-address="${escapeHtml(l.address || "")}"
        data-lat="${l.lat || ""}"
        data-lng="${l.lng || ""}"
        data-name="${escapeHtml(l.name)}">🧭 Navigation öffnen</button>
    </div>`;
  }).join("");

  document.getElementById("locationAddBtn")?.addEventListener("click", () => openLocationEditor());
  document.getElementById("locationInitBtn")?.addEventListener("click", initialMigrateLocations);

  if (!grid.dataset.bound) {
    grid.dataset.bound = "1";
    grid.addEventListener("click", e => {
      const editBtn = e.target.closest('[data-action="edit-location"]');
      if (editBtn) { openLocationEditor(editBtn.dataset.id); return; }
      const delBtn = e.target.closest('[data-action="delete-location"]');
      if (delBtn) { deleteLocation(delBtn.dataset.id); return; }
    });
  }
}

function subscribeLocations() {
  if (!db) return;
  onValue(ref(db, "locations"), snapshot => {
    const data = snapshot.val();
    if (data && typeof data === "object") {
      LOCATIONS = Object.entries(data).map(([id, l]) => ({ id, ...l }));
    } else {
      LOCATIONS = INITIAL_LOCATIONS.slice();
    }
    renderTreffpunkte();
  });
}

async function initialMigrateLocations() {
  if (!isAdmin || !db) return;
  if (!confirm("Initial-Treffpunkte in Firebase laden? (5 Stammtische werden angelegt)")) return;
  try {
    for (const l of INITIAL_LOCATIONS) {
      const newRef = push(ref(db, "locations"));
      await set(newRef, { ...l, createdAt: serverTimestamp() });
    }
    alert("Fertig – Treffpunkte sind jetzt in Firebase und können direkt auf der Website verwaltet werden.");
  } catch (e) {
    alert("Fehler beim Hochladen: " + e.message);
  }
}

function openLocationEditor(id = null) {
  const modal = document.getElementById("locationModal");
  if (!modal) return;
  const form = document.getElementById("locationForm");
  form.reset();
  document.getElementById("locationId").value = id || "";
  document.getElementById("locationModalTitle").textContent = id ? "Treffpunkt bearbeiten" : "Neuer Treffpunkt";

  if (id) {
    const l = LOCATIONS.find(x => x.id === id);
    if (l) {
      document.getElementById("locationName").value     = l.name || "";
      document.getElementById("locationSchedule").value = l.schedule || "";
      document.getElementById("locationAddress").value  = l.address || "";
      document.getElementById("locationLat").value      = l.lat || "";
      document.getElementById("locationLng").value      = l.lng || "";
      document.getElementById("locationIconFile").value = l.iconFile || "";
      document.getElementById("locationPhone").value    = l.phone || "";
      document.getElementById("locationWebsite").value  = l.website || "";
      document.getElementById("locationOrder").value    = l.order || (LOCATIONS.length + 1);
    }
  } else {
    document.getElementById("locationOrder").value = LOCATIONS.length + 1;
  }
  modal.classList.add("open");
}

function closeLocationEditor() {
  document.getElementById("locationModal")?.classList.remove("open");
}

async function saveLocationFromForm(e) {
  e.preventDefault();
  if (!isAdmin || !db) return;
  const id = document.getElementById("locationId").value;
  const data = {
    name:     document.getElementById("locationName").value.trim(),
    schedule: document.getElementById("locationSchedule").value.trim(),
    address:  document.getElementById("locationAddress").value.trim(),
    lat:      parseFloat(document.getElementById("locationLat").value) || null,
    lng:      parseFloat(document.getElementById("locationLng").value) || null,
    iconFile: document.getElementById("locationIconFile").value.trim() || null,
    phone:    document.getElementById("locationPhone").value.trim() || null,
    website:  document.getElementById("locationWebsite").value.trim() || null,
    order:    parseInt(document.getElementById("locationOrder").value, 10) || LOCATIONS.length + 1,
    createdAt: serverTimestamp()
  };
  if (!data.name || !data.address) { alert("Name und Adresse sind Pflicht."); return; }

  try {
    if (id) {
      await set(ref(db, `locations/${id}`), data);
    } else {
      const newRef = push(ref(db, "locations"));
      await set(newRef, data);
    }
    closeLocationEditor();
  } catch (err) {
    alert("Speichern fehlgeschlagen: " + err.message);
  }
}

async function deleteLocation(id) {
  if (!isAdmin || !db) return;
  const l = LOCATIONS.find(x => x.id === id);
  if (!confirm(`Treffpunkt "${l?.name}" wirklich löschen?`)) return;
  try {
    await remove(ref(db, `locations/${id}`));
  } catch (err) {
    alert("Löschen fehlgeschlagen: " + err.message);
  }
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
  const mapEl = document.getElementById("map");
  if (!mapEl || typeof L === "undefined") return; // Karten-Sektion entfernt
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

// Holt die öffentliche Telegram-Web-Vorschau – primär über unseren eigenen
// Cloudflare-Worker, dann öffentliche CORS-Proxies als Fallback.
const TELEGRAM_WORKER_URL = "https://white-field-7706.richard-pal22.workers.dev";

async function fetchTelegramHtml() {
  const target = `https://t.me/s/${TELEGRAM_CHANNEL}`;
  const sources = [
    () => `${TELEGRAM_WORKER_URL}/?channel=${TELEGRAM_CHANNEL}`,
    () => `https://corsproxy.io/?url=${encodeURIComponent(target)}`,
    () => `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`,
    () => `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(target)}`
  ];
  for (const make of sources) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch(make(), { signal: ctrl.signal });
      clearTimeout(t);
      if (!res.ok) continue;
      const html = await res.text();
      if (html && html.length > 500 && html.includes("tgme_widget_message")) return html;
    } catch (e) { /* nächste Quelle probieren */ }
  }
  return null;
}

// Service-Message-Filter: "Channel created", "pinned «...»", etc.
function isServiceText(text) {
  if (!text) return false;
  const t = text.trim();
  if (/^channel\s+(was\s+)?created$/i.test(t)) return true;
  if (/pinned\s+[«"„]/.test(t))                return true;
  if (/^pinned\s+a\s+message$/i.test(t))       return true;
  if (/^.*\spinned\s+«[^»]+»\s*$/.test(t))     return true; // "X pinned «Y»"
  if (/^.*\spinned\s+«/.test(t))               return true;
  return false;
}

function parseTelegramHtml(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const wraps = Array.from(doc.querySelectorAll(".tgme_widget_message_wrap"));
  const posts = [];
  const seen  = new Set();

  for (const wrap of wraps) {
    // Service-Wrapper überspringen (Channel created, pin actions, …)
    if (wrap.querySelector(".tgme_widget_message_service")) continue;
    if (wrap.querySelector(".tgme_widget_message_action"))  continue;

    const msg = wrap.querySelector(".tgme_widget_message");
    if (!msg) continue;
    if (msg.classList.contains("service_message"))      continue;
    if (msg.classList.contains("tgme_widget_message_service")) continue;

    const dateA = msg.querySelector(".tgme_widget_message_date");
    const link  = dateA?.getAttribute("href") || `https://t.me/${TELEGRAM_CHANNEL}`;
    if (seen.has(link)) continue;
    seen.add(link);

    const textEl  = msg.querySelector(".tgme_widget_message_text");
    const text    = textEl ? textEl.textContent : "";
    if (isServiceText(text)) continue; // Notfall-Filter über Inhalt

    const timeEl  = msg.querySelector("time[datetime]");
    const photoEl = msg.querySelector(".tgme_widget_message_photo_wrap");
    let photo = null;
    if (photoEl) {
      const style = photoEl.getAttribute("style") || "";
      const m = style.match(/url\(['"]?([^'")]+)['"]?\)/);
      if (m) photo = m[1];
    }
    const videoEl = msg.querySelector("video");
    const video   = videoEl?.getAttribute("src") || null;

    // Posts ohne jeden Inhalt komplett überspringen
    if (!textEl?.innerHTML?.trim() && !photo && !video) continue;

    posts.push({
      html:  textEl ? textEl.innerHTML : "",
      iso:   timeEl?.getAttribute("datetime") || "",
      link,
      photo,
      video
    });
  }
  // Telegram liefert älteste zuerst – wir wollen neueste oben
  return posts.reverse();
}

function postToCard(p) {
  const d = p.iso ? new Date(p.iso) : null;
  const date = d ? d.toLocaleDateString("de-DE", { day:"numeric", month:"long", year:"numeric" }) : "";
  const time = d ? d.toLocaleTimeString("de-DE", { hour:"2-digit", minute:"2-digit" }) : "";
  const media = p.photo
    ? `<img class="news-card__media" src="${p.photo}" alt="" loading="lazy" />`
    : (p.video ? `<video class="news-card__media" src="${p.video}" controls preload="metadata"></video>` : "");
  return `
    <article class="news-card news-card--custom">
      <header class="news-card__head">
        <div class="news-card__avatar" aria-hidden="true">📨</div>
        <div class="news-card__meta">
          <strong>DGS Stammtisch Hamburg &amp; Umgebung</strong>
          <time class="news-card__date">${date}${time ? " · " + time : ""}</time>
        </div>
      </header>
      ${media}
      <div class="news-card__body">${p.html || "<em>(ohne Text)</em>"}</div>
      <a class="news-card__link" href="${p.link}" target="_blank" rel="noopener noreferrer">In Telegram öffnen ↗</a>
    </article>`;
}

async function renderTelegramFeed() {
  const grid = document.getElementById("newsGrid");
  if (!grid) return;
  grid.innerHTML = `<div class="news-loading">📰 Lade Posts aus dem Telegram-Kanal …</div>`;

  // 1. Versuch: t.me/s/<kanal> via CORS-Proxy → ALLE Posts
  const html = await fetchTelegramHtml();
  if (html) {
    const posts = parseTelegramHtml(html).slice(0, 6);
    if (posts.length) {
      grid.innerHTML = posts.map(postToCard).join("");
      return;
    }
  }

  // 2. Fallback: Telegram-Embed-Widget für die manuell hinterlegten Post-IDs
  console.warn("Telegram-Web-Vorschau nicht erreichbar – nutze Embed-Fallback");
  if (!TELEGRAM_POSTS.length) { renderNewsEmpty(grid); return; }
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

function renderNewsEmpty(grid) {
  grid.innerHTML = `<p class="news-empty">Noch keine Posts. <a href="https://t.me/${TELEGRAM_CHANNEL}" target="_blank" rel="noopener">Folge unserem Telegram-Kanal</a> für die ersten News.</p>`;
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
  initImageLightbox();
  setupAuthObserver();
  subscribeTermine();
  subscribeEvents();
  subscribeLocations();
  initAdminUi();
});

// ── Bild-Lightbox (Click-to-Zoom für Telegram-Bilder) ─

function initImageLightbox() {
  const lb     = document.getElementById("imgLightbox");
  const lbImg  = document.getElementById("imgLightboxImg");
  const lbClose= document.getElementById("imgLightboxClose");
  if (!lb || !lbImg) return;

  function open(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || "";
    lb.classList.add("open");
    document.body.style.overflow = "hidden"; // Scroll sperren
  }
  function close() {
    lb.classList.remove("open");
    lbImg.src = "";
    document.body.style.overflow = "";
  }

  // Klicks auf Telegram-Bilder per Event-Delegation
  document.addEventListener("click", e => {
    const media = e.target.closest("img.news-card__media");
    if (media) {
      e.preventDefault();
      e.stopPropagation();
      open(media.src, media.alt);
      return;
    }
    if (e.target === lb || e.target === lbClose || e.target.closest(".img-lightbox__close")) {
      close();
    }
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && lb.classList.contains("open")) close();
  });
}

// ── Admin-UI (Login + Termin-Editor) ─────────────────

function initAdminUi() {
  // FAB
  const fab = document.getElementById("adminFab");
  fab?.addEventListener("click", () => {
    if (isAdmin) {
      if (confirm("Admin-Modus beenden (ausloggen)?")) adminLogout();
    } else {
      document.getElementById("adminLoginModal")?.classList.add("open");
      setTimeout(() => document.getElementById("adminPasswordInput")?.focus(), 50);
    }
  });

  // Login-Modal
  const loginModal = document.getElementById("adminLoginModal");
  document.getElementById("adminLoginClose")?.addEventListener("click", () => loginModal?.classList.remove("open"));
  document.getElementById("adminLoginForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const pw = document.getElementById("adminPasswordInput").value;
    const errEl = document.getElementById("adminLoginError");
    errEl.textContent = "Login läuft …";
    const res = await adminLogin(pw);
    if (res.ok) {
      loginModal?.classList.remove("open");
      errEl.textContent = "";
      document.getElementById("adminPasswordInput").value = "";
    } else {
      errEl.textContent = "❌ " + res.error;
    }
  });

  // Termin-Modal
  const tModal = document.getElementById("terminModal");
  document.getElementById("terminClose")?.addEventListener("click", closeTerminEditor);
  document.getElementById("terminCancel")?.addEventListener("click", closeTerminEditor);
  document.getElementById("terminForm")?.addEventListener("submit", saveTerminFromForm);
  tModal?.addEventListener("click", e => { if (e.target === tModal) closeTerminEditor(); });

  // Event-Modal
  const eModal = document.getElementById("eventModal");
  document.getElementById("eventClose")?.addEventListener("click", closeEventEditor);
  document.getElementById("eventCancel")?.addEventListener("click", closeEventEditor);
  document.getElementById("eventForm")?.addEventListener("submit", saveEventFromForm);
  eModal?.addEventListener("click", e => { if (e.target === eModal) closeEventEditor(); });

  // Location-Modal
  const lModal = document.getElementById("locationModal");
  document.getElementById("locationClose")?.addEventListener("click", closeLocationEditor);
  document.getElementById("locationCancel")?.addEventListener("click", closeLocationEditor);
  document.getElementById("locationForm")?.addEventListener("submit", saveLocationFromForm);
  lModal?.addEventListener("click", e => { if (e.target === lModal) closeLocationEditor(); });

  updateAdminFab();
}

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
