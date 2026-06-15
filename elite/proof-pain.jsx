/* ============================================================
   TRUST BAR (marquee) · PAIN→SOLUTION · COUNTRIES
   ============================================================ */
const { useState } = React;

const PARTNERS = [
  "ICEF","Shorelight","Apply Wave","Bellevue College","La Salle University",
  "Roosevelt University","Kalamazoo College","Drake University","National Louis University","Westcliff University",
];

const UNI_LOGOS = [
  { src: "images/logos/catalog/polimi.png",   alt: "PoliMi" },
  { src: "images/logos/catalog/bocconi.png",  alt: "Bocconi" },
  { src: "images/logos/catalog/sapienza.png", alt: "Sapienza" },
  { src: "images/logos/catalog/luiss.png",    alt: "LUISS" },
  { src: "images/logos/catalog/roosevelt.png",alt: "Roosevelt" },
  { src: "images/logos/catalog/bellevue.png", alt: "Bellevue" },
  { src: "images/logos/catalog/lasalle.png",  alt: "La Salle" },
  { src: "images/logos/catalog/temple.png",   alt: "Temple" },
  { src: "images/logos/catalog/depaul.png",   alt: "DePaul" },
  { src: "images/logos/catalog/monash.png",   alt: "Monash" },
  { src: "images/logos/catalog/sunway.png",   alt: "Sunway" },
  { src: "images/logos/catalog/taylors.png",  alt: "Taylor's" },
  { src: "images/logos/catalog/wu.png",       alt: "WU Wien" },
  { src: "images/logos/catalog/tuwien.png",   alt: "TU Wien" },
  { src: "images/logos/catalog/emu.png",      alt: "EMU" },
  { src: "images/logos/catalog/vistula.png",  alt: "Vistula" },
  { src: "images/logos/catalog/gisma.png",    alt: "GISMA" },
  { src: "images/logos/catalog/unito.png",    alt: "UniTO" },
  { src: "images/logos/catalog/asu.png",      alt: "ASU" },
  { src: "images/logos/catalog/drexel.png",   alt: "Drexel" },
];

function TrustBar() {
  const logos = [...UNI_LOGOS, ...UNI_LOGOS];
  return (
    <section className="trustbar">
      {/* University logo marquee */}
      <div className="unibar">
        <div className="unibar__track">
          {logos.map((l, i) => (
            <div className="unibar__item" key={i}>
              <img src={l.src} alt={l.alt} className="unibar__logo" />
            </div>
          ))}
        </div>
      </div>
      {/* Partner names marquee */}
      <div className="wrap trustbar__inner">
        <span className="trustbar__label">Нам доверяют</span>
        <div className="trustbar__track">
          <div className="trustbar__row">
            {[...PARTNERS, ...PARTNERS].map((p, i) => (
              <span className="trustbar__logo" key={i}>
                <span className="trustbar__dot"></span>{p}
              </span>
            ))}
          </div>
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
  { cls: "travel", title: "Путешествия", sub: "Новые страны каждые каникулы" },
  { cls: "career", title: "Карьера",     sub: "Международное резюме с первого дня" },
  { cls: "friends", title: "Друзья",     sub: "Со всего мира — на всю жизнь" },
  { cls: "network", title: "Знакомства", sub: "Alumni-сеть в 40+ странах" },
  { cls: "world",   title: "Среда",      sub: "100+ национальностей рядом" },
];

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
        {BEYOND.map(({ cls, title, sub }) => (
          <div key={cls} className={`beyond__cell beyond__cell--${cls}`}>
            <div className="beyond__overlay" />
            <div className="beyond__content">
              <strong className="beyond__title">{title}</strong>
              <span className="beyond__sub">{sub}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

window.TrustBar = TrustBar;
window.BeyondDiploma = BeyondDiploma;
window.PainSolution = PainSolution;
window.Countries = Countries;
