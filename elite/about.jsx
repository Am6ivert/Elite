/* ============================================================
   ABOUT — О нас (company overview + stats + accreditations)
   ============================================================ */

const ABOUT_DEFAULT = {
  text: "Наша миссия — сделать качественное образование за рубежом доступным каждому. Elite Academy — официально аккредитованное агентство ICEF, одной из крупнейших международных сетей образовательных агентств. Мы рядом на каждом этапе — от выбора университета до первого дня в кампусе.",
  badge: "images/icef-badge.png",
  badgeAlt: "ICEF Accredited — статус #6696",
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
  photo: "images/team.jpg",
};

/* Admin-edited content wins over the defaults above */
const ABOUT = window.eaContent ? window.eaContent("about", ABOUT_DEFAULT) : ABOUT_DEFAULT;
window.EA_ABOUT = ABOUT;

function AboutUs() {
  return (
    <section className="section about" id="about">
      <div className="wrap">
        <div className="about__grid">

          <div className="about__media about__media--badge" data-reveal>
            <img src={ABOUT.badge} alt={ABOUT.badgeAlt || "Аккредитация ICEF"} className="about__badge-big" />
          </div>

          <div className="about__content" data-reveal data-delay="1">
            <span className="eyebrow">О нас</span>
            <h2>Будем рядом<br/><span className="text-blue">на всех этапах твоего пути.</span></h2>
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
              {ABOUT.badges.map((b, i) => {
                const text = typeof b === "string" ? b : b.text;
                return (
                  <div className="about__badge" key={i}>
                    <span className="about__badge-ic">✓</span>
                    <span>
                      {text}
                      {b.href && (
                        <a href={b.href} target="_blank" rel="noopener noreferrer" className="about__badge-link">
                          {b.label || "Сертификат →"}
                        </a>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>

            <a href="#cta" className="btn btn--dark">Получить консультацию бесплатно →</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   VISION & MISSION — из брендбука Elite Academy
   ============================================================ */
function VisionMission() {
  return (
    <section className="section section--tight dark grain vm" id="vision">
      <div className="wrap">
        <div className="vm__grid">
          <div className="vm__block" data-reveal>
            <span className="eyebrow eyebrow--light">Видение</span>
            <h2 className="vm__h">Международное образование — для каждого поколения</h2>
            <p className="vm__p">Elite Academy стремится к тому, чтобы целое поколение получило международное качественное образование: культурный обмен, передовые знания, лучшие качества развитых стран — и внесло свой вклад в развитие Кыргызстана.</p>
          </div>
          <div className="vm__block" data-reveal data-delay="1">
            <span className="eyebrow eyebrow--light">Миссия</span>
            <h2 className="vm__h">Сделать качественное образование за рубежом доступным каждому</h2>
            <p className="vm__p">Ускоряем и облегчаем процесс поступления. Создаём сильное поколение через образование и культуру. Будем рядом на всех этапах — от первой консультации до первого дня в университете.</p>
          </div>
        </div>
        <div className="vm__slogan" data-reveal data-delay="2">
          Одна виза — миллион возможностей
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
  { name: "American Academy", tag: "Партнёрство", desc: "Партнёрская академия в США: подготовительные и pathway-программы, которые открывают прямой путь на бакалавриат американских университетов. Помогает студентам адаптироваться к системе обучения и поступить даже без высоких баллов." },
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
              <div className="office__row"><div><b>Адрес</b>{OFFICE.address}</div></div>
              <div className="office__row"><div><b>График</b>{OFFICE.hours}</div></div>
              <div className="office__row"><div><b>Телефон / WhatsApp</b><a href={"tel:" + OFFICE.phone.replace(/[^+\d]/g, "")}>{OFFICE.phone}</a></div></div>
              <div className="office__row"><div><b>Email</b><a href={"mailto:" + OFFICE.email}>{OFFICE.email}</a></div></div>
              <div className="office__row"><div><b>Instagram</b><a href={"https://www.instagram.com/" + OFFICE.instagram.replace("@", "") + "/"} target="_blank" rel="noopener">{OFFICE.instagram}</a></div></div>
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
            <div className="office__map-links">
              <a href="https://go.2gis.com/0qrsd" target="_blank" rel="noopener" className="office__map-ext-link office__map-ext-link--primary">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Открыть в 2GIS
              </a>
              <a href={`https://www.google.com/maps/search/${mapQuery}`} target="_blank" rel="noopener" className="office__map-ext-link office__map-ext-link--muted">
                Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

window.AboutUs = AboutUs;
window.VisionMission = VisionMission;
window.Accreditations = Accreditations;
window.OfficeBlock = OfficeBlock;
