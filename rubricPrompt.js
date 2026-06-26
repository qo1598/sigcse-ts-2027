// 루브릭 채점 프롬프트 빌더 — 단일/다중 모델 채점이 공유한다.
// (기존 aiRubricService에서 추출)

export function buildSystemPrompt(rubric, isC) {
  const domain = isC ? 'C' : (rubric.cardCode?.charAt(0) || 'E');
  return `당신은 AI 리터러시 평가 전문 연구 보조원입니다.
학생의 수행 데이터(answers JSON)를 루브릭 준거에 따라 채점합니다.

## 규칙
- 각 준거별로 0, 1, 2 중 하나의 점수를 부여합니다.
- 0=없음(미응답/무관), 1=부분(흔적 있으나 불완전), 2=명확(준거 충족)
- 이진 준거(binary=true)는 0 또는 2만 부여합니다 (1 사용 불가).
- 기준이 모호하면 낮은 점수로 코딩합니다.
- JSON 필드가 null/undefined/빈값이면 0점입니다.

## 출력 형식 (JSON)
\`\`\`json
{
  "criteria": [
    { "id": "a1", "score": 2, "rationale": "근거 1문장" },
    { "id": "b1", "score": 1, "rationale": "근거 1문장" }
  ]
}
\`\`\`

criteria 배열은 루브릭의 모든 준거를 id 순서대로 포함해야 합니다.
rationale은 한국어로, 해당 점수를 부여한 근거를 JSON 데이터와 연결하여 1~2문장으로 서술합니다.

## 영역: ${domain}영역
## 미션: ${rubric.cardCode} — ${rubric.missionName}
## 학년군: ${rubric.gradeBand}
## 준거 수: ${rubric.criteriaCount}개 (최대 ${rubric.maxScore}점)
`;
}

export function buildUserPrompt(rubric, answers) {
  const criteriaDesc = [];
  for (const [axis, criteria] of Object.entries(rubric.axes)) {
    for (const c of criteria) {
      criteriaDesc.push({
        id: c.id,
        axis,
        name: c.name,
        dataField: c.dataField,
        binary: !!c.binary,
        levels: c.levels,
      });
    }
  }

  return `## 루브릭 준거
${JSON.stringify(criteriaDesc, null, 2)}

## 학생 응답 데이터 (answers JSON)
${JSON.stringify(answers, null, 2)}

위 데이터를 준거별로 분석하여 JSON 형식으로 채점 결과를 출력하세요.`;
}

export function sanitizeAnswers(answers) {
  const cleaned = {};
  for (const [key, val] of Object.entries(answers)) {
    if (key === 'artifact' || key === 'artifact_binding_key' || key === 'step_schema' || key === 'step_trace') continue;
    if (val == null) continue;
    if (typeof val === 'string') {
      if (val.startsWith('data:image') || val.length > 2000) { cleaned[key] = '(이미지 데이터)'; continue; }
      cleaned[key] = val;
    } else if (typeof val === 'object' && !Array.isArray(val)) {
      const sub = {};
      for (const [sk, sv] of Object.entries(val)) {
        if (sk === '_generatedImage' || sk === '_originalImage') continue;
        if (sk === 'markers' && Array.isArray(sv)) {
          sub[sk] = sv.map(m => ({ category: m.category }));
          continue;
        }
        if (typeof sv === 'string' && (sv.startsWith('data:image') || sv.length > 1000)) { sub[sk] = '(생략)'; continue; }
        sub[sk] = sv;
      }
      cleaned[key] = sub;
    } else {
      cleaned[key] = val;
    }
  }
  return cleaned;
}

// 모델 응답 텍스트에서 criteria 배열을 추출한다(코드펜스/잡텍스트 허용).
export function parseCriteriaJson(text) {
  let t = (text || '').trim();
  const fenced = t.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) t = fenced[1].trim();
  try {
    const parsed = JSON.parse(t);
    return parsed.criteria || parsed;
  } catch {
    const jsonMatch = t.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('AI 응답에서 JSON을 찾을 수 없습니다: ' + t.slice(0, 200));
    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.criteria || parsed;
  }
}
