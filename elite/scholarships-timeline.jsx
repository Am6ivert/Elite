/* ============================================================
   SCHOLARSHIPS (cases + filter + countdown) · HOW WE WORK (timeline)
   ============================================================ */
const { useState, useEffect, useRef } = React;

const CASES = [
  { sum: "$858 000", name: "Милана", quote: "11 университетов — все приняли", uni: "Bellevue College", tag: "академическая" },
  { sum: "$312 000", name: "Анара", quote: "135 баллов по Duolingo", uni: "Rowan University", tag: "академическая" },
  { sum: "$88 000", name: "Нуржамал", quote: "Программист, выпускница БГУ", uni: "Saint Leo University", tag: "академическая" },
  { sum: "$204 000", name: "Тимур", quote: "Спортивный грант по футболу", uni: "Drake University", tag: "спортивная" },
  { sum: "$156 000", name: "Айпери", quote: "Из региона — онлайн-подготовка", uni: "Kalamazoo College", tag: "академическая" },
  { sum: "$72 000", name: "Эрлан", quote: "Перевёлся из колледжа", uni: "Roosevelt University", tag: "спортивная" },
  { sum: "€0 / год", name: "Диана", quote: "Медицина в Италии — DSU закрыл расходы полностью", uni: "Università di Bologna", tag: "need-based" },
  { sum: "€726 / год", name: "Асель", quote: "Право в Австрии — почти бесплатно для иностранцев", uni: "Universität Wien", tag: "need-based" },
];

function useCountdown(target) {
  const [t, setT] = useState({});
  useEffect(() => {
    const tick = () => {
      const d = Math.max(0, target - Date.now());
      setT({
        d: Math.floor(d / 86400000),
        h: Math.floor((d / 3600000) % 24),
        m: Math.floor((d / 60000) % 60),
        s: Math.floor((d / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

function FlipDigit({ value }) {
  return (
    <span className="countdown__flip">
      <span key={value} className="countdown__flip-in">{value}</span>
    </span>
  );
}

const FALL_DEADLINE = new Date("2026-08-31T23:59:00").getTime();

function DeadlineBanner() {
  const t = useCountdown(FALL_DEADLINE);
  return (
    <div className="deadline-banner" data-reveal>
      <div className="wrap">
        <div className="scholar__deadline glass">
          <div className="scholar__deadline-txt">
            <div className="scholar__deadline-ic">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <div className="scholar__deadline-h">Дедлайн подачи на осенний семестр</div>
              <div className="scholar__deadline-sub">Набор закрывается — успей пройти оценку и забронировать место</div>
            </div>
          </div>
          <div className="countdown">
            {[["d","дней"],["h","часов"],["m","минут"],["s","секунд"]].map(([k, lab]) => {
              const padded = String(t[k] ?? 0).padStart(2, "0");
              return (
                <div className="countdown__unit" key={k}>
                  <span className="countdown__num">
                    {padded.split("").map((d, i) => <FlipDigit key={i} value={d} />)}
                  </span>
                  <span className="countdown__lab">{lab}</span>
                </div>
              );
            })}
          </div>
          <a href="admission.html#scholarships" className="btn btn--gold">Успеть подать</a>
        </div>
      </div>
    </div>
  );
}

function Scholarships() {
  const [filter, setFilter] = useState("Все");
  const filters = ["Все", "академическая", "спортивная", "need-based"];
  const list = CASES.filter((c) => filter === "Все" || c.tag === filter);
  const t = useCountdown(FALL_DEADLINE);

  return (
    <section className="section scholar" id="scholarships">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow eyebrow--gold">Стипендии и гранты</span>
          <h2>Учёба за границей может стоить дешевле,<br/>чем в Бишкеке</h2>
          <p>Реальные суммы скидок и стипендий наших студентов:</p>
        </div>

        <div className="scholar__filters" data-reveal>
          {filters.map((f) => (
            <button key={f} className={"scholar__filter" + (filter === f ? " is-on" : "")} onClick={() => setFilter(f)}>
              {f === "Все" ? "Все кейсы" : f === "академическая" ? "Академические" : f === "спортивная" ? "Спортивные" : "Need-based"}
            </button>
          ))}
        </div>

        <div className="scholar__grid stagger" key={filter}>
          {list.map((c, i) => (
            <article className="case card card--lift" key={c.name}>
              <div className="case__sum">{c.sum}</div>
              <div className="case__sum-label">скидок и стипендий</div>
              <div className="case__name">{c.name}</div>
              <p className="case__quote">«{c.quote}»</p>
              <div className="case__uni">{c.uni}</div>
              <span className={"chip " + (c.tag === "спортивная" ? "tag-blue" : c.tag === "need-based" ? "tag-green" : "tag-gold")} style={{ marginTop: 14 }}>{c.tag === "need-based" ? "need-based" : c.tag}</span>
            </article>
          ))}
        </div>

        <div className="scholar__deadline glass" data-reveal>
          <div className="scholar__deadline-txt">
            <span className="scholar__deadline-ic">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </span>
            <div>
              <div className="scholar__deadline-h">Дедлайн подачи на осенний семестр</div>
              <div className="scholar__deadline-sub">Набор закрывается — успей пройти оценку и забронировать место</div>
            </div>
          </div>
          <div className="countdown">
            {[["d","дней"],["h","часов"],["m","минут"],["s","секунд"]].map(([k, lab]) => {
              const padded = String(t[k] ?? 0).padStart(2, "0");
              return (
                <div className="countdown__unit" key={k}>
                  <span className="countdown__num">
                    {padded.split("").map((d, i) => <FlipDigit key={i} value={d} />)}
                  </span>
                  <span className="countdown__lab">{lab}</span>
                </div>
              );
            })}
          </div>
          <a href="#cta" className="btn btn--gold">Забронировать место</a>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { n: "01", t: "Бесплатная консультация (30 мин)", d: "Разбираем твой профиль, цели и бюджет. Честно говорим о шансах." },
  { n: "02", t: "Подбор вузов под тебя", d: "Не список из интернета, а персональный анализ 50+ университетов." },
  { n: "03", t: "Подготовка к Duolingo / TOEFL", d: "Наши преподаватели довели 100+ студентов до 100–140 баллов." },
  { n: "04", t: "Документы, эссе, заявки", d: "Проверка основателем лично. Подаём в неограниченное кол-во вузов." },
  { n: "05", t: "Виза F-1 / Student Visa", d: "Заполнение DS-160 + урок по интервью от основателя. Гарантия или возврат." },
  { n: "06", t: "Жизнь за границей: старт", d: "Авиабилеты, жильё, транспорт, водительские права — разберём всё." },
];

function HowWeWork() {
  return (
    <section className="section dark grain how" id="how">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow eyebrow--light">Как мы работаем</span>
          <h2>Твой путь из Бишкека<br/>в зарубежный университет — 6 шагов</h2>
          <p className="how__motto">Мы рядом на каждом этапе — от первой консультации до первого дня в кампусе.</p>
        </div>

        <div className="timeline">
          <div className="timeline__line"></div>
          {STEPS.map((s, i) => (
            <div className="tstep" data-reveal data-delay={(i % 3) + 1} key={s.n}>
              <div className="tstep__node">{s.n}</div>
              <div className="tstep__card glass">
                <h3 className="tstep__t">{s.t}</h3>
                <p className="tstep__d">{s.d}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="how__cta" data-reveal>
          <a href="#cta" className="btn btn--gold btn--lg">Начать шаг 1 — это бесплатно →</a>
        </div>
      </div>
    </section>
  );
}

window.DeadlineBanner = DeadlineBanner;
window.Scholarships = Scholarships;
window.HowWeWork = HowWeWork;
