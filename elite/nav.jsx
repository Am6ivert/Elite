/* ============================================================
   NAVBAR + MEGA MENU + MOBILE DRAWER + STICKY BOTTOM CTA
   Multi-page version: top-level items link to pages, mega shows on hover
   ============================================================ */
const { useState, useEffect, useRef } = React;

const MEGA = {
  "Страны": {
    page: "countries.html",
    cols: [
      { h: "Англоговорящие", items: ["США", "Великобритания", "Канада", "Австралия"] },
      { h: "Европа", items: ["Италия", "Германия", "Франция", "Испания"] },
      { h: "Азия и Ближний Восток", items: ["ОАЭ", "Китай", "Южная Корея"] },
    ],
    cta: "Все страны →",
    ctaHref: "countries.html",
  },
  "Университеты": {
    page: "universities.html",
    cols: [
      { h: "По типу", items: ["Топ-рейтинги QS", "Бесплатные", "Бюджетные"] },
      { h: "США", items: ["Колледжи США", "Муниципальные колледжи", "Community Colleges"] },
      { h: "Инструмент", items: ["Поиск университетов", "Сохранённое"] },
    ],
    cta: "Поиск университетов →",
    ctaHref: "universities.html",
  },
  "Программы": {
    page: "programs.html",
    cols: [
      { h: "Уровни", items: ["Foundation", "Бакалавриат", "Магистратура", "МВА", "PhD"] },
      { h: "Короткие", items: ["Языковые курсы", "Летние школы"] },
      { h: "Формат", items: ["Онлайн-образование", "Двойные дипломы"] },
    ],
    cta: "Все программы →",
    ctaHref: "programs.html",
  },
  "Поступление": {
    page: "admission.html",
    cols: [
      { h: "Шаги", items: ["Как поступить", "Документы", "Сроки и дедлайны"] },
      { h: "Экзамены", items: ["Duolingo", "TOEFL", "IELTS", "SAT"] },
      { h: "Дальше", items: ["Визы", "Стипендии", "Истории студентов"] },
    ],
    cta: "Гайд по поступлению →",
    ctaHref: "admission.html",
  },
  "О нас": {
    page: "about.html",
    cols: [
      { h: "Компания", items: [["О компании", "about.html"], ["Состав Elite", "about.html#team"], ["Аккредитации", "about.html#accreds"], ["Офис и контакты", "about.html#office"]] },
      { h: "Студенты", items: [["Истории студентов", "stories.html"], ["Видео-отзывы", "stories.html"], ["Кейсы стипендий", "stories.html"]] },
      { h: "Карьера", items: [["Вакансии", "careers.html"], ["Наши отделы", "careers.html#departments"], ["Корпоративная жизнь", "careers.html#corp"]] },
      { h: "Блог", items: [["Все статьи", "stories.html#blog"]] },
    ],
    cta: "Познакомиться с нами →",
    ctaHref: "about.html",
  },
};

/* Mega item can be "Label" (links to section page) or ["Label", "href"] */
function megaItem(it, fallbackHref) {
  return Array.isArray(it) ? it : [it, fallbackHref];
}

/* Detect current page from body[data-page] */
function getCurrentPage() {
  return (document.body && document.body.dataset.page) || "home";
}
const PAGE_TO_KEY = {
  countries: "Страны",
  universities: "Университеты",
  programs: "Программы",
  admission: "Поступление",
  stories: "О нас",
  about: "О нас",
};

/* ============================================================
   LANGUAGE SWITCH — RU / EN / KG via Google Website Translator
   Persists across pages through the `googtrans` cookie.
   ============================================================ */
const LANGS = ["RU", "EN", "KG"];
const LANG_CODE = { RU: "ru", EN: "en", KG: "ky" }; // KG = кыргызский (код ky)

/* Manual labels for the navbar (Google Translate conflicts with React re-renders here,
   so we translate the menu ourselves and mark it translate="no"). */
const NAV_T = {
  RU: { "Страны": "Страны", "Университеты": "Университеты", "Программы": "Программы", "Поступление": "Поступление", "О нас": "О нас", cta: "Бесплатная консультация", call: "Позвонить" },
  EN: { "Страны": "Countries", "Университеты": "Universities", "Программы": "Programs", "Поступление": "Admission", "О нас": "About", cta: "Free consultation", call: "Call" },
  KG: { "Страны": "Өлкөлөр", "Университеты": "Университеттер", "Программы": "Программалар", "Поступление": "Кабыл алуу", "О нас": "Биз жөнүндө", cta: "Акысыз консультация", call: "Чалуу" },
};
function navT(lang, key) { return (NAV_T[lang] && NAV_T[lang][key]) || NAV_T.RU[key] || key; }

function currentLang() {
  const m = (document.cookie.match(/googtrans=\/[^/]+\/(\w+)/) || [])[1];
  if (m === "en") return "EN";
  if (m === "ky") return "KG";
  return "RU";
}

function setSiteLang(label) {
  const code = LANG_CODE[label] || "ru";
  const hosts = ["", "; domain=" + location.hostname, "; domain=." + location.hostname];
  if (code === "ru") {
    // remove translation → back to the original Russian
    hosts.forEach((d) => { document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT" + d; });
  } else {
    hosts.forEach((d) => { document.cookie = "googtrans=/ru/" + code + "; path=/" + d; });
  }
  window.location.reload();
}

function injectGoogleTranslate() {
  if (window.__gtLoaded) return;
  window.__gtLoaded = true;
  const style = document.createElement("style");
  style.textContent =
    ".goog-te-banner-frame.skiptranslate,.goog-te-gadget-icon{display:none!important}" +
    "body{top:0!important;position:static!important}" +
    "#goog-gt-tt,.goog-te-balloon-frame{display:none!important}" +
    ".goog-text-highlight{background:none!important;box-shadow:none!important}" +
    "#google_translate_element{display:none!important}";
  document.head.appendChild(style);
  const host = document.createElement("div");
  host.id = "google_translate_element";
  document.body.appendChild(host);
  window.googleTranslateElementInit = function () {
    new window.google.translate.TranslateElement(
      { pageLanguage: "ru", includedLanguages: "ru,en,ky", autoDisplay: false },
      "google_translate_element"
    );
  };
  const s = document.createElement("script");
  s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  s.async = true;
  document.body.appendChild(s);
}

function Logo({ light }) {
  return (
    <a href="index.html" className="logo" aria-label="Elite Academy KG">
      <img
        className="logo__full"
        src={light ? "images/logo-full-white.png" : "images/logo-full-navy.png"}
        alt="Elite Academy"
      />
      <span className="logo__tagline" style={{ color: light ? "rgba(255,255,255,.6)" : "var(--muted)" }}>
        образование за рубежом
      </span>
    </a>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(null);
  const [drawer, setDrawer] = useState(false);
  const [lang, setLang] = useState(currentLang());
  const closeT = useRef(null);
  const currentPage = getCurrentPage();
  const activeKey = PAGE_TO_KEY[currentPage] || null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
  }, [drawer]);

  useEffect(() => { injectGoogleTranslate(); }, []);

  const enter = (k) => { clearTimeout(closeT.current); setOpen(k); };
  const leave = () => { closeT.current = setTimeout(() => setOpen(null), 140); };

  return (
    <>
      <header className={"nav" + (scrolled ? " nav--scrolled" : "")} onMouseLeave={leave}>
        <div className="nav__inner wrap">
          <Logo light={!scrolled} />

          <nav className="nav__menu" aria-label="Главное меню">
            {Object.keys(MEGA).map((k) => (
              <a
                key={k}
                href={MEGA[k].page}
                translate="no"
                className={
                  "nav__item notranslate" +
                  (open === k ? " is-open" : "") +
                  (activeKey === k ? " is-active" : "")
                }
                onMouseEnter={() => enter(k)}
                onFocus={() => enter(k)}
              >
                <span>{navT(lang, k)}</span>
                <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            ))}
          </nav>

          <div className="nav__right">
            <button className="nav__icon" aria-label="Поиск" onClick={() => setOpen(open === "__search" ? null : "__search")}>
              <svg width="19" height="19" viewBox="0 0 20 20"><circle cx="9" cy="9" r="6.2" stroke="currentColor" strokeWidth="1.8" fill="none"/><path d="M14 14l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </button>
            <div className="lang">
              {LANGS.map((l) => (
                <button key={l} className={l === lang ? "is-active" : ""} onClick={() => setSiteLang(l)}>{l}</button>
              ))}
            </div>
            <a href="index.html#cta" translate="no" className="btn btn--gold pulse nav__cta notranslate">{navT(lang, "cta")}</a>
            <button className="nav__burger" aria-label="Меню" onClick={() => setDrawer(true)}>
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>

        {/* Mega menu panel */}
        {open && open !== "__search" && (
          <div className="mega" onMouseEnter={() => enter(open)} onMouseLeave={leave}>
            <div className="wrap mega__grid">
              {MEGA[open].cols.map((c, i) => (
                <div className="mega__col" key={i}>
                  <div className="mega__h">{c.h}</div>
                  {c.items.map((it) => {
                    const [label, href] = megaItem(it, MEGA[open].page);
                    return <a key={label} href={href} className="mega__link">{label}</a>;
                  })}
                </div>
              ))}
              <div className="mega__feature">
                <img src="images/promo-nav.jpg" alt="Elite Academy промо" style={{ width:"100%", height:96, objectFit:"cover", objectPosition:"top", borderRadius:12, marginBottom:14, display:"block" }} />
                <div className="mega__feature-t">Не знаешь с чего начать?</div>
                <p>Пройди оценку шансов за 2 минуты и получи список подходящих вузов.</p>
                <a href={MEGA[open].ctaHref} className="mega__cta" onClick={() => setOpen(null)}>{MEGA[open].cta}</a>
              </div>
            </div>
          </div>
        )}

        {/* Global search dropdown */}
        {open === "__search" && (
          <div className="mega mega--search" onMouseEnter={() => enter("__search")} onMouseLeave={leave}>
            <div className="wrap">
              <div className="search-big">
                <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="9" cy="9" r="6.2" stroke="currentColor" strokeWidth="1.8" fill="none"/><path d="M14 14l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                <input autoFocus placeholder="Найди университет, страну, программу или статью…"
                  onKeyDown={e => { if (e.key === "Enter" && e.target.value.trim()) window.location.href = "universities.html?search=" + encodeURIComponent(e.target.value.trim()); }}
                />
                <kbd>Enter</kbd>
              </div>
              <div className="search-sugs">
                <span>Популярно:</span>
                {[
                  ["США",           "universities.html?country=%D0%A1%D0%A8%D0%90"],
                  ["Bellevue College","university.html?u=Bellevue"],
                  ["Duolingo тест", "programs.html#exams"],
                  ["Стипендии",     "universities.html?bool_meritBased=1"],
                  ["Виза F-1",      "admission.html#visas"],
                ].map(([s, href]) => (
                  <a key={s} href={href} className="chip">{s}</a>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      <div className={"drawer" + (drawer ? " is-open" : "")}>
        <div className="drawer__backdrop" onClick={() => setDrawer(false)}></div>
        <div className="drawer__panel">
          <div className="drawer__top">
            <Logo />
            <button className="drawer__close" aria-label="Закрыть" onClick={() => setDrawer(false)}>✕</button>
          </div>
          <div className="search-big search-big--sm">
            <svg width="18" height="18" viewBox="0 0 20 20"><circle cx="9" cy="9" r="6.2" stroke="currentColor" strokeWidth="1.8" fill="none"/><path d="M14 14l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            <input placeholder="Поиск…"
              onKeyDown={e => { if (e.key === "Enter" && e.target.value.trim()) { setDrawer(false); window.location.href = "universities.html?search=" + encodeURIComponent(e.target.value.trim()); } }}
            />
          </div>
          <nav className="drawer__nav">
            {Object.keys(MEGA).filter(k => k !== "Программы" && k !== "Поступление").map((k) => (
              <DrawerGroup key={k} title={navT(lang, k)} cols={MEGA[k].cols} page={MEGA[k].page} isActive={activeKey === k} />
            ))}
          </nav>
          <a href="index.html#cta" translate="no" className="btn btn--gold btn--block notranslate" onClick={() => setDrawer(false)}>{navT(lang, "cta")}</a>
          <div className="drawer__lang">
            {LANGS.map((l) => (
              <button key={l} className={l === lang ? "is-active" : ""} onClick={() => setSiteLang(l)}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom CTA bar */}
      <div className="bottombar">
        <a href="tel:+996555720712" translate="no" className="bottombar__btn bottombar__btn--ghost notranslate">{navT(lang, "call")}</a>
        <a href="https://wa.me/996555720712" target="_blank" rel="noopener" className="bottombar__btn bottombar__btn--tg">WhatsApp</a>
      </div>
    </>
  );
}

function DrawerGroup({ title, cols, page, isActive }) {
  const [o, setO] = useState(false);
  const items = cols.flatMap((c) => c.items);
  return (
    <div className={"dg" + (o ? " is-open" : "")}>
      <button translate="no" className={"dg__h notranslate" + (isActive ? " is-active" : "")} onClick={() => setO(!o)}>
        {title}
        <span className="dg__plus">{o ? "–" : "+"}</span>
      </button>
      <div className="dg__body">
        <a href={page} style={{ fontWeight: 700, color: "var(--blue)" }}>→ Открыть раздел</a>
        {items.map((it) => {
          const [label, href] = megaItem(it, page);
          return <a key={label} href={href}>{label}</a>;
        })}
      </div>
    </div>
  );
}

window.Navbar = Navbar;
window.Logo = Logo;
