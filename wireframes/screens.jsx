/* TbPos — Dashboard, Products, Inventory, Orders, Settings */

function Dashboard() {
  const TB = window.TB;
  const dark = document.documentElement.getAttribute("data-theme") === "dark";
  const accent = "var(--primary)";
  const totalSales = TB.sales.reduce((a, b) => a + b, 0);
  const pays = [["Card", 58, "var(--primary)"], ["Cash", 27, "var(--success)"], ["QR", 15, "var(--accent-2)"]];
  let acc = 0;
  const segs = pays.map(([n, v, c]) => { const s = acc; acc += v; return `${c} ${s}% ${acc}%`; }).join(", ");

  return (
    <div className="tb-page">
      <PageHead title="Dashboard" sub="Today · Downtown · Register 1">
        <Segmented size="sm" value="today" onChange={() => {}}
          options={[{ value: "today", label: "Today" }, { value: "week", label: "Week" }, { value: "month", label: "Month" }]} />
        <Btn kind="default" icon="refresh">Refresh</Btn>
      </PageHead>

      <div className="tb-grid4">
        <StatCard label="Gross Sales" value={TB.money(totalSales)} delta="12.4%" deltaDir="up" icon="dollar" accent="var(--primary)" />
        <StatCard label="Transactions" value="142" delta="8.1%" deltaDir="up" icon="receipt" accent="var(--success)" />
        <StatCard label="Avg. Basket" value={TB.money(totalSales / 142)} delta="3.2%" deltaDir="up" icon="cart" accent="var(--accent-2)" />
        <StatCard label="Items Sold" value="389" delta="2.0%" deltaDir="down" icon="box" accent="var(--warning)" />
      </div>

      <div className="tb-grid2 tb-mt">
        <div className="tb-panel">
          <div className="tb-panel-head">
            <div><h3>Sales by Hour</h3><div className="sub">Revenue across opening hours</div></div>
            <Chip tone="success"><Icon name="arrowup" size={13} /> Peak 18:00</Chip>
          </div>
          <BarChart labels={TB.hours} values={TB.sales} accent="linear-gradient(180deg, var(--primary), var(--accent-2))" height={170} />
        </div>
        <div className="tb-panel">
          <div className="tb-panel-head"><div><h3>Payment Mix</h3><div className="sub">By transaction count</div></div></div>
          <div className="tb-donut-wrap">
            <div className="tb-donut" style={{ background: `conic-gradient(${segs})` }}>
              <div className="tb-donut-c"><b>142</b><span>orders</span></div>
            </div>
            <div className="tb-legend">
              {pays.map(([n, v, c]) => (
                <div className="tb-legrow" key={n}>
                  <span className="tb-legdot" style={{ background: c }} />
                  <span className="nm">{n}</span><span className="vl tnum">{v}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="tb-grid2 tb-mt">
        <div className="tb-panel">
          <div className="tb-panel-head"><div><h3>Top Products</h3><div className="sub">Best sellers today</div></div><Btn kind="ghost" size="sm" iconRight="chevron">View all</Btn></div>
          <div className="tb-rank">
            {TB.topProducts.map((p, i) => {
              const max = TB.topProducts[0].units;
              return (
                <div className="tb-rankrow" key={p.name}>
                  <span className="tb-rank-no">{i + 1}</span>
                  <div className="tb-rank-main">
                    <div className="tb-rank-name">{p.name}</div>
                    <div className="tb-rank-bar"><i style={{ width: (p.units / max * 100) + "%" }} /></div>
                  </div>
                  <div className="tb-rank-val"><b className="tnum">{p.units}</b><span>{TB.money(p.revenue)}</span></div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="tb-panel">
          <div className="tb-panel-head"><div><h3>Low Stock Alerts</h3><div className="sub">Reorder soon</div></div><Chip tone="warning">4 items</Chip></div>
          <div className="tb-rank">
            {TB.products.filter(p => p.stock > 0 && p.stock <= 9).slice(0, 5).map(p => (
              <div className="tb-rankrow" key={p.id}>
                <Tile name={p.name} cat={p.cat} size="sm" />
                <div className="tb-rank-main"><div className="tb-rank-name">{p.name}</div><div className="sub" style={{ fontSize: 12, color: "var(--text-subtle)" }}>#{p.sku}</div></div>
                <Chip tone={p.stock <= 6 ? "danger" : "warning"}>{p.stock} left</Chip>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Products() {
  const TB = window.TB;
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const list = TB.products.filter(p =>
    (cat === "all" || p.cat === cat) &&
    (p.name.toLowerCase().includes(q.toLowerCase()) || p.sku.includes(q)));
  return (
    <div className="tb-page">
      <PageHead title="Products" sub={`${TB.products.length} items across ${TB.CATS.length - 1} categories`}>
        <Btn kind="default" icon="filter" className="tb-hide-sm">Filters</Btn>
        <Btn kind="primary" icon="plus" onClick={() => setAddOpen(true)}>Add Product</Btn>
      </PageHead>
      <div className="tb-tablewrap">
        <div className="tb-tabletools">
          <SearchField value={q} onChange={setQ} placeholder="Search by name or SKU…" />
          <select className="tb-select" value={cat} onChange={e => setCat(e.target.value)}>
            {TB.CATS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="tb-table">
            <thead><tr>
              <th>Product</th><th className="tb-hide-sm">SKU</th><th className="tb-hide-sm">Category</th>
              <th className="r">Price</th><th className="r">Stock</th><th className="r">Status</th><th></th>
            </tr></thead>
            <tbody>
              {list.map(p => (
                <tr key={p.id}>
                  <td><div className="tb-cellprod"><Tile name={p.name} cat={p.cat} size="sm" /><div className="tb-cellprod-main"><b>{p.name}</b><span>{TB.catName[p.cat]}</span></div></div></td>
                  <td className="tb-hide-sm"><span className="tb-mono">{p.sku}</span></td>
                  <td className="tb-hide-sm"><Chip>{TB.catName[p.cat]}</Chip></td>
                  <td className="r"><b className="tnum"><Money v={p.price} /></b></td>
                  <td className="r tnum" style={{ fontWeight: 600 }}>{p.stock}</td>
                  <td className="r">{p.stock === 0 ? <Chip tone="danger">Out</Chip> : p.stock <= 9 ? <Chip tone="warning">Low</Chip> : <Chip tone="success">In stock</Chip>}</td>
                  <td className="r" style={{ width: 48 }} onClick={e => e.stopPropagation()}>
                    <Menu align="right" trigger={<IconBtn name="dots" kind="ghost" />} items={[
                      { label: "Edit product", icon: "edit", onClick: () => tbToast.info("Edit " + p.name) },
                      { label: "Duplicate", icon: "copy", onClick: () => tbToast.success("Duplicated", p.name) },
                      { label: "Restock", icon: "package", onClick: () => tbToast.info("Restock " + p.name) },
                      { divider: true },
                      { label: "Delete", icon: "trash", danger: true, onClick: async () => {
                        const ok = await tbConfirm({ intent: "danger", icon: "trash", title: "Delete product?", message: `“${p.name}” will be removed from your catalog.`, confirmText: "Delete", confirmIcon: "trash" });
                        if (ok) tbToast.success("Product deleted", p.name);
                      } },
                    ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ProductModal open={addOpen} onClose={() => setAddOpen(false)}
        onSave={(name) => { setAddOpen(false); tbToast.success("Product added", (name || "New product") + " is now in your catalog"); }} />
    </div>
  );
}

function ProductModal({ open, onClose, onSave }) {
  const TB = window.TB;
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [cat, setCat] = useState("drinks");
  useEffect(() => { if (open) { setName(""); setPrice(""); setCat("drinks"); } }, [open]);
  return (
    <Modal open={open} onClose={onClose} size="md" icon="tag" title="Add product" sub="Create a new catalog item"
      footer={<>
        <Btn kind="default" onClick={onClose}>Cancel</Btn>
        <Btn kind="primary" icon="check" disabled={!name.trim() || !price} onClick={() => onSave(name.trim())}>Save product</Btn>
      </>}>
      <div className="tb-form">
        <div className="tb-form-row">
          <label className="tb-label">Product name</label>
          <input className="tb-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Cold Brew Coffee 330ml" autoFocus />
        </div>
        <div className="tb-form-row two">
          <div className="tb-form-row">
            <label className="tb-label">Price</label>
            <input className="tb-input tnum" value={price} onChange={e => setPrice(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="0.00" inputMode="decimal" />
          </div>
          <div className="tb-form-row">
            <label className="tb-label">Category</label>
            <select className="tb-input" value={cat} onChange={e => setCat(e.target.value)}>
              {TB.CATS.filter(c => c.id !== "all").map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className="tb-form-row two">
          <div className="tb-form-row">
            <label className="tb-label">SKU / Barcode</label>
            <input className="tb-input tb-mono" placeholder="Auto-generate" />
          </div>
          <div className="tb-form-row">
            <label className="tb-label">Opening stock</label>
            <input className="tb-input tnum" placeholder="0" inputMode="numeric" />
          </div>
        </div>
      </div>
    </Modal>
  );
}

function Inventory() {
  const TB = window.TB;
  const [q, setQ] = useState("");
  const [stockOpen, setStockOpen] = useState(false);
  const list = TB.products.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
  const lowCount = TB.products.filter(p => p.stock > 0 && p.stock <= 9).length;
  const outCount = TB.products.filter(p => p.stock === 0).length;
  const totalUnits = TB.products.reduce((s, p) => s + p.stock, 0);
  const stockVal = TB.products.reduce((s, p) => s + p.stock * p.price, 0);
  return (
    <div className="tb-page">
      <PageHead title="Inventory" sub="Stock levels & reorder management">
        <Btn kind="default" icon="print" className="tb-hide-sm">Export</Btn>
        <Btn kind="primary" icon="plus" onClick={() => setStockOpen(true)}>Stock In</Btn>
      </PageHead>
      <div className="tb-grid4" style={{ marginBottom: 22 }}>
        <StatCard label="Total Units" value={totalUnits.toLocaleString()} icon="package" accent="var(--primary)" />
        <StatCard label="Stock Value" value={TB.money(stockVal)} icon="dollar" accent="var(--success)" />
        <StatCard label="Low Stock" value={lowCount} icon="warn" accent="var(--warning)" />
        <StatCard label="Out of Stock" value={outCount} icon="x" accent="var(--danger)" />
      </div>
      <div className="tb-tablewrap">
        <div className="tb-tabletools">
          <SearchField value={q} onChange={setQ} placeholder="Search inventory…" />
          <Chip tone="warning"><Icon name="warn" size={13} /> {lowCount} low</Chip>
          <Chip tone="danger"><Icon name="x" size={13} /> {outCount} out</Chip>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="tb-table">
            <thead><tr><th>Product</th><th className="tb-hide-sm">SKU</th><th>Stock Level</th><th className="r tb-hide-sm">Reorder at</th><th className="r">Value</th></tr></thead>
            <tbody>
              {list.map(p => {
                const pct = Math.min(100, p.stock / 60 * 100);
                const color = p.stock === 0 ? "var(--danger)" : p.stock <= 9 ? "var(--warning)" : "var(--success)";
                return (
                  <tr key={p.id}>
                    <td><div className="tb-cellprod"><Tile name={p.name} cat={p.cat} size="sm" /><div className="tb-cellprod-main"><b>{p.name}</b><span>{TB.catName[p.cat]}</span></div></div></td>
                    <td className="tb-hide-sm"><span className="tb-mono">{p.sku}</span></td>
                    <td><div className="tb-stockbar"><div className="tb-stockbar-track"><i style={{ width: pct + "%", background: color }} /></div><b className="tnum" style={{ color }}>{p.stock}</b></div></td>
                    <td className="r tb-hide-sm tb-mono">10</td>
                    <td className="r"><b className="tnum"><Money v={p.stock * p.price} /></b></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <StockInDrawer open={stockOpen} onClose={() => setStockOpen(false)}
        onSave={(name, qty) => { setStockOpen(false); tbToast.success("Stock received", qty + " × " + name + " added to inventory", { icon: "package" }); }} />
    </div>
  );
}

function StockInDrawer({ open, onClose, onSave }) {
  const TB = window.TB;
  const [pid, setPid] = useState(TB.products[0].id);
  const [qty, setQty] = useState("");
  const [supplier, setSupplier] = useState("");
  useEffect(() => { if (open) { setPid(TB.products[0].id); setQty(""); setSupplier(""); } }, [open]);
  const prod = TB.products.find(p => p.id === pid);
  return (
    <Drawer open={open} onClose={onClose} side="right" title="Receive stock" sub="Add incoming units to inventory"
      footer={<>
        <Btn kind="default" onClick={onClose}>Cancel</Btn>
        <Btn kind="primary" icon="check" disabled={!qty} onClick={() => onSave(prod.name, qty)}>Receive {qty || ""} units</Btn>
      </>}>
      <div className="tb-form">
        <div className="tb-form-row">
          <label className="tb-label">Product</label>
          <select className="tb-input" value={pid} onChange={e => setPid(e.target.value)}>
            {TB.products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--r)" }}>
          <Tile name={prod.name} cat={prod.cat} size="sm" />
          <div style={{ flex: 1 }}><b style={{ fontSize: 14 }}>{prod.name}</b><div style={{ fontSize: 12, color: "var(--text-subtle)" }}>Current: {prod.stock} units · #{prod.sku}</div></div>
        </div>
        <div className="tb-form-row two">
          <div className="tb-form-row">
            <label className="tb-label">Quantity received</label>
            <input className="tb-input tnum" value={qty} onChange={e => setQty(e.target.value.replace(/[^0-9]/g, ""))} placeholder="0" inputMode="numeric" autoFocus />
          </div>
          <div className="tb-form-row">
            <label className="tb-label">Unit cost</label>
            <input className="tb-input tnum" placeholder="0.00" inputMode="decimal" />
          </div>
        </div>
        <div className="tb-form-row">
          <label className="tb-label">Supplier <span style={{ fontWeight: 400, color: "var(--text-subtle)" }}>(optional)</span></label>
          <input className="tb-input" value={supplier} onChange={e => setSupplier(e.target.value)} placeholder="e.g. Northwind Foods" />
        </div>
        <div className="tb-form-row">
          <label className="tb-label">Note</label>
          <textarea className="tb-input" placeholder="Delivery reference, batch, expiry…" />
        </div>
      </div>
    </Drawer>
  );
}

function Orders() {
  const TB = window.TB;
  const [sel, setSel] = useState(TB.orders[0]);
  const [q, setQ] = useState("");
  const list = TB.orders.filter(o => o.id.toLowerCase().includes(q.toLowerCase()) || o.customer.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="tb-page">
      <PageHead title="Orders" sub="Recent transactions & receipts">
        <Btn kind="default" icon="filter" className="tb-hide-sm">Today</Btn>
        <Btn kind="default" icon="print">Export</Btn>
      </PageHead>
      <div className="tb-grid2">
        <div className="tb-tablewrap">
          <div className="tb-tabletools"><SearchField value={q} onChange={setQ} placeholder="Search order # or customer…" /></div>
          <div style={{ overflowX: "auto" }}>
            <table className="tb-table">
              <thead><tr><th>Order</th><th className="tb-hide-sm">Customer</th><th>Pay</th><th className="r">Total</th><th className="r tb-hide-sm">Time</th></tr></thead>
              <tbody>
                {list.map(o => (
                  <tr key={o.id} onClick={() => setSel(o)} style={sel.id === o.id ? { background: "var(--primary-soft)" } : null}>
                    <td><b style={{ fontWeight: 700 }}>{o.id}</b><div style={{ fontSize: 12, color: "var(--text-subtle)" }}>{o.count} items</div></td>
                    <td className="tb-hide-sm">{o.customer}</td>
                    <td><Chip tone={o.pay === "Cash" ? "success" : o.pay === "QR" ? "primary" : "neutral"}>{o.pay}</Chip></td>
                    <td className="r"><b className="tnum"><Money v={o.total} /></b></td>
                    <td className="r tb-hide-sm" style={{ color: "var(--text-subtle)", fontSize: 13 }}>{o.ago}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="tb-panel" style={{ alignSelf: "start" }}>
          <div className="tb-panel-head">
            <div><h3>{sel.id}</h3><div className="sub">{sel.customer} · {sel.ago}</div></div>
            {sel.status === "Refunded" ? <Chip tone="danger">Refunded</Chip> : <Chip tone="success"><Icon name="check" size={13} /> {sel.status}</Chip>}
          </div>
          <div className="tb-orddetail">
            {sel.items.map((it, i) => (
              <div className="tb-ord-line" key={i}>
                <span><b className="tnum" style={{ color: "var(--text-muted)" }}>{it.qty}×</b> &nbsp;{it.name}</span>
                <span className="tnum" style={{ fontWeight: 600 }}><Money v={it.qty * it.price} /></span>
              </div>
            ))}
          </div>
          <div className="tb-totals" style={{ marginTop: 16 }}>
            <div className="tb-totrow"><span>Subtotal</span><Money v={sel.subtotal} /></div>
            <div className="tb-totrow"><span>Tax</span><Money v={sel.tax} /></div>
            <div className="tb-totrow grand"><span>Total</span><Money v={sel.total} /></div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <Btn kind="default" icon="print" full onClick={() => tbToast.info("Reprinting receipt", sel.id)}>Reprint</Btn>
            <Btn kind="danger" icon="refresh" full disabled={sel.status === "Refunded"} onClick={async () => {
              const ok = await tbConfirm({ intent: "danger", icon: "refresh", title: "Refund " + sel.id + "?", message: `${window.TB.money(sel.total)} will be returned to the customer via ${sel.pay}. This action is logged.`, confirmText: "Refund " + window.TB.money(sel.total), confirmIcon: "refresh" });
              if (ok) tbToast.success("Refund issued", window.TB.money(sel.total) + " returned · " + sel.id);
            }}>Refund</Btn>
            <Menu align="right" up trigger={<IconBtn name="dots" kind="outline" />} items={[
              { label: "Email receipt", icon: "receipt", onClick: () => tbToast.info("Receipt emailed", sel.customer) },
              { label: "Duplicate as new sale", icon: "copy", onClick: () => tbToast.success("Loaded to cart", sel.id) },
              { divider: true },
              { label: "Report an issue", icon: "warn", danger: true, onClick: () => tbToast.warning("Issue reported", sel.id) },
            ]} />
          </div>
        </div>
      </div>
    </div>
  );
}

window.Dashboard = Dashboard;
window.Products = Products;
window.Inventory = Inventory;
window.Orders = Orders;
