/* ============================================================
   TbPos — overlay kit components + imperative API
   Exposes: Modal, Drawer, Menu, Popover, ConfirmHost,
            tbToast(), tbConfirm()
   ============================================================ */

/* ---- tiny global store shared across the app ---- */
const overlayBus = (() => {
  let state = { toasts: [], dialog: null };
  let subs = [];
  const emit = () => subs.forEach(fn => fn(state));
  return {
    subscribe(fn) { subs.push(fn); return () => { subs = subs.filter(s => s !== fn); }; },
    get: () => state,
    set(patch) { state = { ...state, ...patch }; emit(); },
  };
})();

/* ---- toasts (imperative) ---- */
let _toastSeq = 0;
function _pushToast(opts) {
  const id = ++_toastSeq;
  const toast = { id, intent: "info", duration: 3400, ...opts };
  overlayBus.set({ toasts: [...overlayBus.get().toasts, toast] });
  if (toast.duration) setTimeout(() => _dismissToast(id), toast.duration);
  return id;
}
function _dismissToast(id) {
  const next = overlayBus.get().toasts.map(t => t.id === id ? { ...t, leaving: true } : t);
  overlayBus.set({ toasts: next });
  setTimeout(() => overlayBus.set({ toasts: overlayBus.get().toasts.filter(t => t.id !== id) }), 210);
}
const tbToast = (opts) => _pushToast(typeof opts === "string" ? { title: opts } : opts);
tbToast.success = (title, msg, extra) => _pushToast({ intent: "success", icon: "check", title, msg, ...extra });
tbToast.error   = (title, msg, extra) => _pushToast({ intent: "error",   icon: "warn",  title, msg, ...extra });
tbToast.warning = (title, msg, extra) => _pushToast({ intent: "warning", icon: "warn",  title, msg, ...extra });
tbToast.info    = (title, msg, extra) => _pushToast({ intent: "info",    icon: "info",  title, msg, ...extra });
tbToast.dismiss = _dismissToast;

/* ---- confirm (imperative, returns a Promise<boolean>) ---- */
let _confirmResolve = null;
function tbConfirm(opts) {
  return new Promise(resolve => {
    _confirmResolve = resolve;
    overlayBus.set({ dialog: { intent: "info", confirmText: "Confirm", cancelText: "Cancel", ...opts } });
  });
}
function _settleConfirm(val) {
  const r = _confirmResolve; _confirmResolve = null;
  overlayBus.set({ dialog: null });
  if (r) r(val);
}

const INTENT_ICON = { info: "info", success: "check", warning: "warn", danger: "warn" };

/* ---- the host: renders toaster + active confirm dialog. Mount once. ---- */
function OverlayHost() {
  const [st, setSt] = useState(overlayBus.get());
  useEffect(() => overlayBus.subscribe(setSt), []);
  const d = st.dialog;

  useEffect(() => {
    if (!d) return;
    const h = (e) => { if (e.key === "Escape") _settleConfirm(false); if (e.key === "Enter") _settleConfirm(true); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [d]);

  return (
    <>
      <div className="tb-toaster">
        {st.toasts.map(t => (
          <div key={t.id} className={`tb-toast intent-${t.intent} ${t.leaving ? "is-leaving" : ""}`} role="status">
            <span className="tb-toast-ic"><Icon name={t.icon || INTENT_ICON[t.intent] || "info"} size={19} stroke={2.2} /></span>
            <div className="tb-toast-main">
              <div className="tb-toast-title">{t.title}</div>
              {t.msg && <div className="tb-toast-msg">{t.msg}</div>}
              {t.action && <button className="tb-toast-action" onClick={() => { t.action.onClick && t.action.onClick(); _dismissToast(t.id); }}>{t.action.label}</button>}
            </div>
            <button className="tb-toast-x" onClick={() => _dismissToast(t.id)} aria-label="Dismiss"><Icon name="x" size={15} /></button>
          </div>
        ))}
      </div>

      {d && (
        <div className="tb-overlay" onClick={() => _settleConfirm(false)}>
          <div className="tb-modal tb-dialog" onClick={e => e.stopPropagation()} role="alertdialog">
            <div className="tb-dialog-body">
              <div className={"tb-dialog-ic " + d.intent}>
                <Icon name={d.icon || INTENT_ICON[d.intent]} size={30} stroke={2.1} />
              </div>
              <h3>{d.title}</h3>
              {d.message && <p>{d.message}</p>}
            </div>
            <div className="tb-dialog-foot">
              {!d.hideCancel && <Btn kind="default" onClick={() => _settleConfirm(false)}>{d.cancelText}</Btn>}
              <Btn kind={d.intent === "danger" ? "danger" : "primary"} onClick={() => _settleConfirm(true)} icon={d.confirmIcon}>{d.confirmText}</Btn>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ============================================================
   Declarative components
   ============================================================ */

/* Modal — generic, controlled */
function Modal({ open, title, sub, size = "md", icon, onClose, children, footer, closeOnBackdrop = true }) {
  useEffect(() => {
    if (!open) return;
    const h = (e) => e.key === "Escape" && onClose && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="tb-overlay" onClick={() => closeOnBackdrop && onClose && onClose()}>
      <div className={"tb-modal size-" + size} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        {title && (
          <div className="tb-modal-head">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {icon && <span style={{ width: 40, height: 40, borderRadius: 11, display: "grid", placeItems: "center", background: "var(--primary-soft)", color: "var(--primary)", flex: "none" }}><Icon name={icon} size={20} /></span>}
              <div><h2>{title}</h2>{sub && <div className="sub">{sub}</div>}</div>
            </div>
            <IconBtn name="x" kind="ghost" onClick={onClose} />
          </div>
        )}
        <div className="tb-modal-body">{children}</div>
        {footer && <div className="tb-modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

/* Drawer — side sheet, controlled */
function Drawer({ open, title, sub, side = "right", onClose, children, footer }) {
  useEffect(() => {
    if (!open) return;
    const h = (e) => e.key === "Escape" && onClose && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <>
      <div className="tb-drawer-scrim" onClick={onClose} />
      <aside className={"tb-drawer " + side} role="dialog" aria-modal="true">
        <div className="tb-drawer-head">
          <div><h2>{title}</h2>{sub && <div className="sub">{sub}</div>}</div>
          <IconBtn name="x" kind="ghost" onClick={onClose} />
        </div>
        <div className="tb-drawer-body">{children}</div>
        {footer && <div className="tb-drawer-foot">{footer}</div>}
      </aside>
    </>
  );
}

/* Menu — self-contained dropdown / popover.
   items: [{label, icon, onClick, danger, kbd, checked} | {divider:true} | {label, header:true}] */
function Menu({ trigger, items = [], align = "left", up = false, width }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onEsc); };
  }, [open]);
  return (
    <span className="tb-pop-anchor" ref={ref}>
      {React.cloneElement(trigger, { onClick: (e) => { e.stopPropagation(); setOpen(o => !o); } })}
      {open && (
        <div className={`tb-menu align-${align} ${up ? "up" : ""}`} style={width ? { minWidth: width } : null}>
          {items.map((it, i) => {
            if (it.divider) return <div className="tb-menu-div" key={i} />;
            if (it.header) return <div className="tb-menu-label" key={i}>{it.label}</div>;
            return (
              <button key={i} className={"tb-menu-item " + (it.danger ? "danger" : "")}
                onClick={() => { setOpen(false); it.onClick && it.onClick(); }}>
                {it.icon && <Icon name={it.icon} size={17} />}
                <span>{it.label}</span>
                {it.checked && <Icon name="check" size={16} className="tb-check" />}
                {it.kbd && <span className="kbd">{it.kbd}</span>}
              </button>
            );
          })}
        </div>
      )}
    </span>
  );
}

/* Popover — self-contained rich anchored card via render content */
function Popover({ trigger, children, align = "left", width = 260 }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  return (
    <span className="tb-pop-anchor" ref={ref}>
      {React.cloneElement(trigger, { onClick: (e) => { e.stopPropagation(); setOpen(o => !o); } })}
      {open && <div className={"tb-popover align-" + align} style={{ minWidth: width }}>
        {typeof children === "function" ? children(() => setOpen(false)) : children}
      </div>}
    </span>
  );
}

Object.assign(window, { OverlayHost, Modal, Drawer, Menu, Popover, tbToast, tbConfirm });
