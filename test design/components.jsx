// components.jsx — Shared UI components for Greens

const { useState, useEffect, useRef, useMemo } = React;

// ─────────────────────────────────────────────────────────────
// Icons (inline SVG, 2px stroke, rounded — matches Wanted/Lucide style)
// ─────────────────────────────────────────────────────────────
function Icon({ name, size = 24, color = "currentColor", strokeWidth = 2 }) {
  const props = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: color, strokeWidth,
    strokeLinecap: "round", strokeLinejoin: "round",
  };
  switch (name) {
    case "home": return <svg {...props}><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/></svg>;
    case "plus": return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case "chart": return <svg {...props}><path d="M3 21h18"/><rect x="6" y="10" width="3" height="8" rx="1"/><rect x="11" y="6" width="3" height="12" rx="1"/><rect x="16" y="13" width="3" height="5" rx="1"/></svg>;
    case "user": return <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>;
    case "leaf": return <svg {...props}><path d="M11 20A7 7 0 0 1 4 13c0-7 7-9 16-9 0 9-2 16-9 16a7 7 0 0 1-7-7"/><path d="M4 13c4.5-1.5 9-6 9-9"/></svg>;
    case "search": return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
    case "chevron-right": return <svg {...props}><path d="m9 6 6 6-6 6"/></svg>;
    case "chevron-left": return <svg {...props}><path d="m15 6-6 6 6 6"/></svg>;
    case "close": return <svg {...props}><path d="M18 6 6 18M6 6l12 12"/></svg>;
    case "sun": return <svg {...props}><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/></svg>;
    case "moon": return <svg {...props}><path d="M21 13a8 8 0 0 1-10-10 8 8 0 1 0 10 10z"/></svg>;
    case "coffee": return <svg {...props}><path d="M4 8h13a3 3 0 0 1 0 6h-1"/><path d="M4 8v8a3 3 0 0 0 3 3h7a3 3 0 0 0 3-3V8z"/><path d="M8 2v3M12 2v3"/></svg>;
    case "cookie": return <svg {...props}><path d="M12 3a9 9 0 1 0 9 9 4 4 0 0 1-4-4 4 4 0 0 1-4-4 1 1 0 0 0-1-1z"/><circle cx="9" cy="11" r=".5" fill="currentColor"/><circle cx="14" cy="14" r=".5" fill="currentColor"/><circle cx="9" cy="16" r=".5" fill="currentColor"/></svg>;
    case "drop": return <svg {...props}><path d="M12 3s6 6 6 11a6 6 0 0 1-12 0c0-5 6-11 6-11z"/></svg>;
    case "sparkle": return <svg {...props}><path d="M12 4l1.5 4.5L18 10l-4.5 1.5L12 16l-1.5-4.5L6 10l4.5-1.5z"/><path d="M19 4l.5 1.5L21 6l-1.5.5L19 8l-.5-1.5L17 6l1.5-.5z"/></svg>;
    case "settings": return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>;
    case "bell": return <svg {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>;
    case "check": return <svg {...props}><path d="m5 12 5 5L20 7"/></svg>;
    case "edit": return <svg {...props}><path d="M11 4H4v16h16v-7"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>;
    case "flame": return <svg {...props}><path d="M12 22a7 7 0 0 0 4-12.7c-1 .5-2-.5-2-2 0-2-1-3.7-2-4.3-1 5-5 5-5 10a5 5 0 0 0 5 5z"/></svg>;
    case "calendar": return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>;
    default: return <svg {...props}><circle cx="12" cy="12" r="9"/></svg>;
  }
}

// ─────────────────────────────────────────────────────────────
// NutrientRing — concentric SVG arcs for protein/iron/B12
// ─────────────────────────────────────────────────────────────
function NutrientRing({ data, size = 200, stroke = 14, gap = 6 }) {
  // data: [{key, label, value, target, color}]
  const center = size / 2;
  const rings = data.map((d, i) => {
    const r = center - stroke / 2 - i * (stroke + gap);
    const c = 2 * Math.PI * r;
    const pct = Math.min(d.value / d.target, 1);
    return { ...d, r, c, dash: `${c * pct} ${c}` };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {rings.map((d, i) => (
        <g key={d.key}>
          <circle cx={center} cy={center} r={d.r}
            fill="none" stroke={d.color} strokeOpacity="0.14" strokeWidth={stroke} />
          <circle cx={center} cy={center} r={d.r}
            fill="none" stroke={d.color} strokeWidth={stroke}
            strokeLinecap="round" strokeDasharray={d.dash}
            transform={`rotate(-90 ${center} ${center})`}
            style={{ transition: "stroke-dasharray 600ms cubic-bezier(0.4,0,0.2,1)" }} />
        </g>
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// NutrientBar — alternative horizontal bars
// ─────────────────────────────────────────────────────────────
function NutrientBar({ label, value, target, unit, color }) {
  const pct = Math.min((value / target) * 100, 100);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-fg-neutral-strong)", letterSpacing: "0.0145em" }}>{label}</span>
        <span className="tabular" style={{ fontSize: 13, color: "var(--color-fg-neutral-alternative)", letterSpacing: "0.0194em" }}>
          <span style={{ fontWeight: 700, color: "var(--color-fg-neutral-primary)" }}>{value}</span>
          <span style={{ margin: "0 2px" }}>/</span>{target}{unit}
        </span>
      </div>
      <div className="progress" style={{ background: "rgba(0,0,0,0.05)" }}>
        <div className="bar" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Bottom Nav
// ─────────────────────────────────────────────────────────────
function BottomNav({ active, onChange }) {
  const items = [
    { id: "home", label: "홈", icon: "home" },
    { id: "log", label: "기록", icon: "plus", primary: true },
    { id: "analysis", label: "분석", icon: "chart" },
    { id: "profile", label: "마이", icon: "user" },
  ];
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 0,
      paddingBottom: 28, paddingTop: 8,
      background: "rgba(255,255,255,0.92)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      borderTop: "1px solid var(--color-line-neutral)",
      display: "flex", justifyContent: "space-around", alignItems: "center",
      zIndex: 30,
    }}>
      {items.map(it => {
        const on = active === it.id;
        if (it.primary) {
          return (
            <button key={it.id} onClick={() => onChange(it.id)} className="tappable"
              style={{
                width: 56, height: 56, borderRadius: 999,
                background: "var(--greens-500)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                color: "#fff", boxShadow: "0 6px 16px rgba(46,166,92,0.35)",
                marginTop: -22,
              }}>
              <Icon name="plus" size={26} />
            </button>
          );
        }
        return (
          <button key={it.id} onClick={() => onChange(it.id)} className="tappable"
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              padding: "6px 12px",
              color: on ? "var(--greens-600)" : "var(--color-fg-neutral-alternative)",
            }}>
            <Icon name={it.icon} size={24} strokeWidth={on ? 2.4 : 2} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.0311em" }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Meal slot card — for the home meal list
// ─────────────────────────────────────────────────────────────
function MealSlotCard({ slot, items, onAdd, onTap }) {
  const empty = !items || items.length === 0;
  const totalKcal = empty ? 0 : items.reduce((s, i) => s + (i.kcal || 0), 0);
  return (
    <div className="greens-card tappable" onClick={onTap}
      style={{ padding: 18, display: "flex", flexDirection: "column", gap: empty ? 12 : 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 14,
          background: slot.tint, color: slot.color,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name={slot.icon} size={22} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.012em" }}>{slot.label}</div>
          <div className="tabular" style={{ fontSize: 12, color: "var(--color-fg-neutral-alternative)", marginTop: 1, letterSpacing: "0.0252em" }}>
            {slot.timeRange}
          </div>
        </div>
        {empty ? (
          <button onClick={(e) => { e.stopPropagation(); onAdd(); }}
            style={{
              height: 32, padding: "0 12px", borderRadius: 999,
              background: "var(--greens-50)", color: "var(--greens-700)",
              fontSize: 13, fontWeight: 700, letterSpacing: "0.0145em",
              display: "inline-flex", alignItems: "center", gap: 4,
            }}>
            <Icon name="plus" size={14} strokeWidth={2.5} /> 추가
          </button>
        ) : (
          <span className="tabular" style={{ fontSize: 14, fontWeight: 700, color: "var(--color-fg-neutral-primary)" }}>
            {totalKcal} <span style={{ fontSize: 11, fontWeight: 500, color: "var(--color-fg-neutral-alternative)" }}>kcal</span>
          </span>
        )}
      </div>
      {!empty && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: 52 }}>
          {items.map((it, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, color: "var(--color-fg-neutral-strong)", letterSpacing: "0.0096em" }}>{it.name}</span>
              {it.vegan && <span className="chip chip-vegan" style={{ height: 20, padding: "0 7px", fontSize: 10 }}>
                <Icon name="leaf" size={10} strokeWidth={2.4} /> 비건
              </span>}
              <span style={{ flex: 1 }}></span>
              <span className="tabular" style={{ fontSize: 12, color: "var(--color-fg-neutral-alternative)" }}>{it.amount}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Status bar (simple iOS look — used inside frame)
// ─────────────────────────────────────────────────────────────
function StatusBar({ time = "9:41" }) {
  return (
    <div style={{
      height: 54, padding: "16px 24px 0",
      display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      fontFamily: "var(--font-display)",
      flexShrink: 0,
    }}>
      <span style={{ fontSize: 16, fontWeight: 600 }}>{time}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {/* signal */}
        <svg width="18" height="11" viewBox="0 0 18 11" fill="currentColor">
          <rect x="0" y="7" width="3" height="4" rx="1"/>
          <rect x="5" y="5" width="3" height="6" rx="1"/>
          <rect x="10" y="3" width="3" height="8" rx="1"/>
          <rect x="15" y="0" width="3" height="11" rx="1"/>
        </svg>
        {/* wifi */}
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M1 4a11 11 0 0 1 14 0"/>
          <path d="M3.5 6.5a7 7 0 0 1 9 0"/>
          <path d="M6 9a3 3 0 0 1 4 0"/>
        </svg>
        {/* battery */}
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="currentColor" strokeOpacity="0.4"/>
          <rect x="2" y="2" width="18" height="8" rx="1.5" fill="currentColor"/>
          <rect x="23.5" y="4" width="2" height="4" rx="0.8" fill="currentColor" fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

Object.assign(window, { Icon, NutrientRing, NutrientBar, BottomNav, MealSlotCard, StatusBar });
