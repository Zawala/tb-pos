/* TbPos — shared UI primitives */

const Money = ({ v, className = "" }) => <span className={"tnum " + className}>{window.TB.money(v)}</span>;

/* product image placeholder: soft category-tinted tile w/ initial + stripe texture */
const Tile = ({ name, cat, size = "md", className = "" }) => {
  const hue = window.TB.catHue[cat] ?? 220;
  const dark = document.documentElement.getAttribute("data-theme") === "dark";
  const bg = dark
    ? `linear-gradient(135deg, hsl(${hue} 42% 22%), hsl(${hue} 38% 15%))`
    : `linear-gradient(135deg, hsl(${hue} 70% 93%), hsl(${hue} 64% 87%))`;
  const fg = dark ? `hsl(${hue} 70% 78%)` : `hsl(${hue} 52% 42%)`;
  const initials = name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const stripe = dark ? "rgba(255,255,255,.04)" : "rgba(255,255,255,.5)";
  return (
    <div className={"tb-tile tb-tile-" + size + " " + className}
      style={{ background: bg, color: fg,
        backgroundImage: `repeating-linear-gradient(45deg, ${stripe} 0 1px, transparent 1px 9px), ${bg}` }}>
      <span style={{ fontWeight: 700 }}>{initials}</span>
    </div>
  );
};

/* button */
const Btn = ({ children, kind = "default", size = "md", icon, iconRight, full, className = "", ...rest }) => (
  <button className={`tb-btn tb-btn-${kind} tb-btn-${size} ${full ? "tb-full" : ""} ${className}`} {...rest}>
    {icon && <Icon name={icon} size={size === "lg" ? 20 : 18} />}
    {children && <span>{children}</span>}
    {iconRight && <Icon name={iconRight} size={size === "lg" ? 20 : 18} />}
  </button>
);

const IconBtn = ({ name, kind = "ghost", size = 20, className = "", ...rest }) => (
  <button className={`tb-iconbtn tb-iconbtn-${kind} ${className}`} {...rest}><Icon name={name} size={size} /></button>
);

/* segmented control */
const Segmented = ({ options, value, onChange, size = "md" }) => (
  <div className={"tb-seg tb-seg-" + size} role="tablist">
    {options.map(o => (
      <button key={o.value} role="tab" aria-selected={value === o.value}
        className={"tb-seg-item " + (value === o.value ? "is-active" : "")}
        onClick={() => onChange(o.value)}>
        {o.icon && <Icon name={o.icon} size={16} />}
        {o.label}
      </button>
    ))}
  </div>
);

const Chip = ({ children, tone = "neutral", className = "" }) => (
  <span className={`tb-chip tb-chip-${tone} ${className}`}>{children}</span>
);

const Toggle = ({ checked, onChange }) => (
  <button className={"tb-toggle " + (checked ? "is-on" : "")} onClick={() => onChange(!checked)} role="switch" aria-checked={checked}>
    <span className="tb-toggle-knob" />
  </button>
);

const StatCard = ({ label, value, delta, deltaDir, icon, accent }) => (
  <div className="tb-stat">
    <div className="tb-stat-top">
      <span className="tb-stat-label">{label}</span>
      <span className="tb-stat-ic" style={accent ? { color: accent, background: "color-mix(in srgb," + accent + " 14%, transparent)" } : null}>
        <Icon name={icon} size={18} />
      </span>
    </div>
    <div className="tb-stat-value tnum">{value}</div>
    {delta != null && (
      <div className={"tb-stat-delta " + (deltaDir === "down" ? "is-down" : "is-up")}>
        <Icon name={deltaDir === "down" ? "arrowdown" : "arrowup"} size={14} />
        <span className="tnum">{delta}</span>
        <span className="tb-stat-delta-lbl">vs last week</span>
      </div>
    )}
  </div>
);

/* mini bar chart */
const BarChart = ({ labels, values, accent, height = 150 }) => {
  const max = Math.max(...values);
  return (
    <div className="tb-bars" style={{ height }}>
      {values.map((v, i) => (
        <div className="tb-bar-col" key={i}>
          <div className="tb-bar-track">
            <div className="tb-bar-fill" style={{ height: (v / max * 100) + "%", background: accent }}>
              <span className="tb-bar-tip tnum">{window.TB.money(v)}</span>
            </div>
          </div>
          <span className="tb-bar-lbl">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
};

/* page header */
const PageHead = ({ title, sub, children }) => (
  <div className="tb-pagehead">
    <div>
      <h1 className="tb-h1">{title}</h1>
      {sub && <p className="tb-sub">{sub}</p>}
    </div>
    {children && <div className="tb-pagehead-actions">{children}</div>}
  </div>
);

const SearchField = ({ value, onChange, placeholder, icon = "search", autoFocus }) => (
  <label className="tb-field">
    <Icon name={icon} size={18} className="tb-field-ic" />
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} autoFocus={autoFocus} />
    {value && <button className="tb-field-clear" onClick={() => onChange("")}><Icon name="x" size={14} /></button>}
  </label>
);

Object.assign(window, { Money, Tile, Btn, IconBtn, Segmented, Chip, Toggle, StatCard, BarChart, PageHead, SearchField });
