from pathlib import Path
import json
import re

# === PFADE ===
BASE_DIR = Path(__file__).resolve().parent.parent
OPFANZE_DIR = BASE_DIR / "Mufflonseite" / "assets" / "Opfanze_assets"
OUTPUT_FILE = BASE_DIR / "Mufflonseite" / "js" / "Opfanze-data.js"

print(f"🔍 BASE_DIR: {BASE_DIR}")
print(f"🔍 OPFANZE_DIR: {OPFANZE_DIR}")
print(f"🔍 OUTPUT_FILE: {OUTPUT_FILE}")

ausgaben = []

# Alle Ordner durchgehen
ordner_liste = [
    ("Extrablatt_2025", "Extrablatt"),
    ("Extrablatt_2026", "Extrablatt"),
    ("Eventblatt", "Eventblatt")
]

for ordner_name, typ in ordner_liste:
    folder = OPFANZE_DIR / ordner_name

    if not folder.exists():
        print(f"⚠️ Ordner nicht gefunden: {folder}")
        continue

    print(f"📁 Durchsuche: {folder}")
    for pdf in folder.glob("*.pdf"):
        filename = pdf.stem  # Dateiname ohne .pdf

        nummer = None
        titel = None
        raw_datum = None
        jahr = None

        # 1) Extrablatt 2025: Bsp. 0022025_OPFANZE_Cappy-Chaos_im_Boberlizoo_20250626
        m2025 = re.match(r"^(\d{3})2025_OPFANZE_(.*?)_\d+?_?(\d{8})$", filename)

        # 2) Extrablatt 2026: Bsp. Extrablatt_0012026_Tier-Wahnsinn_und_Raubzug-Drama_20260105
        m2026 = re.match(r"^Extrablatt_(\d{3})2026_(.*?)_(\d{8})$", filename)

        # 3) Eventblatt: Bsp. Eventblatt, 012026, Titel..., 20260329 (1)
        m_event = re.match(r"^Eventblatt,\s*(\d{2,3})(20\d{2}),\s*(.*?),\s*(\d{8})(?:\s*\(\d+\))?$", filename)

        if m2025:
            nummer = f"{int(m2025.group(1)):03d}"
            titel = m2025.group(2)
            raw_datum = m2025.group(3)
            jahr = 2025

        elif m2026:
            nummer = f"{int(m2026.group(1)):03d}"
            titel = m2026.group(2)
            raw_datum = m2026.group(3)
            jahr = 2026

        elif m_event:
            nummer = f"{int(m_event.group(1)):03d}"
            jahr = int(m_event.group(2))
            titel = m_event.group(3)
            raw_datum = m_event.group(4)

        else:
            print(f"❌ Dateiname nicht erkannt: {pdf.name}")
            continue

        # Titel säubern
        titel = titel.replace("_", " ").replace("-", " ")
        titel = re.sub(r"\s+", " ", titel).strip()

        # Datum YYYYMMDD -> YYYY-MM-DD
        datum_formatiert = f"{raw_datum[0:4]}-{raw_datum[4:6]}-{raw_datum[6:8]}"

        # Pfad relativ zum Hauptordner der Webseite
        relativer_pfad = pdf.relative_to(BASE_DIR / "Mufflonseite").as_posix()

        ausgaben.append({
            "typ": typ,
            "nummer": nummer,
            "jahr": jahr,
            "titel": titel,
            "datum": datum_formatiert,
            "pfad": relativer_pfad
        })

# Nach Datum sortieren, neueste zuerst
ausgaben.sort(key=lambda x: x["datum"], reverse=True)

# JavaScript-Datei schreiben
OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

with open(OUTPUT_FILE, "w", encoding="utf-8") as file:
    file.write("const OPFANZE_AUSGABEN = " + json.dumps(ausgaben, ensure_ascii=False, indent=2) + ";\n")

print(f"\n✅ Erfolgreich {len(ausgaben)} Ausgaben verarbeitet!")
print(f"✅ JS-Datei gespeichert unter: {OUTPUT_FILE}")
