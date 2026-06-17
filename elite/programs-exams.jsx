/* ============================================================
   PROGRAMS (tabs) · EXAMS (cards, Duolingo accent)
   ============================================================ */
const { useState } = React;

/* Each tab maps to a catalog level (universities.html filter) where possible.
   Items with `field` link to the catalog with level+field pre-filtered. */
const PROGRAMS = {
  "Бакалавриат": { level: "Бакалавр", items: [
    { name: "Computer Science", flag: "US", country: "США", dur: "4 года", price: "от $9 000/год", schol: "ср. $40 000", specs: "AI · Data · Software", field: "IT", guar: true },
    { name: "Business Administration", flag: "US", country: "США", dur: "4 года", price: "от $10 000/год", schol: "ср. $32 000", specs: "Маркетинг · Финансы", field: "Бизнес", guar: true },
    { name: "Инженерия", flag: "IT", country: "Италия", dur: "3 года", price: "от €2 100/год", schol: "гранты DSU", specs: "Механика · Авиа · Авто", field: "Инженерия", guar: true },
    { name: "Медицина", flag: "IT", country: "Италия", dur: "6 лет", price: "от €2 200/год", schol: "гранты DSU", specs: "На английском · IMAT", field: "Медицина" },
    { name: "Дизайн и архитектура", flag: "IT", country: "Италия", dur: "3 года", price: "от €2 600/год", schol: "ср. $9 000", specs: "Product · Interior · Fashion", field: "Дизайн" },
    { name: "Право", flag: "AT", country: "Австрия", dur: "3 года", price: "от €726/год", schol: "почти бесплатно", specs: "Международное · ЕС", field: "Право", guar: true },
  ]},
  "Магистратура": { level: "Магистр", items: [
    { name: "Data Science (MSc)", flag: "US", country: "США", dur: "2 года", price: "от $14 000/год", schol: "ср. $25 000", specs: "ML · Analytics", field: "IT" },
    { name: "Engineering (MSc)", flag: "DE", country: "Германия", dur: "2 года", price: "€0 в гос. вузах", schol: "DAAD грант", specs: "Robotics · Energy", field: "Инженерия" },
    { name: "Management (MSc)", flag: "AT", country: "Австрия", dur: "2 года", price: "от €726/год", schol: "почти бесплатно", specs: "Стратегия · Консалтинг", field: "Бизнес", guar: true },
    { name: "Finance & Economics", flag: "IT", country: "Италия", dur: "2 года", price: "от €2 500/год", schol: "гранты DSU", specs: "Banking · Fintech", field: "Экономика", guar: true },
    { name: "Public Health (MPH)", flag: "US", country: "США", dur: "2 года", price: "от $20 000/год", schol: "ср. $30 000", specs: "Эпидемиология", field: "Медицина" },
    { name: "Design (MA)", flag: "IT", country: "Италия", dur: "2 года", price: "от €2 600/год", schol: "ср. €5 000", specs: "Fashion · Product", field: "Дизайн" },
  ]},
  "МВА": { level: "Магистр", items: [
    { name: "Full-time MBA", flag: "US", country: "США", dur: "2 года", price: "от $25 000/год", schol: "ср. $45 000", specs: "Strategy · Finance", field: "Бизнес" },
    { name: "Global MBA", flag: "MY", country: "Малайзия", dur: "1–1.5 года", price: "от $9 000", schol: "скидки до 50%", specs: "Британский диплом", field: "Бизнес", guar: true },
    { name: "Tech MBA", flag: "US", country: "США", dur: "1.5 года", price: "от $29 000/год", schol: "ср. $35 000", specs: "Product · Startups", field: "Бизнес" },
  ]},
  "PhD": { level: "PhD", items: [
    { name: "PhD in Computer Science", flag: "US", country: "США", dur: "4–5 лет", price: "Финансируется", schol: "стипендия + стайпенд", specs: "Research", field: "IT" },
    { name: "PhD in Engineering", flag: "DE", country: "Германия", dur: "3–4 года", price: "Финансируется", schol: "оплата позиции", specs: "Applied research", field: "Инженерия" },
    { name: "PhD in Economics", flag: "AT", country: "Австрия", dur: "3–4 года", price: "от €726/год", schol: "ассистентские позиции", specs: "Econometrics", field: "Экономика" },
  ]},
  "Языковые": { level: null, items: [
    { name: "Intensive English (ESL)", flag: "US", country: "США", dur: "4–24 нед.", price: "$1 200/мес", schol: "—", specs: "Подготовка к вузу", guar: true },
    { name: "English Foundation", flag: "MY", country: "Малайзия", dur: "8–36 нед.", price: "от $400/мес", schol: "—", specs: "Перед вузами Азии", guar: true },
    { name: "Italian A1–B2", flag: "IT", country: "Италия", dur: "12 нед.", price: "$900/мес", schol: "—", specs: "Для бесплатных вузов" },
  ]},
  "Летние школы": { level: null, items: [
    { name: "Summer @ Berkeley", flag: "US", country: "США", dur: "6 нед.", price: "$4 500", schol: "частичные", specs: "Pre-college" },
    { name: "Vienna Summer School", flag: "AT", country: "Австрия", dur: "3 нед.", price: "$2 800", schol: "—", specs: "Немецкий + академики" },
    { name: "Milan Design Camp", flag: "IT", country: "Италия", dur: "4 нед.", price: "$3 100", schol: "—", specs: "Creative" },
  ]},
  "Онлайн": { level: null, items: [
    { name: "Online Bachelor (CS)", flag: "US", country: "США", dur: "4 года", price: "$7 000/год", schol: "ср. $15 000", specs: "Гибкий график" },
    { name: "Online MBA", flag: "US", country: "США", dur: "1.5 года", price: "$18 000", schol: "ср. $9 000", specs: "Без отрыва" },
    { name: "MicroMasters", flag: "WW", country: "Глобально", dur: "6–12 мес.", price: "$1 500", schol: "—", specs: "Credential" },
  ]},
};

/* Quick path picker: who are you → which tab fits */
const WHO = [
  { ic: "01", t: "Школьник", sub: "9–11 класс", tab: "Бакалавриат" },
  { ic: "02", t: "Студент / выпускник", sub: "после вуза", tab: "Магистратура" },
  { ic: "03", t: "Работаю", sub: "карьерный рост", tab: "МВА" },
  { ic: "04", t: "Начну с языка", sub: "или летней школы", tab: "Языковые" },
];

function Programs() {
  const tabs = Object.keys(PROGRAMS);
  const [tab, setTab] = useState(tabs[0]);
  const cur = PROGRAMS[tab];
  const catalogCount = cur.level
    ? (window.EA_UNIS || []).filter((u) => u.levels.includes(cur.level)).length
    : 0;

  const progLink = (p) =>
    p.field && cur.level
      ? `universities.html?level=${encodeURIComponent(cur.level)}&field=${encodeURIComponent(p.field)}`
      : "#cta";

  return (
    <section className="section section--tight programs" id="programs">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Программы обучения</span>
          <h2>Найди формат под свою цель</h2>
        </div>

        <div className="programs__who" data-reveal>
          {WHO.map((w) => (
            <button key={w.t}
              className={"pwho" + (tab === w.tab ? " is-on" : "")}
              onClick={() => setTab(w.tab)}>
              <span className="pwho__ic" aria-hidden="true">{w.ic}</span>
              <span className="pwho__txt">
                <b>{w.t}</b>
                <span>{w.sub}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="programs__tabs" data-reveal>
          {tabs.map((t) => (
            <button key={t} className={"programs__tab" + (tab === t ? " is-on" : "")} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        <div className="programs__grid stagger" key={tab}>
          {cur.items.map((p, i) => (
            <article className="prog card card--lift" key={p.name}>
              <div className="prog__head">
                <span className="prog__flag">{p.flag}</span>
                <div>
                  <h3 className="prog__name">{p.name}</h3>
                  <div className="prog__country">{p.country}</div>
                </div>
              </div>
              <div className="prog__rows">
                <div className="prog__row"><span>Длительность</span><b>{p.dur}</b></div>
                <div className="prog__row"><span>Стоимость</span><b>{p.price}</b></div>
                <div className="prog__row"><span>Стипендия Elite</span><b className="prog__schol">{p.schol}</b></div>
              </div>
              {p.guar && <div className="prog__guar">✓ Гарантия поступления по договору</div>}
              <div className="prog__specs">{p.specs}</div>
              <a href={progLink(p)} className="prog__link">
                {p.field && cur.level ? "Вузы с этой программой →" : "Узнать подробнее →"}
              </a>
            </article>
          ))}
        </div>

        {cur.level && catalogCount > 0 && (
          <div className="programs__cat-link" data-reveal>
            В каталоге <b>{catalogCount}</b> вузов с уровнем «{cur.level}» —{" "}
            <a href={`universities.html?level=${encodeURIComponent(cur.level)}`}>открыть с фильтром →</a>
          </div>
        )}
      </div>
    </section>
  );
}

const EXAMS = [
  { name: "TOEFL iBT", badge: "Самый нужный",
    desc: "Золотой стандарт для США и Канады. Принимают 11 000+ вузов по всему миру. Наши студенты получают 90–110 баллов после 6–8 недель подготовки с нами.",
    diff: "Средне", price: "$185", for: "США, Канада, Австралия" },
  { name: "IELTS", badge: "",
    desc: "Открывает двери в Великобританию, Австралию и Европу. Band 6.0–6.5 достаточно для большинства программ. Работаем с Academic и General Training.",
    diff: "Средне", price: "$215", for: "UK, Австралия, ЕС" },
  { name: "Duolingo DET", badge: "Самый дешёвый",
    desc: "Сдаётся онлайн за $65 прямо из дома — результат через 48 часов. Принимают 5000+ вузов включая топ-100. Наша специализация: 90% студентов сдают с первой попытки.",
    diff: "Низко", price: "$65", for: "США, Европа, Азия" },
  { name: "SAT", badge: "",
    desc: "Нужен для бакалавриата в топ-вузах США. Высокий балл (1400+) значительно увеличивает шанс на стипендию. Готовим к Math и Reading секциям.",
    diff: "Высоко", price: "$103", for: "США" },
  { name: "CILS / CELI", badge: "Для бесплатной учёбы",
    desc: "Итальянский B1–B2 открывает доступ к бесплатным государственным вузам Италии с грантом DSU. Это твой билет на учёбу за €0 в год в Милане, Риме или Болонье.",
    diff: "Средне", price: "€105–160", for: "Италия" },
  { name: "GRE / GMAT", badge: "",
    desc: "Для магистратуры, PhD и МВА в США. Высокий балл компенсирует менее сильное GPA и открывает дополнительные стипендии. Готовим под конкретную программу.",
    diff: "Высоко", price: "$220–275", for: "Весь мир" },
  { name: "CЕНТ-S", badge: "Италия · CISIA",
    desc: "Единый вступительный экзамен CISIA для иностранных студентов, поступающих на англоязычные бакалаврские программы в Италии. Тестирует математику, физику и логику. Обязателен для Politecnico di Milano, Bocconi и других топ-вузов.",
    diff: "Средне", price: "€50–80", for: "Италия" },
];

function Exams() {
  return (
    <section className="section exams" id="exams">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow eyebrow--gold">Экзамены и тесты</span>
          <h2>Какой тест нужен для поступления?</h2>
        </div>

        <div className="exams__hero card" data-reveal>
          <div className="exams__hero-left">
            <span className="chip tag-green">Наша специализация</span>
            <h3 className="exams__hero-name">Duolingo English Test</h3>
            <p className="exams__hero-desc">105–140 баллов. Сдаётся онлайн из дома за <b>$65</b>. Наши студенты в среднем сдают с <b>1-й попытки</b> — мы доводим до нужного балла.</p>
            <div className="exams__hero-stats">
              <div><b>$65</b><span>стоимость</span></div>
              <div><b>~48ч</b><span>результат</span></div>
              <div><b>100+</b><span>сдали с нами</span></div>
            </div>
            <a href="#cta" className="btn btn--gold">Подготовиться с нами</a>
          </div>
          <div className="ph exams__hero-vis" data-label="Duolingo · промо-визуал"></div>
        </div>

        <div className="exams__grid">
          {EXAMS.map((e, i) => (
            <article className="exam card card--lift" data-reveal data-delay={i + 1} key={i}>
              {e.badge && <span className="chip tag-green exam__badge">{e.badge}</span>}
              <div className="exam__name">{e.name}</div>
              <p className="exam__desc">{e.desc}</p>
              <div className="exam__meta">
                <span className="chip">Сложность: {e.diff}</span>
                <span className="chip tag-blue">{e.price}</span>
              </div>
              <div className="exam__for">Для стран: {e.for}</div>
              <a href="#cta" className="exam__cta">Подготовиться с нами →</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   ENGLISH LEVEL TEST — result gated behind consultation form
   ============================================================ */
const ELT_QS = [
  { q: "Choose the correct form: 'She ___ English every day.'",
    opts: ["study","studies","studying","studied"], ans: 1 },
  { q: "Which sentence is correct?",
    opts: ["I have saw this film.","I have seen this film.","I seen this film.","I was see this film."], ans: 1 },
  { q: "Fill in: 'By the time we arrived, the show ___ already ___.'",
    opts: ["has / started","had / started","was / starting","is / starting"], ans: 1 },
  { q: "Choose the best word: 'The new policy had unforeseen ___ on the economy.'",
    opts: ["affects","effects","reflections","impacts"], ans: 3 },
  { q: "'Despite ___ tired, she continued working.'",
    opts: ["being","she was","to be","be"], ans: 0 },
  { q: "Which is grammatically correct?",
    opts: [
      "Not only did he win, but he also broke the record.",
      "Not only he won but he also broke the record.",
      "Not only he did win but he also broke the record.",
      "Not only did he won but he also broke the record.",
    ], ans: 0 },
];

const ELT_LEVELS = [
  { min: 0, max: 1, code: "A1–A2", label: "Начинающий",   color: "#e74c3c",
    tip: "Рекомендуем начать с языковых курсов (ESL) — и уже через 6–12 месяцев поступить в вуз." },
  { min: 2, max: 3, code: "B1–B2", label: "Средний",      color: "#f39c12",
    tip: "Хороший уровень для программ в Европе и части вузов США. Подготовим к Duolingo или IELTS." },
  { min: 4, max: 5, code: "C1",    label: "Продвинутый",  color: "#27ae60",
    tip: "Отличный уровень! Подходишь для топ-вузов. Получи персональный список программ." },
  { min: 6, max: 6, code: "C1+",   label: "Высокий",      color: "#2980b9",
    tip: "Уровень носителя языка. Открыты все программы — давай подберём лучшее." },
];

function getLevel(score) {
  return ELT_LEVELS.find((l) => score >= l.min && score <= l.max) || ELT_LEVELS[0];
}

function EnglishLevelTest() {
  const [step, setStep] = useState(0);       // 0=intro, 1..N=question, N+1=gate, N+2=result
  const [answers, setAnswers] = useState([]); // selected option indices
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const total = ELT_QS.length;
  const qIdx = step - 1;

  function selectAnswer(optIdx) {
    const next = [...answers];
    next[qIdx] = optIdx;
    setAnswers(next);
    setTimeout(() => setStep(step + 1), 350);
  }

  function submitGate(e) {
    e.preventDefault();
    setSubmitted(true);
    setStep(total + 2);
  }

  const score = answers.filter((a, i) => a === ELT_QS[i].ans).length;
  const level = getLevel(score);

  return (
    <section className="section section--tight elt" id="english-level">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow eyebrow--gold">Бесплатный тест</span>
          <h2>Проверь свой уровень английского</h2>
          <p className="section-sub">6 вопросов · 2 минуты · результат со списком программ</p>
        </div>

        <div className="elt__card card" data-reveal>

          {/* ── intro ── */}
          {step === 0 && (
            <div className="elt__intro">
              <div className="elt__intro-icon" aria-hidden="true">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              </div>
              <h3 className="elt__intro-h">Узнай за 2 минуты, насколько ты готов к зарубежному вузу</h3>
              <p className="elt__intro-p">Тест определяет твой уровень и подбирает программы и вузы, которые подходят именно тебе. Результат — сразу после ответа на 6 вопросов.</p>
              <button className="btn btn--gold btn--lg" onClick={() => setStep(1)}>Начать тест →</button>
            </div>
          )}

          {/* ── questions ── */}
          {step >= 1 && step <= total && (
            <div className="elt__q">
              <div className="elt__progress">
                <div className="elt__progress-bar" style={{ width: ((step - 1) / total * 100) + "%" }}></div>
              </div>
              <div className="elt__step">Вопрос {step} из {total}</div>
              <p className="elt__question">{ELT_QS[qIdx].q}</p>
              <div className="elt__opts">
                {ELT_QS[qIdx].opts.map((opt, i) => (
                  <button
                    key={i}
                    className={"elt__opt" + (answers[qIdx] === i ? " elt__opt--chosen" : "")}
                    onClick={() => selectAnswer(i)}
                    disabled={answers[qIdx] !== undefined}
                  >{opt}</button>
                ))}
              </div>
            </div>
          )}

          {/* ── gate: collect lead before showing result ── */}
          {step === total + 1 && (
            <div className="elt__gate">
              <div className="elt__gate-lock" aria-hidden="true">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </div>
              <h3 className="elt__gate-h">Тест пройден! Получи свой результат</h3>
              <p className="elt__gate-p">Оставь контакты — отправим твой уровень и персональный список вузов, которые тебя возьмут.</p>
              <form className="elt__form" onSubmit={submitGate}>
                <input required placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} />
                <input required placeholder="WhatsApp / Телефон" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <button type="submit" className="btn btn--gold btn--block">Узнать мой уровень →</button>
              </form>
              <div className="elt__gate-micro">✓ Без спама · ответим за 1 час</div>
            </div>
          )}

          {/* ── result ── */}
          {step === total + 2 && (
            <div className="elt__result">
              <div className="elt__result-badge" style={{ background: level.color }}>
                {level.code}
              </div>
              <h3 className="elt__result-label">{level.label}</h3>
              <p className="elt__result-score">{score} из {total} правильно</p>
              <p className="elt__result-tip">{level.tip}</p>
              <div className="elt__result-actions">
                <a href="#cta" className="btn btn--gold">Подобрать программы с консультантом →</a>
                <button className="btn btn--ghost" onClick={() => { setStep(0); setAnswers([]); setSubmitted(false); }}>Пройти ещё раз</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

window.Programs = Programs;
window.Exams = Exams;
window.EnglishLevelTest = EnglishLevelTest;
