/**
 * E-1·E-2 rule 기준 결정적 재채점기 (v3.1 루브릭 반영분)
 *
 * 목적: 학생 원자료(mission_submissions_v4.answers)만으로 rule 기준 점수를
 *       LLM 없이 코드로 산출한다. v3 → v3.1에서 문구가 바뀐 7개 rule 기준 전용.
 *
 * 입력 answers shape (submitMissionV4.buildSubmissionRow 기준):
 *   choice_cards            → answers.stepN : string[] (선택 id 배열)
 *   photo_or_card_select    → answers.stepN : { value: id }
 *   single_select_buttons   → answers.stepN : id (string)
 *   per_case_judge          → answers.stepN : { caseId: { judgment, text } }
 *   judge_qa_carousel       → answers.stepN : { qId: { judge, reason } }
 *   bubble_select_correct   → answers.stepN : { bubbleId: { selected, reason } }
 *
 * 각 함수는 0/1/2 정수를 반환한다.
 */

// ── E-1-L 매핑 ────────────────────────────────────────────────
// step1(예시 카드)·step2(주변 카드) id를 공통 범주로 묶는다.
const E1L_CATEGORY = {
  // step1 ids
  robot_vacuum: 'clean', voice_assistant: 'voice', recommend_feed: 'recommend', face_unlock: 'face',
  // step2 cardOptions ids
  home_robot_cleaner: 'clean', voice_speaker: 'voice', recommend_app: 'recommend', face_camera: 'face',
  navigation_app: 'navigation', auto_door: 'door',
};
// step2 카드 → step4 주요 기능 id
const E1L_FUNCTION = {
  home_robot_cleaner: 'clean', navigation_app: 'navigate', voice_speaker: 'speak',
  face_camera: 'recognize', recommend_app: 'recommend',
};

// a2 주변 AI 인식: step2 카드가 step1에서 고른 AI와 같은 범주인가
function e1l_a2(answers) {
  const selected = answers?.step2?.value;
  if (!selected) return 0;
  const step1 = Array.isArray(answers?.step1) ? answers.step1 : [];
  const step1Cats = new Set(step1.map(id => E1L_CATEGORY[id]).filter(Boolean));
  const selCat = E1L_CATEGORY[selected];
  return (selCat && step1Cats.has(selCat)) ? 2 : 1;
}

// b1 장소 연결: 구체 장소면 정답(단일 정답 강제 안 함)
function e1l_b1(answers) {
  const v = answers?.step3;
  if (!v) return 0;
  if (v === 'other') return 1;
  return ['home', 'school', 'street', 'car', 'store'].includes(v) ? 2 : 1;
}

// b2 도움 기능 이해: step4가 step2 카드의 주요 기능과 부합
function e1l_b2(answers) {
  const v = answers?.step4;
  if (!v) return 0;
  if (v === 'other') return 1;
  const expected = E1L_FUNCTION[answers?.step2?.value];
  return (expected && v === expected) ? 2 : 1;
}

// ── E-1-H a2 경계 사례 판정 ───────────────────────────────────
function e1h_a2(answers) {
  const s3 = answers?.step3;
  if (!s3 || typeof s3 !== 'object') return 0;
  const j = (id) => s3[id]?.judgment;
  const cases = ['auto_door', 'basic_search', 'smart_thermostat', 'spam_filter'];
  const answered = cases.map(j).filter(Boolean);
  if (answered.length === 0) return 0;
  if (new Set(answered).size <= 1) return 0;          // 모두 같은 값
  const level2 =
    j('spam_filter') === 'ai' &&
    j('auto_door') === 'non_ai' &&
    j('basic_search') === 'non_ai' &&
    (j('smart_thermostat') === 'ai' || j('smart_thermostat') === 'unclear');
  return level2 ? 2 : 1;
}

// ── E-2-L b1 이상 이유 선택 ───────────────────────────────────
const E2L_STRANGE = ['q2', 'q4', 'q5', 'q6'];
const e2l_correctReason = (qId) => (qId === 'q6' ? 'contradicts_itself' : 'wrong_fact');

function e2l_b1(answers) {
  const s1 = answers?.step1;
  if (!s1 || typeof s1 !== 'object') return 0;
  const judgedStrange = E2L_STRANGE.filter(q => s1[q]?.judge === 'strange');
  const withReason = judgedStrange.filter(q => s1[q]?.reason);
  if (withReason.length === 0) return 0;
  const allMatch = withReason.every(q => s1[q].reason === e2l_correctReason(q));
  return allMatch ? 2 : 1;
}

// ── E-2-M a1 의심 말풍선 식별 ─────────────────────────────────
function e2m_a1(answers) {
  const s2 = answers?.step2;
  if (!s2 || typeof s2 !== 'object') return 0;
  const sel = (id) => s2[id]?.selected === true;
  const hits = ['a3', 'a6'].filter(sel).length;          // 정탐
  const fp = ['a1', 'a2', 'a4', 'a5'].filter(sel).length; // 오탐
  if (hits === 0 || fp >= 2) return 0;
  if (hits === 2 && fp === 0) return 2;
  return 1;                                               // 정탐 1+ & 오탐 1 이하
}

// ── E-2-M b1 이상 이유 선택 ───────────────────────────────────
function e2m_b1(answers) {
  const s2 = answers?.step2;
  if (!s2 || typeof s2 !== 'object') return 0;
  const targets = ['a3', 'a6'].filter(id => s2[id]?.selected === true);
  const withReason = targets.filter(id => s2[id]?.reason);
  if (withReason.length === 0) return 0;
  const bothCorrect = ['a3', 'a6'].every(id => s2[id]?.selected === true && s2[id]?.reason === 'wrong_fact');
  return bothCorrect ? 2 : 1;
}

// ── E-3-L 매핑 (추천 탐험가, 4기준 전면 선택형 재설계) ────────
// 모든 채점 기준이 선택형(칩/단일선택) → LLM 없이 결정적 채점.
const E3L_REASON_CORRECT = ['my_yes', 'my_topic'];   // 추천 원리에 부합
const E3L_REASON_WRONG   = ['random', 'everyone'];   // 오개념(내 입력과 무관)

// a1 추천 원리 인식: step4 칩
function e3l_a1(answers) {
  const sel = Array.isArray(answers?.step4) ? answers.step4 : [];
  if (sel.length === 0) return 0;
  const hasCorrect = sel.some(id => E3L_REASON_CORRECT.includes(id));
  const hasWrong = sel.some(id => E3L_REASON_WRONG.includes(id));
  if (!hasCorrect) return 0;
  if (sel.includes('my_yes') && !hasWrong) return 2;
  return 1;
}

// a2 내 정보의 영향 인식: step5 단일 선택
function e3l_a2(answers) {
  const v = answers?.step5;
  if (!v || v === 'same') return 0;
  if (v === 'different') return 2;
  return 1;                                            // dont_know
}

// b1 추천의 영향 판단: step6 칩
const E3L_INFLUENCE = ['more_pick', 'see_similar', 'miss_new'];
function e3l_b1(answers) {
  const sel = Array.isArray(answers?.step6) ? answers.step6 : [];
  const hits = sel.filter(id => E3L_INFLUENCE.includes(id)).length;
  const hasNoEffect = sel.includes('no_effect');
  if (hits === 0) return 0;
  if (hits >= 2 && !hasNoEffect) return 2;
  return 1;
}

// b2 탐구·주도 태도: step7 칩
// 'not_curious'(더 알아보고 싶지 않아요)는 탐구 태도와 모순 → 2점 차단(전부 찍기 방지).
const E3L_CURIOUS = ['other_topic', 'try_opposite', 'how_made', 'search_self'];
function e3l_b2(answers) {
  const sel = Array.isArray(answers?.step7) ? answers.step7 : [];
  const hits = sel.filter(id => E3L_CURIOUS.includes(id)).length;
  const hasNotCurious = sel.includes('not_curious');
  if (hits === 0) return 0;
  if (hits >= 2 && !hasNotCurious) return 2;   // 탐구칩 2개 이상 + 모순칩 미선택
  return 1;
}

// ── E-3-M a1 (취향 반영 실기) ─────────────────────────────────
// 별점 ★4~5를 준 옷들이 '한 가지 태그'(색·스타일·품목·계절)를 절반 이상 공유하면
// "일관된 취향을 도구에 반영"으로 보고 2점. 단순 개수가 아니라 일관성으로 변별한다.
// (추천기 computeClothingRecommendations와 동일하게 모든 태그 차원을 본다)
// ⚠️ DRIFT 주의: 아래 E3M_TAGS는 missionsV4/E-3.js clothingItems(cloth_01~20)의 tags를
//    하드코딩 복제한 것이다. 미션의 옷 구성/태그를 바꾸면 이 표도 반드시 동기화해야
//    채점이 어긋나지 않는다. (2026-06 기준 20벌 일치 확인)
const E3M_TAGS = {
  cloth_01: ['bright_color', 'cute_style', 'tshirt', 'summer'],
  cloth_02: ['dark_color', 'sporty_style', 'pants', 'allseason'],
  cloth_03: ['pastel_color', 'cute_style', 'hoodie', 'allseason'],
  cloth_04: ['vivid_color', 'fancy_style', 'skirt', 'summer'],
  cloth_05: ['pastel_color', 'clean_style', 'pants', 'allseason'],
  cloth_06: ['dark_color', 'clean_style', 'hoodie', 'winter'],
  cloth_07: ['pastel_color', 'cute_style', 'hat', 'allseason'],
  cloth_08: ['bright_color', 'sporty_style', 'shoes', 'allseason'],
  cloth_09: ['bright_color', 'cute_style', 'tshirt', 'summer'],
  cloth_10: ['dark_color', 'sporty_style', 'hoodie', 'winter'],
  cloth_11: ['pastel_color', 'cute_style', 'skirt', 'summer'],
  cloth_12: ['vivid_color', 'sporty_style', 'hoodie', 'winter'],
  cloth_13: ['bright_color', 'clean_style', 'tshirt', 'summer'],
  cloth_14: ['pastel_color', 'clean_style', 'hoodie', 'allseason'],
  cloth_15: ['vivid_color', 'sporty_style', 'pants', 'summer'],
  cloth_16: ['bright_color', 'fancy_style', 'skirt', 'summer'],
  cloth_17: ['dark_color', 'clean_style', 'pants', 'allseason'],
  cloth_18: ['vivid_color', 'cute_style', 'hat', 'allseason'],
  cloth_19: ['pastel_color', 'cute_style', 'shoes', 'allseason'],
  cloth_20: ['dark_color', 'sporty_style', 'hoodie', 'winter'],
};

function e3m_a1(answers) {
  const r = answers?.step2;
  if (!r || typeof r !== 'object') return 0;
  const high = Object.keys(r).filter(id => Number(r[id]) >= 4);
  if (high.length < 3) return 0;
  const freq = {};
  high.forEach(id => (E3M_TAGS[id] || []).forEach(t => { freq[t] = (freq[t] || 0) + 1; }));
  const maxCount = Object.values(freq).reduce((m, c) => Math.max(m, c), 0);
  return maxCount / high.length >= 0.5 ? 2 : 1;   // 한 태그를 '절반 이상' 공유 시 일관된 취향
  // (이전 `> 0.5`는 4점옷 4벌·단일태그 2벌=정확히 0.5인 흔한 일관취향을 1점으로 과소채점했음)
}

// ── E-3-H 매핑 (추천 사용 컨설턴트) ───────────────────────────
// step1: case_carousel_reason → answers.step1[caseId] = { reasons: string[] }
// step2: per_case_judge       → answers.step2[caseId] = { judgment, plans:[], limitations:[] }
const E3H_REASON = { case_1: 'similar_topic', case_2: 'frequency_time', case_3: 'selection_pattern', case_4: 'similar_topic' };
const E3H_WRONG  = ['random', 'everyone'];   // 오개념(우연·모두 동일)
const E3H_JUDGE  = { case_1: 'helpful', case_2: 'careful', case_3: 'both', case_4: 'careful' };

// a1 추천 이유 분석: 케이스별 맞는 신호 선택 + 오개념 미선택 + 과다선택 방지(≤2개)
function e3h_a1(answers) {
  const s = answers?.step1;
  if (!s || typeof s !== 'object') return 0;
  let hit = 0;
  for (const [cid, want] of Object.entries(E3H_REASON)) {
    const reasons = s[cid]?.reasons || [];
    const hasWrong = reasons.some(r => E3H_WRONG.includes(r));
    if (reasons.includes(want) && !hasWrong && reasons.length <= 2) hit++;
  }
  if (hit <= 1) return 0;
  return hit <= 3 ? 1 : 2;
}

// 근거 칩: 정답군 + 오답(distractor)군
const E3H_PLAN_OK   = ['find_fast', 'collect_easy', 'convenient'];
const E3H_PLAN_BAD  = ['plan_passive'];     // 수동성을 장점으로 오인
const E3H_LIM_OK    = ['similar_only', 'miss_new', 'narrow_view'];
const E3H_LIM_BAD   = ['lim_random'];       // 추천이 내 행동과 무관하다는 오개념

// 판단에 맞는 근거 칩을 '정답만' 골랐는지(정답 ≥1 + 오답 0) 확인
function e3h_rationaleOk(ca, judgment) {
  const plans = ca.plans || [];
  const lims = ca.limitations || [];
  const planOk = plans.some(p => E3H_PLAN_OK.includes(p)) && !plans.some(p => E3H_PLAN_BAD.includes(p));
  const limOk = lims.some(l => E3H_LIM_OK.includes(l)) && !lims.some(l => E3H_LIM_BAD.includes(l));
  if (judgment === 'helpful') return planOk;
  if (judgment === 'careful') return limOk;
  if (judgment === 'both') return planOk && limOk;   // '둘 다'는 좋은 점·아쉬운 점 모두 정답
  return false;
}

// b1 추천 영향·한계 판단: 케이스별 올바른 판단 + 정답 근거 칩(오답 칩 회피)
function e3h_b1(answers) {
  const s = answers?.step2;
  if (!s || typeof s !== 'object') return 0;
  const judged = Object.keys(E3H_JUDGE).map(c => s[c]?.judgment).filter(Boolean);
  if (judged.length === 0 || new Set(judged).size <= 1) return 0;   // 모두 같은 판단 → 0
  let hit = 0;
  for (const [cid, want] of Object.entries(E3H_JUDGE)) {
    const ca = s[cid] || {};
    if (ca.judgment === want && e3h_rationaleOk(ca, want)) hit++;
  }
  if (hit <= 1) return 0;
  return hit <= 2 ? 1 : 2;   // 3개 이상 정답 판단+정답 근거 → 2
}

// ── E-4-L 매핑 (AI 배려 관찰자) ───────────────────────────────
// step2: choice_cards         → answers.step2 : string[]
// step3: person_reason_select → answers.step3 : { person, reasons:[] }
// step4: choice_cards         → answers.step4 : string[]
// 각 선택형 준거에서 distractor(무관 칩) 선택 시 2점을 차단해 '전부 찍기 만점'을 막는다.
const E4L_DIFF_OK    = ['recognized_right_away', 'needs_retry', 'easy_use', 'no_response'];
const E4L_DIFF_BAD   = ['same_result', 'both_failed'];
const E4L_REASON_OK  = ['not_recognized', 'needs_retry', 'hard_to_use', 'system_not_fit'];
const E4L_REASON_BAD = ['too_loud', 'broken_device'];
const E4L_CARE_OK    = ['button_option', 'different_way_to_use', 'fit_everyone', 'easy_retry'];
const E4L_CARE_BAD   = ['change_color', 'make_bigger'];

// a1 차이 인식: 관련 차이 2개 이상 + 무관 미선택 → 2
function e4l_a1(answers) {
  const sel = Array.isArray(answers?.step2) ? answers.step2 : [];
  const ok = sel.filter(id => E4L_DIFF_OK.includes(id)).length;
  const bad = sel.some(id => E4L_DIFF_BAD.includes(id));
  if (ok === 0) return 0;
  return (ok >= 2 && !bad) ? 2 : 1;
}

// a2 어려움 대상 식별: person_b(여러 번 시도한 사람)가 정답
function e4l_a2(answers) {
  const p = answers?.step3?.person;
  if (!p) return 0;
  return p === 'person_b' ? 2 : 1;
}

// b1 어려움 이유 선택: 정답 이유 1개 이상 + 무관 미선택 → 2
function e4l_b1(answers) {
  const sel = Array.isArray(answers?.step3?.reasons) ? answers.step3.reasons : [];
  if (sel.length === 0) return 0;
  const ok = sel.some(id => E4L_REASON_OK.includes(id));
  const bad = sel.some(id => E4L_REASON_BAD.includes(id));
  return (ok && !bad) ? 2 : 1;
}

// c1 배려 방법 선택: 적절한 방법 1개 이상 + 무관 미선택 → 2
function e4l_c1(answers) {
  const sel = Array.isArray(answers?.step4) ? answers.step4 : [];
  if (sel.length === 0) return 0;
  const ok = sel.some(id => E4L_CARE_OK.includes(id));
  const bad = sel.some(id => E4L_CARE_BAD.includes(id));
  return (ok && !bad) ? 2 : 1;
}

// ── E-4-M 매핑 (공정성 점검단원) ──────────────────────────────
// step1/2/3: case_judge_carousel → answers.stepN : { caseId: { judgment | fairness | reasons:[] } }
// ★ 5사례 = 공정 2(둘 다 비슷) + 불공정 3(불리한 쪽 A·B·A). 한쪽으로 전부 찍으면(모두 동일) 0점.
//   공정 사례는 불리한 사람이 없으므로 정답 judgment = 'both_similar', fairness = 'okay'.
const E4M_CASE_DEF = {
  face_recognition:  { judgment: 'user_a',       fairness: 'unfair' },
  voice_recognition: { judgment: 'user_b',       fairness: 'unfair' },
  auto_reading:      { judgment: 'both_similar', fairness: 'okay'   },
  video_subtitle:    { judgment: 'user_a',       fairness: 'unfair' },
  book_recommend:    { judgment: 'both_similar', fairness: 'okay'   },
};
const E4M_CASES = Object.keys(E4M_CASE_DEF);
const E4M_N = E4M_CASES.length;
const E4M_REASON_OK   = ['not_recognized', 'not_reflected', 'same_way_not_fit', 'not_considered']; // 불공정 사례 정답
const E4M_REASON_FAIR = ['fair_fits_all'];                                                          // 공정 사례 정답
const E4M_REASON_BAD  = ['user_mistake', 'wifi_problem'];                                            // 공통 오답

// a1 불리 학생 식별: 사례별 정답 일치 수 (전부 동일 = 패턴 찍기 → 0)
function e4m_a1(answers) {
  const s = answers?.step1;
  if (!s || typeof s !== 'object') return 0;
  const judged = E4M_CASES.map(c => s[c]?.judgment).filter(Boolean);
  if (judged.length < E4M_N || new Set(judged).size <= 1) return 0;   // 미완 또는 전부 동일
  const correct = E4M_CASES.filter(c => s[c]?.judgment === E4M_CASE_DEF[c].judgment).length;
  if (correct === E4M_N) return 2;
  return correct >= E4M_N - 1 ? 1 : 0;   // 4/5 → 1, 그 이하 → 0
}

// c1 공정성 판단: 사례별 공정/불공정 정답 일치 수 (전부 동일 = 패턴 찍기 → 0)
function e4m_c1(answers) {
  const s = answers?.step2;
  if (!s || typeof s !== 'object') return 0;
  const judged = E4M_CASES.map(c => s[c]?.fairness).filter(Boolean);
  if (judged.length < E4M_N || new Set(judged).size <= 1) return 0;   // 미완 또는 전부 동일
  const correct = E4M_CASES.filter(c => s[c]?.fairness === E4M_CASE_DEF[c].fairness).length;
  if (correct === E4M_N) return 2;
  return correct >= E4M_N - 1 ? 1 : 0;
}

// b1 원인 분석: 사례별 정답 이유(불공정=원인 / 공정=fair_fits_all, 오답 미포함) + 조합 다양성
function e4m_b1(answers) {
  const s = answers?.step3;
  if (!s || typeof s !== 'object') return 0;
  const results = E4M_CASES.map(c => {
    const rs = Array.isArray(s[c]?.reasons) ? s[c].reasons : [];
    const okPool = E4M_CASE_DEF[c].fairness === 'okay' ? E4M_REASON_FAIR : E4M_REASON_OK;
    const ok = rs.some(id => okPool.includes(id));
    const bad = rs.some(id => E4M_REASON_BAD.includes(id));
    return { valid: ok && !bad, key: rs.slice().sort().join(',') };
  });
  const valid = results.filter(r => r.valid);
  if (valid.length === 0) return 0;
  const distinct = new Set(valid.map(r => r.key)).size;
  return (valid.length === E4M_N && distinct >= 2) ? 2 : 1;   // 모든 사례 정답 이유 + 조합 2종 이상
}

// ── E-4-H 매핑 (AI 공정성 자문위원) ───────────────────────────
// step2/3/4: case_judge_carousel → answers.stepN : { sceneId: { judgment | reasons:[] } }
// ★ 불리한 방문객을 장면마다 교차 배치(게이트=B, 추천=A, 키오스크=B, 자막=A)해
//   한쪽으로 전부 찍으면(모두 동일) 0점 처리한다.
const E4H_SCENES        = ['scene1_gate', 'scene2_recommendation', 'scene3_kiosk', 'scene4_performance'];
const E4H_DISADVANTAGED = { scene1_gate: 'user_b', scene2_recommendation: 'user_a', scene3_kiosk: 'user_b', scene4_performance: 'user_a' };
// 장면별 정답 신호(accept-set): 키오스크는 '엉뚱한 안내 + 더 돌아감' → worse_result·wait_longer 둘 다 인정
const E4H_SIGNAL_DEF    = {
  scene1_gate:           ['wait_longer'],
  scene2_recommendation: ['fewer_choices'],
  scene3_kiosk:          ['worse_result', 'wait_longer'],
  scene4_performance:    ['less_enjoyment'],
};
const E4H_IMPACT_BAD    = ['ticket_price', 'weather_issue'];
const E4H_REASON_HIGHER = ['cumulative_harm', 'unequal_opportunity'];
const E4H_REASON_BAD    = ['just_unlucky', 'ai_cannot_help'];   // 문제를 우연·불가피로 치부하는 오개념 칩

// a1 문제 신호 포착: 장면별 정답 신호 일치 수 (전부 동일 = 찍기 → 0, 장면-신호 매칭을 봄)
function e4h_a1(answers) {
  const s = answers?.step2;
  if (!s || typeof s !== 'object') return 0;
  const judged = E4H_SCENES.map(c => s[c]?.judgment).filter(Boolean);
  if (judged.length < 3 || new Set(judged).size <= 1) return 0;   // 미완 또는 전부 동일(찍기)
  const correct = E4H_SCENES.filter(c => E4H_SIGNAL_DEF[c].includes(s[c]?.judgment)).length;
  if (correct < 2) return 0;
  return correct >= 3 ? 2 : 1;   // 장면별 정답 3~4개 → 2, 2개 → 1
}

// c1 영향 대상·종류 판단: 사례별 정답 일치 수 + 영향 근거 (전부 동일 = 패턴 찍기 → 0)
function e4h_c1(answers) {
  const s = answers?.step3;
  if (!s || typeof s !== 'object') return 0;
  const judged = E4H_SCENES.map(c => s[c]?.judgment).filter(Boolean);
  if (judged.length < 3 || new Set(judged).size <= 1) return 0;   // 미완 또는 전부 동일
  const correct = E4H_SCENES.filter(c => s[c]?.judgment === E4H_DISADVANTAGED[c]).length;
  const reasoned = E4H_SCENES.filter(c => {
    const rs = Array.isArray(s[c]?.reasons) ? s[c].reasons : [];
    return rs.some(id => !E4H_IMPACT_BAD.includes(id));
  }).length;
  if (correct < 2) return 0;
  return (correct >= 3 && reasoned >= 3) ? 2 : 1;
}

// b1 문제 이유 서술: 모든 사례 정답 이유 2개 이상(오개념 칩 미선택) + 상위 개념(누적·불평등) 1개 이상 → 2
//   오개념 칩(운·불가피)을 하나라도 고르면 2점 차단 → '다 찍기'로는 만점 불가
function e4h_b1(answers) {
  const s = answers?.step4;
  if (!s || typeof s !== 'object') return 0;
  const stats = E4H_SCENES.map(c => {
    const rs = Array.isArray(s[c]?.reasons) ? s[c].reasons : [];
    return {
      valid: rs.filter(id => !E4H_REASON_BAD.includes(id)).length,
      bad:   rs.some(id => E4H_REASON_BAD.includes(id)),
    };
  });
  if (stats.every(r => r.valid === 0)) return 0;
  const allTwoClean = stats.every(r => r.valid >= 2 && !r.bad);
  const hasHigher = E4H_SCENES.some(c => (s[c]?.reasons || []).some(id => E4H_REASON_HIGHER.includes(id)));
  return (allTwoClean && hasHigher) ? 2 : 1;
}

// ── 커버리지 보강: rubric은 rule인데 결정적 scorer가 없던 E-1·E-2 기준 ──
// (이전엔 LLM 다수결로 채점되어 rubric 의도(결정적)와 불일치했음. 전수 감사 후 보강.)

// E-1-L/a1, E-1-M/a1 AI/비AI 판별: step1 choice_cards(string[]). 비AI 포함 시 0.
const E1L_AI = ['robot_vacuum', 'voice_assistant', 'recommend_feed', 'face_unlock'];
const E1M_AI = ['robot_vacuum', 'face_unlock', 'translate_app', 'recommend_feed'];
const E1_NONAI = ['calculator', 'lamp'];
function aiPickScore(sel, aiSet) {
  if (!Array.isArray(sel) || sel.length === 0) return 0;
  if (sel.some(id => E1_NONAI.includes(id))) return 0;       // 비AI 선택 → 0
  const ai = sel.filter(id => aiSet.includes(id)).length;
  if (ai === 0) return 0;
  return ai >= 3 ? 2 : 1;                                     // AI 3개↑ → 2, 1~2개 → 1
}
const e1l_a1 = (a) => aiPickScore(a?.step1, E1L_AI);
const e1m_a1 = (a) => aiPickScore(a?.step1, E1M_AI);

// E-1-M/b1 하는 일 연결: step2 카드 → step3 주요 기능 일치
const E1M_FUNCTION = {
  home_robot_cleaner: 'auto_act', navigation_app: 'navigate', translate_app2: 'translate',
  voice_speaker: 'listen', face_camera: 'recognize', recommend_app: 'recommend',
};
function e1m_b1(answers) {
  const v = answers?.step3;
  if (!v) return 0;
  if (v === 'other') return 1;
  const expected = E1M_FUNCTION[answers?.step2?.value];
  return (expected && v === expected) ? 2 : 1;
}

// E-1-H/a1 기본 분류 정확도: step1 classify {cardId: 'ai'|'non_ai'|'unclear'}
const E1H_KEY = {
  calculator: 'non_ai', face_unlock: 'ai', robot_vacuum: 'ai', recommend_video: 'ai',
  auto_door: 'non_ai', navigation: 'ai', translate_app: 'ai', alarm_clock: 'non_ai',
};
const E1H_NONAI = ['calculator', 'auto_door', 'alarm_clock'];
function e1h_a1(answers) {
  const s = answers?.step1;
  if (!s || typeof s !== 'object') return 0;
  const ids = Object.keys(E1H_KEY);
  const answered = ids.filter(id => s[id]);
  if (answered.length === 0) return 0;
  const correct = ids.filter(id => s[id] === E1H_KEY[id]).length;
  const acc = correct / ids.length;
  const nonAiOk = E1H_NONAI.every(id => s[id] === 'non_ai');
  if (acc >= 0.75 && nonAiOk) return 2;                       // ≥75% + 비AI 전부 정답
  return acc >= 0.5 ? 1 : 0;
}

// E-1-H/c1 판단 기준 구성: step2 multi_select_chips(string[]), 핵심 개념 1개 이상 포함
const E1H_CORE = ['learns', 'predicts', 'adapts', 'recognizes'];
function e1h_c1(answers) {
  const sel = Array.isArray(answers?.step2) ? answers.step2 : [];
  if (sel.length === 0) return 0;
  if (sel.length === 1) return 1;
  return sel.some(id => E1H_CORE.includes(id)) ? 2 : 1;
}

// ── E-2 보강 ──────────────────────────────────────────────────
// E-2-L/a1 이상한 답 식별: step1 {qId:{judge}}, 정답 판정 수로 채점
const E2L_JUDGE_KEY = { q1: 'correct', q2: 'strange', q3: 'correct', q4: 'strange', q5: 'strange', q6: 'strange' };
function e2l_a1(answers) {
  const s = answers?.step1;
  if (!s || typeof s !== 'object') return 0;
  const ids = Object.keys(E2L_JUDGE_KEY);
  if (ids.every(q => !s[q]?.judge)) return 0;
  const correct = ids.filter(q => s[q]?.judge === E2L_JUDGE_KEY[q]).length;
  if (correct < 3) return 0;
  return correct >= 5 ? 2 : 1;                                // 5~6→2, 3~4→1
}

// E-2-L/c1 확인 방법: step2 choice_cards. ask_again(AI 그대로) 포함 시 1.
const E2L_SAFE = ['check_book', 'ask_adult', 'search_internet'];
function e2l_c1(answers) {
  const sel = Array.isArray(answers?.step2) ? answers.step2 : [];
  if (sel.length === 0) return 0;
  if (sel.includes('ask_again')) return 1;
  return sel.some(id => E2L_SAFE.includes(id)) ? 2 : 1;
}

// E-2-L/c2 게시판 결정: 자기 step1 판정과 step3 결정의 일관성 (correct→post, strange→skip/verify)
function e2l_c2(answers) {
  const s1 = answers?.step1, s3 = answers?.step3;
  if (!s3 || typeof s3 !== 'object') return 0;
  const ids = Object.keys(E2L_JUDGE_KEY);
  const decisions = ids.map(q => s3[q]?.judgment).filter(Boolean);
  if (decisions.length === 0) return 0;
  if (new Set(decisions).size <= 1) return 0;                 // 모두 같은 값 → 0
  const consistent = (q) => {
    const judge = s1?.[q]?.judge, d = s3[q]?.judgment;
    if (!judge || !d) return false;
    return judge === 'correct' ? d === 'post' : (d === 'skip' || d === 'verify');
  };
  return ids.every(consistent) ? 2 : 1;
}

// E-2-M/c1 사용/보류 결정: 자기 step2 selected와 step4 결정의 일관성 (true→hold, false→use)
const E2M_BUBBLES = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6'];
function e2m_c1(answers) {
  const s2 = answers?.step2, s4 = answers?.step4;
  if (!s4 || typeof s4 !== 'object') return 0;
  const dec = E2M_BUBBLES.map(id => s4[id]?.judgment).filter(Boolean);
  if (dec.length === 0) return 0;
  if (new Set(dec).size <= 1) return 0;                       // 모두 같은 값 → 0
  const consistent = (id) => {
    const j = s4[id]?.judgment;
    if (!j) return false;
    return (s2?.[id]?.selected === true) ? j === 'hold' : j === 'use';
  };
  return E2M_BUBBLES.every(consistent) ? 2 : 1;
}

// E-2-M/c2 유의 태도: step5 chips. 부적절(ask_many·do_copy) 포함 시 1.
const E2M_BAD = ['ask_many', 'do_copy'];
const E2M_SAFE = ['can_be_wrong', 'verify_facts', 'ask_source', 'cross_check', 'ask_followup'];
function e2m_c2(answers) {
  const sel = Array.isArray(answers?.step5) ? answers.step5 : [];
  if (sel.length === 0) return 0;
  if (sel.some(id => E2M_BAD.includes(id))) return 1;
  return sel.filter(id => E2M_SAFE.includes(id)).length >= 2 ? 2 : 1;
}

// E-2-H/a1 5개 기사 판정: step2 {sId: 'use'|'revise'|'verify'}(문자열). 문제기사 s2·s4·s5.
const E2H_PROBLEM = ['s2', 's4', 's5'];
const E2H_ALL = ['s1', 's2', 's3', 's4', 's5'];
function e2h_a1(answers) {
  const s = answers?.step2;
  if (!s || typeof s !== 'object') return 0;
  const all = E2H_ALL.map(id => s[id]).filter(Boolean);
  if (all.length === 0) return 0;
  if (new Set(all).size <= 1) return 0;                       // 모두 같은 값 → 0
  const probCorrect = E2H_PROBLEM.filter(id => s[id] === 'revise' || s[id] === 'verify').length;
  return probCorrect >= 2 ? 2 : 1;
}

// E-2-H/b1 판정 이유: step3 {sId: reason}(문자열). revise/verify 판정 기사 모두에 다른 이유.
function e2h_b1(answers) {
  const s2 = answers?.step2, s3 = answers?.step3;
  if (!s3 || typeof s3 !== 'object') return 0;
  const targets = E2H_ALL.filter(id => s2?.[id] === 'revise' || s2?.[id] === 'verify');
  const reasonOf = (id) => { const v = s3[id]; return typeof v === 'string' ? v : v?.reason; };
  const withReason = targets.filter(id => { const r = reasonOf(id); return r && r !== 'other'; });
  if (withReason.length === 0) return 0;
  if (withReason.length === 1) return 1;
  const allHave = targets.length > 0 && targets.every(id => { const r = reasonOf(id); return r && r !== 'other'; });
  const distinct = new Set(withReason.map(reasonOf)).size;
  return (allHave && distinct >= 2) ? 2 : 1;
}

// ── C-1 (생성형 창작) rule 스코어러 ──────────────────────────
// k1 지식 준거: misconception_probe 선택 = 정개념(learned) vs 오개념. tier2(why) 있으면 1/2 구분.
// 코드북 v2.4.1 §8 (안 A: probe tier1을 지식으로 채점)
function probeKnowledge(sel, why, hasTier2) {
  if (sel !== 'learned') return 0;                       // 오개념 보기 또는 미응답
  if (!hasTier2) return 2;                               // L: tier2 없음 → 정개념=2
  return (typeof why === 'string' && why.trim().length >= 5) ? 2 : 1;
}
function c1l_k1(a) { return probeKnowledge(a?.step6, null, false); }            // C-1-L step6
function c1m_k1(a) { return probeKnowledge(a?.step5, a?.step5_why, true); }      // C-1-M step5
function c1h_k1(a) { return probeKnowledge(a?.step6, a?.step6_why, true); }      // C-1-H step6

// C-1-L c1: step5_reason(근거) ↔ step5(verdict, 주인공·장소 판정) 논리 일치
function c1l_c1(a) {
  const r = a?.step5_reason;
  if (!r) return 0;                                       // 근거 미선택
  const v = a?.step5;
  const consistent =
    (v === 'kept_both'     && (r === 'role_same' || r === 'place_same')) ||
    (v === 'role_changed'  &&  r === 'role_diff') ||
    (v === 'place_changed' &&  r === 'place_diff') ||
    (v === 'both_changed'  && (r === 'role_diff' || r === 'place_diff'));
  return consistent ? 2 : 1;                              // 일치=2, 어긋남=1
}

// C-1-M b1: step3(option_adopt_hold) 채택·보류 구조 완성도
function c1m_b1(a) {
  const s = a?.step3 || {};
  if (s.adopt_index == null) return 0;                    // 채택 미선택
  if (!(s.adopt_reason || '').trim()) return 1;           // 채택했으나 이유 빈칸
  const hold = s.hold_index != null && (s.hold_reason || '').trim();
  return hold ? 2 : 1;                                    // 채택+보류 모두 이유까지 = 2
}
// C-1-M c1: 채택·보류 이유 칩 (서로 다른 기준 적용)
function c1m_c1(a) {
  const s = a?.step3 || {};
  const ac = s.adopt_reason_chip, hc = s.hold_reason_chip;
  if (!ac && !hc) return 0;                               // 둘 다 미선택
  if (!ac || !hc) return 1;                               // 하나만
  if (ac === 'other' && hc === 'other') return 1;         // 둘 다 '기타' = 구체 기준 없음
  return 2;                                               // 둘 다 + 구체 기준
}

// ── 디스패처 ──────────────────────────────────────────────────
// v3 → v3.1에서 바뀐 rule 기준 + 전면 재설계된 E-3-L / E-3-M(a1) / E-3-H(a1·b1) + E-4 전 학년 선택형.
export const CHANGED_RULE_CRITERIA = {
  'E-1-L': ['a1', 'a2', 'b1', 'b2'],
  'E-1-M': ['a1', 'b1'],
  'E-1-H': ['a1', 'a2', 'c1'],
  'E-2-L': ['a1', 'b1', 'c1', 'c2'],
  'E-2-M': ['a1', 'b1', 'c1', 'c2'],
  'E-2-H': ['a1', 'b1'],
  'E-3-L': ['a1', 'a2', 'b1', 'b2'],
  'E-3-M': ['a1'],
  'E-3-H': ['a1', 'b1'],
  'E-4-L': ['a1', 'a2', 'b1', 'c1'],
  'E-4-M': ['a1', 'c1', 'b1'],
  'E-4-H': ['a1', 'c1', 'b1'],
  'C-1-L': ['c1', 'k1'],
  'C-1-M': ['b1', 'c1', 'k1'],
  'C-1-H': ['k1'],
};

const SCORERS = {
  'E-1-L': { a1: e1l_a1, a2: e1l_a2, b1: e1l_b1, b2: e1l_b2 },
  'E-1-M': { a1: e1m_a1, b1: e1m_b1 },
  'E-1-H': { a1: e1h_a1, a2: e1h_a2, c1: e1h_c1 },
  'E-2-L': { a1: e2l_a1, b1: e2l_b1, c1: e2l_c1, c2: e2l_c2 },
  'E-2-M': { a1: e2m_a1, b1: e2m_b1, c1: e2m_c1, c2: e2m_c2 },
  'E-2-H': { a1: e2h_a1, b1: e2h_b1 },
  'E-3-L': { a1: e3l_a1, a2: e3l_a2, b1: e3l_b1, b2: e3l_b2 },
  'E-3-M': { a1: e3m_a1 },
  'E-3-H': { a1: e3h_a1, b1: e3h_b1 },
  'E-4-L': { a1: e4l_a1, a2: e4l_a2, b1: e4l_b1, c1: e4l_c1 },
  'E-4-M': { a1: e4m_a1, c1: e4m_c1, b1: e4m_b1 },
  'E-4-H': { a1: e4h_a1, c1: e4h_c1, b1: e4h_b1 },
  'C-1-L': { c1: c1l_c1, k1: c1l_k1 },
  'C-1-M': { b1: c1m_b1, c1: c1m_c1, k1: c1m_k1 },
  'C-1-H': { k1: c1h_k1 },
};

/**
 * 카드의 바뀐 rule 기준 점수를 결정적으로 산출.
 * @returns {{ [criterionId: string]: 0|1|2 }} — 해당 카드에 스코어러가 없으면 {}
 */
export function scoreChangedRuleCriteria(cardCode, answers) {
  const map = SCORERS[cardCode];
  if (!map || !answers) return {};
  const out = {};
  for (const [id, fn] of Object.entries(map)) out[id] = fn(answers);
  return out;
}
