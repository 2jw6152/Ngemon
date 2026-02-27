import requests
import json

def fetch_type_data():
    url = "https://pokeapi.co/api/v2/type/"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()

def fetch_type_detail(url):
    response = requests.get(url)
    response.raise_for_status()
    return response.json()

def build_type_chart():
    data = fetch_type_data()
    types = data['results']

    type_chart = {}
    for t in types:
        type_name = t['name']
        detail = fetch_type_detail(t['url'])
        damage_relations = detail['damage_relations']

        # 기본 모든 타입에 대해 1 배율 설정
        effectiveness = {other_type['name']: 1.0 for other_type in types}

        # 상성 관계 반영
        for dt in damage_relations['double_damage_to']:
            effectiveness[dt['name']] = 2.0
        for ht in damage_relations['half_damage_to']:
            effectiveness[ht['name']] = 0.5
        for nt in damage_relations['no_damage_to']:
            effectiveness[nt['name']] = 0.0

        type_chart[type_name] = effectiveness

    return type_chart

def save_json(data, filename="pokemon_type_chart.json"):
    with open(filename, 'w') as f:
        json.dump(data, f, indent=2)

if __name__ == "__main__":
    chart = build_type_chart()
    save_json(chart)
    print("Pokemon type effectiveness chart saved to pokemon_type_chart.json")
