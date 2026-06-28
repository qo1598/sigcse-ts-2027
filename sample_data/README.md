# Sample Data (synthetic)

**These records are synthetic / dummy data — not real students.** No real responses
are released, per IRB and consent restrictions. The purpose is to make the **data
shape** concrete: what a student's raw response looks like, and how it becomes the
0–1 **performance** and **self-report** scores analyzed in the paper.

## Files
| File | What it shows |
|---|---|
| `student_record_example.json` | Two synthetic students on the focal mission **E-2-M** ("Can we trust the answer?"): raw `answers` JSON, the rule-scored `rubric_scores`, the post-mission KSA self-report, and a synthetic pre-survey row. |

## How the pieces connect
1. **Raw submission** (`mission_submission_v4.answers`) — exactly what the platform
   stores from the student's interaction (`step2` = which AI claims were flagged +
   why; `step3` = the open confirmation question; `step4` = use/hold decisions;
   `step5` = attitude chips). Field shapes are documented at the top of
   `../ruleScorers.js`.
2. **Performance score** — apply the E-2-M scorers in `../ruleScorers.js`
   (`a1, b1, c1, c2`) to `answers`; each criterion is 0–2; the performance score is
   their mean normalized to 0–1. The open criterion `b2` (confirmation question) is
   scored separately (LLM panel / human raters) and is **not** part of performance.
3. **Self-report score** — average the mapped KSA items in
   `post_mission_evaluation` (5-point Likert; see `../survey_items.md`) and normalize
   to 0–1.

Student A (strong performance, high confidence) and Student B (partial performance,
still fairly confident) illustrate the **say–do gap** that is the paper's focus.

## Reproducing the performance score
```js
import { scoreChangedRuleCriteria } from '../ruleScorers.js';
const answers = record.mission_submission_v4.answers;
const scores = scoreChangedRuleCriteria('E-2-M', answers); // { a1:2, b1:2, c1:2, c2:2 }
const ids = Object.keys(scores);                           // rule criteria only
const performance = ids.reduce((s,id) => s + scores[id], 0) / ids.length / 2; // 0..1
```
`scoreChangedRuleCriteria(cardCode, answers)` is the authoritative entry point in
`../ruleScorers.js`; it returns each rule criterion as 0/1/2 for the given mission.
