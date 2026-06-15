/* ============================================================
   STORIES (carousel + grid) · VISAS · BLOG · TEAM
   ============================================================ */
const { useState, useRef } = React;

const STORY_CARDS_DEFAULT = [
  {
    name: "Элана",
    from: "Италия",
    quote: "Я всегда мечтала учиться в Европе. Elite Academy помогли с документами, языком и нашли грант. Теперь учусь в Италии!",
    uni: "Università degli Studi di Milano",
    videoSrc: "videos/elana.mp4",
    poster: "thumbs/elana.jpg"
  },
  {
    name: "Нурзар",
    from: "США",
    quote: "Даже не верила, что смогу поступить в США. С Elite Academy всё оказалось реально — сейчас уже второй курс!",
    uni: "Roosevelt University, Чикаго",
    videoSrc: "videos/nurzar.mp4",
    poster: "thumbs/nurzar.jpg"
  },
  {
    name: "Анель",
    from: "Италия",
    quote: "Команда Elite Academy — профессионалы. Они знают каждый шаг и помогают на каждом этапе. Без них я бы не справилась.",
    uni: "Università di Roma",
    videoSrc: "videos/anel.mp4",
    poster: "thumbs/anel.jpg"
  },
];

const STORY_GRID_DEFAULT = [
  { n: "Элана",     u: "Università degli Studi di Milano", s: "Грант + €7 000",   t: "Италия", level: "Бакалавр", video: "videos/elana.mp4",     poster: "thumbs/elana.jpg"     },
  { n: "Нурсултан", u: "Università di Bologna",            s: "Грант + €6 500",   t: "Италия", level: "Бакалавр", video: "videos/nursultan.mp4", poster: "thumbs/nursultan.jpg" },
  { n: "Анель",     u: "Università di Roma La Sapienza",   s: "Грант + €8 000",   t: "Италия", level: "Магистр",  video: "videos/anel.mp4",      poster: "thumbs/anel.jpg"      },
  { n: "Амирхан",   u: "Politecnico di Milano",            s: "Грант + €9 000",   t: "Италия", level: "Магистр",  video: "videos/amirkhan.mp4",  poster: "thumbs/amirkhan.jpg"  },
  { n: "Асема",     u: "Università di Torino",             s: "Стипендия €5 000", t: "Италия", level: "Бакалавр", video: "videos/asema.mp4",     poster: "thumbs/asema.jpg"     },
  { n: "Калия",     u: "Università di Napoli Federico II", s: "Стипендия €4 500", t: "Италия", level: "Бакалавр", video: "videos/kaliya.mp4",    poster: "thumbs/kaliya.jpg"    },
  { n: "Нурзар",    u: "Roosevelt University, Чикаго",     s: "$120 000",          t: "США",    level: "Бакалавр", video: "videos/nurzar.mp4",    poster: "thumbs/nurzar.jpg"    },
  { n: "Амир",      u: "Bellevue College",                 s: "$95 000",           t: "США",    level: "Бакалавр", video: "videos/amir.mp4",      poster: "thumbs/amir.jpg"      },
  { n: "Исламбек",  u: "La Salle University",              s: "$88 000",           t: "США",    level: "Бакалавр", video: "videos/islambek.mp4",  poster: "thumbs/islambek.jpg"  },
  { n: "Кенжекан",  u: "Università di Padova",             s: "Грант + €7 500",   t: "Италия", level: "Магистр",  video: "videos/kenzhekan.mp4", poster: "thumbs/kenzhekan.jpg" },
];

/* Admin-edited content wins over the defaults above */
const STORY_CARDS = window.eaContent ? window.eaContent("storyCards", STORY_CARDS_DEFAULT) : STORY_CARDS_DEFAULT;
const STORY_GRID  = window.eaContent ? window.eaContent("storyGrid",  STORY_GRID_DEFAULT)  : STORY_GRID_DEFAULT;
window.EA_STORY_CARDS = STORY_CARDS;
window.EA_STORY_GRID = STORY_GRID;
const STORY_FILTERS = ["Все", ...new Set(STORY_GRID.map((g) => g.t))];

function SgridCard({ g }) {
  const videoRef = useRef(null);

  function handleEnter() {
    if (videoRef.current) videoRef.current.play().catch(() => {});
  }

  function handleLeave() {
    const v = videoRef.current;
    if (v) { v.pause(); v.currentTime = 0; }
  }

  return (
    <div className="sgrid card"
      onMouseEnter={g.video ? handleEnter : undefined}
      onMouseLeave={g.video ? handleLeave : undefined}>
      <div className="sgrid__thumb">
        {g.poster
          ? <img src={g.poster} alt={g.n} className="sgrid__img" loading="lazy" />
          : <div className="ph sgrid__img" data-label={"фото · " + g.n} style={{ height: "100%" }}></div>
        }
        {g.video && (
          <video
            ref={videoRef}
            className="sgrid__video"
            src={g.video}
            poster={g.poster}
            muted playsInline preload="none"
          />
        )}
        {g.video && <span className="sgrid__play">▶</span>}
      </div>
      <div className="sgrid__info">
        <div className="sgrid__name">{g.n}</div>
        <div className="sgrid__uni">{g.u}</div>
        <div className="sgrid__meta">
          {g.t && <span className="chip">{g.t}</span>}
          {g.level && <span className="chip tag-blue">{g.level}</span>}
        </div>
        <div className="sgrid__sum">{g.s}</div>
      </div>
    </div>
  );
}

function StorySlide({ s }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  function handlePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  }

  return (
    <div className="story-big">
      <div className="story-big__photo story-big__photo--video" onClick={handlePlay}>
        <video ref={videoRef} src={s.videoSrc} poster={s.poster} preload="none" playsInline className="story-big__video-bg" />
        {!playing && <span className="story-big__play">▶</span>}
      </div>
      <div className="story-big__body">
        <div className="story-big__name">{s.name}</div>
        <div className="story-big__from">{s.from}</div>
        <p className="story-big__quote">«{s.quote}»</p>
        <div className="story-big__uni">{s.uni}</div>
      </div>
    </div>
  );
}

function Stories() {
  const [idx, setIdx] = useState(0);
  const [gf, setGf] = useState("Все");
  const go = (d) => setIdx((i) => (i + d + STORY_CARDS.length) % STORY_CARDS.length);
  const grid = STORY_GRID.filter((g) => gf === "Все" || g.t === gf);

  return (
    <section className="section stories" id="stories">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Наши студенты</span>
          <h2>Они были такими же, как ты.<br/><span className="text-blue">Теперь учатся за рубежом.</span></h2>
        </div>

        {/* Carousel */}
        <div className="story-carousel" data-reveal>
          <div className="story-carousel__viewport">
            <div className="story-carousel__track" style={{ transform: `translateX(-${idx * 100}%)` }}>
              {STORY_CARDS.map((s, i) => <StorySlide key={i} s={s} />)}
            </div>
          </div>
          <div className="story-carousel__nav">
            <button onClick={() => go(-1)} aria-label="Назад">←</button>
            <div className="story-carousel__dots">
              {STORY_CARDS.map((_, i) => (
                <button key={i} className={i === idx ? "is-on" : ""} onClick={() => setIdx(i)} aria-label={"Слайд " + (i+1)}></button>
              ))}
            </div>
            <button onClick={() => go(1)} aria-label="Вперёд">→</button>
          </div>
        </div>

        {/* Grid */}
        <div className="stories__filters" data-reveal>
          {STORY_FILTERS.map((f) => (
            <button key={f} className={"scholar__filter" + (gf === f ? " is-on" : "")} onClick={() => setGf(f)}>{f}</button>
          ))}
        </div>
        <div className="stories__grid stagger" key={gf}>
          {grid.map((g) => <SgridCard key={g.n} g={g} />)}
        </div>
      </div>
    </section>
  );
}

const VISAS = [
  { name: "Виза F-1 (США)", docs: "I-20, DS-160, SEVIS, паспорт", term: "3–6 недель", rate: "100%" },
  { name: "Студ. виза Италии", docs: "Acceptance letter, финансы, страховка", term: "4–8 недель", rate: "100%" },
  { name: "UK Student Visa", docs: "CAS, IELTS, финансы, TB-тест", term: "3 недели", rate: "100%" },
];

function Visas() {
  return (
    <section className="section section--tight visas" id="visas">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Визы</span>
          <h2>Виза — не проблема. Это система.</h2>
        </div>

        <div className="visas__grid">
          {VISAS.map((v, i) => (
            <article className="visa card card--lift" data-reveal data-delay={i + 1} key={v.name}>
              <h3 className="visa__name">{v.name}</h3>
              <div className="visa__row"><span>Документы</span><b>{v.docs}</b></div>
              <div className="visa__row"><span>Срок оформления</span><b>{v.term}</b></div>
              <div className="visa__rate">
                <span>Одобрений в Elite Academy</span>
                <div className="visa__rate-bar"><div style={{ width: v.rate }}></div></div>
                <b>{v.rate}</b>
              </div>
              <a href="#" className="visa__link">Подробнее →</a>
            </article>
          ))}
        </div>

        <div className="visas__trust card" data-reveal>
          <div className="visas__trust-h">Нам доверяют даже те, кому отказали раньше</div>
          <div className="visas__trust-grid">
            <div className="visas__trust-case">
              <span className="visas__trust-ic">↻</span>
              <p><b>Афтандиль</b> — получил отказ раньше → виза с 1-й попытки с нами.</p>
            </div>
            <div className="visas__trust-case">
              <span className="visas__trust-ic">↻</span>
              <p><b>Айдана</b> — неправильная DS-160 в другой компании → с нами получила с 1-й попытки.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const POSTS_DEFAULT = [
  { cat: "Duolingo", t: "Как сдать Duolingo на 120+ баллов", time: "5 мин", date: "12 мая 2026" },
  { cat: "Виза", t: "DS-160: пошаговое заполнение без ошибок", time: "8 мин", date: "28 апр 2026" },
  { cat: "Стипендии", t: "Как получить $80 000 стипендию в США", time: "6 мин", date: "15 апр 2026" },
  { cat: "США", t: "Community colleges: дешёвый вход в топ-вузы", time: "7 мин", date: "2 апр 2026" },
  { cat: "Италия", t: "Бесплатное обучение в Италии: реально ли", time: "5 мин", date: "20 мар 2026" },
  { cat: "Жизнь", t: "Первый месяц в США: чек-лист новичка", time: "9 мин", date: "8 мар 2026" },
];

/* Admin-edited content wins over the defaults above */
const POSTS = window.eaContent ? window.eaContent("posts", POSTS_DEFAULT) : POSTS_DEFAULT;
window.EA_POSTS = POSTS;
const POST_CATS = [...new Set(POSTS.map((p) => p.cat))];

function Blog() {
  const [cat, setCat] = useState("Все");
  const list = POSTS.filter((p) => cat === "Все" || p.cat === cat);
  return (
    <section className="section blog" id="blog">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Блог</span>
          <h2>Всё, что нужно знать о поступлении</h2>
        </div>
        <div className="blog__cats" data-reveal>
          <button className={"scholar__filter" + (cat === "Все" ? " is-on" : "")} onClick={() => setCat("Все")}>Все</button>
          {POST_CATS.map((c) => (
            <button key={c} className={"scholar__filter" + (cat === c ? " is-on" : "")} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
        <div className="blog__grid stagger" key={cat}>
          {list.map((p, i) => (
            <a href="#" className="post card card--lift" key={p.t}>
              {p.cover
                ? <img src={p.cover} alt={p.t} className="post__cover" loading="lazy" />
                : <div className="ph post__cover" data-label="превью статьи"></div>
              }
              <div className="post__body">
                <div className="post__meta"><span className="chip tag-blue">{p.cat}</span><span>{p.date} · {p.time}</span></div>
                <h3 className="post__t">{p.t}</h3>
                <span className="post__link">Читать →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

const TEAM_DEFAULT = {
  text: "Наши сотрудники сами учились за рубежом — и понимают каждый страх, каждую бумагу и каждый нюанс изнутри. Основатель Elite Academy лично прошёл визовое интервью в посольстве США и сам поступил в американский университет. Именно поэтому он лично проводит финальный урок перед каждым визовым интервью — и знает, какие вопросы задают на самом деле.",
  badges: ["ICEF Accredited", "Shorelight Partner", "Apply Wave"],
  photo: "",
};
const TEAM = window.eaContent ? window.eaContent("team", TEAM_DEFAULT) : TEAM_DEFAULT;
window.EA_TEAM = TEAM;

function Team() {
  return (
    <section className="section section--tight team" id="team">
      <div className="wrap team__grid">
        <div className="team__photo-wrap" data-reveal>
          <img src={TEAM.photo || "images/team.jpg"} alt="Команда Elite Academy" className="team__photo"
            onError={e => {
              const d = document.createElement("div");
              d.className = "ph team__photo";
              d.dataset.label = "фото команды Elite Academy";
              e.currentTarget.parentNode.replaceChild(d, e.currentTarget);
            }}
          />
        </div>
        <div className="team__content" data-reveal data-delay="1">
          <span className="eyebrow">Состав Elite</span>
          <h2>Мы сами прошли этот путь</h2>
          <p className="team__text">{TEAM.text}</p>
          <div className="team__badges">
            {TEAM.badges.map((b) => (
              <div className="team__badge" key={b}>
                <span className="team__badge-ic">✓</span>{b}
              </div>
            ))}
          </div>
          <a href="#cta" className="btn btn--dark">Познакомиться на консультации →</a>
        </div>
      </div>
    </section>
  );
}

window.Stories = Stories;
window.Visas = Visas;
window.Blog = Blog;
window.Team = Team;
