/* ============================================================
   AUTH GATE — login wall for the dev/internal site
   Credentials are stored as a SHA-256 hash (never plain text).
   Session is kept in sessionStorage — clears on tab/browser close.
   ============================================================ */

const AUTH_KEY  = "ea_dev_auth";        // sessionStorage key
const AUTH_HASH = "6a294517a35ec1aa2ef23690486ae63025796410033a2def8dd49c4827ff8dc6"; // sha256("Eliteacademy122321:55661234Elite")

async function sha256(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function AuthGate({ children }) {
  const [authed, setAuthed] = React.useState(() => sessionStorage.getItem(AUTH_KEY) === "1");
  const [login, setLogin]   = React.useState("");
  const [pass,  setPass]    = React.useState("");
  const [error, setError]   = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    const hash = await sha256(login.trim() + ":" + pass);
    if (hash === AUTH_HASH) {
      sessionStorage.setItem(AUTH_KEY, "1");
      setAuthed(true);
    } else {
      setError("Неверный логин или пароль");
    }
    setLoading(false);
  }

  if (authed) return children;

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #06172a 0%, #0a2d52 60%, #0e3d6e 100%)",
      padding: "20px",
    }}>
      <div style={{
        background: "#fff", borderRadius: "20px", padding: "44px 40px 36px",
        width: "100%", maxWidth: "400px",
        boxShadow: "0 32px 80px rgba(0,0,0,.35)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <img src="images/logo.png" alt="Elite Academy" style={{ height: "48px", objectFit: "contain" }}
            onError={e => { e.target.style.display = "none"; }} />
          <div style={{ fontFamily: "Raleway, sans-serif", fontWeight: 900, fontSize: "22px",
            color: "#06172a", marginTop: "12px" }}>Elite Academy</div>
          <div style={{ fontSize: "13px", color: "#8898aa", marginTop: "4px" }}>Внутренняя панель</div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#06172a" }}>Логин</label>
            <input
              type="text" autoComplete="username"
              value={login} onChange={e => setLogin(e.target.value)}
              placeholder="Введите логин"
              required
              style={{
                padding: "12px 16px", borderRadius: "10px", fontSize: "15px",
                border: "1.5px solid #e0e6ef", background: "#f8fafc", outline: "none",
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#06172a" }}>Пароль</label>
            <input
              type="password" autoComplete="current-password"
              value={pass} onChange={e => setPass(e.target.value)}
              placeholder="Введите пароль"
              required
              style={{
                padding: "12px 16px", borderRadius: "10px", fontSize: "15px",
                border: "1.5px solid #e0e6ef", background: "#f8fafc", outline: "none",
              }}
            />
          </div>

          {error && (
            <div style={{
              background: "#fff5f5", border: "1px solid #fecaca", borderRadius: "8px",
              padding: "10px 14px", fontSize: "13.5px", color: "#c0392b", textAlign: "center",
            }}>{error}</div>
          )}

          <button
            type="submit" disabled={loading}
            style={{
              marginTop: "6px", padding: "14px", borderRadius: "12px", border: "none",
              background: loading ? "#8898aa" : "#c9a84c",
              color: "#fff", fontFamily: "Raleway, sans-serif",
              fontWeight: 800, fontSize: "15px", cursor: loading ? "default" : "pointer",
              transition: "background .2s",
            }}
          >
            {loading ? "Проверяем…" : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}

window.AuthGate = AuthGate;
