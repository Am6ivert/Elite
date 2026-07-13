/* ============================================================
   MEDIA FEED — video testimonials horizontal scroll + modal
   ============================================================ */

const VIDEOS_DEFAULT = [
  { name: "Элана",     country: "Италия", src: "videos/elana.mp4",     poster: "thumbs/elana.jpg",     tag: "Отзыв",    uni: "Università degli Studi di Milano", scholarship: "Грант €7 000", quote: "Я всегда мечтала учиться в Европе. Elite Academy помогли с документами, языком и нашли грант. Теперь учусь в Милане!" },
  { name: "Нурсултан", country: "Италия", src: "videos/nursultan.mp4", poster: "thumbs/nursultan.jpg", tag: "Отзыв",    uni: "Италия · бакалавриат", quote: "С Elite Academy весь путь от анкеты до визы прошёл спокойно и понятно." },
  { name: "Анель",     country: "Италия", src: "videos/anel.mp4",      poster: "thumbs/anel.jpg",      tag: "Отзыв",    uni: "Università di Roma La Sapienza", scholarship: "Грант €8 000", quote: "Команда Elite Academy — профессионалы. Они знают каждый шаг и помогают на каждом этапе. Без них я бы не справилась." },
  { name: "Амирхан",   country: "Италия", src: "videos/amirkhan.mp4",  poster: "thumbs/amirkhan.jpg",  tag: "Отзыв",    uni: "Италия · бакалавриат", quote: "Поступил в итальянский вуз — то, что год назад казалось нереальным." },
  { name: "Асема",     country: "Италия", src: "videos/asema.mp4",     poster: "thumbs/asema.jpg",     tag: "Отзыв",    uni: "Италия · бакалавриат", quote: "Помогли с мотивационным письмом и подготовкой к экзамену — всё получилось." },
  { name: "Калия",     country: "Италия", src: "videos/kaliya.mp4",    poster: "thumbs/kaliya.jpg",    tag: "Отзыв",    uni: "Италия · бакалавриат", quote: "Спасибо команде за поддержку на каждом этапе поступления." },
  { name: "Кенжекан",  country: "Италия", src: "videos/kenzhekan.mp4", poster: "thumbs/kenzhekan.jpg", tag: "Отзыв",    uni: "Италия · бакалавриат", quote: "Учусь в Италии — мечта стала реальностью благодаря Elite Academy." },
  { name: "Адеми",     country: "Италия", src: "videos/ademi.mp4",     poster: "thumbs/ademi.png",     tag: "Отзыв",    uni: "Италия · бакалавриат", quote: "Поступление прошло легче, чем я думала — спасибо за чёткий план." },
  { name: "Нурзар",    country: "США",    src: "videos/nurzar.mp4",    poster: "thumbs/nurzar.jpg",    tag: "Отзыв",    uni: "Roosevelt University, Чикаго", scholarship: "$120 000", quote: "Даже не верила, что смогу поступить в США. С Elite Academy всё оказалось реально — сейчас уже второй курс!" },
  { name: "Амир",      country: "США",    src: "videos/amir.mp4",      poster: "thumbs/amir.jpg",      tag: "Отзыв",    uni: "Bellevue College, Сиэтл", scholarship: "$95 000", quote: "Elite Academy сделали процесс поступления понятным. Без них я бы потратил годы на разбор всей этой системы." },
  { name: "Исламбек",  country: "США",    src: "videos/islambek.mp4",  poster: "thumbs/islambek.jpg",  tag: "Интервью", uni: "США · бакалавриат", quote: "Рассказываю, как поступил в США и что дало обучение за рубежом." },
];

const VIDEOS = window.eaContent ? window.eaContent("videos", VIDEOS_DEFAULT) : VIDEOS_DEFAULT;
window.EA_VIDEOS = VIDEOS;

/* ── Fullscreen review modal: video right, student info left ── */
function VideoModal({ item, onClose }) {
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    if (!item) return;
    const esc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    const v = videoRef.current;
    if (v) { v.currentTime = 0; v.muted = false; v.play().catch(() => {}); }
    return () => { document.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [item]);

  if (!item) return null;

  return (
    <div className="vmodal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={`Видео-отзыв · ${item.name}`}>
      <div className="vmodal" onClick={(e) => e.stopPropagation()}>
        <button className="vmodal__close" onClick={onClose} aria-label="Закрыть">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="3" y1="3" x2="17" y2="17"/><line x1="17" y1="3" x2="3" y2="17"/>
          </svg>
        </button>

        <div className="vmodal__info">
          <span className="vmodal__tag">★ {item.tag}</span>
          <h3 className="vmodal__name">{item.name}</h3>
          <p className="vmodal__uni">{item.uni}</p>
          <p className="vmodal__country">{item.country}</p>

          {item.scholarship && (
            <div className="vmodal__money">
              <div className="vmodal__money-val">{item.scholarship}</div>
              <div className="vmodal__money-lab">стипендий и грантов</div>
            </div>
          )}

          {item.quote && <blockquote className="vmodal__quote">«{item.quote}»</blockquote>}

          <a href="#cta" className="btn btn--gold vmodal__cta" onClick={onClose}>Хочу так же — консультация →</a>
        </div>

        <div className="vmodal__video-wrap">
          <video
            ref={videoRef}
            src={item.src}
            poster={item.poster}
            controls
            playsInline
            className="vmodal__video"
          />
        </div>
      </div>
    </div>
  );
}

function VideoCard({ item, onOpen }) {
  const videoRef = React.useRef(null);
  const [hovered, setHovered] = React.useState(false);
  const [loaded,  setLoaded]  = React.useState(false);
  const hoverTimer = React.useRef(null);

  function handleMouseEnter() {
    hoverTimer.current = setTimeout(() => {
      setLoaded(true);
      setHovered(true);
      const v = videoRef.current;
      if (v) { v.muted = true; v.play().catch(() => {}); }
    }, 120);
  }

  function handleMouseLeave() {
    clearTimeout(hoverTimer.current);
    setHovered(false);
    const v = videoRef.current;
    if (v) { v.pause(); v.currentTime = 0; }
  }

  return (
    <div
      className={"vcard" + (hovered ? " vcard--hover" : "")}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpen(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onOpen(item); }}
    >
      <div className="vcard__media">
        <img src={item.poster} alt={item.name} className={"vcard__thumb" + (hovered ? " vcard__thumb--hide" : "")} loading="lazy" />
        {loaded && (
          <video
            ref={videoRef}
            src={item.src}
            poster={item.poster}
            preload="auto"
            playsInline
            muted
            loop
            className="vcard__video"
          />
        )}
        <div className="vcard__overlay">
          <div className="vcard__play-btn"><span>▶</span></div>
          {hovered && <div className="vcard__hint">Нажми, чтобы открыть</div>}
        </div>
        <span className="vcard__tag">{item.tag}</span>
      </div>
      <div className="vcard__info">
        <div className="vcard__name">{item.name}</div>
        <div className="vcard__country">{item.country}</div>
      </div>
    </div>
  );
}

function MediaFeed() {
  const [active, setActive] = React.useState(null);
  return (
    <section className="section section--tight mediafeed" id="videos">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">{window.eaText("reviews.eyebrow")}</span>
          <h2>{window.eaText("reviews.h2a")}<br/><span className="text-blue">{window.eaText("reviews.h2b")}</span></h2>
          <p>{window.eaText("reviews.sub")}</p>
        </div>
      </div>
      <div className="mediafeed__scroll-wrap" data-reveal data-delay="1">
        <div className="mediafeed__rail">
          {VIDEOS.map((v, i) => <VideoCard key={i} item={v} onOpen={setActive} />)}
        </div>
      </div>
      <VideoModal item={active} onClose={() => setActive(null)} />
    </section>
  );
}

window.MediaFeed = MediaFeed;
window.VideoModal = VideoModal;
