// 3총사(Gemini·Claude·ChatGPT) 다수결 채점.
// 각 모델이 준거별 0/1/2 점수를 내고, 준거 단위로 다수결을 계산한다.
//  - 2표 이상 일치 → 합의 점수 채택
//  - 3표가 0·1·2로 전부 갈리거나(또는 2모델만 응답 시 불일치) → needsReview=true
import { proxyGenerateContent } from './geminiProxy.js';
import { buildSystemPrompt, buildUserPrompt, sanitizeAnswers, parseCriteriaJson } from './rubricPrompt.js';

const GEMINI_MODEL = 'gemini-3.5-flash';

// --- 모델별 호출: 각각 [{id, score, rationale}] 배열을 반환 ---

async function callGemini(systemPrompt, userPrompt) {
  const res = await proxyGenerateContent({
    model: GEMINI_MODEL,
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    config: {
      maxOutputTokens: 4000,
      temperature: 0.2,
      systemInstruction: { parts: [{ text: systemPrompt }] },
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          criteria: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                id: { type: 'STRING' },
                score: { type: 'INTEGER' },
                rationale: { type: 'STRING' },
              },
              required: ['id', 'score', 'rationale'],
            },
          },
        },
        required: ['criteria'],
      },
    },
  });
  return parseCriteriaJson(res.text || '');
}

async function callJsonRoute(url, systemPrompt, userPrompt) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemPrompt, userPrompt }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `API error ${res.status}`);
  }
  const data = await res.json();
  return parseCriteriaJson(data.text || '');
}

const callClaude = (s, u) => callJsonRoute('/api/anthropic', s, u);
const callGpt = (s, u) => callJsonRoute('/api/openai', s, u);

// criteria 배열 → { id: {score, rationale} } 맵
function toMap(criteria) {
  const m = {};
  for (const c of criteria || []) {
    if (c && c.id != null) m[c.id] = { score: c.score, rationale: c.rationale || '' };
  }
  return m;
}

// 준거 한 개의 3표를 다수결 처리
function majority(scores) {
  const counts = {};
  for (const s of scores) if (s != null) counts[s] = (counts[s] || 0) + 1;
  const distinct = Object.keys(counts).length;
  if (distinct === 0) return { value: null, needsReview: true };
  let best = null, bestN = 0, tie = false;
  for (const [v, n] of Object.entries(counts)) {
    if (n > bestN) { best = Number(v); bestN = n; tie = false; }
    else if (n === bestN) tie = true;
  }
  if (distinct === 1) return { value: best, needsReview: false };
  if (bestN >= 2 && !tie) return { value: best, needsReview: false };
  return { value: null, needsReview: true }; // 0·1·2 분산 또는 1-1 동률
}

/**
 * 3모델 채점 + 준거별 다수결.
 * @returns {{
 *   criteria: Array<{ id, axis, name, binary,
 *     scores: {gemini, claude, gpt},
 *     rationales: {gemini, claude, gpt},
 *     consensus: number|null, needsReview: boolean }>,
 *   needsReview: boolean,           // 하나라도 불일치면 true
 *   models: { gemini: boolean, claude: boolean, gpt: boolean }  // 응답 성공 여부
 * }}
 */
export async function gradeWithThreeModels(rubric, answers, isC = false) {
  if (!rubric || !answers) throw new Error('rubric과 answers가 필요합니다.');

  const systemPrompt = buildSystemPrompt(rubric, isC);
  const userPrompt = buildUserPrompt(rubric, sanitizeAnswers(answers));

  const [gRes, cRes, oRes] = await Promise.allSettled([
    callGemini(systemPrompt, userPrompt),
    callClaude(systemPrompt, userPrompt),
    callGpt(systemPrompt, userPrompt),
  ]);

  const ok = (r) => r.status === 'fulfilled';
  const gemini = ok(gRes) ? toMap(gRes.value) : {};
  const claude = ok(cRes) ? toMap(cRes.value) : {};
  const gpt = ok(oRes) ? toMap(oRes.value) : {};

  const models = { gemini: ok(gRes), claude: ok(cRes), gpt: ok(oRes) };
  const liveCount = Object.values(models).filter(Boolean).length;
  if (liveCount < 2) {
    const reasons = [gRes, cRes, oRes].filter(r => r.status === 'rejected').map(r => r.reason?.message).join(' / ');
    throw new Error('다수결에 필요한 최소 2개 모델 응답 실패: ' + (reasons || '원인 불명'));
  }

  const criteria = [];
  let anyReview = false;
  for (const [axis, list] of Object.entries(rubric.axes)) {
    for (const c of list) {
      const gv = gemini[c.id]?.score ?? null;
      const cv = claude[c.id]?.score ?? null;
      const ov = gpt[c.id]?.score ?? null;
      const { value, needsReview } = majority([gv, cv, ov]);
      if (needsReview) anyReview = true;
      criteria.push({
        id: c.id,
        axis,
        name: c.name,
        binary: !!c.binary,
        scores: { gemini: gv, claude: cv, gpt: ov },
        rationales: {
          gemini: gemini[c.id]?.rationale || '',
          claude: claude[c.id]?.rationale || '',
          gpt: gpt[c.id]?.rationale || '',
        },
        consensus: value,
        needsReview,
      });
    }
  }

  return { criteria, needsReview: anyReview, models };
}
