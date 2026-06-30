/* ============================================================
   UNIVERSITY PROFILE — university.html?u=<short>
   ============================================================ */
const { useState, useEffect, useRef } = React;

/* Region map — city (ru) → region for USA and Italy */
const CITY_REGIONS = {
  /* USA → state */
  "Чикаго": "Иллинойс",      "Сиэтл": "Вашингтон",      "Белвью": "Вашингтон",
  "Филадельфия": "Пенсильвания", "Кламазу": "Мичиган",    "Ирвайн": "Калифорния",
  "Буффало": "Нью-Йорк",     "Эвансвилл": "Индиана",     "Нью-Джерси": "Нью-Джерси",
  "Харрисберг": "Пенсильвания", "Хьюстон": "Техас",       "Феникс": "Аризона",
  "Темпе": "Аризона",         "Сан-Хосе": "Калифорния",   "Сан-Франциско": "Калифорния",
  "Арлингтон": "Вирджиния",  "Гарден-Сити": "Нью-Йорк",  "Манхэссет": "Нью-Йорк",
  "Цинциннати": "Огайо",     "Бостон": "Массачусетс",     "Нью-Йорк": "Нью-Йорк",
  "Тусон": "Аризона",         "Майами": "Флорида",         "Сторрс": "Коннектикут",
  "Потсдам": "Нью-Йорк",     "Сент-Луис": "Миссури",      "Мельбурн": "Флорида",
  "Рэдфорд": "Вирджиния",    "Афины": "Западная Вирджиния", "Олбани": "Нью-Йорк",
  "Элленсберг": "Вашингтон", "Нью-Лондон": "Коннектикут", "Фримонт": "Калифорния",
  "Лос-Анджелес": "Калифорния", "Портленд": "Орегон",     "Денвер": "Колорадо",
  "Лас-Вегас": "Невада",      "Атланта": "Джорджия",       "Сиракьюс": "Нью-Йорк",
  "Балтимор": "Мэриленд",     "Даллас": "Техас",            "Остин": "Техас",
  /* Italy → region */
  "Милан": "Ломбардия",       "Болонья": "Эмилия-Романья", "Рим": "Лацио",
  "Падуя": "Венето",          "Венеция": "Венето",          "Турин": "Пьемонт",
  "Флоренция": "Тоскана",     "Сиена": "Тоскана",           "Пиза": "Тоскана",
  "Павия": "Ломбардия",       "Тренто": "Трентино-Альто-Адидже", "Триест": "Фриули-Венеция-Джулия",
  "Брешиа": "Ломбардия",      "Парма": "Эмилия-Романья",   "Удине": "Фриули-Венеция-Джулия",
  "Кассино": "Лацио",         "Неаполь": "Кампания",        "Бари": "Апулия",
  "Анкона": "Марке",          "Палермо": "Сицилия",         "Мессина": "Сицилия",
  "Катания": "Сицилия",       "Салерно": "Кампания",        "Казерта": "Кампания",
  "Генуя": "Лигурия",         "Реджо-Калабрия": "Калабрия", "Перуджа": "Умбрия",
};

function uniSlug(short) {
  return short.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

const GALLERY_LABELS = ["Кампус", "Учебные корпуса", "Общежитие", "Студенческая жизнь"];

/* ── Lightbox ── */
function Lightbox({ src, alt, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  return (
    <div className="lightbox" onClick={onClose} role="dialog" aria-modal="true">
      <button className="lightbox__close" onClick={onClose} aria-label="Закрыть">✕</button>
      <img src={src} alt={alt} className="lightbox__img" onClick={e => e.stopPropagation()} />
    </div>
  );
}

function GalleryTile({ src, fallback, label, big, onZoom }) {
  const [stage, setStage] = useState(0);
  const cls = "uprof__tile" + (big ? " uprof__tile--big" : "");
  if (stage === 2 || (stage === 1 && !fallback)) {
    return <div className={cls + " ph"} data-label={"фото · " + label.toLowerCase()}></div>;
  }
  const imgSrc = stage === 0 ? src : fallback;
  return (
    <div className={cls + " uprof__tile--zoom"} onClick={() => onZoom && onZoom(imgSrc, label)}>
      <img src={imgSrc} alt={label} loading="lazy" onError={() => setStage(stage + 1)} />
      <span className="uprof__tile-zoom-ic" aria-hidden="true">⊕</span>
    </div>
  );
}

/* Видео-тур */
function TourVideo({ slug }) {
  const vref = useRef(null);
  const [missing, setMissing] = useState(false);
  const [playing, setPlaying] = useState(false);

  if (missing) {
    return (
      <div className="uprof__tour ph ph--dark" data-label="видео-тур по кампусу · скоро здесь">
        <span className="uprof__tour-play" aria-hidden="true">▶</span>
      </div>
    );
  }

  const toggle = () => {
    const v = vref.current; if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  return (
    <div className="uprof__tour uprof__tour--video" onClick={toggle}>
      <video ref={vref} src={`videos/unis/${slug}/tour.mp4`} preload="metadata" playsInline onError={() => setMissing(true)} />
      {!playing && <span className="uprof__tour-play" aria-hidden="true">▶</span>}
    </div>
  );
}

function FactCard({ label, children, sub }) {
  return (
    <div className="uprof__fact card">
      <div className="uprof__fact-body">
        <span className="uprof__fact-l">{label}</span>
        <div className="uprof__fact-v">{children}</div>
        {sub && <div className="uprof__fact-sub">{sub}</div>}
      </div>
    </div>
  );
}

/* ── Foundation tooltip ── */
function FoundationTip() {
  const [open, setOpen] = useState(false);
  return (
    <span className="ftip" style={{ position: "relative", display: "inline-flex", alignItems: "center", marginLeft: 6 }}>
      <button
        className="ftip__btn"
        onClick={() => setOpen(o => !o)}
        aria-label="Что такое Foundation?"
        title="Что такое Foundation?"
      >?</button>
      {open && (
        <div className="ftip__popup" role="tooltip">
          <strong>Foundation (подготовительный год)</strong> — это вводная программа, которая подготавливает студентов к поступлению на бакалавриат. Обычно длится 1 год и не требует GPA. Позволяет поступить без IELTS/TOEFL на некоторых программах.
          <button className="ftip__close" onClick={() => setOpen(false)} aria-label="Закрыть">✕</button>
        </div>
      )}
    </span>
  );
}

/* ── Requirements Table ── */
const REQ_COL_ICONS = { bachelor: "🎓", master: "📚", foundation: "🌱" };

function reqDefaultItems(u, levelKey) {
  if (levelKey === "bachelor") {
    return [
      { label: "Мин. GPA", value: u.gpaMin || "—" },
      { label: "Языковой тест", value: u.engTests && u.engTests.length ? u.engTests.join(" / ") : "IELTS / TOEFL" },
      { label: "Образование", value: "11 лет" },
      { label: "Экзамены вуза", value: u.exams && u.exams.length ? u.exams.join(", ") : "Не требуются" },
    ];
  }
  if (levelKey === "master") {
    return [
      { label: "Мин. GPA", value: u.gpaMin || "—" },
      { label: "Языковой тест", value: u.engTests && u.engTests.length ? u.engTests.join(" / ") : "IELTS / TOEFL" },
      { label: "Образование", value: "Бакалавриат" },
      { label: "Экзамены вуза", value: "Не требуются" },
    ];
  }
  if (levelKey === "foundation") {
    return [
      { label: "Мин. GPA", value: "Не требуется" },
      { label: "Языковой тест", value: "Не требуется" },
      { label: "Образование", value: "9–11 лет" },
      { label: "Экзамены вуза", value: "Не требуются" },
    ];
  }
  return [];
}

function ReqTable({ u, det }) {
  const rt = (det && det.reqTable) ? det.reqTable : null;
  const enabled = (rt && rt.enabled) || {};

  /* Admin toggle wins; otherwise derive from uni levels */
  const hasBachelor   = enabled.bachelor   !== undefined ? enabled.bachelor   : (u.levels.includes("Бакалавр") || u.levels.includes("Колледж"));
  const hasMaster     = enabled.master     !== undefined ? enabled.master     : u.levels.includes("Магистр");
  const hasFoundation = enabled.foundation !== undefined ? enabled.foundation : u.levels.includes("Foundation");

  const itemsFor = (levelKey) => {
    if (rt && rt[levelKey] && Array.isArray(rt[levelKey].items) && rt[levelKey].items.length) {
      return rt[levelKey].items;
    }
    return reqDefaultItems(u, levelKey);
  };

  const cols = [
    hasBachelor   && { key: "bachelor",   label: "Бакалавр" },
    hasMaster     && { key: "master",     label: "Магистратура" },
    hasFoundation && { key: "foundation", label: "Foundation", tip: true },
  ].filter(Boolean);

  if (!cols.length) return null;

  return (
    <div className="uprof__req-wrap" data-reveal>
      <div className="uprof__req-cards" style={{ "--req-cols": cols.length }}>
        {cols.map((c) => (
          <div className={"uprof__req-col" + (c.key === "bachelor" ? " uprof__req-col--main" : "")} key={c.key}>
            <div className="uprof__req-col-head">
              <span className="uprof__req-col-ic">{REQ_COL_ICONS[c.key]}</span>
              {c.label}
              {c.tip && <FoundationTip />}
            </div>
            {itemsFor(c.key).map((item, i) => (
              <div className="uprof__req-cell" key={i}>
                <span className="uprof__req-cell-lbl">{item.label}</span>
                <span className="uprof__req-cell-val">{item.value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <a href="#cta" className="btn btn--dark uprof__req-cta" data-reveal>Проверить свои шансы на поступление →</a>
    </div>
  );
}

function UniversityProfile() {
  const params = new URLSearchParams(window.location.search);
  const key = params.get("u");
  const UNIS = window.EA_UNIS || [];
  const u = UNIS.find((x) => x.short === key);
  const [lightbox, setLightbox] = useState(null); // { src, alt }

  useEffect(() => {
    if (u) document.title = `${u.name} — Elite Academy KG`;
  }, []);

  if (!u) {
    return (
      <section className="section uprof-missing">
        <div className="wrap" style={{ textAlign: "center" }}>
          <h1>Университет не найден</h1>
          <p style={{ marginTop: 14, color: "var(--muted)" }}>Возможно, ссылка устарела.</p>
          <a href="universities.html" className="btn btn--dark" style={{ marginTop: 26 }}>← Вернуться в каталог</a>
        </div>
      </section>
    );
  }

  const slug = uniSlug(u.short);
  const iso = (window.EA_COUNTRY_ISO || {})[u.country];
  const paletteBase = (window.EA_PALETTE || {})[u.country] || "linear-gradient(135deg,#0a2463 0%,#1b4f9b 100%)";
  const palette = u.campus
    ? `linear-gradient(rgba(8,24,60,0.62),rgba(8,24,60,0.70)),url('../${u.campus}') center/cover no-repeat`
    : paletteBase;
  const fmt = (p) => "$" + p.toLocaleString("ru");
  const isBachelor = u.levels.includes("Бакалавр") || u.levels.includes("Колледж") || u.levels.includes("Foundation");
  const isMaster = u.levels.includes("Магистр");
  const mapQuery = encodeURIComponent(`${u.name}, ${u.loc}`);
  const similar = UNIS.filter((x) => x.country === u.country && x.short !== u.short).slice(0, 3);
  const det = (window.EA_UNI_DETAILS || {})[u.short];

  const typeLc = u.type === "Государственный" ? "государственный" : "частный";
  const aboutMain = (det && det.about)
    ? det.about
    : `${u.name} — ${typeLc} университет в городе ${u.loc} (${u.country}) и официальный вуз-партнёр Elite Academy по направлению «${u.field}». ` +
      `Здесь доступны программы уровня ${u.levels.toLowerCase()}${u.qs ? `, а сам вуз входит в мировой рейтинг QS на позиции #${u.qs}` : ""}. ` +
      `Стоимость обучения — от ${fmt(u.price)} в год.`;
  const aboutExtra = `Мы сопровождаем поступление под ключ: подбираем программу под твой профиль, готовим документы и мотивационное письмо, ` +
    `помогаем с языковым тестом и студенческой визой. ` +
    `${u.dormitory ? "У вуза есть студенческое общежитие. " : ""}` +
    `${(u.meritBased || u.needBased) ? "Для иностранных студентов доступны стипендии и гранты." : "Расскажем о доступных стипендиях и скидках для иностранных студентов."}`;

  return (
    <>
      {/* ===== Dark hero banner ===== */}
      <section className="uprof-hero grain" style={{ "--uprof-bg": palette }}>
        <div className="uprof-hero__mesh" aria-hidden="true"></div>
        <div className="wrap">
          <nav className="uprof__crumbs" aria-label="Хлебные крошки">
            <a href="universities.html">Каталог</a>
            <span>/</span>
            <a href={`universities.html?country=${encodeURIComponent(u.country)}`}>{u.country}</a>
          </nav>

          <div className="uprof-hero__grid">
            <div className="uprof-hero__main">
              {u.logo
                ? <img src={u.logo} className="uprof__logo" alt={u.short} />
                : <div className="uprof__logo uprof__logo--ph">{u.short.slice(0, 2).toUpperCase()}</div>
              }
              <div>
                <h1 className="uprof__name">{u.name}</h1>
                <div className="uprof__loc">
                  {iso && <img src={window.EA_FLAG_URL(iso, "20x15")} alt={u.country} />}
                  {u.loc}
                  {(u.country === "США" || u.country === "Италия") && CITY_REGIONS[u.loc] && (
                    <span className="uprof__loc-region">, {CITY_REGIONS[u.loc]}</span>
                  )}
                  {" · " + u.country}
                </div>
                <div className="uprof__chips">
                  {u.qs && <span className="uprof__chip uprof__chip--qs">QS #{u.qs}</span>}
                  {u.itRank && <span className="uprof__chip uprof__chip--qs">IT #{u.itRank}</span>}
                  <span className="uprof__chip">{u.type}</span>
                  <span className="uprof__chip">{u.field}</span>
                  {u.elite && <span className="uprof__chip uprof__chip--elite">★ Elite выбор</span>}
                </div>
              </div>
            </div>

            <div className="uprof-hero__aside card">
              <div className="uprof__price-l">Обучение в год</div>
              <div className="uprof__price">{fmt(u.price)}</div>
              {(u.meritBased || u.needBased) && (
                <div className="uprof__schol">
                  {u.meritBased && <span className="uprof__schol-tag">Стипендия</span>}
                  {u.needBased && <span className="uprof__schol-tag uprof__schol-tag--grant">Грант</span>}
                </div>
              )}
              {u.appFee > 0 && (
                <div className="uprof__aside-micro" style={{marginBottom:6}}>Взнос за подачу: €{u.appFee}</div>
              )}
              {u.appFee === 0 && (
                <div className="uprof__aside-micro" style={{marginBottom:6}}>Взнос за подачу: бесплатно</div>
              )}
              <a href="#cta" className="btn btn--gold btn--block">Поступить с Elite →</a>
              <div className="uprof__aside-micro">Бесплатная консультация · план поступления</div>
            </div>
          </div>
        </div>
        <div className="uprof-hero__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M 0 40 C 240 10, 480 70, 720 40 S 1200 10, 1440 40 L 1440 80 L 0 80 Z" fill="var(--white)" />
          </svg>
        </div>
      </section>

      {/* ===== Photo gallery ===== */}
      <section className="section section--tight uprof-gallery">
        <div className="wrap">
          <div className="uprof__gal-grid">
            {GALLERY_LABELS.map((label, i) => (
              <GalleryTile
                key={label}
                src={`images/unis/${slug}/${i + 1}.jpg`}
                fallback={i === 0 ? u.campus : null}
                label={label}
                big={i === 0}
                onZoom={(src, alt) => setLightbox({ src, alt })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== About — stats LEFT, text RIGHT ===== */}
      <section className="section section--tight uprof-about">
        <div className="wrap">
          <div className="uprof__about-grid">
            <div className="uprof__about-stats">
              {det && det.founded && (
                <div className="uprof__about-stat"><b>{det.founded}</b><span>год основания</span></div>
              )}
              {det && det.students && (
                <div className="uprof__about-stat"><b>{det.students}</b><span>студентов</span></div>
              )}
              {u.qs && (
                <div className="uprof__about-stat"><b>#{u.qs}</b><span>QS рейтинг</span></div>
              )}
              {u.itRank && (
                <div className="uprof__about-stat"><b>#{u.itRank}</b><span>рейтинг в Италии</span></div>
              )}
              <div className="uprof__about-stat"><b>{fmt(u.price)}</b><span>стоимость в год</span></div>
              <div className="uprof__about-stat"><b>{u.field}</b><span>ключевое направление</span></div>
            </div>
            <div className="uprof__about-main">
              <span className="eyebrow">Об университете</span>
              <h2 className="uprof__about-h">Коротко о вузе</h2>
              <p className="uprof__about-text">{aboutMain}</p>
              <p className="uprof__about-text uprof__about-text--muted">{aboutExtra}</p>
              <div className="uprof__about-chips">
                <span className="uprof__about-chip">{u.type}</span>
                <span className="uprof__about-chip">{u.field}</span>
                <span className="uprof__about-chip">
                  {u.loc}
                  {(u.country === "США" || u.country === "Италия") && CITY_REGIONS[u.loc] ? `, ${CITY_REGIONS[u.loc]}` : ""} · {u.country}
                </span>
                {u.levels.split("·").map((l) => (
                  <span className="uprof__about-chip" key={l}>{l.trim()}</span>
                ))}
              </div>
              {det && det.site && (
                <a className="uprof__site" href={`https://${det.site}`} target="_blank" rel="noopener">
                  Официальный сайт: {det.site} →
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Key facts — column layout ===== */}
      <section className="section section--tight uprof-facts">
        <div className="wrap">
          <div className="uprof__facts-grid uprof__facts-grid--col">
            {isBachelor && (
              <FactCard label="Бакалавриат"
                sub={(u.meritBased || u.needBased) ? (u.needBased ? "Доступны гранты и стипендии" : "Доступны стипендии") : null}
              >
                <span>{fmt(u.price)}/год</span>
                {u.discount > 0 && <span className="uprof__fact-schol">🎓 скидка {fmt(u.discount)}</span>}
              </FactCard>
            )}
            {isMaster && (
              <FactCard label="Магистратура"
                sub={(u.meritBased || u.needBased) ? "Стипендии для иностранных студентов" : null}
              >
                <span>{fmt(u.price)}/год</span>
                {u.discount > 0 && <span className="uprof__fact-schol">🎓 скидка {fmt(u.discount)}</span>}
              </FactCard>
            )}
            {u.faculties && u.faculties.length > 0 && (
              <FactCard label="Ключевые факультеты">
                <div className="uprof__minichips">{u.faculties.map((x) => <span key={x}>{x}</span>)}</div>
              </FactCard>
            )}
            <FactCard label="Набор">
              <div className="uprof__minichips">{u.intake.map((x) => <span key={x}>{x}</span>)}</div>
            </FactCard>
            <FactCard label="Языковой тест">
              <div className="uprof__minichips">{u.engTests.map((x) => <span key={x}>{x}</span>)}</div>
            </FactCard>
            {u.exams.length > 0 && (
              <FactCard label="Вступительные экзамены">
                <div className="uprof__minichips">{u.exams.map((x) => <span key={x}>{x}</span>)}</div>
              </FactCard>
            )}
            <FactCard label="Минимальный GPA">{u.gpaMin}</FactCard>
            <FactCard label="Общежитие">{u.dormitory ? "Есть" : "Нет"}</FactCard>
            <FactCard label="Программы">{u.levels}</FactCard>
          </div>
        </div>
      </section>

      {/* ===== Video tour ===== */}
      <section className="section section--tight uprof-tour">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <span className="eyebrow">Видео-тур</span>
            <h2>Прогуляйся по кампусу, не выходя из дома</h2>
          </div>
          <div data-reveal>
            <TourVideo slug={slug} />
          </div>
        </div>
      </section>

      {/* ===== Admission requirements table ===== */}
      <section className="section section--tight uprof-req">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <span className="eyebrow">Поступление</span>
            <h2>Что нужно, чтобы поступить</h2>
            <p>Основные требования {u.name} для иностранных абитуриентов.</p>
          </div>
          <ReqTable u={u} det={det} />
        </div>
      </section>

      {/* ===== Google Maps ===== */}
      <section className="section section--tight uprof-map" id="map">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <span className="eyebrow">Расположение</span>
            <h2>Посмотри, где будешь учиться</h2>
          </div>
          <div className="uprof__map card" data-reveal>
            <iframe
              title={`${u.name} на карте`}
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed&hl=ru`}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <a className="uprof__map-link" href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noopener">Открыть в Google Maps →</a>
        </div>
      </section>

      {/* ===== Similar universities ===== */}
      {similar.length > 0 && (
        <section className="section section--tight uprof-similar">
          <div className="wrap">
            <div className="section-head" data-reveal>
              <span className="eyebrow">Похожие</span>
              <h2>Ещё университеты — {u.country}</h2>
            </div>
            <div className="uprof__sim-grid">
              {similar.map((s) => (
                <a key={s.short} href={`university.html?u=${encodeURIComponent(s.short)}`} className="uprof__sim card card--lift">
                  {s.logo
                    ? <img src={s.logo} className="uprof__sim-logo" alt={s.short} />
                    : <div className="uprof__sim-logo uprof__sim-logo--ph">{s.short.slice(0, 2).toUpperCase()}</div>
                  }
                  <div className="uprof__sim-info">
                    <div className="uprof__sim-name">{s.name}</div>
                    <div className="uprof__sim-meta">{s.loc} · {fmt(s.price)}/год</div>
                  </div>
                  <span className="uprof__sim-arr">→</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== Lightbox ===== */}
      {lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />}
    </>
  );
}

window.UniversityProfile = UniversityProfile;
