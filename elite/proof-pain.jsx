/* ============================================================
   TRUST BAR (marquee) · PAIN→SOLUTION · COUNTRIES
   ============================================================ */
const { useState, useRef, useEffect } = React;

const UNI_LOGOS = [
  { src: "images/logos/catalog/polimi.png",    name: "Politecnico di Milano" },
  { src: "images/logos/catalog/bocconi.png",   name: "Università Bocconi" },
  { src: "images/logos/catalog/sapienza.png",  name: "Sapienza · Рим" },
  { src: "images/logos/catalog/luiss.png",     name: "LUISS" },
  { src: "images/logos/catalog/unito.png",     name: "Università di Torino" },
  { src: "images/logos/catalog/roosevelt.png", name: "Roosevelt University" },
  { src: "images/logos/catalog/bellevue.png",  name: "Bellevue College" },
  { src: "images/logos/catalog/lasalle.png",   name: "La Salle University" },
  { src: "images/logos/catalog/temple.png",    name: "Temple University" },
  { src: "images/logos/catalog/depaul.png",    name: "DePaul University" },
  { src: "images/logos/catalog/drexel.png",    name: "Drexel University" },
  { src: "images/logos/catalog/asu.png",       name: "Arizona State" },
  { src: "images/logos/catalog/wu.png",        name: "WU Wien" },
  { src: "images/logos/catalog/tuwien.png",    name: "TU Wien" },
  { src: "images/logos/catalog/vistula.png",   name: "Vistula University" },
  { src: "images/logos/catalog/gisma.png",     name: "GISMA Business School" },
  { src: "images/logos/catalog/monash.png",    name: "Monash University" },
  { src: "images/logos/catalog/sunway.png",    name: "Sunway University" },
  { src: "images/logos/catalog/taylors.png",   name: "Taylor's University" },
  { src: "images/logos/catalog/emu.png",       name: "Eastern Mediterranean" },
];

function TrustBar() {
  const items = [...UNI_LOGOS, ...UNI_LOGOS];
  return (
    <section className="trustbar">
      <div className="wrap trustbar__head">
        <span className="trustbar__label">С нами сотрудничают</span>
      </div>
      <div className="unibar">
        <div className="unibar__track">
          {items.map((l, i) => (
            <div className="unibar__item" key={i}>
              <div className="unibar__logo-box">
                <img src={l.src} alt={l.name} className="unibar__logo" loading="lazy" />
              </div>
              <span className="unibar__name">{l.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* «Почему Elite Academy» — аккордеон с фото-панелью (портировано с for-public) */
const PAIN_ITEMS = [
  {
    title: "Мы рядом на каждом этапе",
    body: "За каждым студентом закрепляется персональный ментор, который сопровождает его на каждом этапе: помогает принимать важные решения, отвечает на вопросы, напоминает о дедлайнах и всегда остается на связи. Вы никогда не останетесь один на пути к университету своей мечты.",
    photo: "images/about1.jpg",
  },
  {
    title: "Работаем с лучшими университетами мира",
    body: "Мы сотрудничаем с ведущими государственными и частными университетами. Высокие требования и сложный конкурс для нас — не препятствие, а возможность открыть для вас двери в университет мечты.",
    photo: "images/about2.jpg",
  },
  {
    title: "Максимально повышаем ваши шансы на поступление",
    body: "Мы не оставляем успех на волю случая. Наши эксперты подбирают сразу несколько университетов и программ, учитывая ваши оценки, цели и бюджет. Благодаря этому практически каждый наш студент получает приглашение на обучение.",
    photo: "images/about3.jpg",
  },
  {
    title: "Более 5 лет успешного опыта",
    body: "За годы работы мы помогли более 1500 студентам поступить за границу и накопили огромный практический опыт. Мы знаем весь процесс изнутри: требования университетов, нюансы подачи документов, особенности получения визы и умеем находить решение даже в самых непростых ситуациях.",
    photo: "images/about1.jpg",
  },
  {
    title: "Дополнительные привилегии для наших студентов",
    body: "При полном сопровождении мы подаем документы не только на поступление, но и на внутренние стипендии университетов и максимально возможные скидки. Это позволяет нашим студентам значительно сократить расходы на обучение.",
    photo: "images/about2.jpg",
  },
  {
    title: "Экономим ваше время, деньги и нервы",
    body: "Услуги агентства — это инвестиция. В ваше спокойствие и уверенность. Мы изучаем все требования, дедлайны и даем вам четкую стратегию, по которой будем идти вместе с вами.",
    photo: "images/about3.jpg",
  },
];

function PainSolution() {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % PAIN_ITEMS.length);
    }, 7000);
    return () => clearInterval(timerRef.current);
  }, [active]);

  const pick = (i) => setActive(i);

  return (
    <section className="section pain">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">{window.eaText("pain.eyebrow")}</span>
          <h2>{window.eaText("pain.h2a")}<br/><span className="text-blue">{window.eaText("pain.h2b")}</span></h2>
        </div>

        <div className="pain__accordion-wrap">
          <div className="pain__accordion">
            {PAIN_ITEMS.map((item, i) => (
              <div
                key={i}
                className={"pain__acc-item" + (active === i ? " is-open" : "")}
                onClick={() => pick(i)}
              >
                <div className="pain__acc-head">
                  <span className="pain__acc-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="pain__acc-title">{item.title}</span>
                  <span className="pain__acc-arrow" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </span>
                </div>
                <div className="pain__acc-body">
                  <p>{item.body}</p>
                  <div className="pain__acc-photo-mob">
                    <img src={item.photo} alt={item.title} />
                  </div>
                </div>
              </div>
            ))}
            <a href="#cta" className="btn btn--gold pain__acc-cta">Начать бесплатную консультацию →</a>
          </div>

          <div className="pain__photo-panel">
            {PAIN_ITEMS.map((item, i) => (
              <img
                key={i}
                src={item.photo}
                alt={item.title}
                className={"pain__photo" + (active === i ? " is-active" : "")}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const COUNTRIES_DEFAULT = [
  {
    flagImg: "https://flagcdn.com/40x30/it.png", name: "Италия", landmark: "Рим · Флоренция · Венеция",
    desc: "Культура · Гастрономия · Дольче Вита", price: "от €2 000/год", hot: true,
    photo: "images/countries/italy/1.jpg",
    bg: "linear-gradient(160deg,#9b5e2a 0%,#6b3210 55%,#2e1005 100%)",
    accent: "#d4845a",
  },
  {
    flagImg: "https://flagcdn.com/40x30/us.png", name: "США", landmark: "Нью-Йорк · Чикаго · Лос-Анджелес",
    desc: "Карьера · Топ-кампусы · Стипендии",    price: "от $8 000/год", hot: true,
    photo: "images/countries/usa/1.jpg",
    bg: "linear-gradient(160deg,#0d2b5e 0%,#091842 55%,#030a1c 100%)",
    accent: "#4a8fc7",
  },
  {
    flagImg: "https://flagcdn.com/40x30/at.png", name: "Австрия", landmark: "Вена · Зальцбург · Инсбрук",
    desc: "Безопасность · Европа · Высокое качество", price: "от €726/год",
    photo: "images/countries/austria/1.jpg",
    bg: "linear-gradient(160deg,#1a4a2e 0%,#0d2d1a 55%,#051208 100%)",
    accent: "#4caf82",
  },
  {
    flagImg: "https://flagcdn.com/40x30/de.png", name: "Германия", landmark: "Берлин · Мюнхен · Гамбург",
    desc: "Технологии · Made in Germany · Карьера",  price: "от €0/год",
    photo: "images/countries/germany/1.jpg",
    bg: "linear-gradient(160deg,#2a2a3a 0%,#161622 55%,#07070d 100%)",
    accent: "#8a8ab0",
  },
  {
    flagImg: "https://flagcdn.com/40x30/pl.png", name: "Польша", landmark: "Варшава · Краков · Вроцлав",
    desc: "Близко · Доступно · Востребовано",        price: "от €2 000/год",
    photo: "images/countries/poland/1.jpg",
    bg: "linear-gradient(160deg,#7a1a1a 0%,#4d0d0d 55%,#1a0303 100%)",
    accent: "#e06060",
  },
  {
    flagImg: "images/flags/trnc/40x30.png",
    name: "Северный Кипр", landmark: "Фамагуста · Кирения · Никосия",
    desc: "Без языкового теста · Тёплый климат",     price: "от $3 000/год",
    photo: "images/countries/kipr/1.jpg",
    bg: "linear-gradient(160deg,#0d6b6b 0%,#074545 55%,#021818 100%)",
    accent: "#4fc4c4",
  },
  {
    flagImg: "https://flagcdn.com/40x30/my.png", name: "Малайзия", landmark: "Куала-Лумпур · Пинанг · Джохор",
    desc: "Мусульм. среда · Азия · Безопасность",    price: "от $4 000/год",
    photo: "images/countries/malasia/1.jpg",
    bg: "linear-gradient(160deg,#1a5c2e 0%,#0d3a1c 55%,#04130a 100%)",
    accent: "#5cba7a",
  },
];

/* Admin-edited content wins over the defaults above */
const COUNTRIES = window.eaContent ? window.eaContent("countryCards", COUNTRIES_DEFAULT) : COUNTRIES_DEFAULT;
window.EA_COUNTRY_CARDS = COUNTRIES;

function Countries() {
  return (
    <section className="section countries" id="countries-section">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">{window.eaText("countries.eyebrow")}</span>
          <h2>{window.eaText("countries.h2a")}<br/><span className="text-blue">{window.eaText("countries.h2b")}</span></h2>
        </div>
      </div>
      <div className="wrap">
        <ScrollRail trackClass="countries__grid" loop={true} step={320}>
          {COUNTRIES.map((c, i) => (
            <a href={`country.html?c=${encodeURIComponent(c.name)}`} className="country card--lift" key={i}
               style={{ "--c-bg": c.bg, "--c-accent": c.accent }}>
              {/* Photo area */}
              <div className="country__photo"
                   style={ c.photo
                     ? { backgroundImage: `url(${c.photo})` }
                     : { background: c.bg } }>
                {c.hot && <span className="country__hot">Популярно</span>}
                <div className="country__photo-overlay" />
                <div className="country__photo-bottom">
                  <span className="country__flag-big">
                    {c.flagImg ? <img src={c.flagImg} alt={c.name} className="country__flag-img" /> : c.flag}
                  </span>
                  <span className="country__name-over">{c.name}</span>
                </div>
              </div>
              {/* Card body */}
              <div className="country__body">
                <div className="country__landmark">{c.landmark}</div>
                <div className="country__desc">{c.desc}</div>
                <div className="country__footer">
                  <span className="country__price">{c.price}</span>
                  <span className="country__link">Подробнее →</span>
                </div>
              </div>
            </a>
          ))}
        </ScrollRail>
      </div>
    </section>
  );
}

/* ============================================================
   BEYOND DIPLOMA — visual bento-grid section
   "Зарубежное образование — это не только диплом"
   ============================================================ */
const BEYOND = [
  { cls: "travel",  title: "Путешествия", sub: "Новые страны каждые каникулы",       video: "videos/beyond-travel.mp4",  poster: "images/beyond/travel.jpg"  },
  { cls: "career",  title: "Карьера",     sub: "Международное резюме с первого дня",  video: "videos/beyond-career.mp4",  poster: "images/beyond/career.jpg"  },
  { cls: "friends", title: "Друзья",      sub: "Со всего мира — на всю жизнь",         video: "videos/beyond-friends.mp4", poster: "images/beyond/friends.jpg" },
  { cls: "network", title: "Знакомства",  sub: "Alumni-сеть в 40+ странах",            video: "videos/beyond-network.mp4", poster: "images/beyond/network.jpg" },
  { cls: "world",   title: "Среда",       sub: "100+ национальностей рядом",           video: "videos/beyond-world.mp4",   poster: "images/beyond/world.jpg"   },
];

function BeyondCell({ item }) {
  const ref = React.useRef(null);
  const [sound, setSound] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);

  function enter() { const v = ref.current; if (v && v.muted) { v.play().catch(() => {}); setPlaying(true); } }
  function leave() {
    const v = ref.current;
    if (v && v.muted) { v.pause(); v.currentTime = 0; setPlaying(false); } // keep playing if user turned sound on
  }
  function toggleSound(e) {
    e.stopPropagation();
    const v = ref.current; if (!v) return;
    if (v.muted) { v.muted = false; v.play().catch(() => {}); setSound(true); setPlaying(true); }
    else { v.muted = true; setSound(false); }
  }

  return (
    <div
      className={`beyond__cell beyond__cell--${item.cls}` + (sound ? " beyond__cell--sound" : "")}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onClick={toggleSound}
      role="button"
      tabIndex={0}
    >
      <img
        src={item.poster}
        alt={item.title}
        className={"beyond__poster" + (playing ? " beyond__poster--hide" : "")}
        loading="lazy"
      />
      <video
        ref={ref}
        className="beyond__video"
        src={item.video}
        muted loop playsInline preload="metadata"
      />
      <div className="beyond__scrim" />
      <div className="beyond__overlay" />
      <div className="beyond__content">
        <strong className="beyond__title">{item.title}</strong>
        <span className="beyond__sub">{item.sub}</span>
      </div>
      <span className="beyond__play" aria-hidden="true">
        {sound ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1c2.9.9 5 3.5 5 6.7s-2.1 5.8-5 6.7v2.1c4-1 7-4.6 7-8.8s-3-7.8-7-8.8z"/></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM3 3l18 18-1.4 1.4L1.6 4.4 3 3z"/></svg>
        )}
      </span>
      <span className="beyond__sound-hint" aria-hidden="true">{sound ? "Звук включён" : "Нажми для звука"}</span>
    </div>
  );
}

function BeyondDiploma() {
  return (
    <section className="beyond" id="beyond">
      <div className="wrap">
        <div className="beyond__head" data-reveal>
          <h2 className="beyond__h2"><span className="text-blue">Образование за рубежом —</span><br/>это не только диплом</h2>
        </div>
      </div>
      <div className="beyond__grid" data-reveal data-delay="1">
        {BEYOND.map((item) => <BeyondCell key={item.cls} item={item} />)}
      </div>
    </section>
  );
}

window.TrustBar = TrustBar;
window.BeyondDiploma = BeyondDiploma;
window.PainSolution = PainSolution;
window.Countries = Countries;
