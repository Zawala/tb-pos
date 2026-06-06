/* TbPos — Settings */
function Settings({ prefs, setPref }) {
  const [tab, setTab] = useState("appearance");
  const TB = window.TB;
  const tabs = [
    ["appearance", "settings", "Appearance"],
    ["store", "store", "Store"],
    ["payments", "card", "Payments"],
    ["receipt", "receipt", "Receipt"],
    ["staff", "user", "Staff"],
  ];
  const blues = [["#3b82f6", "Blue"], ["#2563eb", "Royal"], ["#0ea5e9", "Sky"], ["#6366f1", "Indigo"]];
  const purples = [["#b06bff", "Violet"], ["#ff5ec9", "Magenta"], ["#a855f7", "Purple"], ["#22d3ee", "Cyan"]];

  return (
    <div className="tb-page">
      <PageHead title="Settings" sub="Configure your register & appearance" />
      <div className="tb-settings">
        <nav className="tb-set-nav">
          {tabs.map(([id, ic, lbl]) => (
            <button key={id} className={"tb-set-navitem " + (tab === id ? "is-active" : "")} onClick={() => setTab(id)}>
              <Icon name={ic} size={18} /> {lbl}
            </button>
          ))}
        </nav>

        <div className="tb-panel">
          {tab === "appearance" && (
            <div className="tb-set-section">
              <div className="tb-setrow">
                <div className="tb-setrow-main"><b>Theme</b><span>Blue & white in daylight, vibrant purple in the dark.</span></div>
                <Segmented value={prefs.theme} onChange={v => setPref("theme", v)}
                  options={[{ value: "light", label: "Light", icon: "sun" }, { value: "dark", label: "Dark", icon: "moon" }]} />
              </div>
              <div className="tb-setrow">
                <div className="tb-setrow-main"><b>Accent — Light</b><span>Primary brand color used in light mode.</span></div>
                <div className="tb-swatchrow">
                  {blues.map(([c, n]) => <button key={c} title={n} className={"tb-swatch " + (prefs.accentLight === c ? "is-on" : "")} style={{ background: c }} onClick={() => setPref("accentLight", c)} />)}
                </div>
              </div>
              <div className="tb-setrow">
                <div className="tb-setrow-main"><b>Accent — Dark</b><span>Vibrant color used in dark mode.</span></div>
                <div className="tb-swatchrow">
                  {purples.map(([c, n]) => <button key={c} title={n} className={"tb-swatch " + (prefs.accentDark === c ? "is-on" : "")} style={{ background: c }} onClick={() => setPref("accentDark", c)} />)}
                </div>
              </div>
              <div className="tb-setrow">
                <div className="tb-setrow-main"><b>Navigation</b><span>Where the main menu lives — adapt per device.</span></div>
                <Segmented size="sm" value={prefs.nav} onChange={v => setPref("nav", v)}
                  options={[{ value: "sidebar", label: "Side" }, { value: "top", label: "Top" }, { value: "bottom", label: "Bottom" }]} />
              </div>
              <div className="tb-setrow">
                <div className="tb-setrow-main"><b>Corner radius</b><span>{prefs.radius}px — how round buttons & cards appear.</span></div>
                <input type="range" min="0" max="24" step="2" value={prefs.radius} onChange={e => setPref("radius", +e.target.value)} style={{ width: 180, accentColor: "var(--primary)" }} />
              </div>
            </div>
          )}

          {tab === "store" && (
            <div className="tb-set-section">
              {[["Store name", TB.store.name], ["Branch", "Downtown"], ["Register", "Register 1"], ["Address", "120 Market St, Suite 4"], ["Currency", "USD ($)"], ["Timezone", "GMT−5 Eastern"]].map(([l, v]) => (
                <div className="tb-setrow" key={l}>
                  <div className="tb-setrow-main"><b>{l}</b></div>
                  <input className="tb-select" defaultValue={v} style={{ width: 240 }} />
                </div>
              ))}
            </div>
          )}

          {tab === "payments" && (
            <div className="tb-set-section">
              <div className="tb-setrow"><div className="tb-setrow-main"><b>Tax rate</b><span>Applied to taxable items at checkout.</span></div>
                <input className="tb-select" defaultValue="8%" style={{ width: 120 }} /></div>
              {[["Accept Cash", "cash", true], ["Accept Card", "card", true], ["Accept Mobile / QR", "qr", true], ["Allow split payments", "pct", false], ["Tipping", "dollar", false]].map(([l, ic, on]) => (
                <SetToggle key={l} icon={ic} label={l} defaultOn={on} />
              ))}
            </div>
          )}

          {tab === "receipt" && (
            <div className="tb-set-section">
              <div className="tb-setrow"><div className="tb-setrow-main"><b>Header text</b></div><input className="tb-select" defaultValue="TbPos · Thanks for shopping!" style={{ width: 280 }} /></div>
              <div className="tb-setrow"><div className="tb-setrow-main"><b>Footer note</b></div><input className="tb-select" defaultValue="Returns within 30 days with receipt" style={{ width: 280 }} /></div>
              {[["Print automatically", "print", true], ["Email receipt option", "receipt", true], ["Show QR feedback link", "qr", false], ["Include itemized tax", "pct", true]].map(([l, ic, on]) => (
                <SetToggle key={l} icon={ic} label={l} defaultOn={on} />
              ))}
            </div>
          )}

          {tab === "staff" && (
            <div className="tb-set-section">
              {[["Alex Rivera", "Manager", "AR"], ["Maya Chen", "Cashier", "MC"], ["Diego Ruiz", "Cashier", "DR"], ["Aisha Khan", "Supervisor", "AK"]].map(([n, role, ini]) => (
                <div className="tb-setrow" key={n}>
                  <div className="tb-cellprod">
                    <div className="ava" style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,var(--primary),var(--accent-2))", color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 14 }}>{ini}</div>
                    <div className="tb-cellprod-main"><b>{n}</b><span>{role}</span></div>
                  </div>
                  <Btn kind="ghost" size="sm" iconRight="chevron">Manage</Btn>
                </div>
              ))}
              <div style={{ paddingTop: 16 }}><Btn kind="soft" icon="plus">Add staff member</Btn></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SetToggle({ icon, label, defaultOn }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="tb-setrow">
      <div className="tb-setrow-main" style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ width: 36, height: 36, borderRadius: 10, display: "grid", placeItems: "center", background: "var(--surface-3)", color: "var(--text-muted)" }}><Icon name={icon} size={18} /></span>
        <b>{label}</b>
      </div>
      <Toggle checked={on} onChange={setOn} />
    </div>
  );
}

window.Settings = Settings;
