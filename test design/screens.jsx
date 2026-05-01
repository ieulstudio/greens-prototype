// screens.jsx — Greens app screens (Home, MealLog, Analysis, Profile)

const { useState: useS, useMemo: useM } = React;

// ─────────────────────────────────────────────────────────────
// Sample data
// ─────────────────────────────────────────────────────────────
const SLOTS = [
  { id: "breakfast", label: "아침", icon: "sun",    timeRange: "06–10시", tint: "#fff7e6", color: "#d97706" },
  { id: "lunch",     label: "점심", icon: "coffee", timeRange: "11–14시", tint: "#ecf9f1", color: "#1f8c4a" },
  { id: "dinner",    label: "저녁", icon: "moon",   timeRange: "17–21시", tint: "#eef0fe", color: "#5b37ed" },
  { id: "snack",     label: "간식", icon: "cookie", timeRange: "수시",     tint: "#fdeef9", color: "#d331b8" },
];

const INITIAL_MEALS = {
  breakfast: [
    { name: "오트밀 + 두유", amount: "1그릇", kcal: 320, vegan: true, p: 12, fe: 2.8, b12: 0.4 },
    { name: "블루베리", amount: "한 줌", kcal: 60, vegan: true, p: 0.5, fe: 0.2, b12: 0 },
  ],
  lunch: [
    { name: "두부 비빔밥", amount: "1인분", kcal: 540, vegan: true, p: 22, fe: 4.1, b12: 0 },
    { name: "미소된장국", amount: "1컵", kcal: 80, vegan: true, p: 4, fe: 0.8, b12: 0.1 },
  ],
  dinner: [],
  snack: [
    { name: "아몬드", amount: "20알", kcal: 130, vegan: true, p: 5, fe: 0.7, b12: 0 },
  ],
};

const DEFAULT_TARGETS = { protein: 60, iron: 18, b12: 2.4 };

function sumNutrients(meals) {
  let p = 0, fe = 0, b12 = 0, kcal = 0;
  Object.values(meals).forEach(arr => arr.forEach(it => {
    p += it.p || 0; fe += it.fe || 0; b12 += it.b12 || 0; kcal += it.kcal || 0;
  }));
  return { p: +p.toFixed(1), fe: +fe.toFixed(1), b12: +b12.toFixed(1), kcal };
}

// ─────────────────────────────────────────────────────────────
// HOME
// ─────────────────────────────────────────────────────────────
function HomeScreen({ meals, water, setWater, onGoLog, onGoAnalysis, chartMode }) {
  const totals = useM(() => sumNutrients(meals), [meals]);
  const targets = DEFAULT_TARGETS;

  const ringData = [
    { key: "p",   label: "단백질",      value: totals.p,   target: targets.protein, color: "var(--n-protein)" },
    { key: "fe",  label: "철분",        value: totals.fe,  target: targets.iron,    color: "var(--n-iron)" },
    { key: "b12", label: "비타민 B12",  value: totals.b12, target: targets.b12,     color: "var(--n-b12)" },
  ];

  const today = new Date();
  const dateStr = `${today.getMonth() + 1}월 ${today.getDate()}일 ${["일","월","화","수","목","금","토"][today.getDay()]}요일`;

  // friendly feedback
  const feedback = useM(() => {
    const ratios = ringData.map(r => r.value / r.target);
    const avg = ratios.reduce((a, b) => a + b, 0) / ratios.length;
    if (avg < 0.4) return "오늘 하루 잘 시작하고 있어요 🌱";
    if (avg < 0.7) return "오늘도 잘 챙겨드시고 있어요!";
    if (avg < 0.95) return "거의 다 왔어요. 조금만 더!";
    return "오늘의 목표를 달성했어요. 멋져요!";
  }, [totals]);

  const lowestNutrient = useM(() => {
    return ringData.reduce((min, r) => (r.value / r.target < min.value / min.target ? r : min));
  }, [totals]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Scrollable content */}
      <div className="no-scrollbar" style={{ flex: 1, overflow: "auto", padding: "8px 20px 120px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0 20px" }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--color-fg-neutral-alternative)", letterSpacing: "0.0252em", fontWeight: 500 }}>
              {dateStr}
            </div>
            <div className="t-heading1" style={{ marginTop: 2, color: "var(--color-fg-neutral-primary)" }}>
              안녕하세요, 지유님 <span style={{ display: "inline-block", transform: "translateY(-1px)" }}>🌿</span>
            </div>
          </div>
          <button className="tappable" style={{
            width: 40, height: 40, borderRadius: 999,
            background: "#fff", border: "1px solid var(--color-line-normal)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            color: "var(--color-fg-neutral-strong)",
          }}>
            <Icon name="bell" size={20} />
          </button>
        </div>

        {/* Hero — chart toggleable via tweak */}
        <div className="greens-card" style={{
          background: "linear-gradient(180deg, #ffffff 0%, var(--bg-soft-green) 100%)",
          padding: 22, marginBottom: 14, position: "relative",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 13, color: "var(--greens-700)", fontWeight: 700, letterSpacing: "0.0145em" }}>
                오늘의 영양소
              </div>
              <div className="tabular" style={{ fontSize: 11, color: "var(--color-fg-neutral-alternative)", marginTop: 2, letterSpacing: "0.0311em" }}>
                {totals.kcal} kcal · 비건 100%
              </div>
            </div>
            <span className="chip chip-vegan">
              <Icon name="leaf" size={12} strokeWidth={2.4} /> Vegan
            </span>
          </div>

          {chartMode === "ring" ? (
            <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "8px 4px 4px" }}>
              <div style={{ position: "relative", width: 156, height: 156, flexShrink: 0 }}>
                <NutrientRing data={ringData} size={156} stroke={11} gap={5} />
                <div style={{
                  position: "absolute", inset: 0, display: "flex",
                  flexDirection: "column", alignItems: "center", justifyContent: "center",
                }}>
                  <div className="tabular" style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.024em", lineHeight: 1 }}>
                    {Math.round(((totals.p/targets.protein)+(totals.fe/targets.iron)+(totals.b12/targets.b12))/3*100)}%
                  </div>
                  <div style={{ fontSize: 10, color: "var(--color-fg-neutral-alternative)", marginTop: 4, letterSpacing: "0.0311em", fontWeight: 600 }}>
                    평균 달성
                  </div>
                </div>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                {ringData.map(r => (
                  <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 999, background: r.color, flexShrink: 0 }}></span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.0145em" }}>{r.label}</div>
                      <div className="tabular" style={{ fontSize: 11, color: "var(--color-fg-neutral-alternative)", letterSpacing: "0.0252em", marginTop: 1 }}>
                        {r.value} / {r.target}{r.key === "b12" ? "μg" : "g"}
                      </div>
                    </div>
                    <span className="tabular" style={{ fontSize: 13, fontWeight: 700, color: r.color }}>
                      {Math.round((r.value/r.target)*100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "10px 2px 2px" }}>
              <NutrientBar label="단백질"     value={totals.p}   target={targets.protein} unit="g"  color="var(--n-protein)" />
              <NutrientBar label="철분"       value={totals.fe}  target={targets.iron}    unit="mg" color="var(--n-iron)" />
              <NutrientBar label="비타민 B12" value={totals.b12} target={targets.b12}     unit="μg" color="var(--n-b12)" />
            </div>
          )}
        </div>

        {/* Friendly feedback card */}
        <div className="greens-card-flat" style={{
          background: "var(--greens-50)", padding: "16px 18px", marginBottom: 22,
          display: "flex", alignItems: "flex-start", gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 999, background: "#fff",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            color: "var(--greens-600)", flexShrink: 0,
          }}>
            <Icon name="sparkle" size={20} />
          </div>
          <div style={{ flex: 1, paddingTop: 2 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--greens-800)", letterSpacing: "0.0145em" }}>
              {feedback}
            </div>
            <div style={{ fontSize: 12, color: "var(--greens-700)", marginTop: 4, lineHeight: 1.5, letterSpacing: "0.0252em" }}>
              {lowestNutrient.label}이 조금 부족해요. 저녁에 {
                lowestNutrient.key === "p" ? "두부나 렌틸콩" :
                lowestNutrient.key === "fe" ? "시금치나 검은콩" : "영양강화 시리얼"
              }을 더해보면 어때요?
            </div>
          </div>
        </div>

        {/* Section: today's meals */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span className="t-heading2" style={{ fontSize: 17 }}>오늘 식사</span>
          <button onClick={onGoLog} className="tappable" style={{
            fontSize: 12, fontWeight: 600, color: "var(--color-fg-neutral-alternative)",
            display: "inline-flex", alignItems: "center", gap: 2, letterSpacing: "0.0252em",
          }}>
            전체 <Icon name="chevron-right" size={14} />
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
          {SLOTS.map(slot => (
            <MealSlotCard key={slot.id} slot={slot} items={meals[slot.id]}
              onAdd={onGoLog} onTap={onGoLog} />
          ))}
        </div>

        {/* Water */}
        <div className="greens-card" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 12,
                background: "rgba(0,174,255,0.12)", color: "var(--color-atomic-lightBlue-50)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name="drop" size={20} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.012em" }}>물 섭취</div>
                <div className="tabular" style={{ fontSize: 12, color: "var(--color-fg-neutral-alternative)", marginTop: 1, letterSpacing: "0.0252em" }}>
                  {water} / 8컵
                </div>
              </div>
            </div>
            <button onClick={() => setWater(Math.max(0, water - 1))}
              style={{ width: 32, height: 32, borderRadius: 999, background: "var(--color-bg-neutral-tertiary)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--color-fg-neutral-strong)" }}>
              <Icon name="close" size={14} strokeWidth={2.4} />
            </button>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {Array.from({ length: 8 }).map((_, i) => {
              const filled = i < water;
              return (
                <button key={i} onClick={() => setWater(i + 1)} className="tappable"
                  style={{
                    flex: 1, height: 38, borderRadius: 10,
                    background: filled ? "rgba(0,174,255,0.14)" : "var(--color-bg-neutral-tertiary)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    color: filled ? "var(--color-atomic-lightBlue-50)" : "var(--color-fg-neutral-assistive)",
                    transition: "200ms",
                  }}>
                  <Icon name="drop" size={18} strokeWidth={filled ? 2 : 1.6} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Streak */}
        <div className="greens-card-flat" style={{
          background: "#fff",
          border: "1px solid var(--color-line-normal)",
          padding: "16px 18px",
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14, background: "rgba(255,146,0,0.12)",
            color: "var(--color-status-cautionary)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name="flame" size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="tabular" style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.012em" }}>
              12일 연속 기록 중
            </div>
            <div style={{ fontSize: 12, color: "var(--color-fg-neutral-alternative)", marginTop: 1, letterSpacing: "0.0252em" }}>
              꾸준함이 가장 큰 힘이에요
            </div>
          </div>
          <Icon name="chevron-right" size={18} color="var(--color-fg-neutral-assistive)" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MEAL LOG
// ─────────────────────────────────────────────────────────────
const FOOD_DB = [
  { name: "두부", amount: "100g", kcal: 76, vegan: true, p: 8, fe: 1.5, b12: 0, tags: ["단백질"] },
  { name: "렌틸콩", amount: "1컵", kcal: 230, vegan: true, p: 18, fe: 6.6, b12: 0, tags: ["철분", "단백질"] },
  { name: "병아리콩", amount: "1컵", kcal: 269, vegan: true, p: 15, fe: 4.7, b12: 0, tags: ["철분"] },
  { name: "퀴노아", amount: "1컵", kcal: 222, vegan: true, p: 8, fe: 2.8, b12: 0, tags: ["단백질"] },
  { name: "시금치", amount: "1컵", kcal: 23, vegan: true, p: 3, fe: 6.4, b12: 0, tags: ["철분"] },
  { name: "두유", amount: "1컵", kcal: 105, vegan: true, p: 8, fe: 1.1, b12: 1.2, tags: ["B12"] },
  { name: "영양강화 시리얼", amount: "1그릇", kcal: 110, vegan: true, p: 3, fe: 4.5, b12: 1.5, tags: ["B12", "철분"] },
  { name: "아보카도", amount: "반 개", kcal: 160, vegan: true, p: 2, fe: 0.6, b12: 0 },
  { name: "현미밥", amount: "1공기", kcal: 220, vegan: true, p: 5, fe: 0.8, b12: 0 },
  { name: "김치", amount: "1접시", kcal: 30, vegan: true, p: 2, fe: 0.5, b12: 0 },
];

function MealLogScreen({ onClose, onAddItem }) {
  const [activeSlot, setActiveSlot] = useS("lunch");
  const [query, setQuery] = useS("");
  const filtered = FOOD_DB.filter(f => !query || f.name.includes(query));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--bg-cream)" }}>
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "8px 12px 12px",
        background: "rgba(251,250,246,0.92)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--color-line-neutral)",
      }}>
        <button onClick={onClose} className="tappable" style={{
          width: 40, height: 40, borderRadius: 999, display: "inline-flex",
          alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="chevron-left" size={24} />
        </button>
        <div style={{ flex: 1, fontSize: 17, fontWeight: 700, letterSpacing: "-0.012em" }}>
          식사 기록
        </div>
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflow: "auto", padding: "16px 20px 100px" }}>
        {/* Slot selector */}
        <div className="seg" style={{ display: "flex", width: "100%", marginBottom: 16 }}>
          {SLOTS.map(s => (
            <button key={s.id} className={activeSlot === s.id ? "on" : ""} onClick={() => setActiveSlot(s.id)}
              style={{ flex: 1 }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          height: 48, padding: "0 16px",
          background: "#fff", borderRadius: 16,
          border: "1px solid var(--color-line-normal)",
          marginBottom: 18,
        }}>
          <Icon name="search" size={20} color="var(--color-fg-neutral-alternative)" />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="음식명을 검색하세요"
            style={{ flex: 1, border: "none", outline: "none", background: "transparent",
              fontFamily: "var(--font-primary)", fontSize: 15, letterSpacing: "0.0096em" }}
          />
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-fg-neutral-alternative)", letterSpacing: "0.0311em", marginBottom: 8, paddingLeft: 4 }}>
          추천 식품
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((f, i) => (
            <div key={i} className="greens-card tappable" onClick={() => onAddItem(activeSlot, f)}
              style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: "var(--greens-50)", color: "var(--greens-600)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <Icon name="leaf" size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.012em" }}>{f.name}</div>
                <div className="tabular" style={{ fontSize: 12, color: "var(--color-fg-neutral-alternative)", marginTop: 2, letterSpacing: "0.0252em", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <span>{f.amount} · {f.kcal}kcal</span>
                  {f.tags && f.tags.map(t => (
                    <span key={t} className="chip chip-soft" style={{ height: 20, fontSize: 10, padding: "0 7px", letterSpacing: "0.0311em" }}>{t}</span>
                  ))}
                </div>
              </div>
              <button style={{
                width: 32, height: 32, borderRadius: 999,
                background: "var(--greens-500)", color: "#fff",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <Icon name="plus" size={18} strokeWidth={2.4} />
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: "40px 0", textAlign: "center", color: "var(--color-fg-neutral-alternative)", fontSize: 14 }}>
              검색 결과가 없어요
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ANALYSIS
// ─────────────────────────────────────────────────────────────
function AnalysisScreen({ meals, chartMode }) {
  const totals = sumNutrients(meals);
  const targets = DEFAULT_TARGETS;

  // mock weekly data
  const week = [
    { day: "월", p: 58, fe: 14, b12: 2.0 },
    { day: "화", p: 45, fe: 11, b12: 1.5 },
    { day: "수", p: 62, fe: 16, b12: 2.4 },
    { day: "목", p: 50, fe: 13, b12: 1.8 },
    { day: "금", p: 70, fe: 19, b12: 2.6 },
    { day: "토", p: 48, fe: 12, b12: 1.6 },
    { day: "오늘", p: totals.p, fe: totals.fe, b12: totals.b12 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="no-scrollbar" style={{ flex: 1, overflow: "auto", padding: "8px 20px 120px" }}>
        <div style={{ padding: "12px 0 18px" }}>
          <div className="t-heading1">영양 분석</div>
          <div style={{ fontSize: 12, color: "var(--color-fg-neutral-alternative)", marginTop: 2, letterSpacing: "0.0252em" }}>
            이번 주 영양소 트렌드
          </div>
        </div>

        {/* Weekly bar chart */}
        <div className="greens-card" style={{ marginBottom: 14, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.0145em" }}>단백질 (목표 60g)</span>
            <span className="tabular" style={{ fontSize: 12, color: "var(--n-protein)", fontWeight: 700, letterSpacing: "0.0252em" }}>
              평균 55g
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "stretch", gap: 8, height: 140, paddingTop: 8 }}>
            {week.map((d, i) => {
              const h = (d.p / 80) * 100;
              const isToday = i === week.length - 1;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 6, height: "100%" }}>
                  <div style={{
                    width: "100%", height: `${h}%`, minHeight: 4,
                    background: isToday ? "var(--n-protein)" : "var(--n-protein-soft)",
                    borderRadius: 6,
                    transition: "height 400ms var(--ease-standard)",
                  }}></div>
                  <span style={{ fontSize: 11, color: isToday ? "var(--color-fg-neutral-primary)" : "var(--color-fg-neutral-alternative)", fontWeight: isToday ? 700 : 500, letterSpacing: "0.0311em" }}>
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="greens-card" style={{ marginBottom: 14, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.0145em" }}>철분 (목표 18mg)</span>
            <span className="tabular" style={{ fontSize: 12, color: "var(--n-iron)", fontWeight: 700, letterSpacing: "0.0252em" }}>
              평균 14mg
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "stretch", gap: 8, height: 120, paddingTop: 8 }}>
            {week.map((d, i) => {
              const h = (d.fe / 25) * 100;
              const isToday = i === week.length - 1;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 6, height: "100%" }}>
                  <div style={{
                    width: "100%", height: `${h}%`, minHeight: 4,
                    background: isToday ? "var(--n-iron)" : "var(--n-iron-soft)",
                    borderRadius: 6,
                  }}></div>
                  <span style={{ fontSize: 11, color: isToday ? "var(--color-fg-neutral-primary)" : "var(--color-fg-neutral-alternative)", fontWeight: isToday ? 700 : 500, letterSpacing: "0.0311em" }}>
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="greens-card" style={{ marginBottom: 14, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.0145em" }}>비타민 B12 (목표 2.4μg)</span>
            <span className="tabular" style={{ fontSize: 12, color: "var(--n-b12)", fontWeight: 700, letterSpacing: "0.0252em" }}>
              평균 2.0μg
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "stretch", gap: 8, height: 120, paddingTop: 8 }}>
            {week.map((d, i) => {
              const h = (d.b12 / 3) * 100;
              const isToday = i === week.length - 1;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 6, height: "100%" }}>
                  <div style={{
                    width: "100%", height: `${h}%`, minHeight: 4,
                    background: isToday ? "var(--n-b12)" : "var(--n-b12-soft)",
                    borderRadius: 6,
                  }}></div>
                  <span style={{ fontSize: 11, color: isToday ? "var(--color-fg-neutral-primary)" : "var(--color-fg-neutral-alternative)", fontWeight: isToday ? 700 : 500, letterSpacing: "0.0311em" }}>
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insight card */}
        <div className="greens-card-flat" style={{
          background: "var(--greens-50)", padding: "16px 18px",
          display: "flex", gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 999, background: "#fff",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            color: "var(--greens-600)", flexShrink: 0,
          }}>
            <Icon name="sparkle" size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--greens-800)", letterSpacing: "0.0145em" }}>
              주간 인사이트
            </div>
            <div style={{ fontSize: 12.5, color: "var(--greens-700)", marginTop: 4, lineHeight: 1.55, letterSpacing: "0.0252em" }}>
              화요일과 토요일에 단백질 섭취가 낮은 편이에요. 주말에는 두부 요리 한 가지를 미리 준비해두면 어떨까요?
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PROFILE (simple)
// ─────────────────────────────────────────────────────────────
function ProfileScreen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="no-scrollbar" style={{ flex: 1, overflow: "auto", padding: "8px 20px 120px" }}>
        <div className="t-heading1" style={{ padding: "12px 0 18px" }}>마이</div>

        <div className="greens-card" style={{
          marginBottom: 14, padding: 20,
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <div className="avatar" style={{ width: 56, height: 56, fontSize: 18 }}>지</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.012em" }}>김지유</div>
            <div className="tabular" style={{ fontSize: 12, color: "var(--color-fg-neutral-alternative)", marginTop: 2, letterSpacing: "0.0252em" }}>
              비건 · 시작한 지 78일째
            </div>
          </div>
          <button style={{
            width: 36, height: 36, borderRadius: 999,
            background: "var(--color-bg-neutral-tertiary)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            color: "var(--color-fg-neutral-strong)",
          }}>
            <Icon name="edit" size={18} />
          </button>
        </div>

        {[
          { icon: "leaf", label: "채식 단계", value: "비건" },
          { icon: "calendar", label: "목표 칼로리", value: "1,800 kcal" },
          { icon: "sparkle", label: "취약 영양소", value: "단백질 · 철분 · B12" },
          { icon: "settings", label: "알림 설정", value: "" },
        ].map((row, i) => (
          <div key={i} className="greens-card tappable" style={{
            padding: "16px 18px", marginBottom: 8,
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 12,
              background: "var(--greens-50)", color: "var(--greens-600)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name={row.icon} size={18} />
            </div>
            <div style={{ flex: 1, fontSize: 14, fontWeight: 600, letterSpacing: "0.0145em" }}>{row.label}</div>
            <div style={{ fontSize: 13, color: "var(--color-fg-neutral-alternative)", letterSpacing: "0.0145em" }}>{row.value}</div>
            <Icon name="chevron-right" size={16} color="var(--color-fg-neutral-assistive)" />
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen, MealLogScreen, AnalysisScreen, ProfileScreen, INITIAL_MEALS });
