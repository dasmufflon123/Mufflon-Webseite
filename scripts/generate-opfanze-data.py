"""
============================================================
OPFANZE — Automatische Datenbank-Generierung
============================================================
Durchsucht die PDF-Ordner unter Mufflonseite/assets/Opfanze_assets
und baut daraus Mufflonseite/js/Opfanze-data.js.

Wird automatisch von der GitHub Action ausgeführt, sobald neue
PDFs in einem der drei Ordner landen. Kein manueller Aufruf nötig.
============================================================
"""

from pathlib import Path
import json
import re

# === PFADE ===
BASE_DIR = Path(__file__).resolve().parent.parent
OPFANZE_DIR = BASE_DIR / "Mufflonseite" / "assets" / "Opfanze_assets"
OUTPUT_FILE = BASE_DIR / "Mufflonseite" / "js" / "Opfanze-data.js"

# Ordner -> Typ
ORDNER_LISTE = [
    ("Extrablatt_2025", "Extrablatt"),
    ("Extrablatt_2026", "Extrablatt"),
    ("Eventblatt", "Eventblatt"),
]

# ------------------------------------------------------------
# MANUELLE AUSNAHMEN
# Für die seltenen Dateien, aus deren Namen sich kein Datum
# sicher auslesen lässt (z.B. Datum fehlt komplett, oder ist
# eindeutig verstümmelt). Einmal hier eintragen, fertig.
# Key = exakter Dateiname (mit .pdf), Value = "YYYY-MM-DD"
# ------------------------------------------------------------
MANUELLE_DATUMS = {
    "0042025_OPFANZE_Boberlizoo-Chefin_Das_Mufflon_spricht.pdf": "2025-06-27",
    "1092025_OPFANZE_Subathon_Tag_13_2025925.pdf": "2025-09-25",
    # 9-stellige Zahlendreher: automatisches Raten (erste 8 Ziffern) lag hier
    # daneben, weil die Extra-Ziffer nicht am Ende, sondern in der Mitte steckt.
    # Anhand der Nachbar-Ausgaben (063 = 11.08., 065 = 13.08.) korrigiert:
    "0642025_OPFANZE_Enthullung_um_Pumper-Puffin_und_Nunniemaus_202508012.pdf": "2025-08-12",
    # Anhand der Nachbar-Ausgaben (079 = 23.06., 081 = 01.07.) korrigiert:
    "Extrablatt_0802026_Endlich_ein_Eingang_202606024.pdf": "2026-06-24",
}

# Literale Marker, die vor dem Titel stehen können (Tippfehler-tolerant)
TYP_MARKER = ["OPFANZE", "OPFANZAE", "OPFANZE_"]


def saeubere_titel(titel: str) -> str:
    titel = titel.replace("_", " ").replace("-", " ").replace(",", " ")
    titel = re.sub(r"\s+", " ", titel).strip()
    return titel


def datum_gueltig(yyyymmdd: str) -> bool:
    if len(yyyymmdd) != 8 or not yyyymmdd.isdigit():
        return False
    jahr, monat, tag = int(yyyymmdd[0:4]), int(yyyymmdd[4:6]), int(yyyymmdd[6:8])
    return 2020 <= jahr <= 2035 and 1 <= monat <= 12 and 1 <= tag <= 31


def finde_datum_am_ende(text: str):
    """
    Sucht das Datum am Ende eines Dateinamens. Toleriert:
    - genau 8 Ziffern (Normalfall)
    - 9 Ziffern (Zahlendreher, z.B. 202508012 -> 20250801)
    - einen angehängten Versions-Suffix wie "_1" oder " (1)"
    Gibt (rest_ohne_datum, datum_yyyy_mm_dd) zurück, oder (text, None).
    """
    text = re.sub(r"\s*\(\d+\)\s*$", "", text)

    m = re.search(r"(\d{8,9})(?:_\d+)?$", text)
    if not m:
        return text, None

    ziffern = m.group(1)
    kandidat = ziffern[:8]
    if not datum_gueltig(kandidat):
        return text, None

    rest = text[: m.start()].rstrip("_, ")
    formatiert = f"{kandidat[0:4]}-{kandidat[4:6]}-{kandidat[6:8]}"
    return rest, formatiert


def parse_extrablatt_2025(filename: str):
    m = re.match(r"^(\d{3})2025_(.+)$", filename)
    if not m:
        return None
    nummer, rest = m.group(1), m.group(2)

    for marker in TYP_MARKER:
        if rest.upper().startswith(marker.rstrip("_") + "_"):
            rest = rest[len(marker.rstrip("_")) + 1:]
            break

    rest, datum = finde_datum_am_ende(rest)
    rest = re.sub(rf"_{int(nummer):03d}2025$", "", rest)  # ggf. wiederholte Nummer (Original-Schema)
    return {"nummer": f"{int(nummer):03d}", "jahr": 2025, "titel": saeubere_titel(rest), "datum": datum}


def parse_extrablatt_2026(filename: str):
    # Variante A (bisher üblich): Extrablatt_0942026_Titel_20260813
    m = re.match(r"^Extrablatt_(\d{2,4})2026_(.+)$", filename, re.IGNORECASE)
    if m:
        nummer, rest = m.group(1), m.group(2)
        rest, datum = finde_datum_am_ende(rest)
        return {"nummer": f"{int(nummer):03d}", "jahr": 2026, "titel": saeubere_titel(rest), "datum": datum}

    # Variante B (Komma-Format wie Eventblatt): Extrablatt, 0942026, Titel, 20260813
    m = re.match(r"^Extrablatt,\s*(\d{2,4})2026,\s*(.+)$", filename, re.IGNORECASE)
    if m:
        nummer, rest = m.group(1), m.group(2)
        rest, datum = finde_datum_am_ende(rest)
        return {"nummer": f"{int(nummer):03d}", "jahr": 2026, "titel": saeubere_titel(rest), "datum": datum}

    return None


def parse_eventblatt(filename: str):
    m = re.match(r"^Eventblatt,\s*(\d{2,3})(20\d{2}),\s*(.+)$", filename)
    if not m:
        return None
    nummer, jahr, rest = m.group(1), int(m.group(2)), m.group(3)
    rest, datum = finde_datum_am_ende(rest)
    return {"nummer": f"{int(nummer):03d}", "jahr": jahr, "titel": saeubere_titel(rest), "datum": datum}


PARSER = {
    "Extrablatt_2025": parse_extrablatt_2025,
    "Extrablatt_2026": parse_extrablatt_2026,
    "Eventblatt": parse_eventblatt,
}

ausgaben = []
unerkannt = []
manuell_verwendet = []

for ordner_name, typ in ORDNER_LISTE:
    folder = OPFANZE_DIR / ordner_name
    if not folder.exists():
        print(f"⚠️  Ordner nicht gefunden: {folder}")
        continue

    parser = PARSER[ordner_name]

    for pdf in sorted(folder.glob("*.pdf")):
        filename_stem = pdf.stem
        ergebnis = parser(filename_stem)

        if ergebnis is None:
            unerkannt.append(pdf.name)
            continue

        if pdf.name in MANUELLE_DATUMS:
            ergebnis["datum"] = MANUELLE_DATUMS[pdf.name]
            manuell_verwendet.append(pdf.name)
        elif ergebnis["datum"] is None:
            unerkannt.append(f"{pdf.name}  (kein Datum im Namen gefunden — bitte in MANUELLE_DATUMS eintragen)")
            continue

        relativer_pfad = pdf.relative_to(BASE_DIR / "Mufflonseite").as_posix()

        ausgaben.append({
            "typ": typ,
            "nummer": ergebnis["nummer"],
            "jahr": ergebnis["jahr"],
            "titel": ergebnis["titel"],
            "datum": ergebnis["datum"],
            "pfad": relativer_pfad,
        })

# ------------------------------------------------------------
# Duplikate entfernen (z.B. Explorer-Kopien "Datei (1).pdf")
# ------------------------------------------------------------
gesehen = set()
eindeutig = []
for a in ausgaben:
    key = (a["typ"], a["nummer"], a["jahr"])
    if key in gesehen:
        continue
    gesehen.add(key)
    eindeutig.append(a)

# ------------------------------------------------------------
# Plausibilitätsprüfung: Ausgabe X kann nicht NACH einer
# höher nummerierten Ausgabe (gleicher Typ + Jahr) datiert sein.
# Statt das Datum zu erraten (fehleranfällig), wird die Ausgabe
# nur als "unsicher" markiert — sie bleibt ganz normal in der
# Liste/Suche, wird aber nie als "neueste Ausgabe" vorgeschlagen.
# ------------------------------------------------------------
gruppen = {}
for a in eindeutig:
    a["unsicher"] = False
    gruppen.setdefault((a["typ"], a["jahr"]), []).append(a)

unsicher_liste = []
for (typ, jahr), gruppe in gruppen.items():
    gruppe.sort(key=lambda x: int(x["nummer"]))
    suffix_min = None
    for a in reversed(gruppe):
        if suffix_min is not None and a["datum"] > suffix_min:
            a["unsicher"] = True
            unsicher_liste.append(a)
        suffix_min = a["datum"] if suffix_min is None else min(suffix_min, a["datum"])

eindeutig.sort(key=lambda x: x["datum"], reverse=True)

OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.write("// Automatisch generiert von scripts/generate-opfanze-data.py — nicht von Hand bearbeiten!\n")
    f.write("const OPFANZE_AUSGABEN = " + json.dumps(eindeutig, ensure_ascii=False, indent=2) + ";\n")

print(f"✅ {len(eindeutig)} Ausgaben verarbeitet ({len(ausgaben) - len(eindeutig)} Duplikate entfernt).")
if manuell_verwendet:
    print(f"ℹ️  {len(manuell_verwendet)} Datei(en) über MANUELLE_DATUMS aufgelöst.")
if unsicher_liste:
    print(f"\n⚠️  {len(unsicher_liste)} Ausgabe(n) mit unplausiblem Datum (widerspricht der Nummern-Reihenfolge) — bleiben in Liste/Suche, gelten aber nicht als 'neueste Ausgabe':")
    for a in unsicher_liste:
        print(f"   - {a['typ']} {a['nummer']}/{a['jahr']} '{a['titel']}' ({a['datum']}) — bitte Original-Dateiname prüfen")
if unerkannt:
    print(f"\n❌ {len(unerkannt)} Datei(en) konnten NICHT verarbeitet werden:")
    for u in unerkannt:
        print(f"   - {u}")
