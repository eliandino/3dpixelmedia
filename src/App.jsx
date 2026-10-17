import { useEffect, useMemo, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, ShieldCheck, Cpu, Download, Instagram } from 'lucide-react';
import { products } from './data/products';
import Home from './pages/Home';
import Product from './pages/Product';
import Success from './pages/Success';
import Licenses from './pages/Licenses';
import CartDrawer from './components/CartDrawer';

const CART_KEY = '3dpixelmedia-cart-v1';

function App() {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => localStorage.setItem(CART_KEY, JSON.stringify(cart)), [cart]);

  const count = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  function addToCart(product, license = 'personal') {
    setCart(current => {
      const hit = current.find(i => i.id === product.id && i.license === license);
      if (hit) return current.map(i => i === hit ? { ...i, quantity: i.quantity + 1 } : i);
      return [...current, { id: product.id, license, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function updateQty(index, quantity) {
    setCart(current => current.map((item, i) => i === index ? { ...item, quantity: Math.max(1, quantity) } : item));
  }

  function removeItem(index) {
    setCart(current => current.filter((_, i) => i !== index));
  }

  function clearCart() { setCart([]); }

  return (
    <div className="app-shell">
      <div className="scanlines" aria-hidden="true" />
      <header className="topbar">
        <Link to="/" className="brand" onClick={() => setMobileOpen(false)}>
          <span className="brand-mark">3D</span>
          <span>PIXEL<span className="slash">//</span>MEDIA</span>
        </Link>
        <nav className={mobileOpen ? 'nav open' : 'nav'}>
          <Link to="/" onClick={() => setMobileOpen(false)}>MARKET</Link>
          <a href="/#/?category=Characters" onClick={() => setMobileOpen(false)}>CHARACTERS</a>
          <a href="/#/?category=Vehicles" onClick={() => setMobileOpen(false)}>VEHICLES</a>
          <Link to="/licenses" onClick={() => setMobileOpen(false)}>LICENSES</Link>
        </nav>
        <div className="header-actions">
          <button className="icon-btn mobile-menu" onClick={() => setMobileOpen(v => !v)} aria-label="Menu">{mobileOpen ? <X size={20}/> : <Menu size={20}/>}</button>
          <button className="cart-button" onClick={() => setCartOpen(true)}><ShoppingCart size={18}/> <span>CART</span><b>{count}</b></button>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
          <Route path="/product/:id" element={<Product products={products} addToCart={addToCart} />} />
          <Route path="/success" element={<Success clearCart={clearCart} />} />
          <Route path="/licenses" element={<Licenses />} />
          <Route path="*" element={<div className="not-found panel"><h1>404 // SIGNAL LOST</h1><button className="primary" onClick={() => navigate('/')}>RETURN TO MARKET</button></div>} />
        </Routes>
      </main>

      <footer className="footer">
        <div><span className="brand small">3DPIXEL<span className="slash">//</span>MEDIA</span><p>Digital assets for unreal worlds.</p></div>
        <div className="footer-grid">
          <span><ShieldCheck size={15}/> LICENSED ASSETS</span>
          <span><Cpu size={15}/> PRODUCTION READY</span>
          <span><Download size={15}/> DIGITAL DELIVERY</span>
          <span><Instagram size={15}/> SOCIAL READY</span>
        </div>
      </footer>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        products={products}
        updateQty={updateQty}
        removeItem={removeItem}
      />
    </div>
  );
}

export default App;
