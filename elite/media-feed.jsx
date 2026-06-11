/* ============================================================
   MEDIA FEED — video testimonials horizontal scroll
   ============================================================ */

const VIDEOS_DEFAULT = [
  { name: "Элана",     country: "🇮🇹 Италия", src: "videos/elana.mp4",     poster: "thumbs/elana.jpg",     tag: "Отзыв"    },
  { name: "Нурсултан", country: "🇮🇹 Италия", src: "videos/nursultan.mp4", poster: "thumbs/nursultan.jpg", tag: "Отзыв"    },
  { name: "Анель",     country: "🇮🇹 Италия", src: "videos/anel.mp4",      poster: "thumbs/anel.jpg",      tag: "Отзыв"    },
  { name: "Амирхан",   country: "🇮🇹 Италия", src: "videos/amirkhan.mp4",  poster: "thumbs/amirkhan.jpg",  tag: "Отзыв"    },
  { name: "Асема",     country: "🇮🇹 Италия", src: "videos/asema.mp4",     poster: "thumbs/asema.jpg",     tag: "Отзыв"    },
  { name: "Калия",     country: "🇮🇹 Италия", src: "videos/kaliya.mp4",    poster: "thumbs/kaliya.jpg",    tag: "Отзыв"    },
  { name: "Кенжекан",  country: "🇮🇹 Италия", src: "videos/kenzhekan.mp4", poster: "thumbs/kenzhekan.jpg", tag: "Отзыв"    },
  { name: "Нурзар",    country: "🇺🇸 США",     src: "videos/nurzar.mp4",    poster: "thumbs/nurzar.jpg",    tag: "Отзыв"    },
  { name: "Амир",      country: "🇺🇸 США",     src: "videos/amir.mp4",      poster: "thumbs/amir.jpg",      tag: "Отзыв"    },
  { name: "Исламбек",  country: "🇺🇸 США",     src: "videos/islambek.mp4",  poster: "thumbs/islambek.jpg",  tag: "Интервью" },
];

/* Admin-edited content wins over the defaults above */
const VIDEOS = window.eaContent ? window.eaContent("videos", VIDEOS_DEFAULT) : VIDEOS_DEFAULT;
window.EA_VIDEOS = VIDEOS;

function VideoCard({ item }) {
  const ref = React.useRef(null);
  const [loaded, setLoaded] = React.useState(false);
  const [active, setActive] = React.useState(false);

  function toggle() {
    if (!loaded) {
      setLoaded(true);
      setTimeout(() => {
        const v = ref.current;
        if (v) { v.play(); setActive(true); }
      }, 50);
      return;
    }
    const v = ref.current;
    if (!v) return;
    if (v.paused) { v.play(); setActive(true); }
    else { v.pause(); setActive(false); }
  }

  return (
    <div className={"vcard" + (active ? " vcard--active" : "")} onClick={toggle} role="button" tabIndex={0}>
      <div className="vcard__media">
        {loaded
          ? <video ref={ref} src={item.src} poster={item.poster} preload="auto" playsInline autoPlay className="vcard__video" />
          : <img src={item.poster} alt={item.name} className="vcard__thumb" loading="lazy" />
        }
        {!active && (
          <div className="vcard__overlay">
            <div className="vcard__play-ic">▶</div>
          </div>
        )}
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
  return (
    <section className="section section--tight mediafeed" id="videos">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Живые отзывы</span>
          <h2>Они уже учатся за рубежом.<br/><span className="text-blue">Смотри и убеждайся.</span></h2>
          <p>Реальные видео-отзывы наших студентов из Италии и США — без монтажа и сценариев.</p>
        </div>
      </div>
      <div className="mediafeed__scroll-wrap" data-reveal data-delay="1">
        <div className="mediafeed__rail">
          {VIDEOS.map((v, i) => <VideoCard key={i} item={v} />)}
        </div>
      </div>
    </section>
  );
}

window.MediaFeed = MediaFeed;
