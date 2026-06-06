/* TbPos — app shell: nav variants, theming, tweaks */

const NAV = [
  { id: "checkout",  icon: "cart",     label: "Sell" },
  { id: "dashboard", icon: "chart",    label: "Dashboard" },
  { id: "products",  icon: "tag",      label: "Products" },
  { id: "inventory", icon: "box",      label: "Inventory" },
  { id: "orders",    icon: "receipt",  label: "Orders" },
  { id: "settings",  icon: "settings", label: "Settings" },
];
const TITLES = { checkout: "Point of Sale", dashboard: "Dashboard", products: "Products", inventory: "Inventory", orders: "Orders", settings: "Settings" };

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "nav": "sidebar",
  "theme": "light",
  "accentLight": "#3b82f6",
  "accentDark": "#b06bff",
  "radius": 14,
  "device": "desktop"
}/*EDITMODE-END*/;

function applyTheme(t) {
  const root = document.documentElement;
  root.setAttribute("data-theme", t.theme);
  root.style.setProperty("--radius-base", t.radius + "px");
  const accent = t.theme === "dark" ? t.accentDark : t.accentLight;
  root.style.setProperty("--primary", accent);
  root.style.setProperty("--primary-600", `color-mix(in srgb, ${accent} 86%, #000)`);
  root.style.setProperty("--primary-700", `color-mix(in srgb, ${accent} 72%, #000)`);
  root.style.setProperty("--primary-ring", `color-mix(in srgb, ${accent} 38%, transparent)`);
  if (t.theme === "dark") {
    root.style.setProperty("--primary-soft", `color-mix(in srgb, ${accent} 16%, transparent)`);
    root.style.setProperty("--primary-softer", `color-mix(in srgb, ${accent} 9%, transparent)`);
    root.style.setProperty("--accent-2", `color-mix(in srgb, ${accent} 50%, #ff5ec9)`);
  } else {
    root.style.setProperty("--primary-soft", `color-mix(in srgb, ${accent} 12%, #fff)`);
    root.style.setProperty("--primary-softer", `color-mix(in srgb, ${accent} 6%, #fff)`);
    root.style.setProperty("--accent-2", `color-mix(in srgb, ${accent} 64%, #7db0ff)`);
  }
  const stage = document.getElementById("stage");
  if (stage) stage.className = "dev-" + t.device;
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [authed, setAuthed] = useState(false);
  const [cashier, setCashier] = useState(window.TB.store.cashier);
  const [view, setView] = useState("checkout");
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => { applyTheme(t); }, [t.theme, t.radius, t.accentLight, t.accentDark, t.device]);

  const cartCount = cart.reduce((s, l) => s + l.qty, 0);

  const onPaid = ({ total, method }) => {
    setToast({ total, method });
    setTimeout(() => setToast(null), 3400);
  };

  const screen = (() => {
    switch (view) {
      case "checkout":  return <Checkout cart={cart} setCart={setCart} onPaid={onPaid} />;
      case "dashboard": return <Dashboard />;
      case "products":  return <Products />;
      case "inventory": return <Inventory />;
      case "orders":    return <Orders />;
      case "settings":  return <Settings prefs={t} setPref={setTweak} />;
      default: return null;
    }
  })();

  const themeBtn = (
    <IconBtn name={t.theme === "dark" ? "sun" : "moon"} kind="outline"
      onClick={() => setTweak("theme", t.theme === "dark" ? "light" : "dark")} title="Toggle theme" />
  );
  const initials = cashier.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const logout = () => { setAuthed(false); setView("checkout"); setCart([]); };
  const avatar = <div className="tb-side-avatar" title={cashier + " — sign out"} onClick={logout}><Icon name="logout" size={18} /></div>;

  // ----- nav renders -----
  const Sidebar = (
    <nav className="tb-side">
      <div className="tb-brand">T</div>
      {NAV.map(n => (
        <button key={n.id} className={"tb-navitem " + (view === n.id ? "is-active" : "")} onClick={() => setView(n.id)}>
          <span style={{ position: "relative" }}>
            <Icon name={n.icon} size={22} />
            {n.id === "checkout" && cartCount > 0 && <span style={badgeStyle}>{cartCount}</span>}
          </span>
          {n.label}
        </button>
      ))}
      <div className="tb-side-foot">{themeBtn}{avatar}</div>
    </nav>
  );

  const TopNav = (
    <header className="tb-topnav">
      <div className="tb-brand">T</div>
      <div className="tb-topnav-items">
        {NAV.map(n => (
          <button key={n.id} className={"tb-topitem " + (view === n.id ? "is-active" : "")} onClick={() => setView(n.id)}>
            <span style={{ position: "relative", display: "inline-flex" }}>
              <Icon name={n.icon} size={19} />
              {n.id === "checkout" && cartCount > 0 && <span style={badgeStyle}>{cartCount}</span>}
            </span>
            <span className="tb-hide-sm">{n.label}</span>
          </button>
        ))}
      </div>
      <div className="tb-topbar-spacer" />
      {themeBtn}
      <IconBtn name="bell" kind="ghost" className="tb-hide-sm" />
      {avatar}
    </header>
  );

  const BotNav = (
    <nav className="tb-botnav">
      {NAV.map(n => (
        <button key={n.id} className={"tb-botitem " + (view === n.id ? "is-active" : "")} onClick={() => setView(n.id)}>
          <span className="tb-botitem-ic" style={{ position: "relative" }}>
            <Icon name={n.icon} size={21} />
            {n.id === "checkout" && cartCount > 0 && <span style={badgeStyle}>{cartCount}</span>}
          </span>
          {n.label}
        </button>
      ))}
    </nav>
  );

  const InnerTop = (
    <div className="tb-topbar">
      <span className="tb-topbar-title">{TITLES[view]}</span>
      <div className="tb-topbar-spacer" />
      <div className="tb-store-pill">
        <span className="ava">{initials}</span>
        <span className="tb-store-meta tb-hide-sm"><b>{window.TB.store.name}</b><span>{window.TB.store.branch}</span></span>
        <Icon name="chevdown" size={16} className="tb-hide-sm" />
      </div>
      <IconBtn name="bell" kind="outline" className="tb-hide-sm" />
      {themeBtn}
    </div>
  );

  return (
    <>
      <div className={"tb-frame"} data-nav={authed ? t.nav : "none"}>
        {!authed ? (
          <Login onLogin={(u) => { setCashier(u.name); setAuthed(true); }} />
        ) : (
          <>
            {t.nav === "sidebar" && Sidebar}
            {t.nav === "top" && TopNav}
            <div className="tb-content">
              {t.nav !== "top" && InnerTop}
              <div className="tb-scroll">{screen}</div>
            </div>
            {t.nav === "bottom" && BotNav}
          </>
        )}
      </div>

      {authed && toast && (
        <div style={toastStyle}>
          <span style={toastIcon}><Icon name="check" size={18} stroke={2.5} /></span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Sale completed</div>
            <div style={{ fontSize: 12.5, opacity: .8 }}>{window.TB.money(toast.total)} · {toast.method.toUpperCase()}</div>
          </div>
        </div>
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Layout" />
        <TweakRadio label="Navigation" value={t.nav} options={["sidebar", "top", "bottom"]} onChange={v => setTweak("nav", v)} />
        <TweakRadio label="Preview as" value={t.device} options={["desktop", "tablet", "phone"]} onChange={v => setTweak("device", v)} />
        <TweakSection label="Theme" />
        <TweakRadio label="Mode" value={t.theme} options={["light", "dark"]} onChange={v => setTweak("theme", v)} />
        <TweakColor label="Light accent" value={t.accentLight} options={["#3b82f6", "#2563eb", "#0ea5e9", "#6366f1"]} onChange={v => setTweak("accentLight", v)} />
        <TweakColor label="Dark accent" value={t.accentDark} options={["#b06bff", "#ff5ec9", "#a855f7", "#22d3ee"]} onChange={v => setTweak("accentDark", v)} />
        <TweakSection label="Shape" />
        <TweakSlider label="Corner radius" value={t.radius} min={0} max={24} step={2} unit="px" onChange={v => setTweak("radius", v)} />
      </TweaksPanel>
    </>
  );
}

const badgeStyle = { position: "absolute", top: -7, right: -9, minWidth: 16, height: 16, padding: "0 4px", borderRadius: 999, background: "var(--danger)", color: "#fff", fontSize: 10, fontWeight: 700, display: "grid", placeItems: "center", lineHeight: 1 };
const toastStyle = { position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 60, display: "flex", alignItems: "center", gap: 12, padding: "12px 18px 12px 12px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, boxShadow: "var(--shadow-xl)", animation: "tb-rise 240ms cubic-bezier(.4,0,.2,1)" };
const toastIcon = { width: 38, height: 38, borderRadius: 12, background: "var(--success-soft)", color: "var(--success)", display: "grid", placeItems: "center", flex: "none" };

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
