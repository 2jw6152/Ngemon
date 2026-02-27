import requests
import pandas as pd
from tqdm import tqdm

# ✅ 파일 이름 설정
INPUT_FILE = "pokemon list.xlsx"
OUTPUT_FILE = "pokemon_list_filled.xlsx"

# ✅ 엑셀 읽기
df = pd.read_excel(INPUT_FILE)

# 영문명 열 이름 확인 (대소문자 상관없이 자동 인식)
name_col = None
for col in df.columns:
    if "영문" in col or "english" in col.lower() or "name" == col.lower():
        name_col = col
        break

if name_col is None:
    raise ValueError("❌ '영문명' 열을 찾을 수 없습니다. 엑셀에 '영문명' 열이 반드시 포함되어야 합니다.")

# ✅ PokeAPI로부터 종족값 가져오기
def get_base_stats(pokemon_name):
    """주어진 영어 이름으로 PokeAPI에서 종족값을 반환"""
    try:
        url = f"https://pokeapi.co/api/v2/pokemon/{pokemon_name.lower()}"
    except: return
    r = requests.get(url)
    if r.status_code != 200:
        return None
    data = r.json()
    stats = {stat["stat"]["name"]: stat["base_stat"] for stat in data["stats"]}
    total = sum(stats.values())
    return {
        "체력": stats.get("hp"),
        "공격력": stats.get("attack"),
        "방어": stats.get("defense"),
        "특수공격": stats.get("special-attack"),
        "특수방어": stats.get("special-defense"),
        "스피드": stats.get("speed"),
        "총합": total,
    }

# ✅ 데이터 채우기
filled_stats = []
for name in tqdm(df[name_col], desc="Fetching Pokémon base stats"):
    stats = get_base_stats(name)
    if stats:
        filled_stats.append(stats)
        print(f"✅ {name}의 종족값을 성공적으로 가져왔습니다. {stats}")
    else:
        filled_stats.append({
            "체력": None, "공격력": None, "방어": None,
            "특수공격": None, "특수방어": None, "스피드": None, "총합": None
        })

# ✅ 결과 병합
stats_df = pd.DataFrame(filled_stats)
result_df = pd.concat([df.reset_index(drop=True), stats_df], axis=1)

# ✅ 엑셀로 저장
result_df.to_excel(OUTPUT_FILE, index=False)
print(f"✅ 모든 포켓몬 종족값을 '{OUTPUT_FILE}' 파일로 저장했습니다.")
