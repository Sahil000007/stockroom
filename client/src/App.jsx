import { useCallback, useEffect, useState } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Box, ChevronDown, CircleHelp, Command, LayoutDashboard, Plus, Search, Settings2, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { api } from './api.js';

const money = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);
const seedProducts = [
  { _id: 'demo-1', name: 'Studio Headphones', sku: 'AUD-2048', category: 'Audio', price: 129, quantity: 24, description: 'Over-ear studio headphones' },
  { _id: 'demo-2', name: 'Desk Lamp Mini', sku: 'HOM-1092', category: 'Home', price: 48, quantity: 8, description: 'Adjustable warm LED desk lamp' },
  { _id: 'demo-3', name: 'Field Notes Set', sku: 'STA-3301', category: 'Stationery', price: 18, quantity: 3, description: 'Three pocket notebooks' },
  { _id: 'demo-4', name: 'Everyday Tote', sku: 'ACC-5007', category: 'Accessories', price: 32, quantity: 42, description: 'Heavyweight cotton canvas tote' },
  { _id: 'demo-5', name: 'Ceramic Pour Over', sku: 'KIT-8820', category: 'Kitchen', price: 36, quantity: 0, description: 'Hand-finished ceramic dripper' },
  { _id: 'demo-6', name: 'Wireless Mouse', sku: 'TEC-7250', category: 'Technology', price: 76, quantity: 16, description: 'Ergonomic Bluetooth mouse' }
];
const blankForm = { name: '', sku: '', category: '', price: '', quantity: '', description: '' };

function App() {
  const [products, setProducts] = useState(seedProducts);
  const [connected, setConnected] = useState(false);
  const [notice, setNotice] = useState('');
  const refresh = useCallback(async () => {
    try { setProducts(await api.getProducts()); setConnected(true); }
    catch { setConnected(false); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  const mutate = async (operation, success) => {
    try { await operation(); await refresh(); setNotice(success); setTimeout(() => setNotice(''), 3000); }
    catch (error) { setNotice(error.message); setTimeout(() => setNotice(''), 4000); }
  };
  const location = useLocation();
  const isProducts = location.pathname === '/products';
  const totalValue = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
  const lowStock = products.filter((product) => product.quantity > 0 && product.quantity <= 10).length;
  const outOfStock = products.filter((product) => product.quantity === 0).length;

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Command size={17} strokeWidth={2.2}/></div><span>stockroom</span><span className="brand-tag">STUDIO</span></div>
      <div className="workspace"><div className="workspace-avatar">N</div><div className="workspace-copy"><strong>Northstar Goods</strong><small>Workspace</small></div><ChevronDown size={15} className="muted-icon"/></div>
      <div className="side-label">WORKSPACE</div>
      <nav className="main-nav">
        <NavLink end to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><LayoutDashboard size={17}/><span>Overview</span></NavLink>
        <NavLink to="/products" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><Box size={17}/><span>Products</span><span className="nav-count">{products.length}</span></NavLink>
      </nav>
      <div className="sidebar-bottom"><button className="nav-item"><Settings2 size={17}/><span>Settings</span></button><button className="nav-item"><CircleHelp size={17}/><span>Help & support</span></button><div className="profile"><div className="profile-avatar">JS</div><div className="profile-copy"><strong>Jordan Smith</strong><small>Free plan</small></div><ChevronDown size={15}/></div></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{isProducts ? 'Products' : 'Overview'}</strong></div><div className="top-actions"><div className={`connection ${connected ? 'online' : ''}`}><span className="status-dot"/>{connected ? 'Database connected' : 'Demo preview'}</div><button className="icon-button" aria-label="Search"><Search size={17}/></button><div className="top-avatar">JS</div></div></header>
      <div className="page-wrap"><Routes><Route path="/" element={<Dashboard products={products} totalValue={totalValue} lowStock={lowStock} outOfStock={outOfStock} />} /><Route path="/products" element={<Products products={products} connected={connected} onCreate={(form) => mutate(() => api.createProduct(form), 'Product added successfully.')} onUpdate={(id, form) => mutate(() => api.updateProduct(id, form), 'Product updated successfully.')} onDelete={(id) => mutate(() => api.deleteProduct(id), 'Product deleted successfully.')} />} /></Routes></div>
    </main>
    {notice && <div className="toast"><span className="toast-check">✓</span>{notice}<button onClick={() => setNotice('')}><X size={14}/></button></div>}
  </div>;
}

function PageHeading({ eyebrow, title, description, action }) { return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>; }

function Dashboard({ products, totalValue, lowStock, outOfStock }) {
  const recent = [...products].sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)).slice(0, 5);
  return <>
    <PageHeading eyebrow="SUNDAY, OCTOBER 11" title="Good morning, Jordan" description="Here's what's happening with your inventory today." action={<button className="button button-secondary"><Activity size={15}/>Last 30 days<ChevronDown size={14}/></button>} />
    <section className="metric-grid">
      <Metric label="Total products" value={products.length} trend="Across all categories" icon={<Box size={17}/>} tone="violet" />
      <Metric label="Inventory value" value={money(totalValue)} trend="At current retail price" icon={<ArrowUpRight size={17}/>} tone="green" />
      <Metric label="Low stock" value={lowStock} trend={lowStock ? 'Needs a quick look' : 'Everything is stocked'} icon={<ArrowDownRight size={17}/>} tone="amber" />
      <Metric label="Out of stock" value={outOfStock} trend={outOfStock ? 'Restock when ready' : 'All items available'} icon={<Box size={17}/>} tone="rose" />
    </section>
    <section className="dashboard-grid">
      <div className="panel inventory-panel"><div className="panel-heading"><div><h2>Recent products</h2><p>Your latest inventory updates</p></div><NavLink to="/products" className="text-link">View all <ArrowRight size={15}/></NavLink></div><ProductTable products={recent} compact /></div>
      <div className="panel insight-panel"><div className="insight-icon"><Sparkles size={17}/></div><div className="eyebrow">INVENTORY PULSE</div><h2>A little attention goes a long way.</h2><p>{lowStock + outOfStock > 0 ? `You have ${lowStock + outOfStock} ${lowStock + outOfStock === 1 ? 'item' : 'items'} that could use a restock. Keep your bestsellers ready for their next order.` : 'Your shelves look healthy. Every product is ready for its next order.'}</p><NavLink to="/products" className="insight-link">Review inventory <ArrowRight size={15}/></NavLink><div className="insight-decoration">✳</div></div>
    </section>
    <div className="footnote"><span className="tiny-dot"/>Inventory synced just now <span className="foot-separator">·</span> Changes save automatically</div>
  </>;
}

function Metric({ label, value, trend, icon, tone }) { return <div className="metric-card"><div className="metric-top"><span>{label}</span><div className={`metric-icon ${tone}`}>{icon}</div></div><div className="metric-value">{value}</div><div className="metric-trend">{trend}</div></div>; }

function Products({ products, connected, onCreate, onUpdate, onDelete }) {
  const [search, setSearch] = useState(''); const [category, setCategory] = useState('All categories'); const [modal, setModal] = useState(null);
  const categories = ['All categories', ...new Set(products.map((product) => product.category).filter(Boolean))];
  const filtered = products.filter((p) => `${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(search.toLowerCase()) && (category === 'All categories' || p.category === category));
  const save = (form) => { if (modal?.product) onUpdate(modal.product._id, form); else onCreate(form); setModal(null); };
  return <>
    <PageHeading eyebrow="YOUR CATALOG" title="Products" description="A clear view of everything on your shelves." action={<button className="button button-primary" onClick={() => setModal({})}><Plus size={16}/>Add product</button>} />
    {!connected && <div className="demo-banner"><Sparkles size={15}/><span>Showing sample products. Connect the API and MongoDB to create, edit, or delete saved products.</span></div>}
    <div className="panel products-panel"><div className="table-toolbar"><div className="search-field"><Search size={16}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."/><kbd>⌘ K</kbd></div><div className="toolbar-right"><label className="select-wrap"><SlidersHorizontal size={15}/><select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={14}/></label><button className="button button-secondary filter-button"><SlidersHorizontal size={15}/>Filters</button></div></div>
      <ProductTable products={filtered} onEdit={(product) => setModal({ product })} onDelete={(product) => { if (window.confirm(`Delete ${product.name}?`)) onDelete(product._id); }} />
      <div className="table-footer"><span>Showing <strong>{filtered.length ? 1 : 0}–{filtered.length}</strong> of <strong>{products.length}</strong> products</span><div className="pagination"><button disabled>←</button><button className="page-current">1</button><button disabled>→</button></div></div>
    </div>
    <div className="footnote"><span className="tiny-dot"/>{products.length} products in your catalog <span className="foot-separator">·</span> Changes save automatically</div>
    {modal && <ProductModal product={modal.product} onClose={() => setModal(null)} onSave={save} />}
  </>;
}

function ProductTable({ products, onEdit, onDelete, compact = false }) {
  if (!products.length) return <div className="empty-state"><Box size={24}/><strong>No products found</strong><span>Try another search or add a product to your catalog.</span></div>;
  return <div className="table-scroll"><table><thead><tr><th>PRODUCT</th><th>SKU</th><th>CATEGORY</th><th>PRICE</th><th>STOCK</th>{!compact && <th><span className="sr-only">Actions</span></th>}</tr></thead><tbody>{products.map((product, index) => <tr key={product._id}><td><div className="product-cell"><div className={`product-thumb thumb-${index % 5}`}>{product.name?.slice(0, 1).toUpperCase()}</div><div><strong>{product.name}</strong><small>{product.description || '—'}</small></div></div></td><td><span className="sku">{product.sku}</span></td><td><span className="category-pill">{product.category}</span></td><td className="price-cell">{money(product.price)}</td><td><Stock quantity={product.quantity}/></td>{!compact && <td><div className="row-actions"><button onClick={() => onEdit(product)} title="Edit product">Edit</button><button className="delete-action" onClick={() => onDelete(product)} title="Delete product">Delete</button></div></td>}</tr>)}</tbody></table></div>;
}

function Stock({ quantity }) { const kind = quantity === 0 ? 'out' : quantity <= 10 ? 'low' : 'good'; const label = kind === 'out' ? 'Out of stock' : kind === 'low' ? 'Low stock' : 'In stock'; return <span className={`stock ${kind}`}><i/>{label}<b>{quantity}</b></span>; }

function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(product ? { name: product.name, sku: product.sku, category: product.category, price: product.price, quantity: product.quantity, description: product.description || '' } : blankForm);
  const [error, setError] = useState(''); const field = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));
  const submit = (event) => { event.preventDefault(); if (!form.name.trim() || !form.sku.trim() || !form.category.trim()) return setError('Name, SKU, and category are required.'); if (Number(form.price) < 0 || Number(form.quantity) < 0) return setError('Price and quantity must be zero or more.'); onSave({ ...form, name: form.name.trim(), sku: form.sku.trim().toUpperCase(), category: form.category.trim(), price: Number(form.price), quantity: Number(form.quantity) }); };
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-heading"><div><div className="eyebrow">PRODUCT DETAILS</div><h2 id="modal-title">{product ? 'Edit product' : 'Add a product'}</h2><p>Keep your catalog tidy and up to date.</p></div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={18}/></button></div><form onSubmit={submit}><label>Product name<input autoFocus value={form.name} onChange={field('name')} placeholder="e.g. Studio Headphones" required maxLength="100"/></label><div className="form-row"><label>SKU<input value={form.sku} onChange={field('sku')} placeholder="e.g. AUD-2048" required/></label><label>Category<input value={form.category} onChange={field('category')} placeholder="e.g. Audio" required/></label></div><div className="form-row"><label>Price ($)<input type="number" min="0" step="0.01" value={form.price} onChange={field('price')} placeholder="0.00" required/></label><label>Quantity<input type="number" min="0" step="1" value={form.quantity} onChange={field('quantity')} placeholder="0" required/></label></div><label>Description <span className="optional">Optional</span><textarea value={form.description} onChange={field('description')} placeholder="A short description..." rows="3" maxLength="500"/></label>{error && <div className="form-error">{error}</div>}<div className="modal-actions"><button type="button" className="button button-secondary" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary">{product ? 'Save changes' : 'Add product'}</button></div></form></section></div>;
}

export default App;
