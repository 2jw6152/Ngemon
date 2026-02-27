# Pokémon Battle Game — Codex CLI Build Guide (Web, React + PixiJS)

> **Goal**: Ship a stylish, Korean‑language web Pokémon‑style battle game using *vibe coding* with Codex CLI — no heavyweight game engines. CPU battles first (with switch & surrender), online PvP later. All moves are **pre‑compiled** at build time from `skill_list.xlsx` into static handlers; runtime never parses natural language.

> **Assets**: Pokémon spritesheets live under `Images/` and are named by **English species name**; gameplay data provided by `pokemon_list.xlsx` and `skill_list.xlsx`; type chart JSON is provided (`/mnt/data/pokemon_type_chart.json`). fileciteturn0file0

---

## 0) Hard Rules (Non‑Negotiable)

1) **No level, no evolution.**  
2) **PP resets each battle** (skills start at max PP at battle start; reset at battle end).  
3) **Random means uniform.** No middle‑range bias, no weights. Starters, draws, skill grants, rerolls — all **strictly uniform** among eligible items (with no duplicates when the design calls for uniqueness).  
4) **Switching is in MVP.** There is **Surrender** (not “Run”).  
5) **Type effectiveness must be applied** using the provided chart (see §6).  
6) **Korean UI** throughout. Types and terms shown to players are **Korean**, even if data is English.  
7) **When parsing `pokemon_list.xlsx`, any move whose *name field* is English is **excluded** from selection** (only Korean‑named moves appear in‑game).  
8) **UI must be flashy** (see §10) — especially the gacha/“draw” flow.

---

## 1) Tech Stack

- **React 18** (app/UI)  
- **PixiJS 8** (canvas rendering, sprites, particles)  
- **TypeScript** (strict)  
- **Zustand** or **Redux Toolkit** (state)  
- **Vite** (dev/build)  
- **Jest + @testing-library/react** (unit/UI tests)  
- **xlsx** (Excel → JSON at build time)  
- **seedrandom** (reproducible uniform RNG)  
- Optional (later): **Supabase** for auth/storage/DB, **Socket.IO** or **Supabase Realtime** for PvP

> Engines like Unity/Godot are **not used**. We build a light, fast web app.

---

## 2) Project Structure

```text
/project
  /public
    index.html
  /Images/                      # spritesheets (filename = English species name). DO NOT rename.
  /data/
    pokemon_list.xlsx
    skill_list.xlsx
    pokemon.json                # generated at build
    skills.json                 # generated at build
    typeChart.json              # copy of pokemon_type_chart.json used at runtime
  /src/
    main.tsx
    App.tsx
    /i18n/                      # Korean labels for types & UI strings
      ko.ts
    /battle/
      engine.ts                 # turn order, damage, accuracy, effects, logs
      type-chart.ts             # loads data/typeChart.json
      ops.ts                    # SkillOps: dealDamage/applyBuff/applyStatus/...
      ai.ts                     # CPU policy (score-based + switch logic)
      sprites.ts                # runtime loader using *.meta.json (see §7)
    /skills/
      runtime-api.ts            # SkillContext & SkillOps types
      handcoded/                # rare bespoke moves (if any)
      generated/                # ← Codex codegen output (one file per move + index.ts)
    /ui/
      pages/
        Login.tsx
        Dashboard.tsx
        Battle.tsx
        Shop.tsx
        Party.tsx
        Settings.tsx
      components/
        ActionBar.tsx
        BattleHUD.tsx
        BattleLog.tsx
        GachaModal.tsx
        SkillPicker.tsx
        PokemonCard.tsx
        SparkleFX.tsx           # particles & glam
    /state/
      store.ts                  # points, inventory, party, session
    /utils/
      rng.ts                    # uniform RNG wrapper
      excel.ts                  # Excel → JSON parsing helpers
      locale.ts                 # EN→KO mapping for types, etc.
  /tools/
    codegen/
      generate-skills.ts        # Codex CLI generates static handlers per move
      patterns.yaml             # regex/keyword → template mapping
      templates/
        damage.ts.hbs
        buff.ts.hbs
        status.ts.hbs
        multihit.ts.hbs
        custom.ts.hbs
    spritesheet/
      bake-meta.ts              # auto-detect frame grids & emit *.meta.json
  vite.config.ts
  package.json
  README.md
```

---

## 3) Data Ingestion (Excel → JSON) @ build time

### 3.1 Pokémon

- Read `pokemon_list.xlsx` columns:  
  `이름 | 영문명 | 체력 | 공격력 | 방어 | 특수공격 | 특수방어 | 스피드 | 총합 | 타입_1 | 타입_2 | 기술`  
- Emit `data/pokemon.json` with:
```ts
type Species = {
  koName: string;              // 이름
  enName: string;              // 영문명 (must match Images filename)
  stats: { hp:number; atk:number; def:number; spa:number; spd:number; spe:number; total:number };
  types: [string, string?];    // raw English types from sheet (e.g., "fire", "flying")
  learnset: string[];          // candidate move names (Korean only, see filter below)
};
```

**Filter rule** (critical): while building `learnset`, **exclude any move whose name is English**. Keep only **Korean‑named moves**. (Use a heuristic like `/[A-Za-z]/` presence to drop it, or maintain an allow‑list of Hangul.)

### 3.2 Skills

- Read `skill_list.xlsx` columns:  
  `기술 이름 | 영문명 | ID | 명중률 | 위력 | pp | 우선도 | 타입 | 카테고리(물리/특수/변화) | 효과 설명`  
- Emit `data/skills.json` with normalized fields (IDs as strings).  
- **Later** in §5 we generate **static handlers** per skill from `효과 설명`.

### 3.3 Scripts

Add a npm script:
```json
{
  "scripts": {
    "build:data": "ts-node ./src/utils/excel.ts"
  }
}
```
`excel.ts` writes `pokemon.json` & `skills.json` and copies `/mnt/data/pokemon_type_chart.json` to `data/typeChart.json` for runtime use.

> **Uniform randomness**: when granting Pokémon or moves, always Fisher–Yates shuffle, then take the first N (to enforce strict uniform & “no duplicate within a set” when required).

---

## 4) Game Flow & Economy (MVP)

- **Login/Signup**: simple local (ID+password hash) for MVP; later replace with Supabase (see §12).  
- **Starter**: on account creation, **one random species** (uniform) and **4 distinct moves** randomly picked from that species’ `learnset` (uniform, no duplicates, Korean‑named only).  
- **Battle (CPU)**: 1v1 with **Switch** and **Surrender**. Turn order by **Priority**, then **Speed**, tie → coin‑flip.  
- **Points**: win vs CPU → e.g., `+50`; later PvP will give more.  
- **Shop**:
  - **Draw Ticket**: 
    - Random (all species) 300pt — uniform over **all** species.  
    - Tiered by base stat total: *Monster* 100pt, *Super* 400pt, *Hyper* 700pt — uniform **within tier pool**.  
  - **Move Change**:
    - Random 50pt — randomly picks one of four slots and replaces it with a random **eligible** Korean‑named move not already known.  
    - Targeted 500pt — open the full eligible move catalog and pick exactly one.

> **PP resets per battle**. No levels, no evolutions.

---

## 5) Build‑Time Codegen for Skill Effects (No Runtime Parsing)

**Principle**: Compile each skill into a **static TypeScript module** during development. Runtime only calls a function pointer.

### 5.1 Runtime API

```ts
// src/skills/runtime-api.ts
export type Category = "physical"|"special"|"status";

export interface SkillContext {
  rng: () => number;
  typeChart: TypeChart;
  log: (e: BattleLogEvent) => void;
  attacker: BattlerView;
  defender: BattlerView;
}

export interface SkillOps {
  dealDamage(params: {
    power: number; category: Category; type: string;
    accuracy?: number; priority?: number; variance?: [number,number]; critRate?: number;
  }): void;
  applyStatus(target: "self"|"enemy", status: StatusName): void;
  applyBuff(target: "self"|"enemy", stat: StatName, stages: number): void;
  heal(target: "self"|"ally"|"enemy", amount: number | {ratio:number}): void;
  multiHit(min: number, max: number, perHit: () => void): void;
}
export type SkillHandler = (ctx: SkillContext, ops: SkillOps) => void;
```

### 5.2 Codex Codegen Pipeline

- **Input**: `data/skills.json` (including `효과 설명`)  
- **Mapping**: `tools/codegen/patterns.yaml` with regex/keywords mapping descriptions → templates  
- **Templates** (`tools/codegen/templates/`):
  - `damage.ts.hbs` (power/accuracy/priority/type/category)  
  - `buff.ts.hbs` (target/stat/stages)  
  - `status.ts.hbs` (target/status)  
  - `multihit.ts.hbs` (min/max + perHit calls `dealDamage`)  
  - `custom.ts.hbs` (safe stub with console warning)
- **Generator** `tools/codegen/generate-skills.ts`:
  - For each skill: pick template, render params, emit `src/skills/generated/<id>-<slug>.ts`  
  - Emit `src/skills/generated/index.ts` with static imports & `Map<string, SkillHandler>`
  - Emit Jest tests per skill (simple snapshot)  
  - Validate ranges/types; exit non‑zero on failure

**Codex prompt** example:
```
Create tools/codegen/generate-skills.ts that:
- Loads data/skills.json and tools/codegen/patterns.yaml
- Matches '효과 설명' into one of the templates (damage/buff/status/multihit/custom)
- Writes src/skills/generated/<id>-<slug>.ts and an index.ts registry
- Generates minimal Jest tests per skill under __tests__/generated/
- Fails the process if validation fails
```

**Runtime usage**:
```ts
import SkillRegistry from "@/skills/generated";
const handler = SkillRegistry.get(skillId)!;
handler(ctx, ops);
```

---

## 6) Type Effectiveness

- Use `data/typeChart.json` (copied from the provided `pokemon_type_chart.json`). Load at startup and keep in memory.  
- Damage multiplier = `chart[attackType][defenderType1] * chart[attackType][defenderType2 ?? "unknown"]`.

> The supplied chart file is authoritative. Keep it versioned in `data/typeChart.json`. fileciteturn0file0

**Korean display**: map English type keys → Korean labels via `src/i18n/ko.ts`. The underlying calculation remains English keys (to match the JSON), but **UI prints Korean**.

---

## 7) Spritesheets — Unknown Frame Counts (Automatic Baking)

Spritesheets live in `Images/` and are named by **English species**. We don’t know frame counts; we **autodetect** them at build time and emit metadata files consumed at runtime.

### 7.1 Bake Algorithm (`tools/spritesheet/bake-meta.ts`)

1) Load PNG → scan for fully transparent columns/rows as separators; if periodic → use that periodicity as frame width/height.  
2) If not found: compute the **GCD** of contiguous non‑transparent run lengths along X/Y to infer `frameWidth`/`frameHeight`.  
3) If still ambiguous: connected‑component analysis to bound frames; normalize row‑wise.  
4) Write `Images/<name>.meta.json`:
```json
{ "frameWidth": W, "frameHeight": H, "frames": N, "rows": R, "cols": C, "animations": { "idle": [0..k], "attack":[...], "hit":[...], "faint":[...] } }
```
5) If detection fails, log a warning and fall back to safe **uniform slicing** (e.g., 4×2).

### 7.2 Runtime Loader

`src/battle/sprites.ts` loads `<name>.png` + `<name>.meta.json` and exposes `getAnimation(name,"idle"|"attack"|...)` for PixiJS `AnimatedSprite`.

---

## 8) Battle Engine (Deterministic Core)

**Turn Resolution**: sort by `priority`, then `speed`, tie → coin‑flip.  
**Damage**: physical uses `atk/def`, special uses `spa/spd`; apply type multiplier(s); variance default `[0.85,1.0]`.  
**Accuracy**: roll vs `명중률` (default 100%).  
**PP**: decrement on use; **reset to max on battle start** and **reset after battle**.  
**Switch/Surrender**: switch consumes your action; surrender ends battle immediately.  
**Logs**: every event is appended to a battle log (useful for debugging and replays).

---

## 9) CPU AI (Stronger than “random”)

**Score each action**:
```
score(skill) = E[damage(skill)] + priority_bonus + finisher_bonus - miss_risk_penalty
```
- `E[damage]` accounts for type multipliers & accuracy.  
- **Switch logic**: simulate expected incoming damage; if switching to a bench mon reduces expected loss by ε, prefer switching. Pick bench with minimal expected loss vs opponent’s common types.

No tree search; single‑step evaluation is enough and fast.

---

## 10) UI/UX — “Make it Drippy” (Stylish)

- **Global look**: dark theme, neon accents, glassmorphism panels, micro‑interactions (hover/press).  
- **Battle**: large HP bars with Korean labels, type badges in Korean, smooth shake/scale for hit/attack, subtle particles.  
- **Gacha (Draw)**: dramatic modal with *ticket insert* animation → rotating sphere/ball → color flare by **tier** (bronze/silver/gold) → big reveal with sparkle & whoosh SFX.  
- **Motion**: use `pixi/particle-emitter` for sparkles, CSS keyframes for panel transitions.  
- **Accessibility**: readable fonts, high‑contrast damage numbers, mobile‑friendly taps.

> **All labels in Korean**. Ensure EN→KO mappings for types & system strings.

---

## 11) Strict Uniform Randomness

- Use `seedrandom` to produce a seeded RNG (replayable).  
- **Granting Pokémon / Picking 4 moves / Draw tickets / Random move change**:  
  - Fisher–Yates shuffle the eligible list → take the first K.  
  - Never weight or bias unless the design explicitly instructs (tiers are done by *filtering the pool*, not weighting).

---

## 12) Supabase (Optional, after MVP) — Exact Steps

> You can ship MVP with local storage auth. When you want online accounts, points persistence, inventories, or PvP lobby, integrate Supabase. Below is a **concrete checklist**.

### 12.1 Create Project & Configure Auth

1) Create a new Supabase project.  
2) In **Authentication → Providers**, enable **Email** (password).  
3) In **Auth → Policies**, keep **RLS enabled** for all tables we’ll create.  
4) Get `SUPABASE_URL` and `SUPABASE_ANON_KEY` → add to `.env`:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### 12.2 Database Schema (SQL)

```sql
-- Users mirror (auth.users referenced)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  tz text default 'Asia/Seoul',
  created_at timestamptz default now()
);

-- Player profile: points & inventory
create table if not exists public.player_state (
  user_id uuid primary key references public.users(id) on delete cascade,
  points int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Owned pokemon (species by English name to match Images/ file names)
create table if not exists public.owned_pokemon (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  species_en text not null,
  moves text[] not null,      -- 4 Korean move names
  created_at timestamptz default now()
);

-- Party order (front index 0..)
create table if not exists public.party (
  user_id uuid primary key references public.users(id) on delete cascade,
  order_en text[] not null,   -- English species names in field order
  updated_at timestamptz default now()
);

-- Transaction log (shop / rewards)
create table if not exists public.tx_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  kind text not null,         -- 'cpu_win','draw_random','draw_tier','move_reroll','move_pick'
  delta int not null,         -- e.g., +50 for win, -300 for random draw
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);
```

### 12.3 RLS Policies (Examples)

```sql
alter table public.player_state enable row level security;
create policy pstate_sel on public.player_state for select
  using (auth.uid() = user_id);
create policy pstate_upd on public.player_state for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.owned_pokemon enable row level security;
create policy opkm_rw on public.owned_pokemon for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.party enable row level security;
create policy party_rw on public.party for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.tx_log enable row level security;
create policy tx_sel on public.tx_log for select
  using (auth.uid() = user_id);
create policy tx_ins on public.tx_log for insert
  with check (auth.uid() = user_id);
```

### 12.4 Post‑Dev Steps (What you must do **on Supabase**)

1) **Enable Email/Password** sign‑in and test sign‑up/sign‑in.  
2) **Run the SQL** above in the SQL editor to create tables.  
3) **Enable RLS** and create policies (as above).  
4) In **Authentication → Policies**, ensure **email confirmations** as desired (dev can disable temporarily).  
5) In **Project Settings → API**, copy **URL** and **anon key** into `.env`.  
6) Add **Edge Functions** later (optional) for PvP matchmaking or server‑side battle resolution.  
7) Create **indexes** if needed (e.g., `owned_pokemon(user_id)`, `tx_log(user_id)`), for performance.  
8) Verify **CORS** allows your dev/production origins.  
9) **Backup** your DB via project settings.

### 12.5 Client Integration Outline

- Replace local auth with Supabase `auth.signUp` / `auth.signInWithPassword`.  
- On first login, if `player_state` doesn’t exist, create it and **grant starter** (transactionally: insert starter mon + set points).  
- All shop actions must be server‑validated (ideally via Edge Function) to prevent client tampering.

---

## 13) Korean Localization

- **All UI strings** in `src/i18n/ko.ts`. 
- **Type mapping**: English keys → Korean labels. For example:  
  `fire → 불꽃`, `water → 물`, `electric → 전기`, etc.  
- Species names: display the **Korean 이름** (`이름`) in the UI.  
- Moves: **only Korean‑named moves** appear in game (filter at build time).

---

## 14) CPU vs Player Points & Shop (Implementation Notes)

- Points change must be consistent: always write a `tx_log` row (Supabase) or a local log (MVP).  
- **Draw** flow:
  1) Deduct points (fail if insufficient).  
  2) Determine pool (all or tier).  
  3) Uniformly draw species; add to inventory; shimmer FX.  
- **Move Change**:
  - Random: uniformly pick slot 0..3; uniformly pick replacement from eligible non‑owned Korean moves.  
  - Targeted: open searchable list; confirm → replace.

---

## 15) Battle UI & Components (React)

- `<Battle>` page contains:  
  - Pixi Canvas field (`<Stage>` + `AnimatedSprite>`s)  
  - `<BattleHUD>`: Korean name, HP bar, type badges (Korean), status icons  
  - `<ActionBar>`: 4 move buttons (Korean names), **Switch**, **Surrender**  
  - `<BattleLog>`: scrolling log (Korean)  
- Micro‑animations on hover/press; damage numbers float‑up briefly; particle bursts on hit.

---

## 16) Build Scripts

```json
{
  "scripts": {
    "build:data": "ts-node ./src/utils/excel.ts",
    "build:sprites": "ts-node ./tools/spritesheet/bake-meta.ts",
    "build:skills": "ts-node ./tools/codegen/generate-skills.ts",
    "test": "jest",
    "dev": "vite",
    "build": "npm-run-all build:data build:sprites build:skills && vite build",
    "preview": "vite preview"
  }
}
```

> In CI: run `npm run build` so codex‑generated skills & sprite metas are included.

---

## 17) Codex CLI — Ready‑to‑Use Prompts

- **Excel → JSON**:  
  “Create `src/utils/excel.ts` to read `pokemon_list.xlsx` & `skill_list.xlsx`. Output `data/pokemon.json` (Korean‑move filter), `data/skills.json`. Copy `/mnt/data/pokemon_type_chart.json` to `data/typeChart.json`.”

- **Skill Codegen**:  
  “Create `tools/codegen/generate-skills.ts` + `templates/` + `patterns.yaml`. For each skill’s `효과 설명`, generate `src/skills/generated/<id>-<slug>.ts` implementing a static handler that uses `SkillOps`. Create an `index.ts` registry and minimal Jest tests.”

- **Spritesheet Meta**:  
  “Create `tools/spritesheet/bake-meta.ts` that scans `Images/*.png` for frames (transparent separators or GCD runs), writes `<name>.meta.json` with width/height/frames/rows/cols/animations, and logs a warning on fallback uniform slicing.”

- **Battle Core**:  
  “Implement `src/battle/engine.ts` with turn sort (priority → speed → coin flip), accuracy, damage (atk/def or spa/spd), type multipliers from `data/typeChart.json`, PP decrement/reset, switch/surrender handling, and battle log.”

- **AI**:  
  “Implement `src/battle/ai.ts` with expected damage scoring, finisher bonus, miss penalty, and switch evaluation that picks the bench Pokémon minimizing expected loss.”

- **Gacha FX**:  
  “Implement `src/ui/components/GachaModal.tsx` using Pixi particles (sparkle, flare), tier‑colored light, 2‑step reveal animation with SFX cues.”

---

## 18) Testing Checklist

- Data build filters English move names out.  
- Type chart loaded and damage multipliers match expectations.  
- Skills call `SkillOps` exactly once per designed effect (or as multi‑hit specifies).  
- PP resets properly at battle start and after battle.  
- CPU uses switch logic in disadvantage.  
- Draw is strictly uniform (statistically testable via many trials).  
- Korean labels appear everywhere; no English type names leak to UI.

---

## 19) Future: Online PvP

- **Authoritative server** handles turn resolution; clients only choose actions.  
- Use Supabase Realtime or a Node/WebSocket broker; rooms match by MMR or casual.  
- Persist battle logs; anti‑tamper validations server‑side.

---

## 20) Cautions (as requested)

1) **Make the UI stylish** — battle feel & gacha glam are crucial to retention.  
2) **Korean game**: all UI in Korean; types shown in Korean; **exclude English‑named moves** when parsing `pokemon_list.xlsx`.  
3) **If using Supabase**: after development, explicitly configure Email/Password auth, create tables, enable RLS, define policies, set env keys, index tables, validate CORS, and (optionally) move critical economy to Edge Functions (see §12 for exact steps).

---

**You’re set.** Run Codex CLI with the prompts in §17 to scaffold code. Then `npm run dev`, open the browser, and start battling. The build will always bake sprites & compile skills so runtime stays fast and deterministic. 화려하게, 깔끔하게, 한국어로.
