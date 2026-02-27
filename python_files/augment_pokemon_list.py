
import sys
import time
import requests
import pandas as pd

INPUT_POKEMON = "pokemon_list.xlsx"   # 포켓몬 목록 (이름/영문명 포함)
INPUT_SKILLS  = "skill_list.xlsx"     # 기술 목록 (기술 이름/영문명 포함)
OUTPUT_FILE   = "pokemon_list_filled_types_moves.xlsx"

# -----------------------------
# Helpers
# -----------------------------
def get_json(url, retries=4, backoff=1.6):
    for i in range(retries):
        try:
            r = requests.get(url, timeout=30)
            if r.status_code == 200:
                return r.json()
        except Exception:
            pass
        time.sleep(backoff ** (i+1))
    return None

def norm_poke_name(name: str) -> str:
    # API는 소문자-하이픈을 기대하는 경우가 많음
    return name.strip().lower().replace(" ", "-").replace("’", "'")

def build_skill_maps(skills_df: pd.DataFrame):
    # 영어 기술명(lower, hyphen) -> 한글 기술명 매핑
    en_to_ko = {}
    en_set = set()
    ko_col = None
    en_col = None
    for c in skills_df.columns:
        cl = str(c).lower()
        if "영문" in c or "english" in cl or cl == "name":
            en_col = c
        if "기술 이름" in c or "한글" in c or "korean" in cl:
            ko_col = c
    if en_col is None:
        raise ValueError("❌ skill_list.xlsx 에 '영문명' 열이 필요합니다.")
    # ko_col이 없으면 한글명 없이 처리
    for _, row in skills_df.iterrows():
        en = str(row[en_col]).strip()
        if en and en.lower() != "nan":
            key = norm_poke_name(en)
            en_set.add(key)
            if ko_col and ko_col in skills_df.columns:
                ko = str(row[ko_col]).strip()
                if ko and ko.lower() != "nan":
                    en_to_ko[key] = ko
    return en_to_ko, en_set

def extract_types(poke_json):
    types = poke_json.get("types", [])
    # slot 기준으로 정렬
    types_sorted = sorted(types, key=lambda t: t.get("slot", 99))
    names = [t["type"]["name"] for t in types_sorted if "type" in t and "name" in t["type"]]
    if len(names) == 0:
        return None, None
    if len(names) == 1:
        return names[0], None
    return names[0], names[1]

def extract_moves(poke_json, en_to_ko, skill_en_set):
    moves = poke_json.get("moves", [])
    out_names = []
    for m in moves:
        en = m.get("move", {}).get("name", "")
        if not en:
            continue
        key = norm_poke_name(en)
        # skill_list에 있으면 한글명으로 치환
        if key in skill_en_set and key in en_to_ko:
            out_names.append(en_to_ko[key])
        elif key in skill_en_set:
            # skill_list엔 있지만 한글명이 없으면 영문 유지
            out_names.append(en)
        else:
            # skill_list에 없으면 영문 유지
            out_names.append(en)
    # 중복 제거 및 정렬(안정적)
    dedup = sorted(set(out_names), key=lambda x: x.lower())
    return ", ".join(dedup)

# -----------------------------
# Main
# -----------------------------
def main():
    try:
        poke_df = pd.read_excel(INPUT_POKEMON)
    except Exception as e:
        print(f"❌ '{INPUT_POKEMON}' 파일을 여는 데 실패했습니다: {e}")
        sys.exit(1)
    try:
        skill_df = pd.read_excel(INPUT_SKILLS)
    except Exception as e:
        print(f"❌ '{INPUT_SKILLS}' 파일을 여는 데 실패했습니다: {e}")
        sys.exit(1)

    # 필수 열 감지
    en_col = None
    ko_col = None
    for c in poke_df.columns:
        cl = str(c).lower()
        if "영문" in c or "english" in cl or cl == "name":
            en_col = c
        if "이름" in c or "한글" in c or "korean" in cl:
            ko_col = c
    if en_col is None:
        print("❌ pokemon_list.xlsx 에 '영문명' 열이 필요합니다.")
        sys.exit(1)

    # 기술명 매핑 준비
    en_to_ko, skill_en_set = build_skill_maps(skill_df)

    # 결과 컬럼 준비
    type1_list, type2_list, moves_list = [], [], []

    for idx, row in poke_df.iterrows():
        en_name = str(row[en_col]).strip()
        ko_name = str(row[ko_col]).strip() if ko_col in poke_df.columns else ""
        if not en_name or en_name.lower() == "nan":
            type1_list.append(None)
            type2_list.append(None)
            moves_list.append("")
            print(f"[SKIP] 인덱스 {idx}: 영문명이 비어있습니다.")
            continue

        api_name = norm_poke_name(en_name)
        url = f"https://pokeapi.co/api/v2/pokemon/{api_name}"
        data = get_json(url)
        if data is None:
            # 흔한 예외 케이스: 폼(예: 'deoxys-normal') 이름과 목록 불일치
            type1_list.append(None)
            type2_list.append(None)
            moves_list.append("")
            display = f"{ko_name}/{en_name}" if ko_name else en_name
            print(f"[FAIL] {display} → PokeAPI 조회 실패")
            continue

        # 타입 추출
        t1, t2 = extract_types(data)
        # 기술 추출 및 한국어 매칭
        moves_csv = extract_moves(data, en_to_ko, skill_en_set)

        type1_list.append(t1)
        type2_list.append(t2)
        moves_list.append(moves_csv)

        display = f"{ko_name}/{en_name}" if ko_name else en_name
        # 진행 상황 출력 (요청사항)
        print(f"[OK] {display} → 타입: {t1}" + (f"/{t2}" if t2 else "/None") + f", 기술 수: {len(moves_csv.split(', '))}")

    # 결과 병합
    poke_df["타입_1"] = type1_list
    poke_df["타입_2"] = type2_list
    poke_df["기술"]   = moves_list

    # 저장
    poke_df.to_excel(OUTPUT_FILE, index=False)
    print(f"\n✅ 완료! '{OUTPUT_FILE}' 파일이 생성되었습니다.")

if __name__ == "__main__":
    main()
