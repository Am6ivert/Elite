/* ============================================================
   FINAL CTA (positive vs loss) + FOOTER
   ============================================================ */
const { useState, useEffect, useRef } = React;
const LEADS_URL = "https://script.google.com/macros/s/AKfycbw4i67Vtu9cMUjZvXxVCZ0ZdeDndAG2GqY0eS7PznuBGxZeG4PkwHbe8xN-RAoa35BW/exec";
const FOOTER_MAP_COORDS = [74.590385, 42.843700];
const FOOTER_DGIS_KEY   = "de8b758a-a208-4a05-9f30-25eb492f4364";

function FooterMap() {
  const mapRef  = useRef(null);
  const mapInst = useRef(null);
  useEffect(() => {
    if (mapInst.current || !mapRef.current) return;
    function init() {
      mapInst.current = new window.mapgl.Map(mapRef.current, {
        center: FOOTER_MAP_COORDS, zoom: 16, key: FOOTER_DGIS_KEY, lang: "ru",
      });
      new window.mapgl.Marker(mapInst.current, { coordinates: FOOTER_MAP_COORDS });
    }
    if (window.mapgl) { init(); }
    else {
      const s = document.createElement("script");
      s.src = "https://mapgl.2gis.com/api/js/v1";
      s.onload = init;
      document.head.appendChild(s);
    }
    return () => { if (mapInst.current) { mapInst.current.destroy(); mapInst.current = null; } };
  }, []);
  return <div ref={mapRef} className="footer__map"></div>;
}

function FinalCTA() {
  const [sent, setSent]   = useState(false);
  const [busy, setBusy]   = useState(false);
  const [name, setName]   = useState("");
  const [phone, setPhone] = useState("");
  const [dest, setDest]   = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const payload = {
      name, phone, dest,
      page: location.pathname.split("/").pop() || "index.html",
      time: new Date().toLocaleString("ru"),
    };
    try {
      await fetch(LEADS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload),
      });
    } catch (_) { /* no-cors — игнорируем ошибку сети, форма всё равно "принята" */ }
    setBusy(false);
    setSent(true);
  }

  return (
    <section className="section dark grain finalcta" id="cta">
      <div className="finalcta__mesh" aria-hidden="true"></div>
      <div className="wrap finalcta__inner">
        <div className="finalcta__head" data-reveal>
          <span className="eyebrow eyebrow--light">Сделай первый шаг</span>
          <h2>Через год ты можешь учиться за границей.<br/>Решение принимается сегодня.</h2>
        </div>

        <div className="finalcta__grid">
          <div className="finalcta__pitches" data-reveal>
            <div className="pitch pitch--good">
              <div className="pitch__ic">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
              <div>
                <h3 className="pitch__t">Начни сейчас</h3>
                <p>И уже через год ты в кампусе зарубежного университета — со стипендией и планом.</p>
              </div>
            </div>
            <div className="pitch pitch--loss">
              <div className="pitch__ic">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div>
                <h3 className="pitch__t">Или потеряешь ещё год</h3>
                <p>Каждый год студенты ждут «подходящего момента» и теряют год. Следующий набор открыт сейчас.</p>
              </div>
            </div>
            <div className="finalcta__guarantee">
              <span>✓</span> 1500+ студентов уже сделали этот выбор
            </div>
          </div>

          <div className="finalcta__form-wrap card" data-reveal data-delay="1">
            {!sent ? (
              <>
                <h3 className="finalcta__form-t">Бесплатная консультация</h3>
                <p className="finalcta__form-sub">Оставь контакты — перезвоним и составим план поступления.</p>
                <form className="finalcta__form" onSubmit={handleSubmit}>
                  <input required placeholder="Имя" value={name} onChange={e => setName(e.target.value)} />
                  <input required placeholder="WhatsApp / Телефон" inputMode="tel" value={phone} onChange={e => setPhone(e.target.value)} />
                  <select required value={dest} onChange={e => setDest(e.target.value)}>
                    <option value="" disabled>Куда хочешь поступить?</option>
                    <option>США</option>
                    <option>Италия</option>
                    <option>Великобритания</option>
                    <option>Германия</option>
                    <option>Пока не определился</option>
                  </select>
                  <button type="submit" className="btn btn--gold btn--block btn--lg" disabled={busy}>
                    {busy ? "Отправляем…" : "Отправить — это бесплатно"}
                  </button>
                </form>
                <div className="finalcta__micro">
                  <span>✓ Без спама</span><span>✓ Ответим в течение 1 часа</span><span>✓ Первая консультация бесплатна</span>
                </div>
              </>
            ) : (
              <div className="finalcta__sent">
                <div className="finalcta__sent-ic">✓</div>
                <h3>Спасибо! Заявка принята.</h3>
                <p>Наш консультант свяжется с тобой в течение <b>1 часа</b>. Проверь WhatsApp.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const FOOT_DIR = ["США","Италия","Великобритания","Германия","Канада","Австралия"];
const FOOT_SRV = ["Поиск университетов","Оценка шансов","Подготовка к Duolingo","Визовая поддержка","Стипендии и гранты"];

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <Logo light />
          <p className="footer__about">Аккредитованное агентство по образованию за рубежом. Бишкек, Кыргызстан.</p>
          <div className="footer__socials">
            <a href="https://www.instagram.com/eliteacademy.kg" className="footer__social" aria-label="Instagram" target="_blank" rel="noopener">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href="https://www.tiktok.com/@eliteacademy.kg" className="footer__social" aria-label="TikTok" target="_blank" rel="noopener">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.01a8.16 8.16 0 0 0 4.77 1.52V7.09a4.85 4.85 0 0 1-1.01-.4z"/></svg>
            </a>
            <a href="https://t.me/eliteacademykg" className="footer__social" aria-label="Telegram" target="_blank" rel="noopener">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
        </div>

        <div className="footer__col">
          <div className="footer__h">Направления</div>
          {FOOT_DIR.map((d) => <a key={d} href="#">{d}</a>)}
          <a href="#" className="footer__all">→ Все страны</a>
        </div>

        <div className="footer__col">
          <div className="footer__h">Услуги</div>
          {FOOT_SRV.map((s) => <a key={s} href="#">{s}</a>)}
        </div>

        <div className="footer__col footer__contacts">
          <div className="footer__h">Контакты</div>
          <div className="footer__contact">г. Бишкек, ул. Исы Ахунбаева 169, БЦ «Бинокль», 6 этаж</div>
          <a href="tel:+996555720712" className="footer__contact">+996 555 720 712</a>
          <a href="mailto:eliteacademykg@gmail.com" className="footer__contact">eliteacademykg@gmail.com</a>
          <div className="footer__contact">ПН–ПТ 10:00–19:00 · СБ 12:00–19:00</div>
          <FooterMap />
        </div>
      </div>
      <div className="footer__bottom wrap">
        <span>© 2026 Elite Academy KG. Все права защищены.</span>
        <div className="footer__legal"><a href="#">Политика конфиденциальности</a><a href="#">Условия</a></div>
      </div>
    </footer>
  );
}

window.FinalCTA = FinalCTA;
window.Footer = Footer;
