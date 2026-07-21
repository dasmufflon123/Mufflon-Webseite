/* ============================================================
   DIE PFLANZE — Ausgaben-Datenbank
   ============================================================
   Hier trägst du jede neue Ausgabe ein. Das ist die EINZIGE
   Datei, die du für neue Ausgaben bearbeiten musst — sowohl
   die Archiv-Seite als auch die Opfanze-Seite (die dort immer
   die neueste Ausgabe zeigt) lesen automatisch aus dieser Liste.

   SO FÜGST DU EINE NEUE AUSGABE HINZU:
   Kopiere einen Eintrag, füge ihn GANZ OBEN in die Liste ein
   (neueste zuerst) und passe die Werte an:

   {
     nummer: 12,                          // fortlaufende Ausgaben-Nummer
     datum: "2026-07-09",                 // Format: JJJJ-MM-TT
     titel: "Ausgabe 12",                 // frei wählbarer Titel
     teil1_label: "Titelseite",           // Beschriftung für PDF 1
     teil1_url: "https://.../datei1.pdf", // Link zu PDF 1 (später aus Cloudflare R2)
     teil2_label: "Innenseiten",          // Beschriftung für PDF 2
     teil2_url: "https://.../datei2.pdf"  // Link zu PDF 2
   }

   Sobald Cloudflare R2 eingerichtet ist, ersetzt du die
   Platzhalter-Links unten durch die echten R2-Links.
   ============================================================ */

const PFLANZE_AUSGABEN = [
  {
    nummer: 3,
    datum: "2026-07-08",
    titel: "Ausgabe 3 — Beispiel",
    teil1_label: "Titelseite",
    teil1_url: "#",
    teil2_label: "Innenseiten",
    teil2_url: "#"
  },
  {
    nummer: 2,
    datum: "2026-07-06",
    titel: "Ausgabe 2 — Beispiel",
    teil1_label: "Titelseite",
    teil1_url: "#",
    teil2_label: "Innenseiten",
    teil2_url: "#"
  },
  {
    nummer: 1,
    datum: "2026-07-04",
    titel: "Ausgabe 1 — Beispiel",
    teil1_label: "Titelseite",
    teil1_url: "#",
    teil2_label: "Innenseiten",
    teil2_url: "#"
  }
];

// Hilfsfunktion: Datum hübsch auf Deutsch formatieren
function formatiereDatum(isoDatum) {
  const monate = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  const [jahr, monat, tag] = isoDatum.split("-").map(Number);
  return `${tag}. ${monate[monat - 1]} ${jahr}`;
}
