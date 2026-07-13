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

/* Program list (authored or auto-built) is shared with the catalog page —
   see eaUniPrograms in catalog.jsx (exposed as window.eaUniPrograms). */

/* ── Program Cards (horizontal · white = bachelor, navy = master) ── */
function programLevelLabel(level) {
  if (level === "master") return "MASTER'S";
  if (level === "phd") return "PHD";
  if (level === "foundation") return "FOUNDATION";
  return "BACHELOR'S";
}

/* Render an array of lines; a line starting with "# " becomes a bold sub-heading */
function ProgramLines({ lines, bullet }) {
  return (
    <ul className={"pcard__lines" + (bullet ? " pcard__lines--bullet" : "")}>
      {lines.map((raw, i) => {
        const isHead = /^#\s+/.test(raw);
        const text = raw.replace(/^#\s+/, "");
        return isHead
          ? <li className="pcard__line-head" key={i}>{text}</li>
          : <li className="pcard__line" key={i}>{text}</li>;
      })}
    </ul>
  );
}

const toLines = (v) => Array.isArray(v) ? v.filter(x => String(x).trim() !== "")
  : (v ? String(v).split("\n").map(s => s.trim()).filter(Boolean) : []);
const toTags = (v) => Array.isArray(v) ? v
  : (v ? String(v).split(/[·,]/).map(s => s.trim()).filter(Boolean) : []);

/* Full card — used inside the "More" modal (no data-reveal so it shows instantly) */
function ProgramCard({ p, u, det, fmt }) {
  const level = p.level === "master" ? "master" : "bachelor";
  const institution = (p.institution || u.name || "").toUpperCase();
  const est = p.established || (det && det.founded) || "";
  const tuition = p.tuition || (u.price ? fmt(u.price) + " / year" : "");
  const tags = toTags(p.tags);
  const reqs = toLines(p.requirements);
  const docs = toLines(p.documents);
  const dls = toLines(p.deadlines);
  const er = p.engReqs || null;
  const hasEr = er && Object.values(er).some(v => v && v !== "-" && v !== "—");

  return (
    <article className={"pcard pcard--" + level}>
      <header className="pcard__head">
        <div className="pcard__id">
          {u.logo
            ? <img src={u.logo} className="pcard__logo" alt="" />
            : <div className="pcard__logo pcard__logo--ph">{(u.short || "").slice(0, 2).toUpperCase()}</div>}
          <div className="pcard__id-txt">
            <div className="pcard__inst">{institution}{est ? " · EST. " + est : ""}</div>
            <h3 className="pcard__title">{p.title}</h3>
            {p.location && <div className="pcard__loc">📍 {p.location}</div>}
            {tags.length > 0 && (
              <div className="pcard__tags">
                <span className="pcard__tags-l">field:</span>
                {tags.map((t, i) => <span className="pcard__tag" key={i}>{t}</span>)}
              </div>
            )}
          </div>
        </div>
        <div className="pcard__meta">
          <span className="pcard__badge">{p.levelLabel || programLevelLabel(level)}</span>
          {tuition && (<span className="pcard__fin"><span className="pcard__fin-ic" aria-hidden="true">💵</span>{tuition}</span>)}
          {p.funding && (<span className="pcard__fin"><span className="pcard__fin-ic" aria-hidden="true">💰</span>{p.funding}</span>)}
          {p.scholarship && (
            <span className="pcard__fin"><span className="pcard__fin-ic" aria-hidden="true">💰</span>{p.scholarship}{p.grant ? " · Grant available" : ""}</span>
          )}
        </div>
      </header>

      <div className="pcard__body">
        <div className="pcard__col">
          <div className="pcard__col-h">About program</div>
          {p.paidEducation && (<div className="pcard__kv"><span className="pcard__kv-l">If paid education</span><span className="pcard__kv-v">{p.paidEducation}</span></div>)}
          {p.language && (<div className="pcard__kv"><span className="pcard__kv-l">Language of study</span><span className="pcard__kv-v">{p.language}</span></div>)}
          {p.duration && (<div className="pcard__kv"><span className="pcard__kv-l">Duration</span><span className="pcard__kv-v">{p.duration}</span></div>)}
          {p.appFee && (<div className="pcard__kv"><span className="pcard__kv-l">Application fee</span><span className="pcard__kv-v">{p.appFee}</span></div>)}
          {p.studyPlan && (
            <div className="pcard__kv">
              <span className="pcard__kv-l">Study plan</span>
              <a className="pcard__link" href={p.studyPlan} target="_blank" rel="noopener">study plan ↗</a>
            </div>
          )}
          {!p.studyPlan && p.studyPlanLabel && (<div className="pcard__kv"><span className="pcard__kv-l">Study plan</span><span className="pcard__kv-v">{p.studyPlanLabel}</span></div>)}
        </div>

        <div className="pcard__col">
          <div className="pcard__col-h">Requirements</div>
          {hasEr && (
            <div className="pcard__engreqs">
              <div className="pcard__engreqs-h">English language</div>
              <table className="pcard__engtbl">
                <tbody>
                  {er.ielts && er.ielts !== "-" && er.ielts !== "—" && <tr><td>IELTS</td><td>{er.ielts}</td></tr>}
                  {er.toefl && er.toefl !== "-" && er.toefl !== "—" && <tr><td>TOEFL iBT</td><td>{er.toefl}</td></tr>}
                  {er.duolingo && er.duolingo !== "-" && er.duolingo !== "—" && <tr><td>Duolingo</td><td>{er.duolingo}</td></tr>}
                  {er.other && er.other !== "-" && er.other !== "—" && <tr><td>Other</td><td>{er.other}</td></tr>}
                </tbody>
              </table>
            </div>
          )}
          {p.entrance && !hasEr && (
            <div className="pcard__entrance"><span className="pcard__entrance-l">Entrance</span>{p.entrance}</div>
          )}
          {reqs.length > 0 && (
            <>
              <div className="pcard__engreqs-h">Academic requirements</div>
              <ProgramLines lines={reqs} bullet={reqs.length > 1} />
            </>
          )}
          {docs.length > 0 && (
            <>
              <div className="pcard__engreqs-h">Required documents</div>
              <ProgramLines lines={docs} bullet />
            </>
          )}
        </div>

        <div className="pcard__col">
          <div className="pcard__col-h">Submission deadlines</div>
          {dls.length > 0
            ? <ProgramLines lines={dls} bullet />
            : <p className="pcard__about">To be announced</p>}
        </div>
      </div>

      {p.about && (
        <div className="pcard__features">
          <span className="pcard__features-l">Program features:</span> {p.about}
        </div>
      )}
    </article>
  );
}

/* Compact card — shown in the carousel; opens the full card in a modal */
function ProgramCardCompact({ p, u, det, fmt, onMore }) {
  const level = p.level === "master" ? "master" : "bachelor";
  const institution = (p.institution || u.name || "").toUpperCase();
  const est = p.established || (det && det.founded) || "";
  const tuition = p.tuition || (u.price ? fmt(u.price) + " / year" : "");
  const tags = toTags(p.tags);
  return (
    <article className={"pcard-c pcard--" + level}>
      <div className="pcard-c__head">
        {u.logo
          ? <img src={u.logo} className="pcard__logo pcard-c__logo" alt="" />
          : <div className="pcard__logo pcard__logo--ph pcard-c__logo">{(u.short || "").slice(0, 2).toUpperCase()}</div>}
        <div className="pcard-c__id-txt">
          <div className="pcard-c__inst">{institution}{est ? " · EST. " + est : ""}</div>
          <h3 className="pcard-c__title">{p.title}</h3>
          {p.location && <div className="pcard-c__loc">📍 {p.location}</div>}
        </div>
        <span className="pcard__badge">{p.levelLabel || programLevelLabel(level)}</span>
      </div>
      {tags.length > 0 && (
        <div className="pcard__tags pcard-c__tags">{tags.slice(0, 3).map((t, i) => <span className="pcard__tag" key={i}>{t}</span>)}</div>
      )}
      {p.about && <p className="pcard-c__about">{p.about}</p>}
      <div className="pcard-c__foot">
        <div className="pcard-c__meta">
          <span className="pcard__meta-l">Annual tuition</span>
          <span className="pcard-c__meta-v">{tuition || "—"}</span>
        </div>
        <button className="pcard-c__more" onClick={onMore}>Подробнее →</button>
      </div>
    </article>
  );
}

/* "More" modal — full program details */
function ProgramModal({ p, u, det, fmt, onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, []);
  return (
    <div className="pmodal" onClick={onClose} role="dialog" aria-modal="true">
      <div className="pmodal__inner" onClick={(e) => e.stopPropagation()}>
        <button className="pmodal__close" onClick={onClose} aria-label="Закрыть">✕</button>
        <ProgramCard p={p} u={u} det={det} fmt={fmt} />
      </div>
    </div>
  );
}

/* ── Focused program (?p=N from catalog) — full card right after the photos,
      with similar programs below ── */
function FocusProgram({ u, det, fmt, all, idx }) {
  const p = all[idx];
  const goTo = (short, i) => { window.location.href = `university.html?u=${encodeURIComponent(short)}&p=${i}`; };

  /* Similar: this uni's other programs first, then the flagship program of
     other unis in the same field/country */
  const similar = all
    .map((sp, i) => ({ p: sp, u, i }))
    .filter((x) => x.i !== idx);
  (window.EA_UNIS || [])
    .filter((x) => x.short !== u.short && (x.field === u.field || x.country === u.country))
    .sort((a, b) => ((b.field === u.field ? 1 : 0) - (a.field === u.field ? 1 : 0)) || ((a.qs || 9999) - (b.qs || 9999)))
    .slice(0, 4)
    .forEach((x) => similar.push({ p: window.eaUniPrograms(x)[0], u: x, i: 0 }));

  useEffect(() => {
    setTimeout(() => {
      const el = document.getElementById("program");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 400);
  }, []);

  return (
    <section className="section section--tight uprof-progfocus" id="program">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Программа</span>
          <h2>{p.title}</h2>
        </div>
        <ProgramCard p={p} u={u} det={det} fmt={fmt} />
        {similar.length > 0 && (
          <>
            <h3 className="uprof-progfocus__sim-h">Похожие программы</h3>
            <div className="pcards__grid">
              {similar.slice(0, 6).map((s, i) => (
                <ProgramCardCompact
                  key={s.u.short + "-" + s.i}
                  p={s.p} u={s.u} det={(window.EA_UNI_DETAILS || {})[s.u.short]} fmt={fmt}
                  onMore={() => goTo(s.u.short, s.i)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function ProgramCards({ u, det, fmt }) {
  const all = window.eaUniPrograms(u);
  const bachelors = all.filter((p) => (p.level || "bachelor") !== "master");
  const masters = all.filter((p) => p.level === "master");
  const hasBoth = bachelors.length > 0 && masters.length > 0;
  const [level, setLevel] = useState(bachelors.length ? "bachelor" : "master");
  const [open, setOpen] = useState(null);
  const shown = level === "master" ? masters : bachelors;

  if (!all.length) return null;
  return (
    <div className="pcards">
      <p className="pcards__intro">
        Актуальные программы {u.name}: направления, стоимость обучения и требования к поступлению — открой карточку, чтобы увидеть детали.
      </p>
      {hasBoth && (
        <div className="pcards__tabs" role="tablist">
          <button className={"pcards__tab" + (level === "bachelor" ? " is-on" : "")} onClick={() => setLevel("bachelor")}>
            Бакалавриат <span>{bachelors.length}</span>
          </button>
          <button className={"pcards__tab" + (level === "master" ? " is-on" : "")} onClick={() => setLevel("master")}>
            Магистратура <span>{masters.length}</span>
          </button>
        </div>
      )}
      <div className="pcards__scroll">
        <div className="pcards__grid">
          {shown.map((p, i) => (
            <ProgramCardCompact key={i} p={p} u={u} det={det} fmt={fmt} onMore={() => setOpen(p)} />
          ))}
        </div>
      </div>
      <a href="#cta" className="btn btn--dark pcards__cta">Проверить свои шансы на поступление →</a>
      {open && <ProgramModal p={open} u={u} det={det} fmt={fmt} onClose={() => setOpen(null)} />}
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
  const mapQuery = encodeURIComponent(`${u.name}, ${u.loc}`);
  const similar = UNIS.filter((x) => x.country === u.country && x.short !== u.short).slice(0, 3);
  const det = (window.EA_UNI_DETAILS || {})[u.short];

  /* ?p=N — a specific program picked in the catalog */
  const allPrograms = window.eaUniPrograms(u);
  const progIdx = parseInt(params.get("p"), 10);
  const focusProgram = Number.isInteger(progIdx) && allPrograms[progIdx] ? progIdx : null;

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

      {/* ===== Focused program (arrived from catalog program card):
             photos → about → the program card → similar programs ===== */}
      {focusProgram !== null && (
        <FocusProgram u={u} det={det} fmt={fmt} all={allPrograms} idx={focusProgram} />
      )}

      {/* ===== Admission requirements table ===== */}
      <section className="section section--tight uprof-req">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <span className="eyebrow">Поступление</span>
            <h2>Что нужно, чтобы поступить</h2>
            <p>Основные требования {u.name} для иностранных абитуриентов.</p>
          </div>
          <ProgramCards u={u} det={det} fmt={fmt} />
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
