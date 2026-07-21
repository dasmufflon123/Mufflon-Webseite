/* ============================================================
   OPFANZE — Kiosk-Datenbank
   ============================================================
   Hier trägst du ALLE Ausgaben ein.
   
   SO FÜGST DU EINE NEUE AUSGABE HINZU:
   Kopiere einen Eintrag, füge ihn GANZ OBEN in die Liste ein
   (neueste zuerst) und passe die Werte an:

   {
     typ: "Extrablatt",            // "Extrablatt" oder "Eventblatt"
     nummer: "086",                // Ausgabenummer (als String, für die Anzeige)
     titel: "Das Mufflon macht Dinge",
     datum: "2026-07-17",          // Format: JJJJ-MM-TT
     pfad: "assets/Opfanze_assets/Extrablatt 2/Extrablatt, 086, Das Mufflon macht Dinge, 20260717.pdf"
   }

   TIP: Die neueste Ausgabe sollte GANZ OBEN stehen!
   ============================================================ */

const OPFANZE_AUSGABEN = [
  // ============================================================
  // NEUSTE AUSGABEN (hier nach unten einfügen)
  // ============================================================
  
  // --- Extrablätter ---
  {
    typ: "Extrablatt",
    nummer: "086",
    titel: "Das Mufflon macht Dinge",
    datum: "2026-07-17",
    pfad: "assets/Opfanze_assets/Extrablatt 2/Extrablatt, 086, Das Mufflon macht Dinge, 20260717.pdf"
  },
  {
    typ: "Extrablatt",
    nummer: "085",
    titel: "Mufflon auf dem elektrischen Stuhl",
    datum: "2026-07-10",
    pfad: "assets/Opfanze_assets/Extrablatt 2/Extrablatt, 085, Mufflon auf dem elektrischen Stuhl, 20260710.pdf"
  },
  
  // --- Eventblätter ---
  {
    typ: "Eventblatt",
    nummer: "052",
    titel: "Hufgames 2026",
    datum: "2026-05-03",
    pfad: "assets/Opfanze_assets/Eventblatt/Eventblatt, 052, Hufgames 2026, 20260503.pdf"
  },
  {
    typ: "Eventblatt",
    nummer: "032",
    titel: "2 Jahre Das Mufflon auf Twitch",
    datum: "2026-04-14",
    pfad: "assets/Opfanze_assets/Eventblatt/Eventblatt, 032, 2 Jahre Das Mufflon auf Twitch, 20260414.pdf"
  },

  // ============================================================
  // WEITERE AUSGABEN (füge hier deine bestehenden Ausgaben ein)
  // ============================================================
  // ... weitere Einträge hier ...
];

// ------------------------------------------------------------
// HILFSFUNKTIONEN (nicht ändern!)
// ------------------------------------------------------------

function formatiereDatum(isoDatum) {
  const monate = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  const [jahr, monat, tag] = isoDatum.split("-").map(Number);
  return `${tag}. ${monate[monat - 1]} ${jahr}`;
}

function getOrdnerFuerTyp(typ) {
  if (typ === "Extrablatt") return "Extrablatt 2";
  if (typ === "Eventblatt") return "Eventblatt";
  return "";
}
