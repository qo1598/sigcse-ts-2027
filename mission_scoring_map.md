# Mission → Rubric → Answer-Key Map (Engaging with AI, E-1…E-4)

Human-readable summary of `e_domain_rubric.js` (criteria) and `ruleScorers.js`
(deterministic answer keys). For the exact, authoritative logic see `ruleScorers.js`;
this file is a convenience summary. Grade bands: **L** = grades 1–2, **M** = 3–4,
**H** = 5–6. Scoring types: `rule` (deterministic key), `pat` (keyword pattern),
`llm` (open-response, 3-model panel, 0–2).

Aligned K/S/A keys the matched post-mission self-report items (S&S = Self & Social,
Crit = Critical thinking; Cur = Curious, Resp = Responsible, Emp = Empathetic).

---

## E-1 — Finding AI in daily life *(AI identification)*

| Band | Aligned K/S/A | Scoring |
|---|---|---|
| L | K1.4 / S&S / Cur | 4 rule |
| M | K1.4 / S&S / Cur | 2 rule, 1 pat, 1 llm |
| H | K1.4 / Crit / Cur | 3 rule, 1 pat, 1 llm |

**Answer keys (rule):**
- **E-1-L** — `a1` pick-AI (`step1`): **AI = {robot_vacuum, voice_assistant, recommend_feed, face_unlock}**; selecting any non-AI **{calculator, lamp} → 0**. `a2` device-category match. `b1` place link. `b2` helper-function match (`E1L_FUNCTION` map).
- **E-1-M** — `a1` pick-AI: **AI = {robot_vacuum, face_unlock, translate_app, recommend_feed}**; non-AI **{calculator, lamp}**. `b1` function link (`E1M_FUNCTION`). *(b2 = pat, b3 = llm)*
- **E-1-H** — `a1` 3-way classify (`step1`, `E1H_KEY` ai/non_ai); **non-AI = {calculator, auto_door, alarm_clock}**. `a2` boundary-case judgment (≥2 distinct judgments required). `c1` criterion chips: **core = {learns, predicts, adapts, recognizes}**. *(b1 = pat, d1 = llm)*

> Misconception probe (paper RQ2): E-1-H over-attribution — `auto_door` and `calculator`
> have correct answer `non_ai`.

---

## E-2 — Can we trust the answer? *(critical evaluation — focal mission)*

| Band | Aligned K/S/A | Scoring |
|---|---|---|
| L | K4.3 / Crit / Resp | 4 rule |
| M | K4.3 / Crit / Resp | 4 rule, 1 llm |
| H | K4.3, K3.3 / Crit / Resp | 2 rule, 2 llm |

**Answer keys (rule):**
- **E-2-L** — `a1` strange/correct judgment (`step1`): **key = {q1:correct, q2:strange, q3:correct, q4:strange, q5:strange, q6:strange}** (q2 = six-legged cat, q4 = flying dog, q5 = "the Sun orbits the Earth", q6 = ice is originally hot). `b1` reason on strange cards: **`wrong_fact`** (q6 = **`contradicts_itself`**). `c1` how-to-verify chips: **{check_book, ask_adult, search_internet}**. `c2` board decision must be **consistent with the student's own `step1` judgment** (correct→post, strange→skip/verify).
- **E-2-M** — `a1`/`b1` flag false AI bubbles (`step2`); false items **a3 = "a bear is a reptile", a6 = "a dog sees only in black and white"**. `c1` use/hold decision consistent with flags (false→hold, true→use; bubbles a1–a6). *(+1 llm)*
- **E-2-H** — 2 rule + 2 llm (see `ruleScorers.js`).

> Misconception probe (paper RQ2): plausibly-worded false answers (q5 sun; a6 dog b/w)
> are missed far more than blatant ones (q2 cat; q4 dog).

---

## E-3 — Why is it shown to me? *(personalization)*

| Band | Aligned K/S/A | Scoring |
|---|---|---|
| L | K1.1 / S&S / Cur | 4 rule |
| M | K1.1, K5.1 / S&S / Cur | 1 rule, 3 llm |
| H | K1.1, K5.1 / S&S / Cur | 2 rule, 2 llm |

**Answer keys (rule):**
- **E-3-L** — `a1` recommendation-reason: **correct = {my_yes, my_topic}**, misconception **{random, everyone}**. `b1` influence: **{more_pick, see_similar, miss_new}**. `b2` curiosity: **{other_topic, try_opposite, how_made, search_self}**.
- **E-3-M** — `a1` tag-frequency inference over the 20 clothing items (`E3M_TAGS`; verified in sync with the mission's `clothingItems` tags). *(b1–b3 = llm)*
- **E-3-H** — `a1` reason per case: **{case_1: similar_topic, case_2: frequency_time, case_3: selection_pattern, case_4: similar_topic}** (misconception {random, everyone}). `b1` attitude judgment: **{case_1: helpful, case_2: careful, case_3: both, case_4: careful}**, with rationale **plan = {find_fast, collect_easy, convenient}** (not `plan_passive`) and **limitation = {similar_only, miss_new, narrow_view}** (not `lim_random`).

---

## E-4 — Does it work for everyone? *(bias & fairness)*

| Band | Aligned K/S/A | Scoring |
|---|---|---|
| L | K2.5 / S&S / Emp | 4 rule |
| M | K2.5, K5.4 / Crit / Emp | 3 rule, 2 llm |
| H | K2.5, K5.4 / Crit / Emp | 3 rule, 2 llm |

**Answer keys (rule):**
- **E-4-L** — difficulty-noticing **ok = {recognized_right_away, needs_retry, easy_use, no_response}** (distractor {same_result, both_failed}); cause **ok = {not_recognized, needs_retry, hard_to_use, system_not_fit}** (distractor {too_loud, broken_device}); care-suggestion **ok = {button_option, different_way_to_use, fit_everyone, easy_retry}** (distractor {change_color, make_bigger}).
- **E-4-M / E-4-H** — fairness judgment: **unfair case → cause chips (`not_*` / `same_way`)**, **fair case → `fair_fits_all`**; distractors **{user_mistake, wifi_problem}**. *(+2 llm each)*

---

*All "performance" scores in the paper (RQ1–RQ3) use only the `rule` criteria above,
averaged to 0–1. `pat`/`llm` criteria are not part of the performance score.*
