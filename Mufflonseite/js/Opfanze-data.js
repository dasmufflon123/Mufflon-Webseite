/* ============================================================
   OPFANZE — Kiosk-Datenbank
   ============================================================
   Hier sind ALLE Ausgaben eingetragen.
   Die Sortierung erfolgt automatisch nach der Nummer (höchste zuerst).
   ============================================================ */

const OPFANZE_AUSGABEN = [
  // ============================================================
  // EVENTBLÄTTER
  // ============================================================
  {
    typ: "Eventblatt",
    nummer: "112026",
    titel: "Der Sommerhit der Commähnity wurde gefunden",
    datum: "2026-07-12",
    pfad: "assets/Opfanze_assets/Eventblatt/Eventblatt, 112026, Der Sommerhit der Commähnity wurde gefunden, 20260712.pdf"
  },
  {
    typ: "Eventblatt",
    nummer: "102026",
    titel: "Sommerhit-Songbattle",
    datum: "2026-07-02",
    pfad: "assets/Opfanze_assets/Eventblatt/Eventblatt, 102026, Sommerhit-Songbattle, 20260702.pdf"
  },
  {
    typ: "Eventblatt",
    nummer: "092026",
    titel: "Schock-Absage beim GOAT-Clash 3",
    datum: "2026-06-28",
    pfad: "assets/Opfanze_assets/Eventblatt/Eventblatt, 092026, Schock-Absage beim GOAT-Clash 3, 20260628.pdf"
  },
  {
    typ: "Eventblatt",
    nummer: "082026",
    titel: "Letzte Chance auf Ruhm und Ehre",
    datum: "2026-06-25",
    pfad: "assets/Opfanze_assets/Eventblatt/Eventblatt, 082026, Letzte Chance auf Ruhm und Ehre, 20260625.pdf"
  },
  {
    typ: "Eventblatt",
    nummer: "072026",
    titel: "Der Mäh Ess Zeh",
    datum: "2026-06-11",
    pfad: "assets/Opfanze_assets/Eventblatt/Eventblatt, 072026, Der Mäh Ess Zeh, 20260611.pdf"
  },
  {
    typ: "Eventblatt",
    nummer: "062026",
    titel: "Sieger der Hufgames 2026",
    datum: "2026-05-31",
    pfad: "assets/Opfanze_assets/Eventblatt/Eventblatt, 062026, Sieger der Hufgames 2026, 20260531.pdf"
  },
  {
    typ: "Eventblatt",
    nummer: "052026",
    titel: "Hufgames 2026",
    datum: "2026-05-03",
    pfad: "assets/Opfanze_assets/Eventblatt/Eventblatt, 052026, Hufgames 2026, 20260503.pdf"
  },
  {
    typ: "Eventblatt",
    nummer: "042026",
    titel: "Huf-Beben und Musik-Drama am zweiten Streamgeburtstag",
    datum: "2026-04-23",
    pfad: "assets/Opfanze_assets/Eventblatt/Eventblatt, 042026, Huf-Beben und Musik-Drama am zweiten Streamgeburtstag, 20260423.pdf"
  },
  {
    typ: "Eventblatt",
    nummer: "032026",
    titel: "2 Jahre Das Mufflon auf Twitch",
    datum: "2026-04-14",
    pfad: "assets/Opfanze_assets/Eventblatt/Eventblatt, 032026, 2 Jahre Das Mufflon auf Twitch, 20260414.pdf"
  },
  {
    typ: "Eventblatt",
    nummer: "022026",
    titel: "Skandal beim Mufflongeburtstag",
    datum: "2026-04-07",
    pfad: "assets/Opfanze_assets/Eventblatt/Eventblatt, 022026, Skandal beim Mufflongeburtstag, 20260407.pdf"
  },
  {
    typ: "Eventblatt",
    nummer: "012026",
    titel: "Mufflon zerrt ihre Herde vor das Geburtstagsgericht",
    datum: "2026-03-29",
    pfad: "assets/Opfanze_assets/Eventblatt/Eventblatt, 012026, Mufflon zerrt ihre Herde vor das Geburtstagsgericht, 20260329.pdf"
  },

  // ============================================================
  // EXTRA-BLÄTTER
  // ============================================================
  {
    typ: "Extrablatt",
    nummer: "00592026",
    titel: "Käferplage und rollende Steine beim Mufflon",
    datum: "2026-04-25",
    pfad: "assets/Opfanze_assets/Extrablast 2/Extrablast, 00592026, Käferplage und rollende Steine beim Mufflon, 20260425.pdf"
  },
  {
    typ: "Extrablatt",
    nummer: "037206",
    titel: "Raub und Zerstörung in der neuen Welt",
    datum: "2026-03-07",
    pfad: "assets/Opfanze_assets/Extrablast 2/Extrablast, 037206, Raub und Zerstörung in der neuen Welt, 20260307.pdf"
  },
  {
    typ: "Extrablatt",
    nummer: "036206",
    titel: "Alles brennt",
    datum: "2026-03-06",
    pfad: "assets/Opfanze_assets/Extrablast 2/Extrablast, 036206, Alles brennt, 20260306.pdf"
  },
  {
    typ: "Extrablatt",
    nummer: "035206",
    titel: "Capybara-Mishandlung auf Ferieninsel",
    datum: "2026-03-05",
    pfad: "assets/Opfanze_assets/Extrablast 2/Extrablast, 035206, CapybaraMishandlung auf Ferieninsel, 20260305.pdf"
  },
  {
    typ: "Extrablatt",
    nummer: "034206",
    titel: "Alpaka-Adoption",
    datum: "2026-03-03",
    pfad: "assets/Opfanze_assets/Extrablast 2/Extrablast, 034206, Alpaka-Adoption, 20260303.pdf"
  },
  {
    typ: "Extrablatt",
    nummer: "032206",
    titel: "Horror-Campingausflug",
    datum: "2026-02-28",
    pfad: "assets/Opfanze_assets/Extrablast 2/Extrablast, 032206, Horro-Campingausflug, 20260228.pdf"
  }
];

// ------------------------------------------------------------
// HILFSFUNKTION (wird in Opfanze.html verwendet)
// ------------------------------------------------------------
function formatiereDatum(isoDatum) {
  const monate = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  const [jahr, monat, tag] = isoDatum.split("-").map(Number);
  return `${tag}. ${monate[monat - 1]} ${jahr}`;
}
