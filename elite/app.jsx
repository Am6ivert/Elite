/* ============================================================
   APP — page-based composition driven by body[data-page]
   ============================================================ */
const { useEffect } = React;

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

/* ============================================================
   PAGE LAYOUTS — each page composes the right sections
   ============================================================ */

function PageHome() {
  return (
    <>
      <Hero />
      <TrustBar />
      <HomeSearch />
      <BeyondDiploma />
      <Quiz />
      <DeadlineBanner />
      <Countries />
      <MediaFeed />
      <Stories />
      <PainSolution />
      <AboutUs />
      <FinalCTA />
    </>
  );
}

function PageCountries() {
  return (
    <>
      <PageHero
        eyebrow="Направления"
        title="Куда едут учиться студенты Elite Academy"
        sub="Выбери страну — и мы покажем вузы, бюджет, визу и сроки. Карты, цены и реальные истории по каждому направлению."
        variant="geometric"
      />
      <Countries />
      <PainSolution />
      <FinalCTA />
    </>
  );
}

function PageUniversities() {
  return (
    <>
      <PageHero
        eyebrow="Каталог"
        title="База университетов"
        sub="Партнёрские университеты Elite Academy в США, Европе и Азии. Фильтруй по стоимости, направлению, рейтингу — и сохраняй те, что нравятся."
        variant="default"
      />
      <DeadlineBanner />
      <Universities />
      <FinalCTA />
    </>
  );
}

function PagePrograms() {
  return (
    <>
      <PageHero
        eyebrow="Программы обучения"
        title="Найди формат под свою цель"
        sub="Бакалавриат, магистратура, MBA, PhD, языковые и летние школы. Стоимость, длительность, средние стипендии."
        variant="organic"
      />
      <Programs />
      <DeadlineBanner />
      <Exams />
      <EnglishLevelTest />
      <SavingsCalculator />
      <FinalCTA />
    </>
  );
}

function PageAdmission() {
  return (
    <>
      <PageHero
        eyebrow="Поступление"
        title="Из Бишкека в зарубежный кампус — 6 шагов"
        sub="Подбор вуза, подготовка к Duolingo и TOEFL, эссе, документы, студенческая виза. Финальный урок проводит основатель лично."
        variant="default"
      />
      <HowWeWork />
      <Scholarships />
      <Visas />
      <FinalCTA />
    </>
  );
}

function PageCountry() {
  return (
    <>
      <CountryProfile />
      <PainSolution />
      <FinalCTA />
    </>
  );
}

function PageUniversity() {
  return (
    <>
      <UniversityProfile />
      <FinalCTA />
    </>
  );
}

function PageStories() {
  return (
    <>
      <PageHero
        eyebrow="Истории и блог"
        title="Они были такими же, как ты"
        sub="1500+ студентов уже учатся за рубежом. Здесь — их кейсы, видео-отзывы и статьи о жизни после поступления."
        variant="organic"
      />
      <Stories />
      <Blog />
      <FinalCTA />
    </>
  );
}

function PageAbout() {
  return (
    <>
      <PageHero
        eyebrow="О нас"
        title="Кто мы и почему нам доверяют"
        sub="Аккредитованное ICEF агентство из Бишкека. 1500+ студентов поступили в США, Италию и ещё 5 стран. Рейтинг 4.8 из 5 по 214 отзывам на 2GIS."
        variant="minimal"
      />
      <AboutUs />
      <VisionMission />
      <Team />
      <Accreditations />
      <OfficeBlock />
      <FinalCTA />
    </>
  );
}

/* ============================================================
   PAGE HERO — compact intro block used on inner pages
   ============================================================ */
function PageHero({ eyebrow, title, sub, variant }) {
  return (
    <section className="page-hero grain" id="top">
      <div className="page-hero__mesh" aria-hidden="true"></div>
      <AliveBackground variant={variant} />
      <div className="wrap page-hero__inner">
        <span className="eyebrow eyebrow--light" data-reveal>{eyebrow}</span>
        <h1 data-reveal data-delay="1">{title}</h1>
        <p data-reveal data-delay="2">{sub}</p>
      </div>
      <div className="page-hero__wave" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M 0 40 C 240 10, 480 70, 720 40 S 1200 10, 1440 40 L 1440 80 L 0 80 Z" fill="var(--white)" />
        </svg>
      </div>
    </section>
  );
}

const PAGES = {
  home: PageHome,
  countries: PageCountries,
  country: PageCountry,
  universities: PageUniversities,
  university: PageUniversity,
  programs: PagePrograms,
  admission: PageAdmission,
  stories: PageStories,
  about: PageAbout,
};

function App() {
  useReveal();
  const pageKey = (document.body && document.body.dataset.page) || "home";
  const PageComp = PAGES[pageKey] || PageHome;
  return (
    <>
      <Navbar />
      <ScrollProgress />
      <main>
        <PageComp />
      </main>
      <Footer />
      <StickyQuizCTA />
      <FloatingChat />
      <ExitIntent />
      <GlobalFX />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthGate><App /></AuthGate>
);
