/* ============================================================
   ABOUT — О нас (company overview + stats + accreditations)
   ============================================================ */

const ABOUT_DEFAULT = {
  text: "Elite Academy — аккредитованное образовательное агентство из Бишкека. Помогаем студентам из Кыргызстана и стран СНГ поступить в университеты США, Европы и Азии — с частичным или полным грантом. С гарантией по договору.",
  fcN: "1500+",
  fcL: "студентов уже учатся за рубежом",
  stats: [
    { n: "1500+", l: "студентов\nотправлено" },
    { n: "7",     l: "стран\nнаправлений" },
    { n: "500+",  l: "партнёрских\nвузов" },
    { n: "5 лет", l: "на рынке\nобразования" },
  ],
  badges: [
    "ICEF Accredited — международная аккредитация",
    "Shorelight Partner — официальный партнёр",
    "Гарантия по договору — возврат при отказе в визе",
  ],
};

/* Admin-edited content wins over the defaults above */
const ABOUT = window.eaContent ? window.eaContent("about", ABOUT_DEFAULT) : ABOUT_DEFAULT;
window.EA_ABOUT = ABOUT;

function AboutUs() {
  return (
    <section className="section about" id="about">
      <div className="wrap">
        <div className="about__grid">

          <div className="about__media" data-reveal>
            <div className="ph about__photo" data-label="команда Elite Academy"></div>
            <div className="about__fc glass">
              <div className="about__fc-n">{ABOUT.fcN}</div>
              <div className="about__fc-l">{ABOUT.fcL}</div>
            </div>
          </div>

          <div className="about__content" data-reveal data-delay="1">
            <span className="eyebrow">О нас</span>
            <h2>Мы не продаём мечту.<br/><span className="text-blue">Мы строим будущее.</span></h2>
            <p className="about__text">{ABOUT.text}</p>

            <div className="about__stats-row">
              {ABOUT.stats.map((s, i) => (
                <div className="about__stat" key={i}>
                  <div className="about__stat-n">{s.n}</div>
                  <div className="about__stat-l">{s.l}</div>
                </div>
              ))}
            </div>

            <div className="about__badges">
              {ABOUT.badges.map((b, i) => (
                <div className="about__badge" key={i}>
                  <span className="about__badge-ic">✓</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <a href="#cta" className="btn btn--dark">Получить консультацию бесплатно →</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   ACCREDITATIONS — partner / accreditation cards (about page)
   ============================================================ */
const ACCREDS_DEFAULT = [
  { name: "ICEF", tag: "Аккредитация", desc: "Международная сеть проверенных агентств образования. Аккредитация подтверждает стандарты работы и прозрачность для вузов-партнёров." },
  { name: "Shorelight", tag: "Партнёрство", desc: "Официальный партнёр Shorelight — прямые соглашения с университетами США, быстрые офферы и стипендии для наших студентов." },
  { name: "Apply Wave", tag: "Платформа", desc: "Партнёрская платформа подачи заявок: документы уходят в приёмные комиссии напрямую, без посредников." },
  { name: "Birpofi", tag: "Переводы", desc: "Аккредитованная переводческая компания — переводы документов, которые принимают посольства и приёмные комиссии." },
];
const ACCREDS = window.eaContent ? window.eaContent("accreds", ACCREDS_DEFAULT) : ACCREDS_DEFAULT;
window.EA_ACCREDS = ACCREDS;

function Accreditations() {
  return (
    <section className="section section--tight accreds" id="accreds">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Аккредитации и партнёры</span>
          <h2>Нам доверяют не только студенты</h2>
        </div>
        <div className="accreds__grid">
          {ACCREDS.map((a, i) => (
            <article className="accred card card--lift" data-reveal data-delay={i + 1} key={a.name}>
              <span className="accred__tag">{a.tag}</span>
              <h3 className="accred__name">{a.name}</h3>
              <p className="accred__desc">{a.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   OFFICE — address, hours, rating + Google Maps embed
   ============================================================ */
const OFFICE_DEFAULT = {
  rating: "4.8",
  reviews: "214 отзывов на 2GIS",
  address: "ул. Исы Ахунбаева 169, БЦ «Бинокль», 6 этаж",
  hours: "ПН–ПТ 10:00–19:00 · СБ 12:00–19:00",
  phone: "+996 555 720 712",
  email: "eliteacademykg@gmail.com",
  instagram: "@eliteacademy.kg",
  map: "БЦ Бинокль, Ахунбаева 169, Бишкек",
};
const OFFICE = window.eaContent ? window.eaContent("office", OFFICE_DEFAULT) : OFFICE_DEFAULT;
window.EA_OFFICE = OFFICE;

function OfficeBlock() {
  const mapQuery = encodeURIComponent(OFFICE.map);
  return (
    <section className="section section--tight office" id="office">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Офис в Бишкеке</span>
          <h2>Приходи знакомиться лично</h2>
        </div>
        <div className="office__grid">
          <div className="office__info card" data-reveal>
            <div className="office__rating">
              <b>{OFFICE.rating}</b>
              <div>
                <span className="office__stars" aria-hidden="true">★★★★★</span>
                <span className="office__rating-sub">{OFFICE.reviews}</span>
              </div>
            </div>
            <div className="office__rows">
              <div className="office__row"><span>📍</span><div><b>Адрес</b>{OFFICE.address}</div></div>
              <div className="office__row"><span>🕐</span><div><b>График</b>{OFFICE.hours}</div></div>
              <div className="office__row"><span>📞</span><div><b>Телефон / WhatsApp</b><a href={"tel:" + OFFICE.phone.replace(/[^+\d]/g, "")}>{OFFICE.phone}</a></div></div>
              <div className="office__row"><span>✉️</span><div><b>Email</b><a href={"mailto:" + OFFICE.email}>{OFFICE.email}</a></div></div>
              <div className="office__row"><span>📷</span><div><b>Instagram</b><a href={"https://www.instagram.com/" + OFFICE.instagram.replace("@", "") + "/"} target="_blank" rel="noopener">{OFFICE.instagram}</a></div></div>
            </div>
            <a href="#cta" className="btn btn--gold btn--block">Записаться на консультацию</a>
          </div>
          <div className="office__map card" data-reveal data-delay="1">
            <iframe
              title="Офис Elite Academy на карте"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed&hl=ru`}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}

window.AboutUs = AboutUs;
window.Accreditations = Accreditations;
window.OfficeBlock = OfficeBlock;
