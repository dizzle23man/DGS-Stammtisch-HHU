# 📜 Patch Notes — DGS Stammtisch HHU

> *Die komplette Update-Historie unserer Community-Plattform.*

---

## 🎉 v4.5 — „Aufgeräumter Strukturumbau"
> 🧹 Doppelte Menüs raus · 🎮 Memory funktioniert endlich · 📜 OSM-Datenschutz

### 🛠️ Improvements
- **Top-Navigation entfernt** — nur noch die Tab-Bar als Hauptnavigation (keine doppelten Menüs mehr)
- **Hero-Buttons** „Nächste Termine" / „Treffpunkte ansehen" entfernt (Tab-Bar reicht)
- **Burger-Menü** ausgeblendet
- **Tab-Bar zentriert** unter dem Logo (auf Desktop, Mobile bleibt scrollbar)
- **Termine und Events getrennt** — jetzt zwei eigene Tabs statt einem zusammen
- **Memory-Karten** sind jetzt **deutlich größer** (max 640px Brett)

### 🐛 Bug Fixes
- **🎮 Memory-Spiel:** komplett umgebaut von 3D-Rotation auf **Opacity-Fade** — funktioniert jetzt zuverlässig auf allen Browsern (kein Flip-Bug mehr)
- `pointer-events: none` auf Karten-Faces, damit Klicks immer am Button ankommen

### 🔒 Datenschutz
- **OpenStreetMap-Abschnitt** in `datenschutz.html` ergänzt (jetzt nutzt die Karte OSM-Tiles statt Google Maps)
- Alter Google-Maps-Embed-Abschnitt durch kürzeren **„Externe Navigation"-Hinweis** ersetzt (da Google Maps nur noch als Link in der Navi-Auswahl auftaucht, kein Embed mehr)
- **Klaro:** googlemaps-Service entfernt (kein Embed mehr), nur Instagram bleibt opt-in

---

## 🎉 v4.4 — „Großer Strukturumbau"
> 🗺️ Eine Karte für alle · 📑 Tabs statt endlosem Scroll · 🎮 Memory repariert

### 🆕 New Features
- **🗺️ Eine große Karte mit allen Pins** — statt 5 einzelner Google-Maps-Karten gibt's jetzt **eine** schicke Übersichtskarte mit OpenStreetMap (via Leaflet), allen 5 Treffpunkten als Custom-SVG-Pins
- **🏷️ Pin-Labels** — Name des Treffpunkts schwebt immer über dem Pin (gold-blau im Branding)
- **💬 Pin-Tooltip** — Hover (Desktop) / Lange-Tippen (Mobile) zeigt „Klick/Tippe mich für Navigation"
- **🎚️ Slide-Up-Nav-Modal** — Auswahl Google Maps / Apple / Waze / Citymapper kommt jetzt **von unten als Rollo** rein (Mobile)
- **📑 Tab-Navigation** — Seite ist in 5 Tabs unterteilt: 📍 Treffpunkte · 📅 Termine · 📸 Galerie · 🎓 Lernen · 📧 Kontakt
- **🔗 Hash-Sync** — Tabs sind per URL ansteuerbar (`#galerie`, `#lernen` …) und werden geteilt-freundlich gemerkt

### 🛠️ Improvements
- **Sticky Tab-Bar** unter dem Hero — bleibt beim Scrollen oben
- Tab-Wechsel mit sanfter Fade-Animation
- Nav + Footer-Links jetzt mit Tab-System verbunden

### 🐛 Bug Fixes
- **🎮 Memory-Spiel:**
  - Karten-Flip-Animation funktioniert jetzt zuverlässig (3D-Transform robuster)
  - **Timer startet jetzt erst bei der ersten umgedrehten Karte** (vorher direkt beim Laden)
  - Doppel-Klick-Schutz während Karten-Vergleich
  - Match-Animation entfernt die störende `rotateY`-Konflikt-Animation
- **🗓️ Termin korrigiert:** Lim's Buchholz war 15. Mai eingetragen — korrekt ist der **22. Mai 2026** (3. Freitag im Monat fällt diesen Monat anders, Christi Himmelfahrt-Brücken-Effekt)
- **Service Worker** ignoriert jetzt `chrome-extension://` URLs (keine Cache-Fehler mehr in der Console)

### 📐 Technische Details
- Leaflet 1.9.4 + OpenStreetMap-Tiles wieder integriert (kostenlos, kein API-Key)
- Custom `L.divIcon` für die Pins mit eingebettetem SVG
- `mapInstance.fitBounds()` zoomt automatisch auf alle Standorte
- Tab-Panels nutzen `display: none/block` + CSS-Animation

---

## 🎉 v4.3 — „Soft-Launch-Schutz"
> 🚧 Under-Construction-Banner · 🍪 Klaro-Bug behoben · 🤖 Suchmaschinen-Sperre

### 🆕 New Features
- **⚠️ Under-Construction-Banner** ganz oben — gelb mit schwarzen Diagonalstreifen (klassischer Warntape-Look)
- **🤖 robots.txt** + `<meta name="robots" content="noindex,nofollow">` — Suchmaschinen blockiert während Soft-Launch
- **📋 CHANGELOG.md** als gamifierte Update-Historie

### 🐛 Bug Fixes
- **🍪 Klaro-Consent-Bug:** Maps lädt jetzt automatisch beim Reload, wenn der User vorher zugestimmt hat (vorher musste man manuell die Cookie-Einstellungen neu speichern)
- **Service Worker:** `chrome-extension://`-Requests werden nicht mehr versucht zu cachen
- Dreifache Klaro-Erkennung: API → Cookie → localStorage (robuster)

### 🛠️ Improvements
- Klaro-Reapply mehrmals nach Page-Load (300ms, 1.5s, 4s) als Sicherheitsnetz
- Console-Logs für Debugging des Consent-Status

---

## 🎉 v4.2 — „Rechtssicher-Update"
> 🛡️ **DSGVO-Konformität + Impressum + Consent-Banner**

### 🆕 New Features
- **📜 Impressum-Seite** (`impressum.html`) — Pflicht nach §5 DDG, Privatperson als Verantwortlicher
- **🔐 Datenschutzerklärung** (`datenschutz.html`) — alle Drittanbieter (Firebase, Google Maps, Cloudflare, Behold, Telegram, Open-Meteo) ordentlich aufgeführt
- **🍪 Klaro Consent-Manager** — Cookie-Banner unten, Nutzer entscheidet selbst über externe Inhalte
  - Google Maps lädt erst nach Zustimmung
  - Instagram-Feed (Behold) lädt erst nach Zustimmung
- **Footer-Erweiterung** — Links auf Impressum, Datenschutz, Cookie-Einstellungen

### 🛠️ Improvements
- **Admin-E-Mail** geändert: `admin@dgs-stammtisch-hhu.de` → `dgs.stammtisch_hhu@proton.me` (echte Proton-Mail)
- **Kontakt-E-Mail** auf der Website ebenfalls auf Proton-Adresse aktualisiert
- **Google-Maps-Iframes** nutzen `data-src` statt `src` (Klaro-kompatibel)
- **Behold-Widget** als Klaro-Service registriert

### 📝 Verbleibende To-Dos
- [ ] AVVs bei Google Cloud + Cloudflare formell „akzeptieren" (1 Klick)
- [ ] Eigene Adresse in `impressum.html` / `datenschutz.html` ggf. anpassen, falls Umzug

### ✅ Erledigt in diesem Update
- ✅ Echtes Impressum mit Richard-Raul Pal (Wulffsblöcken 12, 22419 Hamburg) eingebaut
- ✅ Vollständige Datenschutzerklärung mit allen 8 Diensten (Firebase, Cloudflare, Behold, Telegram, Open-Meteo, Klaro, Google Fonts, Google Maps)
- ✅ Klaro Consent-Banner aktiv – blockiert Google Maps + Instagram bis zur Zustimmung
- ✅ Admin-E-Mail auf `dgs.stammtisch_hhu@proton.me` umgestellt

---

## 🎉 v4.1 — „Fort Knox Edition"
> 🔒 **Security-Patch + Polish**

### 🔒 Security
- **Admin-E-Mail-Verification** — Login prüft jetzt nicht nur, ob jemand bei Firebase angemeldet ist, sondern auch, ob die E-Mail exakt der Admin-Adresse entspricht. Kein Schmu mit Fremd-Accounts mehr.

### 🐛 Bug Fixes
- **Instagram-Link** im Kontaktbereich zeigt jetzt auf den **echten Account** `@dgs_stammtisch_hhu` (vorher nur Platzhalter `#`)
- **Treffpunkt-Karten auf sehr schmalen Displays** (< 320 px) — Grid-Layout angepasst (`minmax(min(100%, 320px), 1fr)`), Karten skalieren jetzt sauber bis 100 % Breite, kein horizontales Überlaufen mehr auf Mini-Smartphones

---

## 🎉 v4.0 — „Lernen & Spielen Update"
> 🆕 5 neue Widgets, Sektion „Lernen & Spielen" hinzugefügt

### 🆕 New Features
- **🌤️ Wetter-Widget** im Hero — Aktuelles Hamburg-Wetter via Open-Meteo, lädt automatisch
- **🤟 DGS-Wort des Tages** — 30 Wörter rotieren täglich, direkter Sprung zu Spreadthesign-Videos
- **🎮 DGS-Memory-Spiel** — 4×3 Karten mit Hand-Emoji-Paaren, mit Zug- und Zeit-Counter
- **✋ Live Check-in** — Auf der heutigen Termin-Karte erscheint „Bin gerade da!"-Button. Sieht alle, die aktuell vor Ort sind. Verfällt nach 4 Stunden.
- **📚 DGS-Lern-Empfehlungen** — 8 Karten mit kuratierten Ressourcen (SignDict, Spreadthesign, Manimundo, VHS, Gehörlosenverband, …)

### 🛠️ Improvements
- Neue Sektion **„Lernen"** im Menü zwischen Galerie und Kontakt
- Alle Widgets dark-mode-ready

### 🐛 Bug Fixes
- Manimundo-YouTube-URL korrigiert (`@manimundogmbh6507`)

---

## 🎉 v3.4 — „HHU Rebrand"

### 🛠️ Improvements
- App-Titel geändert: `DGS Stammtisch HH` → **`DGS Stammtisch HHU`**
- Konsistent in Navigation, PWA-Manifest, iOS-Homescreen-Title und Kalender-Export

---

## 🎉 v3.3 — „Foto-Vorschau Edition"

### 🆕 New Features
- **🔍 Click-to-Zoom Lightbox** — Bilder im Telegram-Feed lassen sich anklicken und im Vollbild-Overlay anzeigen. Schließen via ESC, Klick außerhalb oder ✕-Button.

---

## 🎉 v3.2 — „Logo-Update"

### 🛠️ Improvements
- Treffpunkt-Karten zeigen jetzt **echte Café-Logos** statt Emoji-Piktogramme
- AI-generierte Icons für: Markt König 🥩 · Peacetanbul 🕊️ · Villa im Park 🏛️ · Lim's 🎸 · Schachcafé ♟️
- Ladenameter & Lazy-Loading für die Bilder

---

## 🎉 v3.1 — „Admin-CMS Phase 2"
> 🆕 Vollständiges Content-Management

### 🆕 New Features
- **Events-CRUD** — ➕ Neues Event · ✏️ bearbeiten · 🗑️ löschen direkt auf der Website
- **Treffpunkte-CRUD** — Komplett dynamisch aus Firebase: Name, Adresse, Koordinaten, Logo, Telefon, Website, Reihenfolge
- **Initial-Migration-Buttons** — Ein Klick lädt die Stammdaten in Firebase

---

## 🎉 v3.0 — „Admin-CMS Phase 1"
> 🆕 Admin können jetzt Termine direkt auf der Website pflegen

### 🆕 New Features
- **🔐 Admin-Login** (Firebase Auth) — Floating-Button unten rechts
- **➕ Neuer Termin** — direkt aus dem Admin-Modus, mit Datum-Picker und Treffpunkt-Dropdown
- **Sondertermine** — eigener „Custom"-Treffpunkt für 5.-Donnerstag-Sonderaktionen
- **Live-Sync** — Speichern → erscheint sofort für alle Besucher, ohne Code-Änderung
- **Admin-Toolbar** in Termine-Sektion mit ➕-Button & Initial-Migration

### 🛠️ Improvements
- Vergangene Termine werden automatisch ausgeblendet (1 Tag Karenz)
- Termine landen sortiert nach Datum

---

## 🎉 v2.4 — „Insta-Feed Update"

### 🆕 New Features
- **📸 Instagram-Galerie** via Behold-Widget — letzte Posts erscheinen automatisch in der Galerie-Sektion

### 🐛 Bug Fixes
- LightWidget durch Behold ersetzt (LightWidget-Free-Tier unterstützt kein HTTPS)
- LightWidget-Watermark-Fix

---

## 🎉 v2.3 — „Aktuelles Update"
> 🆕 Telegram-News auf der Website

### 🆕 New Features
- **📰 „Aktuelles"-Sektion** — letzte 6 Posts aus dem Telegram-Kanal automatisch eingeblendet
- **Eigener Cloudflare Worker** als zuverlässige Brücke zwischen Telegram und Website (öffentliche Proxies waren zu flaky)
- **Telegram-Channel-Button** im Kontakt-Bereich

### 🛠️ Improvements
- Single-Column-Layout für News-Feed (besser lesbar als Grid)
- Service-Messages („Channel created", „pinned X") werden automatisch gefiltert
- Bilder/Videos aus Posts werden inline angezeigt
- Theme-aware: Posts passen sich Dark/Light-Mode an

---

## 🎉 v2.2 — „Navi-Picker Update"

### 🆕 New Features
- **🧭 Navigation öffnen**-Button auf jeder Treffpunkt-Karte
- **App-Picker-Modal** mit 4 Optionen: Google Maps, Apple Karten, Waze, Citymapper
- Adresse wird automatisch in der gewählten App vorausgefüllt

### 🛠️ Improvements
- Doppel-Button-Layout entfernt (Karte + Route waren redundant)
- MOIA-Recherche durchgeführt: keine öffentliche Deep-Link-API → Citymapper als beste Alternative

---

## 🎉 v2.1 — „RSVP Polish Update"

### 🆕 New Features
- **📅 Kalender-Export** — Bei Zusage erscheint Button „In Kalender eintragen" → erzeugt `.ics`-Datei (iOS Calendar / Google Calendar / Outlook kompatibel)

### 🛠️ Improvements
- **Touch-Tooltip** — Klick auf Live-Zähler zeigt Namen darunter (vorher nur Hover, ging auf Mobile nicht)
- **Auswahl-Aufheben** — Nochmal auf den aktiven Button → Stimme wird gelöscht
- Buttons-Layout: Emoji oben + Label drunter (passt in jede Karten-Breite)
- „Monatlich"-Tag entfernt (war redundant)

### 🐛 Bug Fixes
- Service-Worker Cache-First → Network-First für HTML/JS/CSS, damit Updates sofort durchschlagen
- Karte-Sektion entfernt (war Doppelgemoppel zu Treffpunkten)

---

## 🎉 v2.0 — „RSVP-System"
> 🆕 Anmeldung pro Termin

### 🆕 New Features
- **✅ / 🤔 / ❌ Buttons** auf jeder Termin-Karte — anonym, ohne Konto
- **Live-Counter** — alle sehen sofort, wer kommt
- **Name wird einmalig gefragt** und im Browser gespeichert (fühlt sich automatisch an)
- **Firebase Realtime DB** als Backend (kostenlos)

---

## 🎉 v1.3 — „Community Update"

### 🆕 New Features
- **👋 Admin-Team** in Kontakt-Sektion — 5 Personen mit kreisförmigen Avataren in unterschiedlichen Farben
- **WhatsApp-Channel-Button** im Kontakt-Bereich
- **Footer mit Logo** und Admin-Team-Erwähnung

---

## 🎉 v1.2 — „Branding-Update"

### 🛠️ Improvements
- **Echtes Logo** in Hero (groß), Navigation und Footer
- **Farbpalette** angepasst: Marineblau + Gold (passend zum Logo)
- **Section-Titel** mit goldener Akzent-Unterstrich-Linie
- **Hero** mit goldenem Glow-Hintergrund und sanfter Schwebe-Animation am Logo
- **Theme-Color** im PWA-Manifest auf Marineblau

### 🎨 Visual
- Section-Hintergründe weicher
- Hover-Effekte auf Karten
- Schatten in Markenfarbe (Gold-Glow)

---

## 🎉 v1.1 — „PWA-Polish"

### 🐛 Bug Fixes
- **PWA-Installation auf Android Chrome** funktionierte nicht → echte PNG-Icons (192×192, 512×512) im Manifest hinzugefügt (SVGs allein reichen nicht)
- App-Icon-Generator-Workflow über realfavicongenerator.net etabliert

### 🛠️ Improvements
- Service Worker registrierte sich nicht zuverlässig → Cache-Strategie überarbeitet
- Service-Worker-Versions-Bumps für jedes Update

---

## 🎉 v1.0 — „Public Launch"

### 🆕 New Features
- **Vollständige Treffpunkt-Adressen**: Markt König (Rindermarkthalle), Peacetanbul, Villa im Park, Lim's Buchholz, Barmbeker Schachcafé
- **Google Maps Iframes** auf jeder Treffpunkt-Karte
- **PWA-Manifest** für „Zum Homescreen hinzufügen"
- **Service Worker** für Offline-Zugriff
- **Deployment auf GitHub Pages** mit eigener URL

---

## 🎉 v0.2 — „Dark Mode"

### 🆕 New Features
- **🌙 Dark/Light-Mode-Toggle** in der Navigation
- Auto-Erkennung der System-Präferenz (`prefers-color-scheme`)
- Choice-Speicherung in `localStorage`
- Komplett-Anpassung aller Elemente (Karten, Hero, Galerie, Kontakt)

---

## 🎉 v0.1 — „Initial Release"

### 🆕 New Features
- Hero-Sektion mit Call-to-Action
- **Termine** (statisch, hardcoded)
- **Events** (Workshops, Filmabende, Ausflüge)
- **Galerie** mit Platzhalter-Kacheln
- **Kontakt-Formular**
- Responsive Mobile-Layout

---

## 🔮 Coming Soon (mögliche zukünftige Updates)

- 🔔 **Web Push Notifications** — Erinnerung 1 Tag vor Stammtisch
- 📊 **Statistik-Dashboard** im Admin-Bereich
- 🎂 **Geburtstags-Kalender** für Mitglieder
- 🎈 **Balloon-Animation** beim erfolgreichen Memory-Win
- 🏆 **Achievement-Badges** für aktive Mitglieder
- 📷 **Direkt-Foto-Upload** zur Galerie (statt nur Insta-Embed)
- 🌐 **TWA für Google Play Store** (25 € einmalig)

---

> **Made with 👋 by the DGS Stammtisch HHU Admin-Team**
> *Rainer · Merle · Hannes · Richard · Stephan*
