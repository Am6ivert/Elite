/* ============================================================
   EXTRAS — global polish layer:
   · ScrollProgress       — thin gold line under navbar
   · StickyQuizCTA        — bottom pill when quiz untouched
   · ExitIntent           — desktop exit-intent modal w/ checklist
   · FloatingChat         — desktop chat FAB (WA + TG)
   · GlobalFX             — tilt + magnetic buttons (auto-attached)
   · TimelineDraw         — animated SVG path on .timeline
   ============================================================ */
const { useState, useEffect, useRef } = React;

/* shared quiz state via localStorage --------------------------- */
const QUIZ_KEY = "ea_quiz_v1";
const EXIT_KEY = "ea_exit_v1";
window.eaQuizGet = () => {
  try { return JSON.parse(localStorage.getItem(QUIZ_KEY) || "null"); }
  catch { return null; }
};
window.eaQuizSet = (s) => {
  try { localStorage.setItem(QUIZ_KEY, JSON.stringify(s)); }
  catch {}
  window.dispatchEvent(new CustomEvent("ea:quiz"));
};

/* === Scroll progress ========================================== */
function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = null;
    const tick = () => {
      raf = null;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 8 ? (h.scrollTop / max) * 100 : 0);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    window.addEventListener("scroll", onScroll, { passive: true });
    tick();
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return (
    <div className="scrollprog" aria-hidden="true">
      <div className="scrollprog__fill" style={{ transform: `scaleX(${p / 100})` }} />
    </div>
  );
}

/* === Sticky quiz mini-CTA ===================================== */
function StickyQuizCTA() {
  const [show, setShow] = useState(false);
  const [state, setState] = useState(null);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 880) { setShow(false); return; }
      const hero = document.querySelector(".hero");
      const quiz = document.getElementById("quiz");
      const final = document.getElementById("cta");
      if (!hero || !quiz) return;
      const past = hero.getBoundingClientRect().bottom < 40;
      const inQuiz = quiz.getBoundingClientRect().top < window.innerHeight * 0.65 &&
                     quiz.getBoundingClientRect().bottom > 140;
      const inFinal = final && final.getBoundingClientRect().top < window.innerHeight * 0.6;
      const s = window.eaQuizGet();
      setState(s);
      setShow(past && !inQuiz && !inFinal && !(s && s.done));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("ea:quiz", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("ea:quiz", update);
    };
  }, []);

  if (!show) return null;
  const inProgress = state && state.step > 0 && !state.done;
  return (
    <a href="#quiz" className={"stickyq" + (inProgress ? " stickyq--cont" : "")}>
      <span className="stickyq__pulse" aria-hidden="true"></span>
      <div className="stickyq__body">
        <strong>{inProgress ? `Продолжить — шаг ${state.step + 1} из 5` : "Узнай свои шансы за 2 минуты"}</strong>
        <span>{inProgress ? "Прогресс сохранён" : "Бесплатно. Без регистрации."}</span>
      </div>
      <span className="stickyq__arr">→</span>
    </a>
  );
}

/* === Exit-intent (desktop) ==================================== */
function ExitIntent() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const armed = useRef(false);
  const triggered = useRef(false);

  useEffect(() => {
    if (window.innerWidth < 880) return;
    try { if (sessionStorage.getItem(EXIT_KEY)) return; } catch {}
    const arm = setTimeout(() => { armed.current = true; }, 8000);
    const onLeave = (e) => {
      if (!armed.current || triggered.current) return;
      if (e.clientY <= 8 && e.relatedTarget === null) {
        triggered.current = true;
        setOpen(true);
        try { sessionStorage.setItem(EXIT_KEY, "1"); } catch {}
      }
    };
    document.addEventListener("mouseout", onLeave);
    return () => { clearTimeout(arm); document.removeEventListener("mouseout", onLeave); };
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) return null;
  return (
    <div className="exit" role="dialog" aria-modal="true">
      <div className="exit__back" onClick={() => setOpen(false)}></div>
      <div className="exit__panel card">
        <button className="exit__x" aria-label="Закрыть" onClick={() => setOpen(false)}>✕</button>
        {!sent ? (
          <>
            <div className="exit__kicker">Объявление —</div>
            <h3 className="exit__h">Конкурс от Elite Academy</h3>
            <div className="exit__contest-img">
              <img src="images/contest.jpg" alt="Конкурс Elite Academy"
                   onError={(e) => { e.target.style.display = "none"; }} />
            </div>
            <p className="exit__p">
              Фото конкурса появится здесь. Загрузи изображение в <b>images/contest.jpg</b>
            </p>
            <a href="#cta" className="btn btn--gold" onClick={() => setOpen(false)}>
              Узнать подробнее →
            </a>
          </>
        ) : (
          <div className="exit__ok">
            <div className="exit__ok-ic">✓</div>
            <h3>Отправили на почту</h3>
            <p>Проверь входящие через 1–2 минуты. Если не пришло — загляни в «Промоакции».</p>
            <button className="btn btn--ghost" onClick={() => setOpen(false)}>Хорошо</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* === Floating chat (desktop) ================================== */
function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const tick = () => setVisible(window.innerWidth >= 720 && window.scrollY > 300);
    tick();
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    return () => { window.removeEventListener("scroll", tick); window.removeEventListener("resize", tick); };
  }, []);

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  if (!visible) return null;
  return (
    <div className={"fchat" + (open ? " is-open" : "")} ref={ref}>
      {open && (
        <div className="fchat__menu">
          <div className="fchat__head">
            <div className="fchat__head-t">Напиши нам — отвечаем за 5 минут</div>
            <div className="fchat__head-s">Сегодня на связи: Назгуль и Айбек</div>
          </div>
          <a href="https://wa.me/996555720712" target="_blank" rel="noopener" className="fchat__opt fchat__opt--wa">
            <span className="fchat__opt-ic" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.711.307 1.265.49 1.697.628.713.226 1.362.194 1.875.118.572-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg>
            </span>
            <div className="fchat__opt-txt">
              <strong>WhatsApp</strong>
              <span>+996 555 720 712</span>
            </div>
          </a>
          <a href="https://t.me/eliteacademykg" target="_blank" rel="noopener" className="fchat__opt fchat__opt--tg">
            <span className="fchat__opt-ic" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.87 4.326-2.96-.924c-.64-.203-.658-.643.135-.953l11.566-4.458c.538-.196 1.006.128.832.94z"/></svg>
            </span>
            <div className="fchat__opt-txt">
              <strong>Telegram</strong>
              <span>@eliteacademykg</span>
            </div>
          </a>
          <a href="tel:+996555720712" className="fchat__opt fchat__opt--call">
            <span className="fchat__opt-ic" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </span>
            <div className="fchat__opt-txt">
              <strong>Позвонить</strong>
              <span>ПН–ПТ 10:00–19:00</span>
            </div>
          </a>
        </div>
      )}
      <button className="fchat__btn" aria-label={open ? "Закрыть чат" : "Открыть чат"} onClick={() => setOpen(!open)}>
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        )}
        {!open && <span className="fchat__dot"></span>}
      </button>
    </div>
  );
}

/* === Tilt + magnetic + timeline draw (auto-attach) ============ */
function GlobalFX() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const touch = window.matchMedia("(hover: none)").matches;
    if (touch) return;

    /* ---- Tilt on [data-tilt] ---- */
    const tiltEls = document.querySelectorAll("[data-tilt]");
    const tiltHandlers = [];
    tiltEls.forEach((el) => {
      let raf;
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 6}deg) translateY(-4px)`;
        });
      };
      const onLeave = () => {
        cancelAnimationFrame(raf);
        el.style.transform = "";
      };
      el.style.transformStyle = "preserve-3d";
      el.style.transition = "transform .35s cubic-bezier(.22,.61,.36,1)";
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      tiltHandlers.push(() => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
        cancelAnimationFrame(raf);
      });
    });

    /* ---- Magnetic on .btn--gold and [data-magnetic] ---- */
    const magEls = document.querySelectorAll(".btn--gold, [data-magnetic]");
    const magHandlers = [];
    magEls.forEach((el) => {
      let raf;
      const strength = el.classList.contains("btn--lg") ? 10 : 6;
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * strength * 2;
        const y = ((e.clientY - r.top) / r.height - 0.5) * strength * 2;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transform = `translate(${x}px, ${y - 2}px)`;
        });
      };
      const onLeave = () => {
        cancelAnimationFrame(raf);
        el.style.transform = "";
      };
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      magHandlers.push(() => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
        cancelAnimationFrame(raf);
      });
    });

    return () => {
      tiltHandlers.forEach((fn) => fn());
      magHandlers.forEach((fn) => fn());
    };
  }, []);

  /* ---- Timeline draw on scroll ---- */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const line = document.querySelector(".timeline__line");
    if (!line) return;
    line.classList.add("timeline__line--anim");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          line.classList.add("timeline__line--in");
          io.disconnect();
        }
      });
    }, { threshold: 0.12 });
    io.observe(line.parentElement);
    return () => io.disconnect();
  }, []);

  return null;
}

window.ScrollProgress = ScrollProgress;
window.StickyQuizCTA = StickyQuizCTA;
window.ExitIntent = ExitIntent;
window.FloatingChat = FloatingChat;
window.GlobalFX = GlobalFX;
