/* ============================================================
   SAVINGS CALCULATOR — interactive slider with live numbers
   Based on the average scholarship coverage from Elite's case stats.
   ============================================================ */
const { useState, useEffect, useRef } = React;

/* Empirical scholarship coverage curve fitted to Elite's case data
   (cases range $72k–$858k over 4y on $20k–$60k/y tuition).      */
function coveragePct(sticker) {
  if (sticker <= 8000) return 12;
  // 8k → 14%, 25k → 38%, 45k → 60%, 60k → 72%
  const pct = 14 + (sticker - 8000) / 900;
  return Math.min(75, Math.round(pct));
}

const FIT_UNIS = [
  { range: [0, 14000],  list: ["Bellevue College (Сиэтл)", "Politecnico di Milano"] },
  { range: [14000, 25000], list: ["Roosevelt University", "Drake University", "Kalamazoo College"] },
  { range: [25000, 40000], list: ["La Salle University", "Saint Leo University", "UCL (Лондон)"] },
  { range: [40000, 99999], list: ["MIT", "UCL", "TUM (DAAD стипендия)"] },
];

function useSmoothNumber(target, duration = 380) {
  const [val, setVal] = useState(target);
  const raf = useRef(null);
  const fromRef = useRef(target);
  useEffect(() => {
    cancelAnimationFrame(raf.current);
    const from = fromRef.current;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.round(from + (target - from) * eased);
      setVal(v);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return val;
}

function SavingsCalculator() {
  const [sticker, setSticker] = useState(25000);
  const [years, setYears] = useState(4);
  const pct = coveragePct(sticker);
  const saved = Math.round(sticker * pct / 100);
  const real = sticker - saved;
  const totalSaved = saved * years;

  const animSaved = useSmoothNumber(saved);
  const animReal = useSmoothNumber(real);
  const animTotal = useSmoothNumber(totalSaved, 520);

  const fit = FIT_UNIS.find((f) => sticker >= f.range[0] && sticker < f.range[1])?.list || [];

  const fmt = (n) => "$" + n.toLocaleString("ru");

  return (
    <section className="section calc" id="calc">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">{window.eaText("calc.eyebrow")}</span>
          <h2>{window.eaTextBr("calc.h2")}</h2>
          <p>{window.eaText("calc.sub")}</p>
        </div>

        <div className="calc__layout">
          {/* ----- Controls ----- */}
          <div className="calc__controls card" data-reveal>
            <div className="calc__ctrl">
              <div className="calc__ctrl-top">
                <label className="calc__ctrl-label">Стоимость университета</label>
                <div className="calc__ctrl-val">{fmt(sticker)}<span>/год</span></div>
              </div>
              <input
                type="range"
                min="8000"
                max="60000"
                step="1000"
                value={sticker}
                onChange={(e) => setSticker(+e.target.value)}
                className="calc__range"
                style={{ "--p": ((sticker - 8000) / 52000 * 100) + "%" }}
              />
              <div className="calc__ctrl-marks">
                <span>$8k</span><span>$25k</span><span>$45k</span><span>$60k</span>
              </div>
            </div>

            <div className="calc__ctrl">
              <div className="calc__ctrl-top">
                <label className="calc__ctrl-label">Длительность программы</label>
              </div>
              <div className="calc__years">
                {[2, 3, 4].map((y) => (
                  <button
                    key={y}
                    className={"calc__year" + (years === y ? " is-on" : "")}
                    onClick={() => setYears(y)}
                  >
                    {y} {y === 2 ? "года" : "лет"}
                  </button>
                ))}
              </div>
            </div>

            <div className="calc__hint">
              <span className="calc__hint-ic" aria-hidden="true">💡</span>
              <p>Подвинь ползунок — увидишь, как меняется экономия. Расчёт по среднему покрытию стипендией для этой ценовой категории.</p>
            </div>
          </div>

          {/* ----- Result ----- */}
          <div className="calc__result card" data-reveal data-delay="1">
            <div className="calc__bar">
              <div className="calc__bar-block calc__bar-block--real" style={{ width: (100 - pct) + "%" }}>
                <span>Твоя цена</span>
                <b>{fmt(animReal)}/год</b>
              </div>
              <div className="calc__bar-block calc__bar-block--saved" style={{ width: pct + "%" }}>
                <span>Стипендия Elite</span>
                <b>{fmt(animSaved)}/год</b>
              </div>
            </div>

            <div className="calc__pct">
              <span className="calc__pct-num">{pct}%</span>
              <span className="calc__pct-lab">средняя стипендия<br/>для этого профиля</span>
            </div>

            <div className="calc__total">
              <span className="calc__total-lab">Сэкономишь за {years} {years === 2 ? "года" : "лет"} обучения</span>
              <div className="calc__total-num">{fmt(animTotal)}</div>
              <span className="calc__total-sub">Это новая машина, первый взнос за квартиру в Бишкеке или 4 года жизни за границей.</span>
            </div>

            {fit.length > 0 && (
              <div className="calc__fit">
                <span className="calc__fit-lab">В эту категорию попадают:</span>
                <div className="calc__fit-list">
                  {fit.map((u) => <span key={u} className="chip">{u}</span>)}
                </div>
              </div>
            )}

            <a href="#cta" className="btn btn--gold btn--block btn--lg calc__cta">
              Узнать точную сумму для тебя →
            </a>
            <div className="calc__micro">Бесплатный расчёт за 30 минут на консультации</div>
          </div>
        </div>
      </div>
    </section>
  );
}

window.SavingsCalculator = SavingsCalculator;
