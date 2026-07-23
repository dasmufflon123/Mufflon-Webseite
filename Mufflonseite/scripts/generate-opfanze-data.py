from pathlib import Path
import json
import re

# Ordner mit den PDFs
BASE_DIR = Path(__file__).resolve().parent.parent
OPFANZE_DIR = BASE_DIR / "assets" / "Opfanze_assets"

# Ausgabe-Datei
OUTPUT_FILE = BASE_DIR / "js" / "Opfanze-data.js"

ausgaben = []

# Beide Jahrgänge durchsuchen
for year_folder in ["Extrablatt_2025", "Extrablatt_2026"]:
    folder = OPFANZE_DIR / year_folder

    if not folder.exists():
        continue

    for pdf in folder.glob("*.pdf"):
        filename = pdf.stem

        # 2025:
        # 0012025_OPFANZE_Titel_0012025_20250626
        match_2025 = re.match(
            r"^(\d{3})2025_OPFANZE_(.*?)_\d{7}_?(\d{8})$",
            filename
        )

        # 2026:
        # Extrablatt_0012026_Titel_20260105
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
            print(f"Nicht erkannt: {pdf.name}")
            continue

        # Unterstriche im Titel durch Leerzeichen ersetzen
        titel = titel.replace("_", " ")

        # Bindestriche im Titel durch Leerzeichen ersetzen
        titel = titel.replace("-", " ")

        # Mehrere Leerzeichen entfernen
        titel = re.sub(r"\s+", " ", titel).strip()

        # Website-Pfad
        relativer_pfad = pdf.relative_to(BASE_DIR).as_posix()

        ausgaben.append({
            "nummer": f"{nummer:03d}",
            "jahr": jahr,
            "titel": titel,
            "datum": datum,
            "pfad": relativer_pfad,
            "typ": "Extrablatt"
        })


# Nach Datum sortieren, neueste zuerst
ausgaben.sort(
    key=lambda x: x["datum"],
    reverse=True
)

# JavaScript-Datei erstellen
OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

with open(OUTPUT_FILE, "w", encoding="utf-8") as file:
    file.write(
        "const OPFANZE_AUSGABEN = "
        + json.dumps(ausgaben, ensure_ascii=False, indent=2)
        + ";\n"
    )

print(f"{len(ausgaben)} Opfanzen gefunden.")
print(f"Datei erstellt: {OUTPUT_FILE}")
