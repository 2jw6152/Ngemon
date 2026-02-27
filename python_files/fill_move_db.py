
import sys
import time
import json
import requests
import pandas as pd

INPUT_FILE = "skill_list.xlsx"
OUTPUT_FILE = "skill_list_filled.xlsx"

# ---- Helpers ----
def get_json(url, retries=3, backoff=1.5):
    for i in range(retries):
        r = requests.get(url, timeout=30)
        if r.status_code == 200:
            return r.json()
        time.sleep(backoff ** (i+1))
    return None

def move_korean_name(move_json):
    # Try to fetch Korean name from names[] if present
    try:
        for name_entry in move_json.get("names", []):
            if name_entry.get("language", {}).get("name") == "ko":
                return name_entry.get("name")
    except Exception:
        pass
    return None

def effect_text_ko(move_json):
    # Prefer Korean effect text if available, else short English effect
    # (PokeAPI rarely has Korean effects. Fallback to English short_effect.)
    try:
        # Try KO from effect_entries
        for e in move_json.get("effect_entries", []):
            if e.get("language", {}).get("name") == "ko":
                return e.get("short_effect") or e.get("effect")
        # Fallback EN
        for e in move_json.get("effect_entries", []):
            if e.get("language", {}).get("name") == "en":
                return e.get("short_effect") or e.get("effect")
    except Exception:
        pass
    return ""

def normalize_move_name(name: str):
    # PokeAPI expects lowercase with hyphens
    return name.strip().lower().replace(" ", "-").replace("’", "'")

# ---- Load ----
try:
    df = pd.read_excel(INPUT_FILE)
except Exception as e:
    print(f"Failed to open {INPUT_FILE}: {e}")
    sys.exit(1)

# Detect columns
ko_col = None
en_col = None
for c in df.columns:
    cl = str(c).lower()
    if "영문" in c or cl == "english" or cl == "name" or "영문명" in c:
        en_col = c
    if "기술 이름" in c or "한글" in c or "korean" in cl:
        ko_col = c

if en_col is None:
    print("❌ '영문명' 열을 찾지 못했습니다. 엑셀에 영문명이 반드시 있어야 합니다.")
    sys.exit(1)

# Prepare output columns
out_cols = [
    "기술 이름", "영문명", "ID", "명중률", "위력", "pp", "우선도",
    "타입", "카테고리(물리/특수/변화)", "효과 설명"
]

rows = []
for idx, row in df.iterrows():
    en = str(row[en_col]).strip()
    ko = str(row[ko_col]).strip() if ko_col in df.columns else ""

    if not en or en.lower() == "nan":
        rows.append({
            "기술 이름": ko, "영문명": en, "ID": None, "명중률": None, "위력": None, "pp": None,
            "우선도": None, "타입": None, "카테고리(물리/특수/변화)": None, "효과 설명": ""
        })
        continue

    api_name = normalize_move_name(en)
    url = f"https://pokeapi.co/api/v2/move/{api_name}"
    data = get_json(url)
    if data is None:
        # Try by ID if en looks like ID
        try:
            int_id = int(en)
            url2 = f"https://pokeapi.co/api/v2/move/{int_id}"
            data = get_json(url2)
        except Exception:
            pass

    if data is None:
        rows.append({
            "기술 이름": ko, "영문명": en, "ID": None, "명중률": None, "위력": None, "pp": None,
            "우선도": None, "타입": None, "카테고리(물리/특수/변화)": None, "효과 설명": f"(조회 실패: {en})"
        })
        continue

    # derive fields
    kid = data.get("id")
    acc = data.get("accuracy")
    power = data.get("power")
    pp = data.get("pp")
    prio = data.get("priority")
    mtype = (data.get("type") or {}).get("name")
    dclass = (data.get("damage_class") or {}).get("name")
    effect = effect_text_ko(data)

    # Korean name fallback
    if not ko or ko.lower() == "nan":
        ko_alt = move_korean_name(data)
        if ko_alt:
            ko = ko_alt

    # map dclass to requested label
    dclass_map = {"physical": "물리", "special": "특수", "status": "변화"}
    dclass_label = dclass_map.get(dclass, dclass)

    rows.append({
        "기술 이름": ko,
        "영문명": en,
        "ID": kid,
        "명중률": acc,
        "위력": power,
        "pp": pp,
        "우선도": prio,
        "타입": mtype,
        "카테고리(물리/특수/변화)": dclass_label,
        "효과 설명": effect
    })

# Merge with original columns (preserve original order)
out_df = pd.concat([df, pd.DataFrame(rows)], axis=1)

# Try to avoid duplicate columns if original had same names
out_df = out_df.loc[:, ~out_df.columns.duplicated()]

out_df.to_excel(OUTPUT_FILE, index=False)
print(f"✅ Done. Saved to {OUTPUT_FILE}")
