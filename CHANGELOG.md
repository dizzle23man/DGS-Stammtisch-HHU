# 📜 Patch Notes — DGS Stammtisch HHU

> *Die komplette Update-Historie unserer Community-Plattform.*

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
