/* ============================================================
   FINAL CTA (positive vs loss) + FOOTER
   ============================================================ */
const { useState } = React;

function FinalCTA() {
  const [sent, setSent] = useState(false);
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
              <div className="pitch__ic">🚀</div>
              <div>
                <h3 className="pitch__t">Начни сейчас</h3>
                <p>И уже через год ты в кампусе зарубежного университета — со стипендией и планом.</p>
              </div>
            </div>
            <div className="pitch pitch--loss">
              <div className="pitch__ic">⏳</div>
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
                <form className="finalcta__form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                  <input required placeholder="Имя" />
                  <input required placeholder="WhatsApp / Телефон" inputMode="tel" />
                  <select required defaultValue="">
                    <option value="" disabled>Куда хочешь поступить?</option>
                    <option>🇺🇸 США</option>
                    <option>🇮🇹 Италия</option>
                    <option>🇬🇧 Великобритания</option>
                    <option>🇩🇪 Германия</option>
                    <option>Пока не определился</option>
                  </select>
                  <button type="submit" className="btn btn--gold btn--block btn--lg">Отправить — это бесплатно</button>
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
            {["Instagram","TikTok","Telegram"].map((s) => (
              <a key={s} href="#" className="footer__social">{s}</a>
            ))}
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
          <div className="footer__contact">📍 г. Бишкек, ул. Исы Ахунбаева 169, БЦ «Бинокль», 6 этаж</div>
          <a href="tel:+996555720712" className="footer__contact">📞 +996 555 720 712</a>
          <a href="mailto:eliteacademykg@gmail.com" className="footer__contact">✉️ eliteacademykg@gmail.com</a>
          <div className="footer__contact">🕐 ПН–ПТ 10:00–19:00 · СБ 12:00–19:00</div>
          <iframe
            className="footer__map"
            title="Офис Elite Academy на карте"
            src={`https://www.google.com/maps?q=${encodeURIComponent("БЦ Бинокль, Ахунбаева 169, Бишкек")}&output=embed&hl=ru`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ border: 0, width: "100%" }}
          ></iframe>
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
