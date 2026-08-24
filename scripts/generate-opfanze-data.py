from pathlib import Path
import json
import re

# === PFADE ANPASSEN ===
BASE_DIR = Path(__file__).resolve().parent.parent

# Die PDFs liegen in Mufflonseite/assets/Opfanze_assets/
OPFANZE_DIR = BASE_DIR / "Mufflonseite" / "assets" / "Opfanze_assets"

# Ausgabe-Datei: MUSS in Mufflonseite/js/ liegen!
OUTPUT_FILE = BASE_DIR / "Mufflonseite" / "js" / "Opfanze-data.js"

print(f"🔍 BASE_DIR: {BASE_DIR}")
print(f"🔍 OPFANZE_DIR: {OPFANZE_DIR}")
print(f"🔍 OUTPUT_FILE: {OUTPUT_FILE}")

ausgaben = []

# Beide Jahrgänge durchsuchen
for year_folder in ["Extrablatt_2025", "Extrablatt_2026"]:
    folder = OPFANZE_DIR / year_folder

    if not folder.exists():
        print(f"⚠️ Ordner nicht gefunden: {folder}")
        continue

    print(f"📁 Durchsuche: {folder}")
    for pdf in folder.glob("*.pdf"):
        print(f"📄 Gefunden: {pdf.name}")
        filename = pdf.stem

        # 2025: 0012025_OPFANZE_Skandal-Mufflon_frisst_Ananas-Pizza_0012025_20250626
        match_2025 = re.match(
            r"^(\d{3})2025_OPFANZE_(.*?)_\d+?_?(\d{8})$",
            filename
        )

        # 2026: Extrablatt_0012026_Tier-Wahnsinn_und_Raubzug-Drama_20260105
        match_2026 = re.match(
            r"^Extrablatt_(\d{3})2026_(.*?)_(\d{8})$",
            filename
        )

        if match_2025:
            nummer = int(match_2025.group(1))
            titel = match_2025.group(2)
            raw_datum = match_2025.group(3)
            jahr = 2025
        elif match_2026:
            nummer = int(match_2026.group(1))
            titel = match_2026.group(2)
            raw_datum = match_2026.group(3)
            jahr = 2026
        else:
            print(f"❌ Nicht erkannt: {pdf.name}")
            continue

        # Titel bereinigen
        titel = titel.replace("_", " ").replace("-", " ")
        titel = re.sub(r"\s+", " ", titel).strip()

        # Datum von YYYYMMDD nach YYYY-MM-DD formatieren
        datum_formatiert = f"{raw_datum[0:4]}-{raw_datum[4:6]}-{raw_datum[6:8]}"

        # Pfad für die Website (relativ zum Mufflonseite-Ordner)
        # Bsp: assets/Opfanze_assets/Extrablatt_2026/...
        relativer_pfad = pdf.relative_to(BASE_DIR / "Mufflonseite").as_posix()

        ausgaben.append({
            "typ": "Extrablatt",
            "nummer": f"{nummer:03d}",
            "jahr": jahr,
            "titel": titel,
            "datum": datum_formatiert,
            "pfad": relativer_pfad
        })

# Neueste Ausgaben nach Datum zuerst sortieren
ausgaben.sort(key=lambda x: x["datum"], reverse=True)

# JavaScript-Datei erstellen
OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

with open(OUTPUT_FILE, "w", encoding="utf-8") as file:
    file.write(
        "const OPFANZE_AUSGABEN = "
        + json.dumps(ausgaben, ensure_ascii=False, indent=2)
        + ";\n"
    )

print(f"✅ {len(ausgaben)} Opfanzen gefunden.")
print(f"✅ Datei erstellt: {OUTPUT_FILE}")
