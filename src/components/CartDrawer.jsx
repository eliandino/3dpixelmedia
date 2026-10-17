import { X, Trash2, Lock, ArrowRight } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '';

export default function CartDrawer({ open, onClose, cart, products, updateQty, removeItem }) {
  const detailed = cart.map((item, index) => ({ ...item, index, product: products.find(p => p.id === item.id) })).filter(i => i.product);
  const total = detailed.reduce((sum, i) => sum + i.product.prices[i.license] * i.quantity, 0);

  async function checkout() {
    try {
      const res = await fetch(`${API}/api/create-checkout-session`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ items: cart })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      window.location.href = data.url;
    } catch (err) {
      alert(`${err.message}\n\nFor local testing, add your Stripe key to .env and run the backend.`);
    }
  }

  return (
    <>
      <div className={`drawer-backdrop ${open ? 'show' : ''}`} onClick={onClose}/>
      <aside className={`cart-drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div className="drawer-head"><div><small>SECURE LOADOUT</small><h2>YOUR CART</h2></div><button className="icon-btn" onClick={onClose}><X/></button></div>
        <div className="cart-list">
          {detailed.length === 0 && <div className="empty-cart"><div className="radar"/><h3>NO ASSETS DETECTED</h3><p>Add something dangerous-looking and polygonal.</p></div>}
          {detailed.map(i => (
            <div className="cart-line" key={`${i.id}-${i.license}-${i.index}`}>
              <img src={i.product.image} alt=""/>
              <div className="cart-line-info">
                <strong>{i.product.title}</strong>
                <span>{i.license.toUpperCase()} LICENSE</span>
                <div className="qty"><button onClick={() => updateQty(i.index, i.quantity - 1)}>-</button><b>{i.quantity}</b><button onClick={() => updateQty(i.index, i.quantity + 1)}>+</button></div>
              </div>
              <div className="cart-price"><b>${i.product.prices[i.license] * i.quantity}</b><button onClick={() => removeItem(i.index)}><Trash2 size={15}/></button></div>
            </div>
          ))}
        </div>
        <div className="drawer-footer">
          <div className="total-row"><span>TOTAL</span><strong>${total.toFixed(2)}</strong></div>
          <button className="primary checkout" disabled={!detailed.length} onClick={checkout}><Lock size={16}/> SECURE CHECKOUT <ArrowRight size={18}/></button>
          <p className="microcopy">Payment is processed by Stripe. Asset prices are validated on the server, not trusted from the browser.</p>
        </div>
      </aside>
    </>
  );
}
