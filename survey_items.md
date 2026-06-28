# Measurement Instrument — Self-Report Items

This file releases the **self-report instrument** (item wording) so the say–do
comparison in the paper can be inspected. It contains **only the questions**, not
any student responses (IRB / consent restrictions). Original items are in Korean
(administered language); brief English glosses are added where helpful.

## Response scale
All self-report items use a **5-point pictorial (emoji) Likert** scale, identical
across grade bands (lower, middle, upper):

| 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|
| 😣 전혀 아니야 (not at all) | 😕 별로 (not really) | 😐 보통이야 (neutral) | 😊 그런 편이야 (somewhat) | 😆 완전 그래! (totally) |

Each post-mission survey also asks two non-KSA items: **difficulty**
(😎 너무 쉬웠어 … 😵 많이 어려웠어) and, for AI-using missions, **AI helpfulness**
(😟 별로였어 … 🤩 엄청 도움!). Self-report scores in the paper average the mapped
KSA items and normalize to 0–1.

---

## 1. Pre-instruction survey (general AI-literacy KSA)
Administered once, anonymously (grade only; no identifiers). Context items (CTX)
are not scored. Knowledge (K), Skill (S), Attitude (A) items are 5-point Likert.

**Context (not scored):**
- CTX1. 현재 학년
- CTX0. 성별
- CTX2. 최근 한 달 AI 서비스 사용 빈도
- CTX3. 사용해 본 AI 서비스(복수)
- CTX4. 가정 내 AI 사용 가능 기기 보유
- CTX5. 최근 1년 AI 학습 경험

**Knowledge (K):**
- K1.1 AI가 정해진 방법과 자료 속 규칙으로 답을 만든다
- K1.2 AI가 자료에서 규칙·관계를 찾아 더 나은 결과를 만들도록 학습한다
- K1.3 생성형 AI가 자연스럽게 글을 써도 사람처럼 뜻을 완전히 이해하는 건 아니다
- K1.4 목적이 다르면(길찾기·추천·대화형) AI 작동 방법도 달라질 수 있다
- K2.1 학습에 쓰는 자료에 따라 AI 결과가 달라질 수 있다
- K2.2 AI는 글·그림·소리·숫자 자료로 학습할 수 있다
- K2.3 AI와 대화 시 내가 입력한 정보가 저장·반영될 수 있다
- K2.4 학습 자료를 사람이 고르고 정리하는 과정이 필요할 수 있다
- K2.5 학습 자료가 치우치면 결과도 공정하지 않을 수 있다
- K3.1 AI가 널리 쓰이면 사람의 일과 역할이 달라질 수 있다
- K3.2 AI에게 맡겨도 되는 일과 사람이 판단할 일이 다를 수 있다
- K3.3 AI 도움을 받아도 마지막 결정·책임은 사람에게 있다
- K4.1 AI도 감정·책임에는 한계가 있다
- K4.2 AI 작동에는 기기·시스템의 전기가 필요하다
- K4.3 생성형 AI가 그럴듯하지만 사실과 다른 답을 만들 수 있다
- K5.1 AI가 병원·회사·학교에서 중요한 판단을 도울 수 있다
- K5.2 AI가 안전·공정하게 쓰이도록 규칙·점검이 필요하다
- K5.3 AI로 만든 결과물은 AI 사용 사실을 밝힐 필요가 있다
- K5.4 신뢰할 수 있는 AI에는 공정성·안전성·개인정보보호·책임성이 중요하다

**Skill (S):**
- S1 AI 답을 그대로 믿기보다 다른 자료와 비교·확인한다
- S2 AI 결과를 내 목적에 맞게 고치거나 보탤 수 있다
- S3 원하는 결과가 안 나오면 문제를 나누고 질문·조건을 바꿔 다시 요청한다
- S4 AI 사용 시 내 정보·타인 정보가 어떻게 쓰이는지 생각한다
- S5 모둠에서 AI가 할 일과 사람이 할 일을 나눌 수 있다
- S6 과제·발표에서 AI 도움 받은 부분을 밝힐 수 있다
- S7 문제 해결에 AI 사용이 적절한지 먼저 판단한다

**Attitude (A):**
- A1 AI 사용 시 타인에게 피해가 가지 않도록 조심한다
- A2 AI가 왜 그런 답을 했는지 궁금해하고 이유를 찾는다
- A3 AI로 나만의 새 아이디어·작품을 만들어 보고 싶다
- A4 AI 사용법이 바뀌어도 배우며 다시 시도한다
- A5 AI 사용이 어려운 친구를 생각하고 도우려 한다

---

## 2. Post-mission survey (task-proximal KSA)
Administered immediately after each mission. A mission shows **one item per mapped
K/S/A construct** (see `mission_scoring_map.md` for each mission's codes), worded
per grade band. Items below are grouped by construct code; **[L]/[M]/[H]** = lower
(grades 1–2) / middle (3–4) / upper (5–6).


### Knowledge (K)

**K1.1**
- [L] 이 미션으로 AI가 많은 예시를 보고 정해진 답을 내는 걸 알게 되었다.
- [M] 이 미션으로 AI가 데이터에서 패턴을 찾아 답을 낸다는 것을 이해했다.
- [H] 이 미션으로 AI가 통계적 추론을 통해 가장 그럴듯한 결과를 낸다는 것을 이해했다.

**K1.2**
- [L] 이 미션으로 AI가 스스로 배운다는 걸 알게 되었다.
- [M] 이 미션으로 AI가 예시를 보고 점점 더 잘하게 된다는 것을 이해했다.
- [H] 이 미션으로 AI가 경험을 통해 학습하고 자율성·적응성을 갖는다는 것을 이해했다.

**K1.3**
- [L] 이 미션으로 AI가 말을 만들어도 뜻을 진짜로 알지는 못한다는 걸 알게 되었다.
- [M] 이 미션으로 AI가 사람처럼 글을 만들어도 진짜로 이해하지는 않는다는 것을 알게 되었다.
- [H] 이 미션으로 생성형 AI가 확률 기반으로 결과를 만들며 진정한 이해는 없다는 것을 이해했다.

**K1.4**
- [L] 이 미션으로 AI는 하는 일마다 다르게 움직인다는 걸 알게 되었다.
- [M] 이 미션으로 AI가 쓰임새에 따라 다르게 작동한다는 것을 알게 되었다.
- [H] 이 미션으로 AI 시스템이 개발 목적에 따라 각기 다른 방식으로 작동한다는 것을 이해했다.

**K2.1**
- [L] 이 미션으로 AI는 사람이 만들고 있다는 걸 알게 되었다.
- [M] 이 미션으로 AI의 결과에 사람의 선택이 들어간다는 것을 알게 되었다.
- [H] 이 미션으로 AI 시스템이 인간의 선택·관점·노동을 반영한다는 것을 이해했다.

**K2.2**
- [L] 이 미션으로 AI가 많은 예시를 보면서 배운다는 걸 알게 되었다.
- [M] 이 미션으로 AI가 아주 많은 자료를 보고 학습한다는 것을 알게 되었다.
- [H] 이 미션으로 AI가 방대한 데이터로 훈련된다는 것을 이해했다.

**K2.3**
- [M] 이 미션으로 내가 AI에게 보낸 말이 AI 반응에 바로 영향을 준다는 것을 알게 되었다.
- [H] 이 미션으로 AI가 사용자와의 상호작용을 통해 실시간 데이터를 수집한다는 것을 이해했다.

**K2.4**
- [M] 이 미션으로 AI가 사람이 정리해준 예시에서 규칙을 찾는다는 것을 알게 되었다.
- [H] 이 미션으로 AI가 인간이 선별·분류한 데이터에서 패턴을 식별한다는 것을 이해했다.

**K2.5**
- [L] 이 미션으로 AI가 사람처럼 편을 들 때가 있다는 걸 알게 되었다.
- [M] 이 미션으로 AI가 한쪽으로 치우친 결과를 낼 수 있다는 것을 알게 되었다.
- [H] 이 미션으로 AI에 훈련 데이터·설계에서 비롯된 편향이 내재될 수 있음을 이해했다.

**K3.1**
- [L] 이 미션으로 AI가 도와줄 때 사람이 할 일도 달라질 수 있다는 걸 알게 되었다.
- [M] 이 미션으로 AI가 쓰이면서 사람이 하는 일이 바뀔 수 있다는 것을 알게 되었다.
- [H] 이 미션으로 AI가 산업을 변화시키며 인간이 새로운 역할에 적응해야 한다는 것을 이해했다.

**K3.2**
- [M] 이 미션으로 어떤 일은 사람이 직접 해야 한다는 것을 알게 되었다.
- [H] 이 미션으로 AI에 맡길 수 있는 일과 인간이 개입해야 할 일을 구분해야 한다는 것을 이해했다.

**K3.3**
- [M] 이 미션으로 AI가 도와도 결정은 내가 책임져야 한다는 것을 알게 되었다.
- [H] 이 미션으로 의사결정의 궁극적 책임은 인간에게 있음을 이해했다.

**K4.1**
- [L] 이 미션으로 AI가 잘하는 일과 못하는 일이 있다는 걸 알게 되었다.
- [M] 이 미션으로 AI가 모든 것을 완벽하게 하지는 못한다는 것을 알게 되었다.
- [H] 이 미션으로 AI가 패턴·자동화에 강하지만 감정·맥락 이해에 한계가 있음을 이해했다.

**K4.2**
- [H] 이 미션으로 AI 사용이 에너지와 자원을 쓰는 일임을 이해했다.

**K4.3**
- [L] 이 미션으로 AI가 그럴듯하게 가짜 정보도 만들 수 있다는 걸 알게 되었다.
- [M] 이 미션으로 AI가 진짜 같아 보이는 잘못된 정보를 만들 수 있다는 것을 알게 되었다.
- [H] 이 미션으로 생성형 AI가 사실과 허구를 구별하기 어려운 결과를 낼 수 있음을 이해했다.

**K5.1**
- [M] 이 미션으로 AI가 학교·병원·상점 같은 곳에서도 결정에 쓰인다는 것을 알게 되었다.
- [H] 이 미션으로 AI가 사회의 다양한 의사결정 영역에 점점 더 쓰임을 이해했다.

**K5.2**
- [H] 이 미션으로 AI를 안전하게 쓰려면 감시와 규제가 필요함을 이해했다.

**K5.3**
- [L] 이 미션으로 AI 도움을 받았으면 솔직하게 말해야 한다는 걸 알게 되었다.
- [M] 이 미션으로 AI가 만든 결과물의 저작자와 출처가 중요하다는 것을 알게 되었다.
- [H] 이 미션으로 생성형 AI의 콘텐츠 진정성과 지적 재산권 문제를 이해했다.

**K5.4**
- [L] 이 미션으로 좋은 AI는 모두를 위해 공정해야 한다는 걸 알게 되었다.
- [M] 이 미션으로 AI는 공정하고 안전하게 만들어져야 한다는 것을 알게 되었다.
- [H] 이 미션으로 윤리적 AI 설계가 공정성·투명성·책임성을 포함해야 함을 이해했다.

### Skill (S)

**S.collaboration**
- [L] 이 미션에서 AI와 잘 주고받으며 활동할 수 있었다.
- [M] 이 미션에서 AI와 역할을 나누고 서로의 결과를 활용할 수 있었다.
- [H] 이 미션에서 AI와 효과적으로 소통하며 공동 작업을 탐색할 수 있었다.

**S.communication**
- [L] 이 미션에서 내가 AI를 어떻게 썼는지 다른 사람에게 말할 수 있었다.
- [M] 이 미션에서 AI가 한 일과 내가 한 일을 분명하게 표현할 수 있었다.
- [H] 이 미션에서 AI의 역할과 내 기여를 투명하게 설명할 수 있었다.

**S.computational_thinking**
- [L] 이 미션에서 AI에게 원하는 것을 차근차근 말할 수 있었다.
- [M] 이 미션에서 문제를 작게 나누어 AI에게 정확히 전달할 수 있었다.
- [H] 이 미션에서 문제를 구조적으로 분해해 명확한 지침을 AI에 제공할 수 있었다.

**S.creativity**
- [L] 이 미션에서 AI와 함께 새로운 것을 만들어낼 수 있었다.
- [M] 이 미션에서 AI 결과를 바탕으로 내 아이디어를 더할 수 있었다.
- [H] 이 미션에서 AI와 협업해 독창적인 아이디어를 발전시킬 수 있었다.

**S.critical_thinking**
- [L] 이 미션에서 AI가 준 것을 그대로 믿지 않고 한 번 더 확인해 볼 수 있었다.
- [M] 이 미션에서 AI의 답이 맞는지 기준을 세워 살펴볼 수 있었다.
- [H] 이 미션에서 AI 결과의 정확성·편향·공정성을 비판적으로 평가할 수 있었다.

**S.problem_solving**
- [L] 이 미션에서 AI를 써야 할지 말지 스스로 정할 수 있었다.
- [M] 이 미션에서 AI를 쓸 때 생길 수 있는 문제를 미리 생각할 수 있었다.
- [H] 이 미션에서 AI의 기술적 역량·위험·윤리를 고려해 사용을 결정할 수 있었다.

**S.self_social_awareness**
- [L] 이 미션으로 내 주변에 어떤 AI가 있는지 더 잘 알게 되었다.
- [M] 이 미션으로 AI가 나와 다른 사람에게 미치는 영향을 알게 되었다.
- [H] 이 미션으로 AI가 개인·공동체·사회에 미치는 영향을 성찰하게 되었다.

### Attitude (A)

**A.adaptable**
- [L] 이 미션에서 AI가 원하는 답을 주지 않아도 포기하지 않았다.
- [M] 이 미션에서 결과가 마음에 들지 않을 때 방법을 바꿔 다시 해볼 수 있었다.
- [H] 이 미션에서 AI와의 작업이 반복적 과정임을 이해하고 끈기 있게 수정했다.

**A.curious**
- [L] 이 미션으로 AI에 대해 더 알고 싶어졌다.
- [M] 이 미션으로 AI가 할 수 있는 일과 앞으로의 변화가 더 궁금해졌다.
- [H] 이 미션으로 AI의 가능성과 한계를 더 탐구하고 싶어졌다.

**A.empathetic**
- [L] 이 미션 이후에도 친구도 AI를 잘 쓸 수 있는지 생각하고 싶다.
- [M] 이 미션 이후에도 AI가 여러 사람에게 미치는 영향을 생각하려고 한다.
- [H] 이 미션 이후에도 AI가 다양한 사람·공동체·환경에 미치는 영향을 세심하게 살피고 싶다.

**A.innovative**
- [L] 이 미션 이후에도 AI로 새로운 것을 해보고 싶다.
- [M] 이 미션 이후에도 AI로 문제를 새롭게 해결해보고 싶다.
- [H] 이 미션 이후에도 AI를 활용해 실생활 문제에 창의적으로 도전하고 싶다.

**A.responsible**
- [L] 이 미션 이후에도 AI를 쓸 때 조심해서 쓰고 싶다.
- [M] 이 미션 이후에도 AI를 쓸 때 다른 사람에게 피해가 가지 않게 쓰려고 한다.
- [H] 이 미션 이후에도 AI를 쓸 때 의도한 결과와 의도치 않은 결과를 모두 책임지려 한다.

---

*Self-report values are averaged over a mission's mapped KSA items and
normalized to 0–1. The closed-task performance score (RQ1–RQ3) is computed
separately from rule criteria; see `mission_scoring_map.md` and `ruleScorers.js`.*
