from pathlib import Path
import json
import re

# === PFADE ANPASSEN ===
BASE_DIR = Path(__file__).resolve().parent.parent
OPFANZE_DIR = BASE_DIR / "Mufflonseite" / "assets" / "Opfanze_assets"
OUTPUT_FILE = BASE_DIR / "Mufflonseite" / "js" / "Opfanze-data.js"

print(f"🔍 BASE_DIR: {BASE_DIR}")
print(f"🔍 OPFANZE_DIR: {OPFANZE_DIR}")
print(f"🔍 OUTPUT_FILE: {OUTPUT_FILE}")

ausgaben = []

# ============================================================
# 1. Extrablätter (aus Extrablatt_2025 und Extrablatt_2026)
# ============================================================
for year_folder in ["Extrablatt_2025", "Extrablatt_2026"]:
    folder = OPFANZE_DIR / year_folder
    if not folder.exists():
        print(f"⚠️ Ordner nicht gefunden: {folder}")
        continue

    print(f"📁 Durchsuche Extrablätter: {folder}")
    for pdf in folder.glob("*.pdf"):
        print(f"📄 Gefunden: {pdf.name}")
        filename = pdf.stem

        # 2025: 0012025_OPFANZE_Titel_0012025_20250626
        match_2025 = re.match(
            r"^(\d{3})2025_OPFANZE_(.*?)_\d{7}_?(\d{8})$",
            filename
        )

        # 2026: Extrablatt_0012026_Titel_20260105
        match_2026 = re.match(
            r"^Extrablatt_(\d{3})2026_(.*?)_(\d{8})$",
            filename
        )

        if match_2025:
            nummer = int(match_2025.group(1))
            titel = match_2025.group(2)
            datum = match_2025.group(3)
            jahr = 2025
        elif match_2026:
            nummer = int(match_2026.group(1))
            titel = match_2026.group(2)
            datum = match_2026.group(3)
            jahr = 2026
        else:
            print(f"❌ Nicht erkannt (Extrablatt): {pdf.name}")
            continue

        titel = titel.replace("_", " ").replace("-", " ")
        titel = re.sub(r"\s+", " ", titel).strip()
        relativer_pfad = pdf.relative_to(BASE_DIR).as_posix()

        ausgaben.append({
            "nummer": f"{nummer:03d}",
            "jahr": jahr,
            "titel": titel,
            "datum": datum,
            "pfad": relativer_pfad,
            "typ": "Extrablatt"
        })

# ============================================================
# 2. Eventblätter (aus Eventblatt-Ordner)
# ============================================================
event_folder = OPFANZE_DIR / "Eventblatt"
if event_folder.exists():
    print(f"📁 Durchsuche Eventblätter: {event_folder}")
    for pdf in event_folder.glob("*.pdf"):
        print(f"📄 Gefunden: {pdf.name}")
        filename = pdf.stem

        # Eventblatt_XXX2026_Titel_20260101
        match_event = re.match(
            r"^Eventblatt_(\d{3})2026_(.*?)_(\d{8})$",
            filename
        )

        # Alternativ: Eventblatt_XXX2025_Titel_20250101
        match_event_2025 = re.match(
            r"^Eventblatt_(\d{3})2025_(.*?)_(\d{8})$",
            filename
        )

        if match_event:
            nummer = int(match_event.group(1))
            titel = match_event.group(2)
            datum = match_event.group(3)
            jahr = 2026
        elif match_event_2025:
            nummer = int(match_event_2025.group(1))
            titel = match_event_2025.group(2)
            datum = match_event_2025.group(3)
            jahr = 2025
        else:
            print(f"❌ Nicht erkannt (Eventblatt): {pdf.name}")
            continue

        titel = titel.replace("_", " ").replace("-", " ")
        titel = re.sub(r"\s+", " ", titel).strip()
        relativer_pfad = pdf.relative_to(BASE_DIR).as_posix()

        ausgaben.append({
            "nummer": f"{nummer:03d}",
            "jahr": jahr,
            "titel": titel,
            "datum": datum,
            "pfad": relativer_pfad,
            "typ": "Eventblatt"
        })

# ============================================================
# Sortieren: neueste zuerst
# ============================================================
ausgaben.sort(key=lambda x: x["datum"], reverse=True)

# ============================================================
# JavaScript-Datei erstellen
# ============================================================
OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

with open(OUTPUT_FILE, "w", encoding="utf-8") as file:
    file.write(
        "const OPFANZE_AUSGABEN = "
        + json.dumps(ausgaben, ensure_ascii=False, indent=2)
        + ";\n"
    )

print(f"✅ {len(ausgaben)} Opfanzen gefunden.")
print(f"✅ Datei erstellt: {OUTPUT_FILE}")
