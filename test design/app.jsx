// app.jsx — Greens main app (router + tweaks)

const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "chartMode": "ring",
  "showStreak": true,
  "accent": "fresh"
}/*EDITMODE-END*/;

function App() {
  const [tab, setTab] = useState("home");
  const [logOpen, setLogOpen] = useState(false);
  const [meals, setMeals] = useState(INITIAL_MEALS);
  const [water, setWater] = useState(4);
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply accent tweak as a CSS variable swap on root
  useEffect(() => {
    const root = document.documentElement;
    if (tweaks.accent === "deep") {
      root.style.setProperty("--greens-500", "#1f8c4a");
      root.style.setProperty("--greens-600", "#166e3a");
      root.style.setProperty("--greens-50", "#e7f4ec");
      root.style.setProperty("--n-protein", "#1f8c4a");
    } else if (tweaks.accent === "matcha") {
      root.style.setProperty("--greens-500", "#7da742");
      root.style.setProperty("--greens-600", "#5e8530");
      root.style.setProperty("--greens-50", "#f1f6e6");
      root.style.setProperty("--n-protein", "#7da742");
    } else {
      // fresh (default)
      root.style.setProperty("--greens-500", "#2ea65c");
      root.style.setProperty("--greens-600", "#1f8c4a");
      root.style.setProperty("--greens-50", "#ecf9f1");
      root.style.setProperty("--n-protein", "#2ea65c");
    }
  }, [tweaks.accent]);

  function addItem(slot, food) {
    setMeals(prev => ({ ...prev, [slot]: [...(prev[slot] || []), food] }));
    setLogOpen(false);
  }

  let screen;
  if (tab === "home") {
    screen = <HomeScreen meals={meals} water={water} setWater={setWater}
      onGoLog={() => setLogOpen(true)} onGoAnalysis={() => setTab("analysis")}
      chartMode={tweaks.chartMode} />;
  } else if (tab === "analysis") {
    screen = <AnalysisScreen meals={meals} chartMode={tweaks.chartMode} />;
  } else if (tab === "profile") {
    screen = <ProfileScreen />;
  } else {
    screen = <HomeScreen meals={meals} water={water} setWater={setWater}
      onGoLog={() => setLogOpen(true)} onGoAnalysis={() => setTab("analysis")}
      chartMode={tweaks.chartMode} />;
  }

  // Use a custom phone shell so we control the contents fully.
  // 402 × 874 (iPhone 16 Pro logical), with rounded bezel.
  const phone = (
    <div style={{
      width: 402, height: 874,
      background: "var(--bg-cream)",
      borderRadius: 56, overflow: "hidden",
      position: "relative",
      boxShadow: "0 30px 60px -20px rgba(23,23,23,0.25), 0 0 0 12px #1a1a1c, 0 0 0 13px #2a2a2c",
      display: "flex", flexDirection: "column",
      color: "var(--color-fg-neutral-primary)",
    }}>
      {/* dynamic island */}
      <div style={{
        position: "absolute", top: 11, left: "50%", transform: "translateX(-50%)",
        width: 124, height: 36, borderRadius: 999, background: "#000", zIndex: 100,
      }}></div>

      <StatusBar />

      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {screen}
      </div>

      <BottomNav active={tab === "log" ? "log" : tab} onChange={(id) => {
        if (id === "log") setLogOpen(true);
        else setTab(id);
      }} />

      {/* home indicator */}
      <div style={{
        position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
        width: 134, height: 5, borderRadius: 999, background: "rgba(0,0,0,0.35)", zIndex: 40,
      }}></div>

      {/* Meal-log bottom sheet */}
      {logOpen && (
        <>
          <div onClick={() => setLogOpen(false)} style={{
            position: "absolute", inset: 0, background: "rgba(0,0,0,0.32)",
            zIndex: 50, animation: "fadeIn 200ms ease-out",
          }}></div>
          <div style={{
            position: "absolute", left: 0, right: 0, bottom: 0,
            height: "92%",
            background: "var(--bg-cream)",
            borderTopLeftRadius: 28, borderTopRightRadius: 28,
            zIndex: 60, overflow: "hidden",
            animation: "slideUp 280ms cubic-bezier(0.4,0,0.2,1)",
            display: "flex", flexDirection: "column",
          }}>
            {/* grabber */}
            <div style={{ display: "flex", justifyContent: "center", paddingTop: 8, paddingBottom: 4, flexShrink: 0 }}>
              <div style={{ width: 36, height: 4, borderRadius: 999, background: "var(--color-fg-neutral-assistive)" }}></div>
            </div>
            <MealLogScreen onClose={() => setLogOpen(false)} onAddItem={addItem} />
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
        background: "radial-gradient(ellipse at top, #f3f7f0 0%, #ecf0eb 60%, #e6ebe5 100%)",
      }}>
        {phone}
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Visualization">
          <TweakRadio
            label="영양소 차트"
            value={tweaks.chartMode}
            onChange={(v) => setTweak("chartMode", v)}
            options={[
              { value: "ring", label: "링" },
              { value: "bar",  label: "바" },
            ]}
          />
        </TweakSection>
        <TweakSection title="Color accent">
          <TweakRadio
            label="그린 톤"
            value={tweaks.accent}
            onChange={(v) => setTweak("accent", v)}
            options={[
              { value: "fresh",  label: "Fresh" },
              { value: "deep",   label: "Deep" },
              { value: "matcha", label: "Matcha" },
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
