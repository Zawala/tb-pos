/* TbPos — Checkout screen + Payment flow */
function Checkout({ cart, setCart, onPaid }) {
  const TB = window.TB;
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [discountPct, setDiscountPct] = useState(0);
  const [custOpen, setCustOpen] = useState(false);
  const [customer, setCustomer] = useState(null);

  const items = useMemo(() => {
    let list = TB.products;
    if (cat !== "all") list = list.filter(p => p.cat === cat);
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(s) || p.sku.includes(s));
    }
    return list;
  }, [cat, q]);

  const add = (p) => {
    if (p.stock === 0) return;
    setCart(c => {
      const ex = c.find(l => l.id === p.id);
      if (ex) return c.map(l => l.id === p.id ? { ...l, qty: l.qty + 1 } : l);
      return [...c, { id: p.id, name: p.name, price: p.price, cat: p.cat, sku: p.sku, qty: 1 }];
    });
  };
  const setQty = (id, d) => setCart(c => c.map(l => l.id === id ? { ...l, qty: Math.max(0, l.qty + d) } : l).filter(l => l.qty > 0));
  const removeLine = (id) => setCart(c => c.filter(l => l.id !== id));

  const subtotal = cart.reduce((s, l) => s + l.qty * l.price, 0);
  const discount = subtotal * (discountPct / 100);
  const tax = (subtotal - discount) * TB.store.taxRate;
  const total = subtotal - discount + tax;
  const count = cart.reduce((s, l) => s + l.qty, 0);

  // barcode: enter SKU and press enter to add
  const onScan = (e) => {
    if (e.key === "Enter") {
      const hit = TB.products.find(p => p.sku === q.trim());
      if (hit) { add(hit); setQ(""); }
    }
  };

  const cycleDiscount = () => setDiscountPct(d => d === 0 ? 5 : d === 5 ? 10 : d === 10 ? 15 : 0);

  return (
    <div className="tb-checkout">
      {/* catalog */}
      <div className="tb-catalog">
        <div className="tb-catalog-bar">
          <div className="tb-scanrow">
            <label className="tb-field">
              <Icon name="barcode" size={20} className="tb-field-ic" />
              <input value={q} onChange={e => setQ(e.target.value)} onKeyDown={onScan}
                placeholder="Scan barcode or search products…" autoFocus />
              {q && <button className="tb-field-clear" onClick={() => setQ("")}><Icon name="x" size={14} /></button>}
            </label>
            <IconBtn name="scan" kind="outline" />
          </div>
          <div className="tb-cats">
            {TB.CATS.map(c => (
              <button key={c.id} className={"tb-catpill " + (cat === c.id ? "is-active" : "")} onClick={() => setCat(c.id)}>
                <Icon name={c.icon === "grid" ? "grid" : "tag"} size={16} />{c.name}
              </button>
            ))}
          </div>
        </div>
        <div className="tb-grid">
          {items.map(p => (
            <div key={p.id} className={"tb-pcard " + (p.stock === 0 ? "is-out" : "")} onClick={() => add(p)}>
              <Tile name={p.name} cat={p.cat} size="md" />
              {p.stock === 0
                ? <span className="tb-out-badge"><Chip tone="danger">Out</Chip></span>
                : <span className="tb-pcard-add"><Icon name="plus" size={18} /></span>}
              <div className="tb-pcard-body">
                <div className="tb-pcard-name">{p.name}</div>
                <div className="tb-pcard-foot">
                  <span className="tb-pcard-price"><Money v={p.price} /></span>
                  <span className="tb-pcard-stock">{p.stock > 0 ? p.stock + " left" : "—"}</span>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div style={{ gridColumn: "1/-1" }} className="tb-empty">
              <div className="ic"><Icon name="search" size={28} /></div>
              No products match “{q}”.
            </div>
          )}
        </div>
      </div>

      {/* cart */}
      <aside className={"tb-cart " + (cartOpen ? "is-open" : "")}>
        <div className="tb-cart-peek" onClick={() => setCartOpen(o => !o)}>
          <strong style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Icon name="cart" size={20} /> {count} item{count !== 1 ? "s" : ""}
          </strong>
          <strong><Money v={total} /></strong>
        </div>
        <div className="tb-cart-head">
          <h2><Icon name="cart" size={20} /> Current Sale {count > 0 && <span className="tb-cart-count">{count}</span>}</h2>
          {cart.length > 0 && <IconBtn name="trash" kind="ghost" onClick={async () => {
            const ok = await tbConfirm({ intent: "danger", icon: "trash", title: "Clear this sale?", message: `${count} item${count !== 1 ? "s" : ""} will be removed from the current cart. This can't be undone.`, confirmText: "Clear cart", confirmIcon: "trash" });
            if (ok) { setCart([]); setDiscountPct(0); tbToast.info("Cart cleared"); }
          }} title="Clear" />}
        </div>
        <div className="tb-cust" onClick={() => setCustOpen(true)}>
          <Icon name="user" size={18} /> {customer ? customer.name + " · " + customer.phone : "Add customer · Walk-in"}
        </div>

        {cart.length === 0 ? (
          <div className="tb-cart-empty">
            <div className="ic"><Icon name="cart" size={34} /></div>
            <div>
              <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Cart is empty</div>
              <div style={{ fontSize: 13 }}>Scan a barcode or tap a product to begin.</div>
            </div>
          </div>
        ) : (
          <div className="tb-cart-items">
            {cart.map(l => (
              <div className="tb-line" key={l.id}>
                <Tile name={l.name} cat={l.cat} size="sm" />
                <div className="tb-line-main">
                  <div className="tb-line-name">{l.name}</div>
                  <div className="tb-line-meta"><Money v={l.price} /> · #{l.sku}</div>
                </div>
                <div className="tb-qty">
                  <button onClick={() => l.qty === 1 ? removeLine(l.id) : setQty(l.id, -1)}>
                    <Icon name={l.qty === 1 ? "trash" : "minus"} size={15} />
                  </button>
                  <span className="tnum">{l.qty}</span>
                  <button onClick={() => setQty(l.id, 1)}><Icon name="plus" size={15} /></button>
                </div>
                <div className="tb-line-price"><Money v={l.qty * l.price} /></div>
              </div>
            ))}
          </div>
        )}

        <div className="tb-cart-foot">
          <div className="tb-totals">
            <div className="tb-totrow"><span>Subtotal</span><Money v={subtotal} /></div>
            {discountPct > 0 && <div className="tb-totrow discount"><span>Discount ({discountPct}%)</span><span>−<Money v={discount} /></span></div>}
            <div className="tb-totrow"><span>Tax ({Math.round(TB.store.taxRate * 100)}%)</span><Money v={tax} /></div>
            <div className="tb-totrow grand"><span>Total</span><Money v={total} /></div>
          </div>
          <div className="tb-cart-actions">
            <Btn kind="default" icon="pct" onClick={cycleDiscount} title="Discount">{discountPct > 0 ? discountPct + "%" : ""}</Btn>
            <Btn kind="default" icon="pause" title="Hold sale" disabled={cart.length === 0} onClick={() => { tbToast.warning("Sale held", count + " items parked · resume from Orders", { icon: "pause" }); setCart([]); setDiscountPct(0); }} />
            <Btn kind="primary" size="md" disabled={cart.length === 0} onClick={() => setPayOpen(true)}>
              Charge <Money v={total} />
            </Btn>
          </div>
        </div>
      </aside>

      {payOpen && (
        <Payment total={total} subtotal={subtotal} tax={tax} discount={discount} count={count}
          onClose={() => setPayOpen(false)}
          onComplete={(method) => { setPayOpen(false); onPaid({ total, method, count }); setCart([]); setDiscountPct(0); }} />
      )}

      <CustomerModal open={custOpen} current={customer} onClose={() => setCustOpen(false)}
        onSave={(c) => { setCustomer(c); setCustOpen(false); tbToast.success("Customer added", c.name + " attached to this sale"); }}
        onClear={() => { setCustomer(null); setCustOpen(false); tbToast.info("Customer removed"); }} />
    </div>
  );
}

function Payment({ total, subtotal, tax, discount, count, onClose, onComplete }) {
  const TB = window.TB;
  const [method, setMethod] = useState("card");
  const [tendered, setTendered] = useState("");
  const [done, setDone] = useState(false);
  const [processing, setProcessing] = useState(false);

  const tNum = parseFloat(tendered || "0");
  const change = Math.max(0, tNum - total);
  const press = (k) => setTendered(t => k === "del" ? t.slice(0, -1) : (t + k).replace(/^0+(?=\d)/, ""));
  const quick = [total, Math.ceil(total / 5) * 5, Math.ceil(total / 10) * 10, Math.ceil(total / 20) * 20]
    .filter((v, i, a) => a.indexOf(v) === i);

  const canComplete = method !== "cash" || tNum >= total;

  const complete = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setDone(true); }, method === "card" ? 1100 : 500);
  };

  if (done) {
    return (
      <div className="tb-overlay" onClick={onClose}>
        <div className="tb-modal" onClick={e => e.stopPropagation()}>
          <div className="tb-modal-body">
            <div className="tb-success">
              <div className="tb-success-ic"><Icon name="check" size={44} stroke={2.4} /></div>
              <h2 style={{ margin: "0 0 4px", fontSize: 22 }}>Payment Complete</h2>
              <p style={{ color: "var(--text-muted)", margin: 0, fontSize: 14 }}>
                {method === "cash" ? <>Change due <b className="tnum" style={{ color: "var(--success)" }}>{TB.money(change)}</b></> : "Transaction approved"}
              </p>
              <div className="tb-receipt">
                <h3>{TB.store.name}</h3>
                <div className="rc-sub">{TB.store.branch} · {new Date().toLocaleString()}</div>
                <div className="tb-receipt-row"><span>{count} items</span><span>{TB.money(subtotal)}</span></div>
                {discount > 0 && <div className="tb-receipt-row"><span>Discount</span><span>−{TB.money(discount)}</span></div>}
                <div className="tb-receipt-row"><span>Tax</span><span>{TB.money(tax)}</span></div>
                <div className="tb-receipt-row b"><span>Total · {method.toUpperCase()}</span><span>{TB.money(total)}</span></div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn kind="default" icon="print" full>Print</Btn>
                <Btn kind="primary" icon="check" full onClick={() => onComplete(method)}>New Sale</Btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tb-overlay" onClick={onClose}>
      <div className="tb-modal" onClick={e => e.stopPropagation()}>
        <div className="tb-modal-head">
          <h2>Take Payment</h2>
          <IconBtn name="x" kind="ghost" onClick={onClose} />
        </div>
        <div className="tb-modal-body">
          <div className="tb-pay-amount">
            <div className="lbl">Amount due</div>
            <div className="val tnum">{TB.money(total)}</div>
          </div>
          <div className="tb-paytabs">
            {[["cash", "cash", "Cash"], ["card", "card", "Card"], ["qr", "qr", "Mobile / QR"]].map(([m, ic, lbl]) => (
              <button key={m} className={"tb-paytab " + (method === m ? "is-active" : "")} onClick={() => { setMethod(m); setTendered(""); }}>
                <Icon name={ic} size={26} /> {lbl}
              </button>
            ))}
          </div>

          {method === "cash" && (
            <>
              <div className="tb-quickcash">
                {quick.map(v => <button key={v} className="tnum" onClick={() => setTendered(String(v))}>{TB.money(v)}</button>)}
              </div>
              <div className="tb-field" style={{ height: 56, marginBottom: 12 }}>
                <Icon name="cash" className="tb-field-ic" />
                <input className="tnum" style={{ fontSize: 22, fontWeight: 700 }} value={tendered ? "$" + tendered : ""} placeholder="$0.00" readOnly />
              </div>
              <div className="tb-keypad">
                {["1","2","3","4","5","6","7","8","9",".","0","del"].map(k => (
                  <button key={k} className="tb-key" onClick={() => press(k)}>{k === "del" ? "⌫" : k}</button>
                ))}
              </div>
              {tNum >= total && <div className="tb-change"><span>Change due</span><span className="tnum">{TB.money(change)}</span></div>}
            </>
          )}

          {method === "card" && (
            <div style={{ textAlign: "center", padding: "10px 0 6px" }}>
              <div className="tb-qr-box">
                <div style={{ width: 120, height: 120, borderRadius: 20, background: "var(--primary-soft)", color: "var(--primary)", display: "grid", placeItems: "center" }}>
                  {processing ? <Icon name="refresh" size={42} style={{ animation: "tb-spin 900ms linear infinite" }} /> : <Icon name="card" size={48} />}
                </div>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0 }}>
                {processing ? "Contacting terminal…" : "Insert, tap, or swipe card on the terminal."}
              </p>
            </div>
          )}

          {method === "qr" && (
            <div className="tb-qr-box">
              <div className="tb-qr-img" style={{ backgroundImage:
                "repeating-conic-gradient(#0f172a 0% 25%, #fff 0% 50%)", backgroundSize: "20px 20px", backgroundPosition: "center" }} />
              <p style={{ color: "var(--text-muted)", fontSize: 14, margin: "14px 0 0", textAlign: "center" }}>Ask the customer to scan to pay <b><Money v={total} /></b></p>
            </div>
          )}
        </div>
        <div style={{ padding: "0 22px 22px" }}>
          <Btn kind="success" size="lg" full disabled={!canComplete || processing} onClick={complete} icon={processing ? null : "check"}>
            {processing ? "Processing…" : method === "cash" ? "Confirm Cash Payment" : method === "qr" ? "Mark as Paid" : "Charge Card"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

window.Checkout = Checkout;

function CustomerModal({ open, current, onClose, onSave, onClear }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => { if (open) { setName(current?.name || ""); setPhone(current?.phone || ""); setEmail(current?.email || ""); } }, [open]);
  return (
    <Modal open={open} onClose={onClose} size="sm" icon="user" title="Customer"
      sub="Attach a customer to this sale"
      footer={<>
        {current && <Btn kind="ghost" onClick={onClear}>Remove</Btn>}
        <div style={{ flex: 1 }} />
        <Btn kind="default" onClick={onClose}>Cancel</Btn>
        <Btn kind="primary" icon="check" disabled={!name.trim()} onClick={() => onSave({ name: name.trim(), phone: phone.trim() || "—", email: email.trim() })}>Save</Btn>
      </>}>
      <div className="tb-form">
        <div className="tb-form-row">
          <label className="tb-label">Full name</label>
          <input className="tb-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Maya Chen" autoFocus />
        </div>
        <div className="tb-form-row two">
          <div className="tb-form-row">
            <label className="tb-label">Phone</label>
            <input className="tb-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="555-0100" />
          </div>
          <div className="tb-form-row">
            <label className="tb-label">Loyalty</label>
            <input className="tb-input" defaultValue="Silver" />
          </div>
        </div>
        <div className="tb-form-row">
          <label className="tb-label">Email <span style={{ fontWeight: 400, color: "var(--text-subtle)" }}>(for e-receipt)</span></label>
          <input className="tb-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@email.com" />
        </div>
      </div>
    </Modal>
  );
}
