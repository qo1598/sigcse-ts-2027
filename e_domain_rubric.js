// E영역 루브릭 데이터 (v3 기준)
// 출처: docs/E영역_평가루브릭_v3.md
// 척도: 준거별 0·1·2 (3점) → 합산 → 4수준 변환

export const AXIS_NAMES = {
  A: '인식·식별',
  B: '근거·설명',
  C: '판단·적용',
  D: '제안·확장',
};

export const LEVEL_NAMES = {
  0: '미달',
  1: '시작',
  2: '기초',
  3: '도달',
};

const LEVEL_CUTOFFS = {
  3: [[0, 1], [2, 3], [4, 5], [6, 6]],
  4: [[0, 2], [3, 4], [5, 6], [7, 8]],
  5: [[0, 2], [3, 5], [6, 7], [8, 10]],
};

export function computeLevel(sumScore, criteriaCount) {
  const cutoffs = LEVEL_CUTOFFS[criteriaCount];
  if (!cutoffs) return 0;
  for (let lv = 3; lv >= 0; lv--) {
    if (sumScore >= cutoffs[lv][0] && sumScore <= cutoffs[lv][1]) return lv;
  }
  return 0;
}

export function computeSum(rubricScores) {
  if (!rubricScores) return 0;
  let total = 0;
  for (const axisScores of Object.values(rubricScores)) {
    if (!axisScores) continue;
    for (const v of Object.values(axisScores)) {
      if (v != null) total += v;
    }
  }
  return total;
}

export function computeTotal(rubricScores, gradeBand, cardCode) {
  const rubric = E_RUBRICS[cardCode];
  if (!rubric) return 0;
  const sum = computeSum(rubricScores);
  return computeLevel(sum, rubric.criteriaCount);
}

export function getLevelLabel(level) {
  return `${level}수준(${LEVEL_NAMES[level] || '미달'})`;
}

export const E_RUBRIC_VERSION = 'E_v3.1_2026-06';

export const E_RUBRICS = {

  'E-1-L': {
    cardCode: 'E-1-L',
    missionName: 'AI 탐정단원',
    gradeBand: 'L',
    criteriaCount: 4,
    maxScore: 8,
    expectedLevel: '수준 2 이상',
    axes: {
      A: [
        {
          id: 'a1', name: 'AI/비AI 판별', dataField: 'step1 (string[])', scoringType: 'rule', ksa: 'S', ksaCode: 'Self and Social Awareness', constructCode: 'S1', constructLabel: '자기·사회 인식',
          levels: {
            0: '배열 없음 또는 비AI id(calculator, lamp) 포함',
            1: 'AI id만 있으나 1~2개',
            2: 'AI id 3개 이상 + 비AI id 미포함',
          },
        },
        {
          id: 'a2', name: '주변 AI 인식', dataField: 'step2.value (string)', scoringType: 'rule', ksa: 'K', ksaCode: 'K1.4', constructCode: 'K1', constructLabel: 'AI 개념 인식',
          levels: {
            0: 'null 또는 없음',
            1: '카드를 선택했으나 step1에서 고른 AI 종류와 무관한 항목',
            2: 'step1 선택과 같은 범주 카드 선택 (robot_vacuum↔home_robot_cleaner, voice_assistant↔voice_speaker, recommend_feed↔recommend_app, face_unlock↔face_camera)',
          },
        },
      ],
      B: [
        {
          id: 'b1', name: '장소 연결', dataField: 'step3 (string)', scoringType: 'rule', ksa: 'K', ksaCode: 'K1.4', constructCode: 'K1', constructLabel: 'AI 개념 인식',
          levels: {
            0: 'null 또는 없음',
            1: "'other'만 선택(구체 장소 미기록)",
            2: '구체 장소(home·school·street·car·store) 1개 선택 — 카드가 실제로 쓰일 수 있는 곳이면 정답 인정(단일 정답 강제 안 함)',
          },
        },
        {
          id: 'b2', name: '도움 기능 이해', dataField: 'step4 (string)', scoringType: 'rule', ksa: 'K', ksaCode: 'K1.4', constructCode: 'K2', constructLabel: 'AI 작동 원리 이해',
          levels: {
            0: 'null 또는 없음',
            1: "'other' 선택",
            2: 'step2 카드의 주요 기능과 부합하는 id (home_robot_cleaner→clean, navigation_app→navigate, voice_speaker→speak, face_camera→recognize, recommend_app→recommend)',
          },
        },
      ],
    },
  },

  'E-1-M': {
    cardCode: 'E-1-M',
    missionName: 'AI 소개 기자',
    gradeBand: 'M',
    criteriaCount: 4,
    maxScore: 8,
    expectedLevel: '수준 2~3',
    axes: {
      A: [
        {
          id: 'a1', name: 'AI/비AI 판별', dataField: 'step1 (string[])', scoringType: 'rule', ksa: 'S', ksaCode: 'Self and Social Awareness', constructCode: 'S1', constructLabel: '자기·사회 인식',
          levels: {
            0: '배열 없음 또는 비AI id(calculator, lamp) 포함',
            1: 'AI id만 1~2개',
            2: 'AI id 3개 이상 + 비AI id 미포함',
          },
        },
      ],
      B: [
        {
          id: 'b1', name: '하는 일 연결', dataField: 'step3 (string)', scoringType: 'rule', ksa: 'K', ksaCode: 'K1.4', constructCode: 'K2', constructLabel: 'AI 작동 원리 이해',
          levels: {
            0: 'null 또는 없음',
            1: "'other' 선택 또는 step2 선택 항목과 무관",
            2: 'step2 항목의 주요 기능과 일치하는 id',
          },
        },
        {
          id: 'b2', name: 'AI인 이유 서술', dataField: 'step4 (string)', scoringType: 'pattern', ksa: 'K', ksaCode: 'K1.4', constructCode: 'K2', constructLabel: 'AI 작동 원리 이해',
          levels: {
            0: '빈칸 또는 무관',
            1: '표면 특징만 ("빨라요", "편해요")',
            2: "'스스로 판단', '추천', '학습' 관련 표현 1개 이상",
          },
        },
        {
          id: 'b3', name: '소개 문장 완성', dataField: 'step5 (string)', scoringType: 'llm_judge', ksa: 'S', ksaCode: 'Self and Social Awareness', constructCode: 'S2', constructLabel: '자기·사회 인식',
          levels: {
            0: '빈칸',
            1: '대상 AI·도움 기능(또는 쓰임 장소) 중 1개만 포함',
            2: '대상 AI + 도움 기능 포함 (쓰임 장소까지 드러나면 더 좋음)',
          },
        },
      ],
    },
  },

  'E-1-H': {
    cardCode: 'E-1-H',
    missionName: 'AI 전시 큐레이터',
    gradeBand: 'H',
    criteriaCount: 5,
    maxScore: 10,
    expectedLevel: '수준 3',
    axes: {
      A: [
        {
          id: 'a1', name: '기본 분류 정확도', dataField: 'step1 (object) answerKey 비교', scoringType: 'rule', ksa: 'S', ksaCode: 'Critical Thinking', constructCode: 'S1', constructLabel: 'AI 식별·분류',
          levels: {
            0: '미응답 또는 정답률 <50%',
            1: '정답률 50~74%',
            2: '정답률 ≥75% + 비AI(calculator,auto_door,alarm_clock) 전부 non_ai',
          },
        },
        {
          id: 'a2', name: '경계 사례 판정', dataField: 'step3[caseId].judgment (4개)', scoringType: 'rule', ksa: 'S', ksaCode: 'Critical Thinking', constructCode: 'S1', constructLabel: 'AI 식별·분류',
          levels: {
            0: '미응답 또는 4개 모두 같은 값',
            1: '4개 중 2개 이상 구분 시도',
            2: '학습형(spam_filter)=ai, 비학습형(auto_door·basic_search)=non_ai 구분 + smart_thermostat은 ai 또는 unclear 인정',
          },
        },
      ],
      B: [
        {
          id: 'b1', name: '경계 사례 이유', dataField: 'step3[caseId].text (per case)', scoringType: 'pattern', ksa: 'K', ksaCode: 'K1.4', constructCode: 'K2', constructLabel: 'AI 작동 원리 이해',
          levels: {
            0: '모든 케이스 빈칸',
            1: '"스스로 움직여요" 수준',
            2: "'학습', '판단', '데이터' 관련 표현 1개 이상",
          },
        },
      ],
      C: [
        {
          id: 'c1', name: '판단 기준 구성', dataField: 'step2 (string[])', scoringType: 'rule', ksa: 'S', ksaCode: 'Critical Thinking', constructCode: 'S3', constructLabel: 'AI 평가·비교',
          levels: {
            0: '빈 배열 또는 없음',
            1: '1개만',
            2: "2개 이상 + 'learns','predicts','adapts','recognizes' 중 1개 이상 포함",
          },
        },
      ],
      D: [
        {
          id: 'd1', name: '전시 기준 문장', dataField: 'step4 (string)', scoringType: 'llm_judge', ksa: 'A', ksaCode: 'Curious', constructCode: 'A3', constructLabel: '자기주도적 활용',
          levels: {
            0: '빈칸 또는 템플릿만 복사',
            1: '기준 1개만 언급',
            2: '기준 2개 이상 + 판단 근거 명시',
          },
        },
      ],
    },
  },

  'E-2-L': {
    cardCode: 'E-2-L',
    missionName: 'AI 답 점검 도우미',
    gradeBand: 'L',
    criteriaCount: 4,
    maxScore: 8,
    expectedLevel: '수준 2 이상',
    axes: {
      A: [
        {
          id: 'a1', name: '이상한 답 식별', dataField: 'step1[qId].judge (6개)', scoringType: 'rule', ksa: 'S', ksaCode: 'Critical Thinking', constructCode: 'S1', constructLabel: 'AI 식별·분류',
          levels: {
            0: '미응답 또는 정답 <3개',
            1: '정답 3~4개 (50~66%)',
            2: '정답 5~6개 (≥83%)',
          },
        },
      ],
      B: [
        {
          id: 'b1', name: '이상 이유 선택', dataField: 'step1[qId].reason (strange 판정 카드만)', scoringType: 'rule', ksa: 'K', ksaCode: 'K4.3', constructCode: 'K3', constructLabel: 'AI 특성·한계 이해',
          levels: {
            0: 'strange 판정 카드에 reason 없음',
            1: '일부 strange에만 reason, 또는 모든 strange에 wrong_fact만 선택',
            2: 'q6(얼음·자기모순)=contradicts_itself, 나머지 strange(q2·q4·q5)=wrong_fact 매핑 일치',
          },
        },
      ],
      C: [
        {
          id: 'c1', name: '확인 방법 판단', dataField: 'step2 (string[])', scoringType: 'rule', ksa: 'S', ksaCode: 'Critical Thinking', constructCode: 'S3', constructLabel: 'AI 평가·비교',
          levels: {
            0: '배열 없음 또는 없음',
            1: "'ask_again'(AI 그대로) 포함",
            2: "'ask_again' 미포함 + 안전한 방법 1개 이상",
          },
        },
        {
          id: 'c2', name: '게시판 결정', dataField: 'step3[caseId].judgment (6개)', scoringType: 'rule', ksa: 'A', ksaCode: 'Responsible', constructCode: 'A1', constructLabel: '비판적 사고',
          levels: {
            0: '미응답 또는 6개 모두 같은 값',
            1: 'strange·correct 일부만 구분',
            2: "step1 judge와 결정 완전 일치 (strange→skip/verify, correct→post)",
          },
        },
      ],
    },
  },

  'E-2-M': {
    cardCode: 'E-2-M',
    missionName: 'AI 대화 검토자',
    gradeBand: 'M',
    criteriaCount: 5,
    maxScore: 10,
    expectedLevel: '수준 2~3',
    axes: {
      A: [
        {
          id: 'a1', name: '의심 말풍선 식별', dataField: 'step2[bubbleId].selected (6개)', scoringType: 'rule', ksa: 'S', ksaCode: 'Critical Thinking', constructCode: 'S1', constructLabel: 'AI 식별·분류',
          levels: {
            0: '미응답, 또는 a3·a6 모두 미선택, 또는 오선택(정상 4개 중 2개 이상 true)',
            1: 'a3·a6 중 1개만 true (오선택 1개 이하)',
            2: 'a3·a6 모두 true + 나머지 4개 false 유지',
          },
        },
      ],
      B: [
        {
          id: 'b1', name: '이상 이유 선택', dataField: 'step2[bubbleId].reason (selected=true 항목)', scoringType: 'rule', ksa: 'K', ksaCode: 'K4.3', constructCode: 'K3', constructLabel: 'AI 특성·한계 이해',
          levels: {
            0: 'reason 없음',
            1: 'a3·a6 중 1개에만 reason 선택',
            2: 'a3·a6 모두에 wrong_fact 선택 (둘 다 명백한 사실 오류이므로 wrong_fact가 적절)',
          },
        },
        {
          id: 'b2', name: '확인 질문 작성', dataField: 'step3[bubbleId] (string, selected=true 항목)', scoringType: 'llm_judge', ksa: 'S', ksaCode: 'Critical Thinking', constructCode: 'S3', constructLabel: 'AI 평가·비교',
          levels: {
            0: '빈칸',
            1: '"맞아요?" 수준 또는 주장과 무관',
            2: '해당 말풍선 구체 주장에 대응하는 질문 또는 근거·출처 요청',
          },
        },
      ],
      C: [
        {
          id: 'c1', name: '사용/보류 결정', dataField: 'step4[caseId].judgment (6개)', scoringType: 'rule', ksa: 'A', ksaCode: 'Responsible', constructCode: 'A1', constructLabel: '비판적 사고',
          levels: {
            0: '미응답 또는 모두 같은 값',
            1: '의심 말풍선 일부에만 hold 적용',
            2: "step2 selected와 결정 완전 일치 (true→hold, false→use)",
          },
        },
        {
          id: 'c2', name: '유의 태도 선택', dataField: 'step5 (string[])', scoringType: 'rule', ksa: 'A', ksaCode: 'Responsible', constructCode: 'A2', constructLabel: '윤리·책임',
          levels: {
            0: '배열 없음',
            1: "'ask_many'(지칠 때까지) 또는 'do_copy'(그대로 써서) 포함",
            2: '부적절 옵션 미포함 + 안전 태도 2개 이상',
          },
        },
      ],
    },
  },

  'E-2-H': {
    cardCode: 'E-2-H',
    missionName: '학급 신문 편집장',
    gradeBand: 'H',
    criteriaCount: 4,
    maxScore: 8,
    expectedLevel: '수준 3',
    axes: {
      A: [
        {
          id: 'a1', name: '5개 기사 판정', dataField: 'step2[sampleId] (string, 5개)', scoringType: 'rule', ksa: 'S', ksaCode: 'Critical Thinking', constructCode: 'S1', constructLabel: 'AI 식별·분류',
          levels: {
            0: '미응답 또는 5개 모두 같은 값',
            1: 's1·s3만 use, 나머지 구분 없음',
            2: 's2·s4·s5 중 2개 이상 revise 또는 verify 정확 판정',
          },
        },
      ],
      B: [
        {
          id: 'b1', name: '판정 이유 표시', dataField: 'step3[sampleId] (string, revise/verify 항목)', scoringType: 'rule', ksa: 'K', ksaCode: 'K4.3', constructCode: 'K3', constructLabel: 'AI 특성·한계 이해',
          levels: {
            0: "reason 없음 또는 모두 'other'",
            1: '1개에만 reason',
            2: 'revise/verify 항목 모두에 reason + 항목별 다른 reason 구분',
          },
        },
      ],
      C: [
        {
          id: 'c1', name: '편집 계획 서술', dataField: 'step4[sampleId] (string, revise/verify 항목)', scoringType: 'llm_judge', ksa: 'S', ksaCode: 'Critical Thinking', constructCode: 'S3', constructLabel: 'AI 평가·비교',
          levels: {
            0: '빈칸 또는 "고친다" 수준',
            1: '1개 항목만 구체적',
            2: '2개 이상 항목에 확인 자원(교과서·전문가 등) 명시',
          },
        },
      ],
      D: [
        {
          id: 'd1', name: '편집장 메모', dataField: 'step5 (string)', scoringType: 'llm_judge', ksa: 'A', ksaCode: 'Responsible', constructCode: 'A1', constructLabel: '비판적 사고',
          levels: {
            0: '빈칸 또는 무관',
            1: 'AI 한계만 언급 (일반론)',
            2: 'AI 한계 + 인간 책임 또는 실천 태도 언급',
          },
        },
      ],
    },
  },

  'E-3-L': {
    cardCode: 'E-3-L',
    missionName: '추천 탐험가',
    gradeBand: 'L',
    criteriaCount: 4,
    maxScore: 8,
    expectedLevel: '수준 2 이상',
    // 설계 메모: step1~3(주제·예아니오·추천열람)은 추천 경험을 위한 진행 게이트이며 채점 대상이 아니다.
    // 채점은 step4~7의 내용 이해(K)·자기인식(S)·태도(A)에서만 이뤄지며, 각 준거가 0/1/2로 변별된다.
    axes: {
      A: [
        {
          id: 'a1', name: '추천 원리 인식', dataField: 'step4 (string[])', scoringType: 'rule', ksa: 'K', ksaCode: 'K1.1', constructCode: 'K2', constructLabel: 'AI 작동 원리 이해',
          levels: {
            0: "정답칩 없음 — 'dont_know'만, 또는 오개념칩(random·everyone)만 선택",
            1: "정답칩 1개(my_yes 또는 my_topic). 오개념칩이 섞여 있어도 이 수준",
            2: "'my_yes'(내가 '예'라고 답한 것과 비슷해서) 포함 + 오개념칩 미선택 — 추천이 내 응답에서 나왔음을 정확히 인식",
          },
        },
        {
          id: 'a2', name: '내 정보의 영향 인식', dataField: 'step5 (string)', scoringType: 'rule', ksa: 'S', ksaCode: 'Self and Social Awareness', constructCode: 'S2', constructLabel: '자기·사회 인식',
          levels: {
            0: "null 또는 'same'(내 대답과 무관하게 추천이 같다는 오개념)",
            1: "'dont_know'",
            2: "'different' — 내 대답이 바뀌면 추천도 바뀐다는 자기 영향 인식",
          },
        },
      ],
      B: [
        {
          id: 'b1', name: '추천의 영향 판단', dataField: 'step6 (string[])', scoringType: 'rule', ksa: 'S', ksaCode: 'Self and Social Awareness', constructCode: 'S3', constructLabel: '자기·사회 인식',
          levels: {
            0: "영향칩 없음 — 'no_effect' 또는 'dont_know'만 선택",
            1: '영향칩 1개(more_pick·see_similar·miss_new 중)',
            2: "영향칩 2개 이상 + 'no_effect' 미선택 — 추천이 내 선택·시야에 주는 영향을 인식",
          },
        },
        {
          id: 'b2', name: '탐구·주도 태도', dataField: 'step7 (string[])', scoringType: 'rule', ksa: 'A', ksaCode: 'Curious', constructCode: 'A3', constructLabel: '자기주도적 활용',
          levels: {
            0: "탐구칩 없음 — 'not_curious'만 또는 빈 선택",
            1: '탐구칩 1개(other_topic·try_opposite·how_made·search_self 중)',
            2: "탐구칩 2개 이상 + 'not_curious' 미선택 — 더 알아보거나 직접 찾아보려는 주도적 호기심",
          },
        },
      ],
    },
  },

  'E-3-M': {
    cardCode: 'E-3-M',
    missionName: '쇼핑몰 취향 분석가',
    gradeBand: 'M',
    criteriaCount: 4,
    maxScore: 8,
    expectedLevel: '수준 2~3',
    // 설계 메모: step1(둘러보기)·step3(추천 열람)은 진행 게이트. 채점은 step2 별점 실기(S)와
    // step4 서술 3문항(K 작동원리·K 한계·A 호기심)에서만 이뤄지며 K/S/A가 중복 없이 변별된다.
    axes: {
      A: [
        {
          id: 'a1', name: '취향 반영 실기', dataField: 'step2 (object) ★4~5 항목의 태그 일관성', scoringType: 'rule', ksa: 'S', ksaCode: 'Self and Social Awareness', constructCode: 'S2', constructLabel: '자기·사회 인식',
          levels: {
            0: '★4~5(높게 평가)한 옷이 3개 미만 — 취향을 충분히 드러내지 않음',
            1: '★4~5 옷이 색·스타일·품목·계절에 뚜렷한 공통점이 없음(특정 특징이 절반을 넘지 못함)',
            2: '★4~5 옷의 절반을 넘는 수가 한 가지 특징(색·스타일·품목·계절)을 공유 — 일관된 취향을 도구에 반영',
          },
        },
      ],
      B: [
        {
          id: 'b1', name: '추천-별점 연결 설명', dataField: "step4['q1'] (string)", scoringType: 'llm_judge', ksa: 'K', ksaCode: 'K1.1', constructCode: 'K2', constructLabel: 'AI 작동 원리 이해',
          levels: {
            0: '빈칸 또는 무관',
            1: '"비슷해요" 수준 (막연)',
            2: '추천 옷과 내 고평가 옷의 공통 속성(색·스타일·계절 등) 1개 이상 명시 — "내 별점에서 추천이 나왔음"을 설명',
          },
        },
        {
          id: 'b2', name: '추천의 한계·영향 이해', dataField: "step4['q2'] (string)", scoringType: 'llm_judge', ksa: 'K', ksaCode: 'K5.1', constructCode: 'K3', constructLabel: 'AI 특성·한계 이해',
          levels: {
            0: '빈칸 또는 무관 / 아쉬운 점 없이 좋은 점만 언급',
            1: '"질려요" 등 막연한 아쉬움',
            2: '구체적 한계 1개 이상 (비슷한 것만 보게 됨·새 선택 놓침·시야 좁아짐 등)',
          },
        },
      ],
      C: [
        {
          id: 'c1', name: '주도적 활용 제안', dataField: "step4['q3'] (string)", scoringType: 'llm_judge', ksa: 'A', ksaCode: 'Curious', constructCode: 'A3', constructLabel: '자기주도적 활용',
          levels: {
            0: '빈칸 또는 무관 / "그냥 추천대로 본다"',
            1: '추상적 다짐 ("잘 써야겠다") 수준',
            2: '구체적 활용·탐구 행동 1개 이상 (직접 검색도 해본다·일부러 다른 스타일도 본다·추천 이유를 확인한다 등)',
          },
        },
      ],
    },
  },

  'E-3-H': {
    cardCode: 'E-3-H',
    missionName: '추천 사용 컨설턴트',
    gradeBand: 'H',
    criteriaCount: 4,
    maxScore: 8,
    expectedLevel: '수준 3',
    // 설계 메모: 4개 준거가 K(작동원리·영향한계)·S(자기·사회 영향 자각)·A(주도적 활용)로 분리되어
    // 각 축이 0/1/2로 변별된다. step1·step2는 rule(결정적), step3·step4는 llm_judge(서술).
    axes: {
      A: [
        {
          id: 'a1', name: '추천 이유 분석', dataField: 'step1[caseId].reasons (string[], 4개)', scoringType: 'rule', ksa: 'K', ksaCode: 'K1.1', constructCode: 'K2', constructLabel: 'AI 작동 원리 이해',
          levels: {
            0: '미응답, 또는 오개념(우연히·모두 동일) 위주 / 맞는 신호 0~1개',
            1: '맞는 신호 2~3개 (오개념 미선택) — "주제 비슷"으로만 찍으면 case_1·4만 맞아 이 수준',
            2: '4개 케이스 모두 맞는 신호 — case_1·4=주제 유사, case_2=자주·오래, case_3=반복 클릭 (오개념 미선택, 케이스당 핵심 신호만)',
          },
        },
      ],
      B: [
        {
          id: 'b1', name: '추천 영향·한계 판단', dataField: 'step2[caseId].judgment + plans[]/limitations[] (4개)', scoringType: 'rule', ksa: 'K', ksaCode: 'K5.1', constructCode: 'K3', constructLabel: 'AI 특성·한계 이해',
          levels: {
            0: '미응답 또는 4개 모두 같은 판단',
            1: '올바른 판단 + 정답 근거(오답 칩 없이)가 2개 케이스',
            2: "3개 이상 케이스에서 올바른 판단(case_1=도움, case_2·case_4=조심, case_3=둘 다) + 정답 근거만 선택(오답 칩 plan_passive·lim_random 미선택, '둘 다'는 좋은 점·아쉬운 점 모두)",
          },
        },
      ],
      C: [
        {
          id: 'c1', name: '나·사회 영향 자각', dataField: 'step3 (string)', scoringType: 'llm_judge', ksa: 'S', ksaCode: 'Self and Social Awareness', constructCode: 'S3', constructLabel: '자기·사회 인식',
          levels: {
            0: '빈칸 또는 "영향 없다"/무관',
            1: '나에게의 영향만, 또는 막연한 서술',
            2: '나의 생각·선택에 주는 영향 + 사회적 영향(시야 좁아짐·여론 쏠림·다양성 감소 등)을 함께 구체적으로 서술',
          },
        },
      ],
      D: [
        {
          id: 'd1', name: '주도적 사용 원칙', dataField: "step4['p1']·['p2']·['p3'] (string 3개)", scoringType: 'llm_judge', ksa: 'A', ksaCode: 'Curious', constructCode: 'A3', constructLabel: '자기주도적 활용',
          levels: {
            0: '0~1개 작성 또는 "조심히 쓴다" 수준',
            1: '2개 작성, 또는 3개이나 추상적·중복',
            2: '서로 다른 관점의 구체적 실천 원칙 3개 (예: 직접 검색 병행·추천 이유 확인·일부러 다른 관점 찾기)',
          },
        },
      ],
    },
  },

  'E-4-L': {
    cardCode: 'E-4-L',
    missionName: 'AI 배려 관찰자',
    gradeBand: 'L',
    criteriaCount: 4,
    maxScore: 8,
    expectedLevel: '수준 2 이상',
    axes: {
      A: [
        {
          id: 'a1', name: '차이 인식', dataField: 'step2 (string[])', scoringType: 'rule', ksa: 'K', ksaCode: 'K2.5', constructCode: 'K3', constructLabel: 'AI 특성·한계 이해',
          levels: {
            0: '배열 없음',
            1: '무관한 차이(change_color, make_bigger 등) 포함',
            2: '관련 차이(recognized_right_away,needs_retry,easy_use,no_response) 2개 이상 + 무관 미포함',
          },
        },
        {
          id: 'a2', name: '어려움 대상 식별', dataField: 'step3.person (string)', scoringType: 'rule', ksa: 'K', ksaCode: 'K2.5', constructCode: 'K3', constructLabel: 'AI 특성·한계 이해',
          levels: {
            0: 'null 또는 없음',
            1: "'person_a' 선택",
            2: "'person_b' 선택",
          },
        },
      ],
      B: [
        {
          id: 'b1', name: '어려움 이유 선택', dataField: 'step3.reasons (string[])', scoringType: 'rule', ksa: 'K', ksaCode: 'K2.5', constructCode: 'K3', constructLabel: 'AI 특성·한계 이해',
          levels: {
            0: '빈 배열 또는 없음',
            1: '무관한 이유 선택',
            2: "'not_recognized'·'needs_retry'·'hard_to_use'·'system_not_fit' 중 1개 이상 + step2 선택과 정합",
          },
        },
      ],
      C: [
        {
          id: 'c1', name: '배려 방법 선택', dataField: 'step4 (string[])', scoringType: 'rule', ksa: 'A', ksaCode: 'Empathetic', constructCode: 'A2', constructLabel: '윤리·책임',
          levels: {
            0: '배열 없음',
            1: "'change_color'·'make_bigger'(무관) 포함",
            2: '무관 옵션 미포함 + step3.reasons와 연결되는 적절한 방법 1개 이상',
          },
        },
      ],
    },
  },

  'E-4-M': {
    cardCode: 'E-4-M',
    missionName: '공정성 점검단원',
    gradeBand: 'M',
    criteriaCount: 5,
    maxScore: 10,
    expectedLevel: '수준 2~3',
    axes: {
      A: [
        {
          id: 'a1', name: '불리 학생 식별', dataField: 'step1[caseId].judgment (5개)', scoringType: 'rule', ksa: 'K', ksaCode: 'K2.5', constructCode: 'K3', constructLabel: 'AI 특성·한계 이해',
          // 5사례 정답: 얼굴=A, 음성=B, 글읽기=둘 다 비슷, 자막=A, 책추천=둘 다 비슷 (불리한 쪽이 사례마다 다르고 공정 사례 포함)
          levels: {
            0: '미응답, 5사례 모두 같은 답(한쪽으로 찍음), 또는 정답 3개 이하',
            1: '사례별 정답 4개 일치',
            2: '5사례 모두 정답 일치 — 얼굴=A · 음성=B · 글읽기=둘 다 비슷 · 자막=A · 책추천=둘 다 비슷',
          },
        },
      ],
      C: [
        {
          id: 'c1', name: '공정성 판단', dataField: 'step2[caseId].fairness (5개)', scoringType: 'rule', ksa: 'A', ksaCode: 'Empathetic', constructCode: 'A2', constructLabel: '윤리·책임',
          // 정답: 불공정 3(얼굴·음성·자막) + 공정 2(글읽기·책추천)
          levels: {
            0: "미응답, 5사례 모두 같은 답, 또는 정답 3개 이하",
            1: "사례별 정답 4개 일치",
            2: "5사례 모두 정답 일치 (불공정 3 + 공정 2 구분)",
          },
        },
      ],
      B: [
        {
          id: 'b1', name: '원인 분석', dataField: 'step3[caseId].reasons (string[], 5개)', scoringType: 'rule', ksa: 'K', ksaCode: 'K5.4', constructCode: 'K3', constructLabel: 'AI 특성·한계 이해',
          // 불공정 사례=원인 칩(not_*/same_way), 공정 사례=fair_fits_all, 오답(user_mistake·wifi) 미포함
          levels: {
            0: '모든 케이스 빈 배열 또는 정답 이유 0개',
            1: '일부 케이스만 정답 이유 또는 조합 단조',
            2: '모든 케이스 정답 이유(공정/불공정 구분) + 조합 2종 이상',
          },
        },
      ],
      D: [
        {
          id: 'd1', name: '개선 제안', dataField: 'step4[caseId].text (string, 3개)', scoringType: 'llm_judge', ksa: 'A', ksaCode: 'Empathetic', constructCode: 'A2', constructLabel: '윤리·책임',
          levels: {
            0: '모든 케이스 빈칸',
            1: '1개만 구체적',
            2: "2개 이상 케이스에 구체 대안 (대체 입력·사람 확인·데이터 다양화 관련)",
          },
        },
        {
          id: 'd2', name: '종합 의견', dataField: 'step5 (string)', scoringType: 'llm_judge', ksa: 'A', ksaCode: 'Empathetic', constructCode: 'A2', constructLabel: '윤리·책임',
          levels: {
            0: '빈칸 또는 무관',
            1: '한 관점(제작자 또는 사용자)만 서술',
            2: 'AI 설계·사용 양 관점 통합 언급',
          },
        },
      ],
    },
  },

  'E-4-H': {
    cardCode: 'E-4-H',
    missionName: 'AI 공정성 자문위원',
    gradeBand: 'H',
    criteriaCount: 5,
    maxScore: 10,
    expectedLevel: '수준 3',
    axes: {
      A: [
        {
          id: 'a1', name: '문제 신호 포착', dataField: 'step2[caseId].judgment (string, 4개)', scoringType: 'rule', ksa: 'S', ksaCode: 'Critical Thinking', constructCode: 'S1', constructLabel: 'AI 식별·분류',
          // 장면별 정답 신호: 게이트=더 오래 기다림 · 추천=선택 폭 좁아짐 · 키오스크=결과 못 얻음(또는 더 기다림) · 공연=충분히 못 즐김
          levels: {
            0: '미응답, 4장면 모두 같은 신호(찍기), 또는 장면별 정답 1개 이하',
            1: '장면별 정답 신호 2개 일치',
            2: '장면별 정답 신호 3~4개 일치(장면-신호 매칭)',
          },
        },
      ],
      C: [
        {
          id: 'c1', name: '영향 대상·종류 판단', dataField: 'step3[caseId].judgment + .reasons[] (4개)', scoringType: 'rule', ksa: 'A', ksaCode: 'Empathetic', constructCode: 'A1', constructLabel: '비판적 사고',
          // 사례별 불리한 방문객 정답: 게이트=B, 추천=A, 키오스크=B, 자막=A (장면마다 교차)
          levels: {
            0: '미응답, 4장면 모두 같은 답(한쪽으로 찍음), 또는 정답 1개 이하',
            1: '사례별 정답 2개, 또는 정답 3개 이상이나 영향 근거가 부족',
            2: '사례별 정답 3개 이상(게이트=B·추천=A·키오스크=B·자막=A) + 각 장면 영향 id 1개 이상',
          },
        },
      ],
      B: [
        {
          id: 'b1', name: '문제 이유 서술', dataField: 'step4[caseId].reasons (string[], 4개)', scoringType: 'rule', ksa: 'K', ksaCode: 'K2.5', constructCode: 'K3', constructLabel: 'AI 특성·한계 이해',
          // 오개념 칩(just_unlucky·ai_cannot_help) 선택 시 2점 차단 → '다 찍기' 만점 불가
          levels: {
            0: '모든 케이스 빈 배열',
            1: '일부 케이스만 정답 이유, 또는 오개념 칩(운·불가피) 선택',
            2: "4개 모두 정답 이유 2개 이상(오개념 칩 미선택) + 'cumulative_harm'·'unequal_opportunity' 중 1개 이상",
          },
        },
      ],
      D: [
        {
          id: 'c2', name: 'AI 수용 판단 서술', dataField: 'step5[caseId].text (string, 4개)', scoringType: 'llm_judge', ksa: 'A', ksaCode: 'Empathetic', constructCode: 'A1', constructLabel: '비판적 사고',
          levels: {
            0: '모든 케이스 빈칸',
            1: '1~2개만 서술',
            2: '3개 이상 케이스 + 개선 절차 또는 조건 1개 이상',
          },
        },
        {
          id: 'd1', name: '최종 자문 의견서', dataField: 'step6 (string)', scoringType: 'llm_judge', ksa: 'A', ksaCode: 'Empathetic', constructCode: 'A2', constructLabel: '윤리·책임',
          levels: {
            0: '빈칸 또는 1~2문장 일반론',
            1: '3문장 이상이나 관점 1개',
            2: '3문장 이상 + 제작자·사용자 양 관점 + 구조적 원인·개선·지속 점검 중 2개 이상',
          },
        },
      ],
    },
  },
};
