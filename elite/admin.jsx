/* ============================================================
   ADMIN PANEL — admin.html
   Edits all site content: universities (+descriptions),
   countries (cards + profile pages), stories, videos, blog.
   Draft is stored in localStorage ("ea_content_v1") — instantly
   visible on the site in THIS browser. "Экспорт" downloads
   elite/content-data.js — replace the file to publish for everyone.

   Default password: elite2026
   To change it: run in any browser console
     crypto.subtle.digest("SHA-256", new TextEncoder().encode("НОВЫЙ_ПАРОЛЬ"))
       .then(b => console.log([...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")))
   and put the result into PASS_SHA256 below.
   ============================================================ */
const { useState, useEffect, useMemo } = React;

const LS_KEY = "ea_content_v1";
const SESSION_KEY = "ea_admin_ok";
const GH_TOKEN_KEY = "ea_gh_token";
const GH_BRANCH_KEY = "ea_gh_branch";
const GH_OWNER = "nurza777";
const GH_REPO = "Elite_website";
const GH_PATH = "elite/content-data.js";
const PASS_SHA256 = "132694353effb245b819fb7e2c0de5a0f66143f69a082d40e28367286557eb04";
const PASS_DJB2 = "3b742bc2"; // fallback when crypto.subtle is unavailable (plain http)

const FLAGS = { "Италия": "🇮🇹", "США": "🇺🇸", "Северный Кипр": "🇨🇾", "Малайзия": "🇲🇾", "Германия": "🇩🇪", "Польша": "🇵🇱", "Австрия": "🇦🇹" };
const COUNTRY_OPTS = Object.keys(FLAGS);
const FIELD_OPTS = ["IT", "Business", "Medicine", "Law", "Engineering", "Design", "Economics", "Education"];
const TYPE_OPTS = ["Государственный", "Частный"];

const clone = (x) => JSON.parse(JSON.stringify(x));

function djb2(s) { let h = 5381; for (let i = 0; i < s.length; i++) { h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; } return h.toString(16); }
async function checkPass(p) {
  if (window.crypto && crypto.subtle) {
    try {
      const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(p));
      return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("") === PASS_SHA256;
    } catch (e) { /* fall through */ }
  }
  return djb2(p) === PASS_DJB2;
}

/* ---------- GitHub one-click publish ---------- */
function utf8b64(s) {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  const CH = 0x8000;
  for (let i = 0; i < bytes.length; i += CH) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
  }
  return btoa(bin);
}

function contentFileText(content) {
  return "/* ============================================================\n" +
    "   PUBLISHED CONTENT — published from admin.html\n" +
    "   " + new Date().toLocaleString("ru") + "\n" +
    "   ============================================================ */\n" +
    "window.EA_CONTENT_PUBLISHED = " + JSON.stringify(content, null, 2) + ";\n";
}

async function ghPublish(token, branch, fileText) {
  const api = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${GH_PATH}`;
  const headers = {
    Authorization: "Bearer " + token,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };
  let sha = null;
  const g = await fetch(`${api}?ref=${encodeURIComponent(branch)}`, { headers });
  if (g.status === 200) sha = (await g.json()).sha;
  else if (g.status === 401) throw new Error("Неверный ключ доступа (token). Проверь в «Публикации».");
  else if (g.status !== 404) throw new Error("GitHub: ошибка " + g.status);
  const body = { message: "Обновление контента из админ-панели", content: utf8b64(fileText), branch };
  if (sha) body.sha = sha;
  const p = await fetch(api, { method: "PUT", headers, body: JSON.stringify(body) });
  if (!p.ok) {
    const j = await p.json().catch(() => ({}));
    if (p.status === 404) throw new Error("Нет доступа к репозиторию — у ключа должны быть права Contents: Read and write.");
    throw new Error("GitHub " + p.status + ": " + (j.message || "не удалось опубликовать"));
  }
  return (await p.json()).commit;
}

/* ---------- Media upload helpers ---------- */
async function ghUploadMedia(token, branch, path, base64) {
  const api = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${path}`;
  const headers = { Authorization: "Bearer " + token, Accept: "application/vnd.github+json", "Content-Type": "application/json" };
  let sha = null;
  const g = await fetch(`${api}?ref=${encodeURIComponent(branch)}`, { headers });
  if (g.status === 200) sha = (await g.json()).sha;
  else if (g.status === 401) throw new Error("Неверный ключ доступа");
  else if (g.status !== 404) throw new Error("GitHub: ошибка " + g.status);
  const body = { message: "Медиа: " + path.split("/").pop(), content: base64, branch };
  if (sha) body.sha = sha;
  const p = await fetch(api, { method: "PUT", headers, body: JSON.stringify(body) });
  if (!p.ok) {
    const j = await p.json().catch(() => ({}));
    throw new Error("GitHub " + p.status + ": " + (j.message || "ошибка загрузки"));
  }
  return await p.json();
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result.split(",")[1]);
    r.onerror = () => reject(new Error("Ошибка чтения файла"));
    r.readAsDataURL(file);
  });
}

function UploadSlot({ label, path, token, branch, accept = "image/jpeg,image/png,image/webp", hint, onSuccess, video }) {
  const [file, setFile] = React.useState(null);
  const [preview, setPreview] = React.useState(null);
  const [st, setSt] = React.useState(null);
  const [err, setErr] = React.useState(null);
  const [warn, setWarn] = React.useState(null);
  const [imgOk, setImgOk] = React.useState(true);
  const fmtMB = (b) => (b / 1024 / 1024).toFixed(1) + " МБ";

  function onFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setSt(null); setErr(null); setWarn(null);
    /* GitHub API не примет очень большие файлы; телефонные видео надо сжимать */
    if (f.size > 45 * 1024 * 1024) {
      setErr("Файл " + fmtMB(f.size) + " — слишком большой (макс. 45 МБ). Сожми видео перед загрузкой.");
      e.target.value = "";
      return;
    }
    if (video && f.size > 10 * 1024 * 1024) {
      setWarn("Видео " + fmtMB(f.size) + " — тяжёлое. Лучше сжать до MP4 (H.264), иначе на сайте возможны лаги и рассинхрон звука.");
    }
    if (video && !/\.mp4$/i.test(f.name)) {
      setWarn("Файл не .mp4 — на сайте может не воспроизвестись. Конвертируй в MP4 (H.264).");
    }
    setFile(f);
    const r = new FileReader();
    r.onload = () => setPreview(r.result);
    r.readAsDataURL(f);
    e.target.value = "";
  }

  async function upload() {
    if (!file || !preview) return;
    setSt("busy"); setErr(null);
    try {
      await ghUploadMedia(token, branch, path, preview.split(",")[1]);
      setSt("ok"); setFile(null); setPreview(null); setImgOk(true);
      if (onSuccess) onSuccess(path);
    } catch (e2) {
      setSt("err"); setErr(e2.message);
    }
  }

  return (
    <div className="mslot">
      <div className="mslot__label">{label}</div>
      <div className="mslot__code">{path}</div>
      <div className="mslot__thumb">
        {preview
          ? (video
              ? <video src={preview} className="mslot__img" controls muted playsInline />
              : <img src={preview} className="mslot__img" alt="" />)
          : imgOk
            ? (video
                ? <video src={path} className="mslot__img" controls muted playsInline preload="metadata" onError={() => setImgOk(false)} />
                : <img src={path} className="mslot__img" alt="" onError={() => setImgOk(false)} />)
            : <div className="mslot__empty">нет файла</div>
        }
      </div>
      <div className="mslot__row">
        <label className="abtn mslot__pick">
          {file ? (file.name.length > 18 ? file.name.slice(0, 16) + "…" : file.name) : "Выбрать файл"}
          <input type="file" accept={video ? "video/mp4,video/quicktime,video/*" : accept} onChange={onFile} style={{ display: "none" }} />
        </label>
        {file && (
          <button className="abtn abtn--primary" onClick={upload} disabled={st === "busy"}>
            {st === "busy" ? "Идёт…" : "↑ Загрузить"}
          </button>
        )}
      </div>
      {warn && <div className="mslot__status mslot__warn">⚠ {warn}</div>}
      {st === "ok" && <div className="mslot__status mslot__ok">✓ Загружено</div>}
      {st === "err" && <div className="mslot__status mslot__err">{err}</div>}
      {hint && <div className="mslot__hint">{hint}</div>}
    </div>
  );
}

/* ---------- tiny form helpers ---------- */
function F({ l, children, wide }) {
  return <label className={"af" + (wide ? " af--wide" : "")}><span>{l}</span>{children}</label>;
}
function TIn({ l, v, on, ph, wide }) {
  return <F l={l} wide={wide}><input value={v ?? ""} placeholder={ph || ""} onChange={(e) => on(e.target.value)} /></F>;
}
function NIn({ l, v, on, ph }) {
  return <F l={l}><input type="number" value={v ?? ""} placeholder={ph || ""} onChange={(e) => on(e.target.value === "" ? null : +e.target.value)} /></F>;
}
function Area({ l, v, on, rows = 3 }) {
  return <F l={l} wide><textarea rows={rows} value={v ?? ""} onChange={(e) => on(e.target.value)} /></F>;
}
function Sel({ l, v, on, opts }) {
  return (
    <F l={l}>
      <select value={v ?? ""} onChange={(e) => on(e.target.value)}>
        {opts.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </F>
  );
}
function Chk({ l, v, on }) {
  return (
    <label className="af af--chk">
      <input type="checkbox" checked={!!v} onChange={(e) => on(e.target.checked)} />
      <span>{l}</span>
    </label>
  );
}

/* ---------- initial state from current effective content ---------- */
function buildInitial() {
  const det = window.EA_UNI_DETAILS || {};
  const unis = (window.EA_UNIS_RAW || []).map((u) => {
    const d = det[u.short] || {};
    return { ...clone(u), about: d.about || "", founded: d.founded || "", students: d.students || "", site: d.site || "", reqTable: d.reqTable ? clone(d.reqTable) : null, programs: d.programs ? clone(d.programs) : [] };
  });
  const cdet = window.EA_COUNTRY_DETAILS || {};
  const countries = (window.EA_COUNTRY_CARDS || []).map((c) => ({
    card: clone(c),
    det: clone(cdet[c.name] || {}),
  }));
  return {
    unis,
    countries,
    storyCards: clone(window.EA_STORY_CARDS || []),
    storyGrid: clone(window.EA_STORY_GRID || []),
    videos: clone(window.EA_VIDEOS || []),
    posts: clone(window.EA_POSTS || []),
    about: clone(window.EA_ABOUT || { text: "", fcN: "", fcL: "", stats: [], badges: [] }),
    team: clone(window.EA_TEAM || { text: "", badges: [] }),
    office: clone(window.EA_OFFICE || {}),
    accreds: clone(window.EA_ACCREDS || []),
    texts: clone((window.eaContent && window.eaContent("texts", {})) || {}),
  };
}

/* ---------- state → publishable content object ---------- */
const UNI_CAT_KEYS = ["name", "short", "loc", "country", "qs", "price", "discount", "type", "field", "levels", "elite", "meritBased", "needBased", "intake", "engTests", "exams", "gpaMin"];
function buildContent(s) {
  const unis = s.unis.map((u) => {
    const o = {};
    UNI_CAT_KEYS.forEach((k) => { if (u[k] !== undefined && u[k] !== null && u[k] !== "" && u[k] !== false) o[k] = u[k]; });
    o.qs = (u.qs === "" || u.qs == null) ? null : +u.qs;
    o.price = +u.price || 0;
    o.flag = FLAGS[o.country] || "🌍";
    return o;
  });
  const uniDetails = {};
  s.unis.forEach((u) => {
    const d = {};
    if (u.about) d.about = u.about;
    if (u.founded) d.founded = isNaN(+u.founded) ? u.founded : +u.founded;
    if (u.students) d.students = u.students;
    if (u.site) d.site = u.site;
    if (u.reqTable) d.reqTable = u.reqTable;
    if (u.programs && u.programs.length) d.programs = u.programs;
    if (Object.keys(d).length) uniDetails[u.short] = d;
  });
  const countryCards = s.countries.map((c) => c.card);
  const countryDetails = {};
  s.countries.forEach((c) => { countryDetails[c.card.name] = c.det; });
  return {
    unis, uniDetails, countryCards, countryDetails,
    storyCards: s.storyCards, storyGrid: s.storyGrid,
    videos: s.videos, posts: s.posts,
    about: s.about, team: s.team, office: s.office, accreds: s.accreds,
    texts: s.texts || {},
  };
}

/* ============================================================
   LOGIN
   ============================================================ */
function Login({ onOk }) {
  const [p, setP] = useState("");
  const [err, setErr] = useState(false);
  async function submit(e) {
    e.preventDefault();
    if (await checkPass(p)) {
      try { sessionStorage.setItem(SESSION_KEY, "1"); } catch (e2) {}
      onOk();
    } else setErr(true);
  }
  return (
    <div className="alogin">
      <form className="alogin__card" onSubmit={submit}>
        <div className="alogin__logo">EA</div>
        <h1>Админ-панель</h1>
        <p>Elite Academy KG — управление контентом</p>
        <input type="password" autoFocus placeholder="Пароль" value={p}
               onChange={(e) => { setP(e.target.value); setErr(false); }} />
        {err && <div className="alogin__err">Неверный пароль</div>}
        <button type="submit" className="abtn abtn--primary abtn--block">Войти</button>
      </form>
    </div>
  );
}

/* ============================================================
   UNIVERSITIES EDITOR
   ============================================================ */
function UnisEditor({ list, setList, token, branch }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(null);
  const shown = useMemo(() => {
    const qq = q.toLowerCase();
    return list.map((u, i) => ({ u, i }))
      .filter(({ u }) => !qq || [u.name, u.short, u.loc, u.country].join(" ").toLowerCase().includes(qq));
  }, [list, q]);

  const upd = (i, k, v) => setList(list.map((u, j) => (j === i ? { ...u, [k]: v } : u)));
  const del = (i) => {
    if (!window.confirm(`Удалить «${list[i].name}»?`)) return;
    setList(list.filter((_, j) => j !== i));
    setSel(null);
  };
  const add = () => {
    const nu = { name: "Новый университет", short: "NEW" + (list.length + 1), loc: "", country: "США", qs: null, price: 10000, type: "Частный", field: "Business", levels: "Бакалавр · Магистр", about: "", founded: "", students: "", site: "" };
    setList([nu, ...list]);
    setSel(0); setQ("");
  };
  const u = sel != null ? list[sel] : null;
  const uSlug = u ? u.short.toLowerCase().replace(/[^a-z0-9]+/g, "") : "";
  const logoPath = (u && u.logo) || (uSlug ? `images/logos/catalog/${uSlug}.png` : "");

  return (
    <div className="asplit">
      <div className="alist">
        <div className="alist__top">
          <input className="alist__search" placeholder={`Поиск среди ${list.length} вузов…`} value={q} onChange={(e) => { setQ(e.target.value); }} />
          <button className="abtn abtn--primary" onClick={add}>+ Вуз</button>
        </div>
        <div className="alist__scroll">
          {shown.map(({ u: x, i }) => (
            <button key={i} className={"alist__row" + (sel === i ? " is-on" : "")} onClick={() => setSel(i)}>
              <span className="alist__flag">{FLAGS[x.country] || "🌍"}</span>
              <span className="alist__name">{x.name}</span>
              <span className="alist__meta">{x.loc}</span>
            </button>
          ))}
          {shown.length === 0 && <div className="alist__empty">Ничего не найдено</div>}
        </div>
      </div>

      {u ? (
        <div className="aform">
          <div className="aform__head">
            <h3>{u.name}</h3>
            <div className="aform__head-act">
              <a href={`university.html?u=${encodeURIComponent(u.short)}`} target="_blank" rel="noopener" className="abtn">Открыть страницу ↗</a>
              <button className="abtn abtn--danger" onClick={() => del(sel)}>Удалить</button>
            </div>
          </div>
          <div className="aform__grid">
            <TIn l="Название" v={u.name} on={(v) => upd(sel, "name", v)} wide />
            <TIn l="Код (ID, латиницей)" v={u.short} on={(v) => upd(sel, "short", v)} />
            <Sel l="Страна" v={u.country} on={(v) => upd(sel, "country", v)} opts={COUNTRY_OPTS} />
            <TIn l="Город" v={u.loc} on={(v) => upd(sel, "loc", v)} />
            <NIn l="QS рейтинг (пусто = нет)" v={u.qs} on={(v) => upd(sel, "qs", v)} />
            <NIn l="Контракт $/год" v={u.price} on={(v) => upd(sel, "price", v)} />
            <NIn l="Стипендия / скидка $ (пусто = нет)" v={u.discount} on={(v) => upd(sel, "discount", v)} />
            <Sel l="Тип" v={u.type} on={(v) => upd(sel, "type", v)} opts={TYPE_OPTS} />
            <Sel l="Направление" v={u.field} on={(v) => upd(sel, "field", v)} opts={FIELD_OPTS} />
            <TIn l="Уровни (через · )" v={u.levels} on={(v) => upd(sel, "levels", v)} ph="Бакалавр · Магистр" />
            <div className="aform__checks">
              <Chk l="★ Elite выбор" v={u.elite} on={(v) => upd(sel, "elite", v)} />
              <Chk l="Merit-стипендия" v={u.meritBased} on={(v) => upd(sel, "meritBased", v)} />
              <Chk l="Need-грант" v={u.needBased} on={(v) => upd(sel, "needBased", v)} />
            </div>
            <div className="aform__divider">Условия поступления</div>
            <TIn l="Начало обучения" v={u.intake} on={(v) => upd(sel, "intake", v)} ph="Осень / Весна" />
            <TIn l="Языковые тесты (через · )" v={u.engTests} on={(v) => upd(sel, "engTests", v)} ph="IELTS · TOEFL · Duolingo" />
            <TIn l="Вступит. экзамены" v={u.exams} on={(v) => upd(sel, "exams", v)} ph="без экзаменов" />
            <TIn l="Мин. GPA (пусто = нет)" v={u.gpaMin} on={(v) => upd(sel, "gpaMin", v)} ph="2.5" />

            <div className="aform__divider">Страница вуза (university.html)</div>
            <Area l="Описание (2–3 предложения)" v={u.about} on={(v) => upd(sel, "about", v)} rows={4} />
            <TIn l="Год основания" v={u.founded} on={(v) => upd(sel, "founded", v)} ph="1863" />
            <TIn l="Студентов" v={u.students} on={(v) => upd(sel, "students", v)} ph="≈47 000" />
            <TIn l="Официальный сайт" v={u.site} on={(v) => upd(sel, "site", v)} ph="polimi.it" />

            <div className="aform__divider">Программы поступления — карточки (страница вуза)</div>
            <div style={{ gridColumn: "1 / -1" }}>
              <ProgramsEditor programs={u.programs || []} onChange={(pr) => upd(sel, "programs", pr)} />
            </div>
          </div>
          <div className="aform__divider">Медиа</div>
          {token ? (
            <div>
              <div className="ahint" style={{ marginBottom: 12 }}>Логотип — PNG на прозрачном фоне, 300×300 px:</div>
              <div className="mgrid" style={{ marginBottom: 20 }}>
                <UploadSlot label="Логотип" path={logoPath} token={token} branch={branch} accept="image/png,image/webp,image/jpeg" />
                <UploadSlot label="Фото для каталога" path={"images/campus/" + uSlug + ".jpg"} token={token} branch={branch} hint="1400×900 px" />
              </div>
              <div className="ahint" style={{ marginBottom: 12 }}>Галерея на странице вуза — 4 фото, 1200×800 px:</div>
              <div className="mgrid" style={{ marginBottom: 16 }}>
                {["Кампус", "Корпуса", "Общежитие", "Студ. жизнь"].map((lbl, idx) => (
                  <UploadSlot key={idx} label={lbl} path={"images/unis/" + uSlug + "/" + (idx + 1) + ".jpg"} token={token} branch={branch} />
                ))}
              </div>
              <div className="ahint" style={{ marginBottom: 12 }}>Видео-тур по кампусу (MP4, H.264, до 45 МБ):</div>
              <div className="mgrid">
                <UploadSlot video label="Видео-тур" path={"videos/unis/" + uSlug + "/tour.mp4"} token={token} branch={branch} hint="Телефонное видео сначала сожми в MP4 (H.264)" />
              </div>
            </div>
          ) : (
            <div className="ahint">
              Лого: <code>{logoPath}</code><br />
              Фото: <code>images/unis/{uSlug}/1.jpg … 4.jpg</code><br />
              Видео: <code>videos/unis/{uSlug}/tour.mp4</code><br />
              Добавь GitHub token в разделе «⚙️ Публикация» чтобы загружать файлы отсюда.
            </div>
          )}
        </div>
      ) : (
        <div className="aform aform--empty">← Выбери вуз из списка или добавь новый</div>
      )}
    </div>
  );
}

/* ============================================================
   COUNTRIES EDITOR
   ============================================================ */
function CountriesEditor({ list, setList }) {
  const [sel, setSel] = useState(0);
  const c = list[sel];
  const updCard = (k, v) => setList(list.map((x, j) => (j === sel ? { ...x, card: { ...x.card, [k]: v } } : x)));
  const updDet = (k, v) => setList(list.map((x, j) => (j === sel ? { ...x, det: { ...x.det, [k]: v } } : x)));
  const updFact = (k, v) => updDet("facts", { ...(c.det.facts || {}), [k]: v });
  const updWhy = (i, k, v) => {
    const why = clone(c.det.why || []);
    why[i] = { ...why[i], [k]: v };
    updDet("why", why);
  };

  return (
    <div className="asplit">
      <div className="alist alist--narrow">
        <div className="alist__scroll">
          {list.map((x, i) => (
            <button key={x.card.name} className={"alist__row" + (sel === i ? " is-on" : "")} onClick={() => setSel(i)}>
              <span className="alist__flag">{x.card.flag}</span>
              <span className="alist__name">{x.card.name}</span>
            </button>
          ))}
        </div>
      </div>

      {c && (
        <div className="aform">
          <div className="aform__head">
            <h3>{c.card.flag} {c.card.name}</h3>
            <a href={`country.html?c=${encodeURIComponent(c.card.name)}`} target="_blank" rel="noopener" className="abtn">Открыть страницу ↗</a>
          </div>
          <div className="aform__grid">
            <div className="aform__divider">Карточка на главной</div>
            <TIn l="Города (ориентиры)" v={c.card.landmark} on={(v) => updCard("landmark", v)} wide />
            <TIn l="Подпись (3 слова)" v={c.card.desc} on={(v) => updCard("desc", v)} wide />
            <TIn l="Цена на карточке" v={c.card.price} on={(v) => updCard("price", v)} />
            <Chk l="🔥 Метка «Популярно»" v={c.card.hot} on={(v) => updCard("hot", v)} />

            <div className="aform__divider">Страница страны</div>
            <Area l="Слоган под названием" v={c.det.tagline} on={(v) => updDet("tagline", v)} rows={2} />
            {Object.entries(c.det.facts || {}).map(([k, v]) => (
              <TIn key={k} l={"Факт: " + k} v={v} on={(nv) => updFact(k, nv)} />
            ))}
            {(c.det.why || []).map((w, i) => (
              <div className="aform__sub" key={i}>
                <div className="aform__sub-h">Почему {c.card.name} — карточка {i + 1}</div>
                <div className="aform__grid aform__grid--inner">
                  <TIn l="Эмодзи" v={w.ic} on={(v) => updWhy(i, "ic", v)} />
                  <TIn l="Заголовок" v={w.t} on={(v) => updWhy(i, "t", v)} />
                  <Area l="Текст" v={w.d} on={(v) => updWhy(i, "d", v)} rows={2} />
                </div>
              </div>
            ))}
            <Area l="Об образовании" v={c.det.edu} on={(v) => updDet("edu", v)} rows={4} />
            <Area l="Туризм и жизнь" v={c.det.tourism} on={(v) => updDet("tourism", v)} rows={3} />
          </div>
          <div className="ahint">Фото галереи: <code>images/countries/{c.det.slug}/1.jpg … 4.jpg</code></div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   GENERIC LIST EDITOR (stories / videos / posts)
   ============================================================ */
function SimpleList({ list, setList, schema, titleKey, addTemplate, addLabel }) {
  const [sel, setSel] = useState(null);
  const upd = (i, k, v) => setList(list.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  const del = (i) => {
    if (!window.confirm("Удалить запись?")) return;
    setList(list.filter((_, j) => j !== i));
    setSel(null);
  };
  const add = () => { setList([clone(addTemplate), ...list]); setSel(0); };
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    setList(next);
    setSel(j);
  };
  const x = sel != null ? list[sel] : null;

  return (
    <div className="asplit">
      <div className="alist">
        <div className="alist__top">
          <span className="alist__count">{list.length} записей</span>
          <button className="abtn abtn--primary" onClick={add}>{addLabel}</button>
        </div>
        <div className="alist__scroll">
          {list.map((item, i) => (
            <button key={i} className={"alist__row" + (sel === i ? " is-on" : "")} onClick={() => setSel(i)}>
              <span className="alist__name">{item[titleKey] || "—"}</span>
            </button>
          ))}
        </div>
      </div>
      {x ? (
        <div className="aform">
          <div className="aform__head">
            <h3>{x[titleKey] || "Запись"}</h3>
            <div className="aform__head-act">
              <button className="abtn" onClick={() => move(sel, -1)}>↑</button>
              <button className="abtn" onClick={() => move(sel, 1)}>↓</button>
              <button className="abtn abtn--danger" onClick={() => del(sel)}>Удалить</button>
            </div>
          </div>
          <div className="aform__grid">
            {schema.map(([k, l, type, opts]) =>
              type === "area" ? <Area key={k} l={l} v={x[k]} on={(v) => upd(sel, k, v)} />
              : type === "select" ? <Sel key={k} l={l} v={x[k]} on={(v) => upd(sel, k, v)} opts={opts} />
              : <TIn key={k} l={l} v={x[k]} on={(v) => upd(sel, k, v)} />
            )}
          </div>
        </div>
      ) : (
        <div className="aform aform--empty">← Выбери запись или добавь новую</div>
      )}
    </div>
  );
}

/* ============================================================
   REQUIREMENTS TABLE EDITOR
   ============================================================ */
const REQ_LEVELS = [
  { key: "bachelor",   label: "Бакалавр" },
  { key: "master",     label: "Магистратура" },
  { key: "foundation", label: "Foundation" },
];

function reqAdminDefaultItems(u, levelKey) {
  if (levelKey === "bachelor") {
    return [
      { label: "Мин. GPA", value: u.gpaMin || "" },
      { label: "Языковой тест", value: (u.engTests && u.engTests.length) ? u.engTests.join(" / ") : "IELTS / TOEFL" },
      { label: "Образование", value: "11 лет" },
      { label: "Экзамены вуза", value: (u.exams && u.exams.length) ? u.exams.join(", ") : "Не требуются" },
    ];
  }
  if (levelKey === "master") {
    return [
      { label: "Мин. GPA", value: u.gpaMin || "" },
      { label: "Языковой тест", value: (u.engTests && u.engTests.length) ? u.engTests.join(" / ") : "IELTS / TOEFL" },
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

function ReqTableEditor({ u, onChange }) {
  const rt = u.reqTable || {};
  const enabled = rt.enabled || {};

  /* Default visibility derived from uni levels; admin can override per-column */
  const defaultOn = {
    bachelor:   (u.levels || "").includes("Бакалавр") || (u.levels || "").includes("Колледж"),
    master:     (u.levels || "").includes("Магистр"),
    foundation: (u.levels || "").includes("Foundation"),
  };
  const isOn = (key) => enabled[key] !== undefined ? enabled[key] : defaultOn[key];

  function items(levelKey) {
    if (rt[levelKey] && Array.isArray(rt[levelKey].items)) return rt[levelKey].items;
    return reqAdminDefaultItems(u, levelKey);
  }

  function setItems(levelKey, newItems) {
    const newRt = clone(rt);
    if (!newRt[levelKey]) newRt[levelKey] = {};
    newRt[levelKey].items = newItems;
    onChange(newRt);
  }

  function updItem(levelKey, idx, field, value) {
    const its = clone(items(levelKey));
    its[idx] = { ...its[idx], [field]: value };
    setItems(levelKey, its);
  }

  function addItem(levelKey) {
    const its = clone(items(levelKey));
    its.push({ label: "Новый пункт", value: "" });
    setItems(levelKey, its);
  }

  function removeItem(levelKey, idx) {
    const its = clone(items(levelKey));
    its.splice(idx, 1);
    setItems(levelKey, its);
  }

  function toggle(levelKey, on) {
    const newRt = clone(rt);
    newRt.enabled = { ...enabled, [levelKey]: on };
    onChange(newRt);
  }

  const activeLevels = REQ_LEVELS.filter(l => isOn(l.key));

  return (
    <div>
      <div className="ahint" style={{ marginBottom: 10 }}>
        Включай или выключай колонки таблицы поступления независимо от уровней вуза. В каждой колонке — свой набор пунктов, добавляй и убирай их кнопкой «+» / «✕».
      </div>
      <div className="req-editor__toggles">
        {REQ_LEVELS.map(lv => (
          <Chk key={lv.key} l={lv.label} v={isOn(lv.key)} on={(v) => toggle(lv.key, v)} />
        ))}
      </div>
      {!activeLevels.length && (
        <div className="ahint" style={{ marginTop: 10 }}>Все колонки выключены — таблица не будет показана на странице вуза.</div>
      )}
      <div className="req-editor">
        {activeLevels.map(lv => (
          <div className="req-editor__col" key={lv.key}>
            <div className="req-editor__head">{lv.label}</div>
            {items(lv.key).map((it, i) => (
              <div className="req-editor__item" key={i}>
                <input
                  className="req-editor__item-lbl"
                  value={it.label}
                  placeholder="Название пункта"
                  onChange={e => updItem(lv.key, i, "label", e.target.value)}
                />
                <input
                  className="req-editor__item-val"
                  value={it.value}
                  placeholder="Значение"
                  onChange={e => updItem(lv.key, i, "value", e.target.value)}
                />
                <button className="req-editor__item-rm" onClick={() => removeItem(lv.key, i)} title="Удалить пункт">✕</button>
              </div>
            ))}
            <button className="req-editor__add" onClick={() => addItem(lv.key)}>+ Добавить пункт</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   PROGRAM CARDS EDITOR — horizontal cards (bachelor / master)
   ============================================================ */
const PROG_LEVELS = [
  { key: "bachelor", label: "Бакалавр (белая карточка)" },
  { key: "master",   label: "Магистр (синяя карточка)" },
];

function newProgram() {
  return {
    level: "bachelor", title: "Новая программа", location: "", institution: "", established: "",
    tags: [], tuition: "", funding: "", paidEducation: "", language: "English",
    studyPlan: "", about: "", entrance: "", requirements: [], deadlines: [],
  };
}

function ProgramsEditor({ programs, onChange }) {
  const list = programs || [];
  const [openIdx, setOpenIdx] = React.useState(null);
  const [filter, setFilter] = React.useState("all");
  const [q, setQ] = React.useState("");

  const upd = (i, k, v) => onChange(list.map((p, j) => (j === i ? { ...p, [k]: v } : p)));
  const add = () => { onChange([...list, newProgram()]); setOpenIdx(list.length); setFilter("all"); setQ(""); };
  const del = (i) => { if (window.confirm("Удалить программу-карточку?")) { onChange(list.filter((_, j) => j !== i)); setOpenIdx(null); } };
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setOpenIdx((cur) => (cur === i ? j : cur === j ? i : cur));
  };
  /* array<->textarea helpers */
  const toText = (v) => Array.isArray(v) ? v.join("\n") : (v || "");
  const toArr = (s) => s.split("\n").map((x) => x.replace(/\s+$/, "")).filter((x) => x.trim() !== "");
  const tagsText = (v) => Array.isArray(v) ? v.join(", ") : (v || "");
  const tagsArr = (s) => s.split(",").map((x) => x.trim()).filter(Boolean);

  const isBach = (p) => (p.level || "bachelor") !== "master";
  const counts = {
    all: list.length,
    bachelor: list.filter(isBach).length,
    master: list.filter((p) => !isBach(p)).length,
  };
  const rows = list
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => {
      if (filter === "bachelor" && !isBach(p)) return false;
      if (filter === "master" && isBach(p)) return false;
      if (q && !((p.title || "") + " " + (p.location || "")).toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });

  const FILTERS = [["all", "Все"], ["bachelor", "Бакалавр"], ["master", "Магистр"]];

  return (
    <div>
      <div className="ahint" style={{ marginBottom: 12 }}>
        Каждая карточка — отдельная программа (направление). <b>Бакалавр</b> = белая, <b>Магистр</b> = синяя.
        Кликни по строке, чтобы раскрыть и редактировать. В «Требованиях» и «Дедлайнах» каждая строка — отдельный
        пункт; строку, начинающуюся с<code> # </code>, покажем как жирный подзаголовок (например «# First intake»).
      </div>

      <div className="progtool">
        <input className="alist__search" placeholder="Поиск по названию или городу…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="progtool__filters">
          {FILTERS.map(([k, l]) => (
            <button key={k} className={"progchip" + (filter === k ? " is-on" : "")} onClick={() => setFilter(k)}>
              {l} <span>{counts[k]}</span>
            </button>
          ))}
        </div>
        <button className="abtn abtn--primary" onClick={add}>+ Программа</button>
      </div>

      {list.length === 0 && (
        <div className="ahint" style={{ marginBottom: 10 }}>Пока нет программ. Если ничего не добавить — на странице покажутся авто-карточки, собранные из данных вуза (уровни, GPA, языковые тесты, набор). Добавь программу, чтобы задать точный текст.</div>
      )}

      {rows.map(({ p, i }) => {
        const bach = isBach(p);
        const open = openIdx === i;
        return (
          <div className={"progrow" + (open ? " is-open" : "")} key={i}>
            <div className="progrow__head" onClick={() => setOpenIdx(open ? null : i)}>
              <span className={"progrow__dot progrow__dot--" + (bach ? "bachelor" : "master")}></span>
              <span className="progrow__title">{p.title || "Без названия"}</span>
              {p.location && <span className="progrow__loc">📍 {p.location}</span>}
              <span className="progrow__lvl">{bach ? "Бакалавр" : "Магистр"}</span>
              <span className="progrow__ctl" onClick={(e) => e.stopPropagation()}>
                <button className="abtn" onClick={() => move(i, -1)} title="Выше">↑</button>
                <button className="abtn" onClick={() => move(i, 1)} title="Ниже">↓</button>
                <button className="abtn abtn--danger" onClick={() => del(i)} title="Удалить">✕</button>
              </span>
              <span className="progrow__chev">{open ? "▲" : "▼"}</span>
            </div>
            {open && (
              <div className="progrow__body">
                <div className="aform__grid aform__grid--inner">
                  <Sel l="Уровень (цвет карточки)" v={p.level} on={(v) => upd(i, "level", v)} opts={PROG_LEVELS.map((x) => x.key)} />
                  <TIn l="Название программы (англ.)" v={p.title} on={(v) => upd(i, "title", v)} ph="Business & Economics" />
                  <TIn l="Кампус / город" v={p.location} on={(v) => upd(i, "location", v)} ph="Bologna" />
                  <TIn l="Институт (пусто = имя вуза)" v={p.institution} on={(v) => upd(i, "institution", v)} ph="University of Bologna" />
                  <TIn l="Год основания (пусто = у вуза)" v={p.established} on={(v) => upd(i, "established", v)} ph="1088" />
                  <TIn l="Теги (через запятую)" v={tagsText(p.tags)} on={(v) => upd(i, "tags", tagsArr(v))} ph="Economics, Business" wide />
                  <TIn l="Стоимость / год (пусто = цена вуза)" v={p.tuition} on={(v) => upd(i, "tuition", v)} ph="3 000 € / year" />
                  <TIn l="Финансирование" v={p.funding} on={(v) => upd(i, "funding", v)} ph="Merit scholarship" />
                  <TIn l="Если платно (IF PAID EDUCATION)" v={p.paidEducation} on={(v) => upd(i, "paidEducation", v)} ph="906 €" />
                  <TIn l="Язык обучения" v={p.language} on={(v) => upd(i, "language", v)} ph="English" />
                  <TIn l="Ссылка «Study plan»" v={p.studyPlan} on={(v) => upd(i, "studyPlan", v)} ph="https://…" wide />
                  <Area l="Об программе (About program)" v={p.about} on={(v) => upd(i, "about", v)} rows={3} />
                  <TIn l="Вступление (ENTRANCE)" v={p.entrance} on={(v) => upd(i, "entrance", v)} ph="Digital SAT · English B2" wide />
                  <Area l="Требования (Requirements) — по строке на пункт" v={toText(p.requirements)} on={(v) => upd(i, "requirements", toArr(v))} rows={6} />
                  <Area l="Дедлайны (Submission deadlines) — по строке на пункт" v={toText(p.deadlines)} on={(v) => upd(i, "deadlines", toArr(v))} rows={8} />
                </div>
              </div>
            )}
          </div>
        );
      })}

      {rows.length === 0 && list.length > 0 && (
        <div className="ahint" style={{ marginBottom: 10 }}>Ничего не найдено по этому фильтру.</div>
      )}

      <button className="abtn abtn--primary" onClick={add} style={{ marginTop: 10 }}>+ Добавить программу</button>
    </div>
  );
}

/* ============================================================
   SITE TEXTS EDITOR — every heading/label registered in texts.js
   ============================================================ */
function TextsEditor({ texts, setTexts }) {
  const schema = window.EA_TEXT_SCHEMA || [];
  const DEF = window.EA_TEXT_DEFAULTS || {};
  const upd = (k, v) => {
    const next = { ...texts };
    if (v === "" || v === DEF[k]) delete next[k];   // пусто/как стандарт — без правки
    else next[k] = v;
    setTexts(next);
  };
  const changed = Object.keys(texts || {}).length;
  return (
    <div className="aform" style={{ maxWidth: 900 }}>
      <div className="aform__head">
        <h3>📝 Тексты сайта</h3>
        {changed > 0 && <span className="atop__draft">изменено: {changed}</span>}
      </div>
      <div className="ahint" style={{ marginBottom: 6 }}>
        Здесь все заголовки и подписи разделов. Пустое поле = стандартный текст (показан серым).
        Перенос строки в длинных полях = перенос строки на сайте.
      </div>
      {schema.map((g) => (
        <div key={g.group}>
          <div className="aform__divider">{g.group}</div>
          <div className="aform__grid">
            {g.items.map((it) => {
              const cur = (texts || {})[it.k];
              const val = cur !== undefined ? cur : "";
              return it.area ? (
                <F key={it.k} l={it.l} wide>
                  <textarea rows={3} value={val} placeholder={DEF[it.k]} onChange={(e) => upd(it.k, e.target.value)} />
                </F>
              ) : (
                <F key={it.k} l={it.l} wide>
                  <input value={val} placeholder={DEF[it.k]} onChange={(e) => upd(it.k, e.target.value)} />
                </F>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */
const SECTIONS = [
  ["texts", "📝 Тексты"],
  ["unis", "🎓 Вузы"],
  ["countries", "🌍 Страны"],
  ["stories", "💬 Истории"],
  ["videos", "🎬 Видео-отзывы"],
  ["posts", "📰 Блог"],
  ["about", "ℹ️ О нас"],
  ["media", "📸 Медиа"],
  ["publish", "⚙️ Публикация"],
];

/* ============================================================
   ABOUT PAGE EDITOR
   ============================================================ */
function AboutEditor({ about, setAbout, team, setTeam, office, setOffice }) {
  const updA = (k, v) => setAbout({ ...about, [k]: v });
  const updT = (k, v) => setTeam({ ...team, [k]: v });
  const updO = (k, v) => setOffice({ ...office, [k]: v });
  const updStat = (i, k, v) => {
    const stats = clone(about.stats || []);
    stats[i] = { ...stats[i], [k]: v };
    updA("stats", stats);
  };
  return (
    <div className="aform" style={{ maxWidth: 860 }}>
      <div className="aform__head">
        <h3>Страница «О нас»</h3>
        <a href="about.html" target="_blank" rel="noopener" className="abtn">Открыть страницу ↗</a>
      </div>
      <div className="aform__grid">
        <div className="aform__divider">Блок «О нас» (также на главной)</div>
        <Area l="Текст о компании" v={about.text} on={(v) => updA("text", v)} rows={4} />
        <TIn l="Фото «О нас» (путь к файлу)" v={about.photo || ""} on={(v) => updA("photo", v)} ph="images/team.jpg" wide />
        <TIn l="Цифра на фото" v={about.fcN} on={(v) => updA("fcN", v)} ph="1500+" />
        <TIn l="Подпись к цифре" v={about.fcL} on={(v) => updA("fcL", v)} />
        {(about.stats || []).map((s, i) => (
          <div className="aform__sub" key={i}>
            <div className="aform__sub-h">Статистика {i + 1}</div>
            <div className="aform__grid aform__grid--inner">
              <TIn l="Цифра" v={s.n} on={(v) => updStat(i, "n", v)} />
              <TIn l="Подпись" v={(s.l || "").replace(/\n/g, " ")} on={(v) => updStat(i, "l", v)} />
            </div>
          </div>
        ))}
        <Area l="Бейджи доверия (по одному в строке)" v={(about.badges || []).join("\n")}
              on={(v) => updA("badges", v.split("\n").filter(Boolean))} rows={3} />

        <div className="aform__divider">Команда — «Мы сами прошли этот путь»</div>
        <Area l="Текст о команде" v={team.text} on={(v) => updT("text", v)} rows={4} />
        <Area l="Бейджи (по одному в строке)" v={(team.badges || []).join("\n")}
              on={(v) => updT("badges", v.split("\n").filter(Boolean))} rows={3} />
        <TIn l="Фото команды (путь к файлу)" v={team.photo || ""} on={(v) => updT("photo", v)} ph="images/team.jpg" wide />

        <div className="aform__divider">Офис и контакты</div>
        <TIn l="Рейтинг" v={office.rating} on={(v) => updO("rating", v)} ph="4.8" />
        <TIn l="Подпись рейтинга" v={office.reviews} on={(v) => updO("reviews", v)} ph="214 отзывов на 2GIS" />
        <TIn l="Адрес" v={office.address} on={(v) => updO("address", v)} wide />
        <TIn l="График работы" v={office.hours} on={(v) => updO("hours", v)} wide />
        <TIn l="Телефон / WhatsApp" v={office.phone} on={(v) => updO("phone", v)} />
        <TIn l="Email" v={office.email} on={(v) => updO("email", v)} />
        <TIn l="Instagram" v={office.instagram} on={(v) => updO("instagram", v)} ph="@eliteacademy.kg" />
        <TIn l="Адрес для Google Maps" v={office.map} on={(v) => updO("map", v)} />
      </div>
    </div>
  );
}

/* ============================================================
   PUBLISH SETTINGS
   ============================================================ */
function PublishSettings({ token, setToken, branch, setBranch, onExport }) {
  return (
    <div className="aform" style={{ maxWidth: 720 }}>
      <div className="aform__head"><h3>⚙️ Настройка публикации</h3></div>
      <div className="aform__grid">
        <div className="aform__divider">Публикация в один клик (GitHub)</div>
        <F l="Ключ доступа (GitHub token)" wide>
          <input type="password" value={token} placeholder="github_pat_…"
                 onChange={(e) => setToken(e.target.value)} />
        </F>
        <Sel l="Ветка" v={branch} on={setBranch} opts={["for-public", "dev", "main"]} />
        <div className="ahint" style={{ gridColumn: "1 / -1", marginTop: 0 }}>
          Ключ хранится только в этом браузере. Относись к нему как к паролю.
        </div>
        <div className="aform__sub">
          <div className="aform__sub-h">Как получить ключ (делается один раз, ~3 минуты)</div>
          <ol className="asteps">
            <li>Зайди на <b>github.com</b> под аккаунтом, у которого есть доступ к репозиторию <b>{GH_OWNER}/{GH_REPO}</b></li>
            <li>Settings → Developer settings → <b>Personal access tokens → Fine-grained tokens</b> → Generate new token</li>
            <li>Repository access: <b>Only select repositories</b> → выбери <b>{GH_REPO}</b></li>
            <li>Permissions → Repository permissions → <b>Contents: Read and write</b></li>
            <li>Generate token → скопируй и вставь в поле выше</li>
          </ol>
        </div>
        <div className="aform__divider">Запасной вариант — файлом</div>
        <div style={{ gridColumn: "1 / -1" }}>
          <button className="abtn" onClick={onExport}>⬇ Экспортировать content-data.js</button>
          <div className="ahint" style={{ marginTop: 10 }}>
            Скачанный файл нужно положить в папку <code>elite/</code> сайта вместо старого.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MEDIA EDITOR — upload photos for all sections via GitHub API
   ============================================================ */
function MediaEditor({ token, branch, state, setPosts, setStoryGrid, setStoryCards, setVideos, setSection }) {
  const [tab, setTab] = React.useState("team");
  const [cSel, setCSel] = React.useState(0);
  const [uQ, setUQ] = React.useState("");
  const [uSel, setUSel] = React.useState(null);

  const TABS = [
    ["team",      "Команда"],
    ["countries", "Страны"],
    ["unis",      "Вузы"],
    ["students",  "Студенты"],
    ["videos",    "Видео-отзывы"],
    ["blog",      "Блог"],
  ];
  /* slug для имени файла: латиница/цифры из имени, кириллица как есть */
  const nameSlug = (n) => String(n || "video").trim().toLowerCase().replace(/\s+/g, "-");

  const uSlug = (u) => u.short.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const filteredUnis = React.useMemo(() => {
    const q = uQ.toLowerCase();
    return state.unis
      .map((u, i) => ({ u, i }))
      .filter(({ u }) => !q || u.name.toLowerCase().includes(q) || u.short.toLowerCase().includes(q));
  }, [state.unis, uQ]);
  const selUni = uSel != null ? state.unis[uSel] : null;

  const cList = state.countries;
  const selC = cList[cSel] || null;
  const cSlug = selC
    ? (selC.det && selC.det.slug) || selC.card.name.toLowerCase().replace(/[ёе]/g, "e").replace(/[^a-z0-9]+/g, "")
    : "";

  if (!token) {
    return (
      <div className="aform" style={{ maxWidth: 600 }}>
        <div className="aform__head"><h3>📸 Медиа</h3></div>
        <p style={{ padding: "16px 0", color: "var(--muted)", fontSize: 14 }}>
          Для загрузки файлов нужен GitHub token.{" "}
          <button className="abtn" style={{ marginLeft: 8 }} onClick={() => setSection("publish")}>
            Открыть настройки публикации →
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="aform" style={{ maxWidth: 1000 }}>
      <div className="aform__head"><h3>📸 Медиа — загрузка фото</h3></div>

      <div className="mtabs">
        {TABS.map(([k, l]) => (
          <button key={k} className={"mtab" + (tab === k ? " is-on" : "")} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {/* Команда */}
      {tab === "team" && (
        <div>
          <div className="ahint" style={{ marginBottom: 16 }}>
            Фото команды используется в hero-секции главной страницы и на страницах «О нас» и «Истории».
            Рекомендуемый размер: 1400 × 900 px, JPG.
          </div>
          <div className="mgrid">
            <UploadSlot label="Фото команды" path="images/team.jpg" token={token} branch={branch} />
          </div>
        </div>
      )}

      {/* Страны */}
      {tab === "countries" && (
        <div>
          <div className="mselector">
            {cList.map((c, i) => (
              <button key={i} className={"mchip" + (cSel === i ? " is-on" : "")} onClick={() => setCSel(i)}>
                {c.card.flag} {c.card.name}
              </button>
            ))}
          </div>
          {selC && (
            <div>
              <div className="ahint" style={{ marginBottom: 16 }}>
                Папка: <code>images/countries/{cSlug}/</code> · 4 фото галереи (1.jpg … 4.jpg) · Размер: 1200 × 800 px.
              </div>
              <div className="mgrid">
                {[1, 2, 3, 4].map((n) => (
                  <UploadSlot
                    key={n}
                    label={"Фото " + n}
                    path={"images/countries/" + cSlug + "/" + n + ".jpg"}
                    token={token} branch={branch}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Вузы */}
      {tab === "unis" && (
        <div className="asplit">
          <div className="alist">
            <div className="alist__top">
              <input className="alist__search" placeholder="Поиск вуза…" value={uQ} onChange={(e) => setUQ(e.target.value)} />
            </div>
            <div className="alist__scroll">
              {filteredUnis.map(({ u, i }) => (
                <button key={i} className={"alist__row" + (uSel === i ? " is-on" : "")} onClick={() => setUSel(i)}>
                  <span className="alist__flag">{FLAGS[u.country] || "🌍"}</span>
                  <span className="alist__name">{u.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            {selUni ? (
              <div>
                <div className="aform__divider" style={{ marginTop: 0 }}>
                  {selUni.name}
                </div>
                <div className="ahint" style={{ marginBottom: 12 }}>
                  Главное фото в каталоге — отображается на карточке и в шапке страницы вуза.
                </div>
                <div className="mgrid" style={{ marginBottom: 20 }}>
                  <UploadSlot
                    label="Фото для каталога"
                    path={"images/campus/" + uSlug(selUni) + ".jpg"}
                    token={token} branch={branch}
                    hint="images/campus/<slug>.jpg · 1400×900 px"
                  />
                </div>
                <div className="ahint" style={{ marginBottom: 12 }}>
                  Галерея на странице вуза — 4 фото, 1200×800 px:
                </div>
                <div className="mgrid">
                  {["Кампус", "Корпуса", "Общежитие", "Студ. жизнь"].map((lbl, idx) => (
                    <UploadSlot
                      key={idx}
                      label={lbl}
                      path={"images/unis/" + uSlug(selUni) + "/" + (idx + 1) + ".jpg"}
                      token={token} branch={branch}
                    />
                  ))}
                </div>
                <div className="ahint" style={{ marginTop: 14 }}>
                  Видео-тур: загружай напрямую в репозиторий GitHub →{" "}
                  <code>videos/unis/{uSlug(selUni)}/tour.mp4</code>
                </div>
              </div>
            ) : (
              <div className="aform--empty">← Выбери вуз из списка</div>
            )}
          </div>
        </div>
      )}

      {/* Студенты */}
      {tab === "students" && (
        <div>
          <div className="ahint" style={{ marginBottom: 16 }}>
            У каждого студента — превью-фото (400×400, JPG) и видео (MP4, H.264).
            После загрузки путь к файлу сам записывается в карточку — нажми «💾 Сохранить» вверху.<br />
            <b>Видео с телефона перед загрузкой сожми в MP4 (H.264)</b> — иначе на сайте будут лаги и звук разойдётся с картинкой.
          </div>
          <div className="mgrid">
            {state.storyGrid.map((g, i) => {
              const posterPath = g.poster || ("thumbs/" + nameSlug(g.n) + ".jpg");
              const videoPath = g.video || ("videos/" + nameSlug(g.n) + ".mp4");
              return (
                <React.Fragment key={i}>
                  <UploadSlot
                    label={g.n + " · фото"}
                    path={posterPath}
                    token={token} branch={branch}
                    onSuccess={(p) => setStoryGrid(state.storyGrid.map((x, j) => j === i ? { ...x, poster: p } : x))}
                  />
                  <UploadSlot
                    video
                    label={g.n + " · видео"}
                    path={videoPath}
                    token={token} branch={branch}
                    onSuccess={(p) => setStoryGrid(state.storyGrid.map((x, j) => j === i ? { ...x, video: p } : x))}
                  />
                </React.Fragment>
              );
            })}
          </div>
          <div className="aform__divider" style={{ marginTop: 24 }}>Карусель больших историй</div>
          <div className="mgrid">
            {state.storyCards.map((s, i) => {
              const posterPath = s.poster || ("thumbs/" + nameSlug(s.name) + ".jpg");
              const videoPath = s.videoSrc || ("videos/" + nameSlug(s.name) + ".mp4");
              return (
                <React.Fragment key={i}>
                  <UploadSlot
                    label={s.name + " · фото"}
                    path={posterPath}
                    token={token} branch={branch}
                    onSuccess={(p) => setStoryCards(state.storyCards.map((x, j) => j === i ? { ...x, poster: p } : x))}
                  />
                  <UploadSlot
                    video
                    label={s.name + " · видео"}
                    path={videoPath}
                    token={token} branch={branch}
                    onSuccess={(p) => setStoryCards(state.storyCards.map((x, j) => j === i ? { ...x, videoSrc: p } : x))}
                  />
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Видео-отзывы (лента на главной) */}
      {tab === "videos" && (
        <div>
          <div className="ahint" style={{ marginBottom: 16 }}>
            Видео-отзывы из ленты на главной. Формат: MP4 (H.264), вертикальное 9:16, до 45 МБ.
            Путь после загрузки сам записывается в карточку — нажми «💾 Сохранить» вверху.<br />
            <b>Видео с телефона перед загрузкой сожми</b> — иначе возможны лаги и рассинхрон звука.
          </div>
          <div className="mgrid">
            {state.videos.map((v, i) => {
              const posterPath = v.poster || ("thumbs/" + nameSlug(v.name) + ".jpg");
              const videoPath = v.src || ("videos/" + nameSlug(v.name) + ".mp4");
              return (
                <React.Fragment key={i}>
                  <UploadSlot
                    label={v.name + " · превью"}
                    path={posterPath}
                    token={token} branch={branch}
                    onSuccess={(p) => setVideos(state.videos.map((x, j) => j === i ? { ...x, poster: p } : x))}
                  />
                  <UploadSlot
                    video
                    label={v.name + " · видео"}
                    path={videoPath}
                    token={token} branch={branch}
                    onSuccess={(p) => setVideos(state.videos.map((x, j) => j === i ? { ...x, src: p } : x))}
                  />
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Блог */}
      {tab === "blog" && (
        <div>
          <div className="ahint" style={{ marginBottom: 16 }}>
            Обложки статей блога. Размер: 800 × 480 px, JPG.<br />
            После загрузки нажми <b>«💾 Сохранить»</b> вверху — путь к обложке запишется в данные статьи.
          </div>
          <div className="mgrid">
            {state.posts.map((p, i) => {
              const coverPath = p.cover || ("images/blog/" + (i + 1) + ".jpg");
              return (
                <UploadSlot
                  key={i}
                  label={p.t || "Статья " + (i + 1)}
                  path={coverPath}
                  token={token} branch={branch}
                  onSuccess={(path) => {
                    const updated = state.posts.map((pp, j) => j === i ? { ...pp, cover: path } : pp);
                    setPosts(updated);
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function AdminApp() {
  const [authed, setAuthed] = useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY) === "1"; } catch (e) { return false; }
  });
  const [state, setState] = useState(buildInitial);
  const [section, setSection] = useState("unis");
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const hasDraft = useMemo(() => { try { return !!localStorage.getItem(LS_KEY); } catch (e) { return false; } }, [savedAt]);
  const [ghToken, setGhTokenState] = useState(() => { try { return localStorage.getItem(GH_TOKEN_KEY) || ""; } catch (e) { return ""; } });
  const [ghBranch, setGhBranchState] = useState(() => { try { return localStorage.getItem(GH_BRANCH_KEY) || "for-public"; } catch (e) { return "for-public"; } });
  const [pub, setPub] = useState({ busy: false, ok: null, err: null });
  const setGhToken = (v) => { setGhTokenState(v); try { localStorage.setItem(GH_TOKEN_KEY, v); } catch (e) {} };
  const setGhBranch = (v) => { setGhBranchState(v); try { localStorage.setItem(GH_BRANCH_KEY, v); } catch (e) {} };

  const set = (k) => (v) => { setState((s) => ({ ...s, [k]: v })); setDirty(true); };
  const setCountries = (v) => { setState((s) => ({ ...s, countries: v })); setDirty(true); };

  function save() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(buildContent(state)));
      setDirty(false);
      setSavedAt(Date.now());
    } catch (e) { alert("Не удалось сохранить: " + e.message); }
  }

  async function publish() {
    if (!ghToken) {
      setSection("publish");
      setPub({ busy: false, ok: null, err: "Сначала вставь ключ доступа GitHub — инструкция ниже." });
      return;
    }
    if (!window.confirm(`Опубликовать изменения для всех? (репозиторий ${GH_OWNER}/${GH_REPO}, ветка ${ghBranch})`)) return;
    save();
    setPub({ busy: true, ok: null, err: null });
    try {
      const commit = await ghPublish(ghToken, ghBranch, contentFileText(buildContent(state)));
      setPub({ busy: false, ok: "Опубликовано ✓ (" + (commit && commit.sha ? commit.sha.slice(0, 7) : "ok") + ")", err: null });
    } catch (e) {
      setPub({ busy: false, ok: null, err: e.message });
    }
  }

  function exportFile() {
    const txt = contentFileText(buildContent(state));
    const blob = new Blob([txt], { type: "text/javascript;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "content-data.js";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function reset() {
    if (!window.confirm("Удалить все локальные правки и вернуться к опубликованной версии?")) return;
    try { localStorage.removeItem(LS_KEY); } catch (e) {}
    location.reload();
  }

  function logout() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
    setAuthed(false);
  }

  useEffect(() => {
    const onBeforeUnload = (e) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  if (!authed) return <Login onOk={() => setAuthed(true)} />;

  return (
    <div className="admin">
      <header className="atop">
        <div className="atop__brand">
          <span className="alogin__logo alogin__logo--sm">EA</span>
          <b>Админ-панель</b>
          {hasDraft && <span className="atop__draft">● локальные правки активны</span>}
          {dirty && <span className="atop__dirty">несохранённые изменения</span>}
        </div>
        <div className="atop__act">
          <a href="index.html" target="_blank" rel="noopener" className="abtn">Открыть сайт ↗</a>
          <button className="abtn" onClick={reset}>↺ Сбросить правки</button>
          <button className="abtn abtn--primary" onClick={save}>💾 Сохранить</button>
          <button className="abtn abtn--gold" onClick={publish} disabled={pub.busy}>
            {pub.busy ? "Публикуем…" : "🚀 Опубликовать"}
          </button>
          <button className="abtn" onClick={logout}>Выйти</button>
        </div>
      </header>
      {(pub.ok || pub.err) && (
        <div className={"apub " + (pub.err ? "apub--err" : "apub--ok")}>
          {pub.ok || pub.err}
          <button className="apub__x" onClick={() => setPub({ busy: false, ok: null, err: null })}>✕</button>
        </div>
      )}

      <div className="abody">
        <nav className="aside">
          {SECTIONS.map(([k, l]) => (
            <button key={k} className={"aside__item" + (section === k ? " is-on" : "")} onClick={() => setSection(k)}>{l}</button>
          ))}
          <div className="aside__help">
            <b>Как это работает</b>
            <ol>
              <li>Правишь контент</li>
              <li>«Сохранить» — предпросмотр на сайте в этом браузере</li>
              <li>«Опубликовать» — правки уходят в репозиторий и попадают на сайт</li>
            </ol>
          </div>
        </nav>

        <main className="amain">
          {section === "texts" && <TextsEditor texts={state.texts} setTexts={set("texts")} />}
          {section === "unis" && <UnisEditor list={state.unis} setList={set("unis")} token={ghToken} branch={ghBranch} />}
          {section === "countries" && <CountriesEditor list={state.countries} setList={setCountries} />}
          {section === "stories" && (
            <>
              <div className="amain__note">Карусель больших историй (главная и «Истории»). Ниже — сетка студентов.</div>
              <SimpleList
                list={state.storyCards} setList={set("storyCards")} titleKey="name" addLabel="+ История"
                addTemplate={{ name: "Имя", from: "🇺🇸 США", quote: "", uni: "🎓 Университет", videoSrc: "videos/имя.mp4", poster: "thumbs/имя.jpg" }}
                schema={[["name", "Имя"], ["from", "Страна (с флагом)"], ["quote", "Цитата", "area"], ["uni", "Подпись вуза"], ["videoSrc", "Путь к видео"], ["poster", "Путь к превью"]]}
              />
              <div className="amain__note" style={{ marginTop: 26 }}>Сетка студентов (фильтруется по стране):</div>
              <SimpleList
                list={state.storyGrid} setList={set("storyGrid")} titleKey="n" addLabel="+ Студент"
                addTemplate={{ n: "Имя", u: "Университет", s: "Грант", t: "Италия", video: "", poster: "" }}
                schema={[["n", "Имя"], ["u", "Университет"], ["s", "Сумма / грант"], ["t", "Страна (для фильтра)", "select", COUNTRY_OPTS], ["video", "Путь к видео (videos/…)"], ["poster", "Путь к превью (thumbs/…)"]]}
              />
            </>
          )}
          {section === "videos" && (
            <SimpleList
              list={state.videos} setList={set("videos")} titleKey="name" addLabel="+ Видео"
              addTemplate={{ name: "Имя", country: "🇺🇸 США", src: "videos/имя.mp4", poster: "thumbs/имя.jpg", tag: "Отзыв" }}
              schema={[["name", "Имя"], ["country", "Страна (с флагом)"], ["src", "Путь к видео (videos/…)"], ["poster", "Путь к превью (thumbs/…)"], ["tag", "Метка", "select", ["Отзыв", "Интервью"]]]}
            />
          )}
          {section === "posts" && (
            <SimpleList
              list={state.posts} setList={set("posts")} titleKey="t" addLabel="+ Статья"
              addTemplate={{ cat: "США", t: "Заголовок статьи", time: "5 мин", date: "", cover: "" }}
              schema={[["t", "Заголовок"], ["cat", "Категория"], ["time", "Время чтения"], ["date", "Дата (текстом)"], ["cover", "Обложка (путь к файлу)"]]}
            />
          )}
          {section === "about" && (
            <>
              <AboutEditor
                about={state.about} setAbout={set("about")}
                team={state.team} setTeam={set("team")}
                office={state.office} setOffice={set("office")}
              />
              <div className="amain__note" style={{ marginTop: 26 }}>Карточки «Аккредитации и партнёры»:</div>
              <SimpleList
                list={state.accreds} setList={set("accreds")} titleKey="name" addLabel="+ Карточка"
                addTemplate={{ name: "Название", tag: "Партнёрство", desc: "" }}
                schema={[["name", "Название"], ["tag", "Метка"], ["desc", "Описание", "area"]]}
              />
            </>
          )}
          {section === "media" && (
            <MediaEditor
              token={ghToken} branch={ghBranch} state={state}
              setPosts={set("posts")} setStoryGrid={set("storyGrid")} setStoryCards={set("storyCards")} setVideos={set("videos")}
              setSection={setSection}
            />
          )}
          {section === "publish" && (
            <PublishSettings token={ghToken} setToken={setGhToken} branch={ghBranch} setBranch={setGhBranch} onExport={exportFile} />
          )}
        </main>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AdminApp />);
