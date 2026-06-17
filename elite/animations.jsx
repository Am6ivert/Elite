/* ============================================================
   ANIMATED BACKGROUND COMPONENTS
   - <AliveBackground variant="..." /> — floating geometric shapes
   - <SectionWave /> — animated wave divider
   ============================================================ */

/* SVG shape library — pure outlines, all use currentColor via stroke */
const SHAPES = {
  circle: (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="44" />
    </svg>
  ),
  triangle: (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <polygon points="50,8 92,84 8,84" />
    </svg>
  ),
  square: (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M 12 12 L 88 12 L 88 88 L 12 88 Z" />
    </svg>
  ),
  hex: (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <polygon points="50,6 90,28 90,72 50,94 10,72 10,28" />
    </svg>
  ),
  ring: (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="44" />
      <circle cx="50" cy="50" r="28" />
    </svg>
  ),
  cross: (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M 50 10 L 50 90 M 10 50 L 90 50" strokeLinecap="round" />
    </svg>
  ),
  wave: (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M 5 50 Q 25 20, 50 50 T 95 50" />
    </svg>
  ),
  diamond: (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <polygon points="50,8 92,50 50,92 8,50" />
    </svg>
  ),
};

/* Variants pick different combinations + positions */
const VARIANTS = {
  default: ["ring", "triangle", "hex", "square", "circle"],
  geometric: ["hex", "diamond", "triangle", "cross", "ring"],
  organic: ["wave", "circle", "ring", "wave", "circle"],
  minimal: ["circle", "ring", "cross"],
};

function AliveBackground({ variant = "default" }) {
  const shapes = VARIANTS[variant] || VARIANTS.default;
  return (
    <div className="alive" aria-hidden="true">
      {shapes.map((name, i) => (
        <div className={`alive__shape alive__shape--${i + 1}`} key={i}>
          {SHAPES[name]}
        </div>
      ))}
    </div>
  );
}

/* Section divider wave — between light sections */
function SectionWave({ flip = false, color = "var(--white)" }) {
  return (
    <div className={"section-wave " + (flip ? "section-wave--top" : "")} aria-hidden="true">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path
          d={
            "M 0 40 C 240 10, 480 70, 720 40 S 1200 10, 1440 40 L 1440 80 L 0 80 Z " +
            "M 1440 40 C 1680 10, 1920 70, 2160 40 S 2640 10, 2880 40 L 2880 80 L 1440 80 Z"
          }
          fill={color}
          opacity="0.6"
        />
      </svg>
    </div>
  );
}

/* Horizontal scroll rail with prev/next arrows (and optional wrap-around loop).
   Pass trackClass to reuse an existing flex/scroll grid (e.g. "countries__grid"). */
function ScrollRail({ children, trackClass = "", loop = false, step = 320 }) {
  const ref = React.useRef(null);
  function scroll(dir) {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (loop) {
      if (dir > 0 && el.scrollLeft >= max - 6) { el.scrollTo({ left: 0, behavior: "smooth" }); return; }
      if (dir < 0 && el.scrollLeft <= 6) { el.scrollTo({ left: max, behavior: "smooth" }); return; }
    }
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }
  return (
    <div className="srail">
      <button type="button" className="srail__arrow srail__arrow--prev" onClick={() => scroll(-1)} aria-label="Назад">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div className={"srail__track " + trackClass} ref={ref}>
        {children}
      </div>
      <button type="button" className="srail__arrow srail__arrow--next" onClick={() => scroll(1)} aria-label="Вперёд">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>
  );
}

window.AliveBackground = AliveBackground;
window.SectionWave = SectionWave;
window.ScrollRail = ScrollRail;
