/* TbPos — Login (staff select + PIN, password fallback) */
function Login({ onLogin }) {
  const staff = [
    { name: "Alex Rivera", role: "Manager",    ini: "AR", hue: 250 },
    { name: "Maya Chen",   role: "Cashier",    ini: "MC", hue: 200 },
    { name: "Diego Ruiz",  role: "Cashier",    ini: "DR", hue: 150 },
    { name: "Aisha Khan",  role: "Supervisor", ini: "AK", hue: 320 },
  ];
  const [sel, setSel] = useState(null);
  const [pin, setPin] = useState("");
  const [mode, setMode] = useState("select"); // select | pin | password
  const [ok, setOk] = useState(false);

  const ava = (hue) => `linear-gradient(135deg, hsl(${hue} 75% 60%), hsl(${hue + 40} 70% 52%))`;

  useEffect(() => {
    if (pin.length === 4) {
      const t = setTimeout(() => { setOk(true); setTimeout(() => onLogin(sel), 750); }, 120);
      return () => clearTimeout(t);
    }
  }, [pin]);

  const press = (k) => {
    if (k === "del") return setPin(p => p.slice(0, -1));
    setPin(p => (p.length < 4 ? p + k : p));
  };

  if (ok) {
    return (
      <div className="tb-login">
        <div className="tb-login-card">
          <div className="tb-login-brand">
            <div className="tb-login-logo">T</div>
            <h1>TbPos</h1>
            <p>Retail point of sale, built for speed at the counter.</p>
          </div>
          <div className="tb-login-auth">
            <div className="tb-login-ok">
              <div className="tb-login-ok-ic"><Icon name="check" size={46} stroke={2.4} /></div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: 19 }}>Welcome, {sel.name.split(" ")[0]}</div>
                <div style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 2 }}>Opening Register 1…</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tb-login">
      <div className="tb-login-card">
        <div className="tb-login-brand">
          <div className="tb-login-logo">T</div>
          <h1>TbPos</h1>
          <p>Retail point of sale, built for speed at the counter.</p>
          <div className="tb-login-feats">
            <div className="tb-login-feat"><span><Icon name="scan" size={18} /></span> Barcode-fast checkout</div>
            <div className="tb-login-feat"><span><Icon name="box" size={18} /></span> Live inventory &amp; stock</div>
            <div className="tb-login-feat"><span><Icon name="chart" size={18} /></span> Daily sales insights</div>
          </div>
        </div>

        <div className="tb-login-auth">
          {mode === "select" && (
            <>
              <h2>Choose your account</h2>
              <p className="lead">Downtown · Register 1</p>
              <div className="tb-staff-grid">
                {staff.map(s => (
                  <button key={s.name} className="tb-staff-tile" onClick={() => { setSel(s); setPin(""); setMode("pin"); }}>
                    <span className="tb-staff-ava" style={{ background: ava(s.hue) }}>{s.ini}</span>
                    <b>{s.name}</b><span>{s.role}</span>
                  </button>
                ))}
              </div>
              <div className="tb-login-foot">
                <button className="tb-login-link" onClick={() => setMode("password")}>Manager sign-in with password →</button>
              </div>
            </>
          )}

          {mode === "pin" && sel && (
            <div className="tb-pin-view">
              <button className="tb-pin-back tb-login-link" onClick={() => { setMode("select"); setPin(""); }}>← Back</button>
              <span className="tb-pin-ava" style={{ background: ava(sel.hue) }}>{sel.ini}</span>
              <div className="tb-pin-name">{sel.name}</div>
              <div className="tb-pin-hint">Enter your 4-digit PIN</div>
              <div className="tb-pin-dots">
                {[0, 1, 2, 3].map(i => <span key={i} className={"tb-pin-dot " + (i < pin.length ? "is-filled" : "")} />)}
              </div>
              <div className="tb-pinpad">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(k => (
                  <button key={k} className="tb-pinkey" onClick={() => press(k)}>{k}</button>
                ))}
                <button className="tb-pinkey ghost" onClick={() => setPin("")}>C</button>
                <button className="tb-pinkey" onClick={() => press("0")}>0</button>
                <button className="tb-pinkey ghost" onClick={() => press("del")}><Icon name="x" size={20} /></button>
              </div>
            </div>
          )}

          {mode === "password" && (
            <>
              <h2>Manager sign-in</h2>
              <p className="lead">Use your TbPos credentials</p>
              <div className="tb-login-form">
                <div>
                  <label>Email</label>
                  <label className="tb-field"><Icon name="user" size={18} className="tb-field-ic" />
                    <input type="email" defaultValue="alex@tbpos.com" /></label>
                </div>
                <div>
                  <label>Password</label>
                  <label className="tb-field"><Icon name="settings" size={18} className="tb-field-ic" />
                    <input type="password" defaultValue="········" /></label>
                </div>
                <Btn kind="primary" size="lg" full onClick={() => { setSel(staff[0]); setOk(true); setTimeout(() => onLogin(staff[0]), 750); }}>
                  Sign in
                </Btn>
              </div>
              <div className="tb-login-foot">
                <button className="tb-login-link" onClick={() => setMode("select")}>← Back to staff PIN</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

window.Login = Login;
