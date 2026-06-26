# Replication Package — Performance-Based Assessment of Elementary AI Literacy

*Operationalizing the AILit Framework's **Engaging with AI** domain as 12 performance
missions (E-1…E-4 × three grade bands).*

This package releases the **task–rubric mappings** and **deterministic answer keys**
referenced in the paper. It lets others reproduce how closed-task responses are turned
into the 0–1 performance scores used throughout RQ1–RQ3, and how open artifacts are
rubric-scored.

> **Anonymized for review.** No author, institution, or school names appear here.
> Student response data are **not** included (IRB / consent restrictions); only the
> instrument, scoring logic, and rubrics are released.

## Contents

| File | What it is |
|---|---|
| `mission_scoring_map.md` | The 12 missions: construct, grade band, aligned K/S/A codes, scoring criteria, and the **rule answer keys** (which choices count as correct). Human-readable summary of the code below. |
| `e_domain_rubric.js` | Canonical **rubric definitions** — for each criterion: which response field it scores, scoring type (`rule` / `pattern` / `llm_judge`), 0/1/2 level cutoffs, and aligned KSA codes. |
| `ruleScorers.js` | Canonical **deterministic scorers** — the exact answer-key constants and logic that map a raw student response to a rule score. This is the authoritative source; `mission_scoring_map.md` summarizes it. |
| `rubricPrompt.js` | The **LLM grading prompts** — `buildSystemPrompt` / `buildUserPrompt` construct the exact instructions sent to each model, and `sanitizeAnswers` strips images and any non-response fields so only the rubric and the student's answer text are sent (no identifiers). |
| `multiModelRubricService.js` | The **three-model panel + majority vote** — calls Gemini 3.5 Flash, Claude Haiku 4.5, and GPT-5.4 on the same prompt (temperature 0.2, JSON mode) and combines per-criterion votes (unanimous / 2-of-3; three-way split or tie flagged for review). |

## Scoring methodology (as reported in the paper)

- **`rule` (deterministic).** The response is compared against a fixed answer key
  (see `mission_scoring_map.md`). The same response always yields the same score, so
  the measure needs no rater and is reproducible by construction. **All RQ1–RQ3
  "performance" scores use only rule criteria** (mean of rule-criterion scores, 0–1).
- **`pattern`.** Keyword/structure checks on short free text (not used in the RQ1–RQ3
  performance score).
- **`llm_judge` (open reasoning).** Free-text artifacts in the middle/upper bands,
  scored 0–2 by a three-model LLM panel (majority vote). Used **only** in the
  exploratory measurement check; a blind human-scoring check is reported in the paper
  (inter-rater weighted κ = 0.95; human↔LLM κ = 0.61).

## Reproducing a performance score

1. Take a student's raw response object (`answers.stepN`, shapes documented at the top
   of `ruleScorers.js`).
2. For the mission's rule criteria, apply the matching scorer in `ruleScorers.js`.
3. Normalize: performance (0–1) = mean(rule-criterion scores) / max per criterion.

## Pre-submission checklist (maintainers)

- [x] Copy `e_domain_rubric.js` and `ruleScorers.js` into this folder. *(done; both are
      standalone — no imports)*
- [x] Scan all files for any author / institution / school string (anonymization). *(clean)*
- [ ] Push this `replication/` folder to a **new, dedicated** public GitHub repo
      (not the full platform repo).
- [ ] Submit that repo to `anonymous.4open.science`; paste the anonymized URL into the
      paper footnote (currently a placeholder `…/r/ailit-engaging`).
- [ ] At camera-ready: replace the anonymized link with the de-anonymized repository.
