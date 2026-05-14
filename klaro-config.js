/* ===================================================
   Klaro Consent-Manager – Konfiguration
   Dokumentation: https://heyklaro.com/docs
   =================================================== */

window.klaroConfig = {
  version: 1,
  elementID: 'klaro',
  styling: { theme: ['light', 'top', 'wide'] },
  noAutoLoad: false,
  htmlTexts: true,
  embedded: false,
  groupByPurpose: true,
  storageMethod: 'cookie',
  cookieName: 'dgs-klaro',
  cookieExpiresAfterDays: 365,
  default: false,           // Nichts ist standardmäßig aktiv (opt-in)
  mustConsent: false,       // Banner kann mit X geschlossen werden
  acceptAll: true,          // "Alle akzeptieren"-Button anzeigen
  hideDeclineAll: false,    // "Alle ablehnen"-Button anzeigen
  hideLearnMore: false,
  noticeAsModal: false,     // unten als Banner, nicht als Vollbild

  translations: {
    de: {
      privacyPolicyUrl: 'datenschutz.html',
      consentNotice: {
        title: '🍪 Datenschutz-Einstellungen',
        description: 'Wir nutzen einige Dienste von Drittanbietern (Google Maps, Instagram, Telegram), die deine Daten verarbeiten könnten. Du kannst frei entscheiden, was du erlauben möchtest. Mehr Infos in der {privacyPolicy}.',
        learnMore: 'Einstellungen anzeigen',
        privacyPolicy: { name: 'Datenschutzerklärung' }
      },
      consentModal: {
        title: '🛡️ Datenschutz-Einstellungen',
        description: 'Hier kannst du auswählen, welche Drittanbieter-Dienste du auf dieser Website zulassen möchtest. Deine Auswahl wird ein Jahr lang in einem Cookie gespeichert. Du kannst die Einstellung jederzeit über den Link „Cookie-Einstellungen" im Footer ändern.'
      },
      acceptAll: 'Alle akzeptieren',
      acceptSelected: 'Auswahl speichern',
      decline: 'Alle ablehnen',
      ok: 'OK',
      close: 'Schließen',
      poweredBy: 'Konsens-Manager: Klaro!',
      purposes: {
        external_content: { title: 'Externe Inhalte', description: 'Eingebettete Inhalte von Drittanbietern (Karten, Bilder, Posts).' }
      },

      googlemaps: {
        title: 'Google Maps',
        description: 'Karten-Vorschau der fünf Stammtisch-Treffpunkte. Beim Aktivieren wird deine IP-Adresse an Google (USA) übertragen.'
      },
      instagram: {
        title: 'Instagram (Behold-Widget)',
        description: 'Galerie-Feed mit Bildern unserer Treffen. Beim Aktivieren werden Daten an Behold und Instagram (Meta, USA) übertragen.'
      }
    }
  },

  services: [
    {
      name: 'googlemaps',
      purposes: ['external_content'],
      required: false,
      optOut: false,
      onlyOnce: false,
      cookies: []
    },
    {
      name: 'instagram',
      purposes: ['external_content'],
      required: false,
      optOut: false,
      onlyOnce: false,
      cookies: []
    }
  ]
};

// "Cookie-Einstellungen"-Link im Footer wieder-öffnet das Modal
document.addEventListener('DOMContentLoaded', () => {
  const link = document.getElementById('openConsentManager');
  if (link) {
    link.addEventListener('click', e => {
      e.preventDefault();
      if (window.klaro) window.klaro.show();
    });
  }
});
