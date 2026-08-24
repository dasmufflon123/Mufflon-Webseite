/* ============================================================
   OPFANZE — Kiosk-Datenbank (Test-Datei für 2 Ausgaben)
   ============================================================ */

const OPFANZE_AUSGABEN = [
  {
    "typ": "Extrablatt",
    "nummer": "001",
    "jahr": 2026,
    "titel": "Tier Wahnsinn und Raubzug Drama",
    "datum": "2026-01-05",
    "pfad": "assets/Opfanze_assets/Extrablatt_2026/Extrablatt_0012026_Tier-Wahnsinn_und_Raubzug-Drama_20260105.pdf"
  },
  {
    "typ": "Extrablatt",
    "nummer": "001",
    "jahr": 2025,
    "titel": "Skandal Mufflon frisst Ananas Pizza",
    "datum": "2025-06-26",
    "pfad": "assets/Opfanze_assets/Extrablatt_2025/0012025_OPFANZE_Skandal-Mufflon_frisst_Ananas-Pizza_0012025_20250626.pdf"
  }
];

// ------------------------------------------------------------
// HILFSFUNKTION (wird in Opfanze.html verwendet)
// ------------------------------------------------------------
function formatiereDatum(isoDatum) {
  if (!isoDatum) return "";
  const monate = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  const [jahr, monat, tag] = isoDatum.split("-").map(Number);
  return `${tag}. ${monate[monat - 1]} ${jahr}`;
}
