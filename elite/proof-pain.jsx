/* ============================================================
   TRUST BAR (marquee) · PAIN→SOLUTION · COUNTRIES
   ============================================================ */
const { useState } = React;

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

const PAIN = [
  ["Не знаешь, с чего вообще начать", "Пошаговый план с первого дня"],
  ["Месяцами ищешь стипендии вслепую", "Мы знаем, где лежат $72 000 – $858 000"],
  ["Ошибка в DS-160 = отказ в визе", "100% правильное заполнение анкеты"],
  ["Слабое эссе = отказ приёмной комиссии", "Эссе проверяет основатель лично"],
  ["Не знаешь, как вести себя на визовом интервью", "Финальный урок по интервью перед посольством"],
];

function PainSolution() {
  return (
    <section className="section pain">
      <div className="wrap">
        <div className="section-head section-head--center" data-reveal>
          <span className="eyebrow">Почему с нами</span>
          <h2>Поступить самому — это лотерея.<br/><span className="text-blue">С нами — это система.</span></h2>
        </div>

        <div className="pain__grid">
          <div className="pain__col pain__col--bad" data-reveal>
            <div className="pain__col-h">
              <span className="pain__col-badge pain__col-badge--bad">Без Elite Academy</span>
            </div>
            {PAIN.map((r, i) => (
              <div className="pain__row pain__row--bad" key={i}>
                <span className="pain__ic pain__ic--bad">✕</span>
                <span>{r[0]}</span>
              </div>
            ))}
          </div>

          <div className="pain__col pain__col--good" data-reveal data-delay="1">
            <div className="pain__col-h">
              <span className="pain__col-badge pain__col-badge--good">С Elite Academy</span>
            </div>
            {PAIN.map((r, i) => (
              <div className="pain__row pain__row--good" key={i}>
                <span className="pain__ic pain__ic--good">✓</span>
                <span>{r[1]}</span>
              </div>
            ))}
            <a href="#cta" className="btn btn--gold btn--block pain__cta">Начать с нами →</a>
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
    photo: "images/countries/italy.jpg",
    bg: "linear-gradient(160deg,#9b5e2a 0%,#6b3210 55%,#2e1005 100%)",
    accent: "#d4845a",
  },
  {
    flagImg: "https://flagcdn.com/40x30/us.png", name: "США", landmark: "Нью-Йорк · Чикаго · Лос-Анджелес",
    desc: "Карьера · Топ-кампусы · Стипендии",    price: "от $8 000/год", hot: true,
    photo: "images/countries/usa.jpg",
    bg: "linear-gradient(160deg,#0d2b5e 0%,#091842 55%,#030a1c 100%)",
    accent: "#4a8fc7",
  },
  {
    flagImg: "https://flagcdn.com/40x30/at.png", name: "Австрия", landmark: "Вена · Зальцбург · Инсбрук",
    desc: "Безопасность · Европа · Высокое качество", price: "от €726/год",
    photo: "images/countries/austria.jpg",
    bg: "linear-gradient(160deg,#1a4a2e 0%,#0d2d1a 55%,#051208 100%)",
    accent: "#4caf82",
  },
  {
    flagImg: "https://flagcdn.com/40x30/de.png", name: "Германия", landmark: "Берлин · Мюнхен · Гамбург",
    desc: "Технологии · Made in Germany · Карьера",  price: "от €0/год",
    photo: "images/countries/germany.jpg",
    bg: "linear-gradient(160deg,#2a2a3a 0%,#161622 55%,#07070d 100%)",
    accent: "#8a8ab0",
  },
  {
    flagImg: "https://flagcdn.com/40x30/pl.png", name: "Польша", landmark: "Варшава · Краков · Вроцлав",
    desc: "Близко · Доступно · Востребовано",        price: "от €2 000/год",
    photo: "images/countries/poland.jpg",
    bg: "linear-gradient(160deg,#7a1a1a 0%,#4d0d0d 55%,#1a0303 100%)",
    accent: "#e06060",
  },
  {
    flagImg: "images/flags/trnc/40x30.png",
    name: "Северный Кипр", landmark: "Фамагуста · Кирения · Никосия",
    desc: "Без языкового теста · Тёплый климат",     price: "от $3 000/год",
    photo: "images/countries/kipr.jpg",
    bg: "linear-gradient(160deg,#0d6b6b 0%,#074545 55%,#021818 100%)",
    accent: "#4fc4c4",
  },
  {
    flagImg: "https://flagcdn.com/40x30/my.png", name: "Малайзия", landmark: "Куала-Лумпур · Пинанг · Джохор",
    desc: "Мусульм. среда · Азия · Безопасность",    price: "от $4 000/год",
    photo: "images/countries/malasia.jpg",
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
          <span className="eyebrow">Направления</span>
          <h2>Выбери страну<br/><span className="text-blue">своей мечты</span></h2>
        </div>
      </div>
      <div className="wrap">
        <div className="countries__grid" data-reveal data-delay="1">
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
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   BEYOND DIPLOMA — visual bento-grid section
   "Зарубежное образование — это не только диплом"
   ============================================================ */
const BEYOND = [
  { cls: "travel",  title: "Путешествия", sub: "Новые страны каждые каникулы",       video: "videos/beyond-travel.mp4",  poster: "thumbs/beyond-travel.jpg"  },
  { cls: "career",  title: "Карьера",     sub: "Международное резюме с первого дня",  video: "videos/beyond-career.mp4",  poster: "thumbs/beyond-career.jpg"  },
  { cls: "friends", title: "Друзья",      sub: "Со всего мира — на всю жизнь",         video: "videos/beyond-friends.mp4", poster: "thumbs/beyond-friends.jpg" },
  { cls: "network", title: "Знакомства",  sub: "Alumni-сеть в 40+ странах",            video: "videos/beyond-network.mp4", poster: "thumbs/beyond-network.jpg" },
  { cls: "world",   title: "Среда",       sub: "100+ национальностей рядом",           video: "videos/beyond-world.mp4",   poster: "thumbs/beyond-world.jpg"   },
];

function BeyondCell({ item }) {
  const ref = React.useRef(null);
  const [sound, setSound] = React.useState(false);

  function enter() { const v = ref.current; if (v && v.muted) v.play().catch(() => {}); }
  function leave() {
    const v = ref.current;
    if (v && v.muted) { v.pause(); v.currentTime = 0; } // keep playing if user turned sound on
  }
  function toggleSound(e) {
    e.stopPropagation();
    const v = ref.current; if (!v) return;
    if (v.muted) { v.muted = false; v.play().catch(() => {}); setSound(true); }
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
      <video
        ref={ref}
        className="beyond__video"
        src={item.video}
        poster={item.poster}
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
          <p className="beyond__eyebrow">Образование за рубежом</p>
          <h2 className="beyond__h2">Это не только диплом</h2>
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
