/* ============================================================
   tweaks-app.jsx — color-theme + feel controls
   Mounts into #tweaks-root. Applies CSS variables to :root.
   ============================================================ */
const { useEffect } = React;

const THEMES = {
  sprout: {
    label: "새싹 그린", swatch: "#1E9150",
    v: {
      "--paper":"#F4F2E9","--paper-2":"#FBFAF4","--card":"#FFFFFF",
      "--ink":"#16150F","--ink-soft":"#595750","--ink-faint":"#918E83",
      "--line":"rgba(22,21,15,.12)","--line-soft":"rgba(22,21,15,.07)",
      "--accent":"#1E9150","--accent-deep":"#0C5230","--accent-soft":"#E6F1E2",
      "--highlight":"#CDEE5C","--on-accent":"#FBFFF6"
    }
  },
  forest: {
    label: "딥 포레스트", swatch: "#0E5C3A",
    v: {
      "--paper":"#EEF1EC","--paper-2":"#F7F9F5","--card":"#FFFFFF",
      "--ink":"#10231A","--ink-soft":"#4B5A50","--ink-faint":"#8A988F",
      "--line":"rgba(16,35,26,.13)","--line-soft":"rgba(16,35,26,.07)",
      "--accent":"#177A4E","--accent-deep":"#093E27","--accent-soft":"#DCEBE2",
      "--highlight":"#9FE870","--on-accent":"#F4FBF6"
    }
  },
  lime: {
    label: "라임 팝", swatch: "#34D058",
    v: {
      "--paper":"#F6F6F0","--paper-2":"#FFFFFF","--card":"#FFFFFF",
      "--ink":"#13160F","--ink-soft":"#54584C","--ink-faint":"#8C9082",
      "--line":"rgba(19,22,15,.12)","--line-soft":"rgba(19,22,15,.07)",
      "--accent":"#28B24A","--accent-deep":"#15602C","--accent-soft":"#E4F6E0",
      "--highlight":"#D7FF4F","--on-accent":"#FBFFF4"
    }
  },
  coral: {
    label: "코랄 선셋", swatch: "#E8654A",
    v: {
      "--paper":"#F7F1EC","--paper-2":"#FFFBF8","--card":"#FFFFFF",
      "--ink":"#231411","--ink-soft":"#6A574F","--ink-faint":"#A18C82",
      "--line":"rgba(35,20,17,.12)","--line-soft":"rgba(35,20,17,.07)",
      "--accent":"#E0563B","--accent-deep":"#9A2F1C","--accent-soft":"#F8E2D9",
      "--highlight":"#FFC24D","--on-accent":"#FFF8F4"
    }
  },
  ink: {
    label: "모노 잉크", swatch: "#1A1A1A",
    v: {
      "--paper":"#F1F0EC","--paper-2":"#FBFBF9","--card":"#FFFFFF",
      "--ink":"#121211","--ink-soft":"#56544F","--ink-faint":"#928F88",
      "--line":"rgba(18,18,17,.13)","--line-soft":"rgba(18,18,17,.07)",
      "--accent":"#1E1E1C","--accent-deep":"#000000","--accent-soft":"#E7E6E1",
      "--highlight":"#E8E54A","--on-accent":"#FAFAF7"
    }
  }
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "sprout",
  "radius": 18,
  "marquee": true,
  "bwPhoto": false
}/*EDITMODE-END*/;

function applyTheme(key) {
  const t = THEMES[key] || THEMES.sprout;
  const root = document.documentElement;
  Object.keys(t.v).forEach(function (k) { root.style.setProperty(k, t.v[k]); });
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(function () { applyTheme(t.theme); }, [t.theme]);

  useEffect(function () {
    const r = document.documentElement;
    r.style.setProperty("--radius", t.radius + "px");
    r.style.setProperty("--radius-sm", Math.max(4, Math.round(t.radius * 0.66)) + "px");
  }, [t.radius]);

  useEffect(function () {
    document.querySelectorAll(".marquee-track").forEach(function (el) {
      el.style.animationPlayState = t.marquee ? "running" : "paused";
    });
  }, [t.marquee]);

  useEffect(function () {
    const imgs = document.querySelectorAll(".hero-photo .pic img, .phone img");
    imgs.forEach(function (el) { el.style.filter = t.bwPhoto ? "grayscale(1) contrast(1.04)" : "none"; });
  }, [t.bwPhoto]);

  const themeKeys = Object.keys(THEMES);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="컬러 테마 · Color theme" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 6 }}>
        {themeKeys.map(function (k) {
          const active = t.theme === k;
          return (
            <button key={k} onClick={function () { setTweak("theme", k); }}
              style={{
                display: "flex", alignItems: "center", gap: 9, padding: "9px 11px",
                borderRadius: 11, cursor: "pointer", textAlign: "left",
                border: active ? "1.5px solid " + THEMES[k].swatch : "1px solid rgba(0,0,0,.12)",
                background: active ? "rgba(0,0,0,.04)" : "transparent",
                fontSize: 12.5, fontWeight: active ? 700 : 500, color: "#1a1a1a",
                transition: "all .2s"
              }}>
              <span style={{ width: 18, height: 18, borderRadius: 6, background: THEMES[k].swatch, flex: "none", boxShadow: "inset 0 0 0 1px rgba(0,0,0,.1)" }} />
              {THEMES[k].label}
            </button>
          );
        })}
      </div>

      <TweakSection label="느낌 · Feel" />
      <TweakSlider label="모서리 둥글기" value={t.radius} min={0} max={28} step={1} unit="px"
        onChange={function (v) { setTweak("radius", v); }} />
      <TweakToggle label="키워드 마퀴 흐름" value={t.marquee}
        onChange={function (v) { setTweak("marquee", v); }} />
      <TweakToggle label="사진 흑백 처리" value={t.bwPhoto}
        onChange={function (v) { setTweak("bwPhoto", v); }} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("tweaks-root")).render(<App />);
