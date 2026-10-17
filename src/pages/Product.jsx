import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Bone, Play, Box, Shield, LockKeyhole, Eye, EyeOff, ShoppingCart, MonitorDown, Cpu } from 'lucide-react';
import { licenses } from '../data/products';

export default function Product({ products, addToCart }) {
  const { id } = useParams();
  const product = useMemo(() => products.find(p => p.id === id), [products, id]);
  const [license, setLicense] = useState('personal');
  const [adultUnlocked, setAdultUnlocked] = useState(false);
  if (!product) return <div className="panel not-found"><h2>ASSET NOT FOUND</h2><Link to="/">Return to market</Link></div>;

  const locked = product.nsfw && !adultUnlocked;
  return (
    <section className="product-page">
      <Link className="back-link" to="/"><ArrowLeft size={15}/> BACK TO MARKET</Link>
      <div className="product-layout">
        <div className="product-visual panel">
          <div className="visual-label">ASSET_PREVIEW // {product.id}</div>
          {product.model ? <model-viewer src={product.model} camera-controls auto-rotate shadow-intensity="1" style={{width:'100%',height:'100%'}}/> : <img src={product.image} alt={product.title} className={locked ? 'nsfw-blur strong' : ''}/>} 
          {locked && <div className="adult-gate"><LockKeyhole size={34}/><h3>18+ PREVIEW</h3><p>This product is marked for mature workflows. Store previews remain censored until confirmed.</p><button className="ghost" onClick={()=>setAdultUnlocked(true)}><Eye size={16}/> I AM 18+ // REVEAL CENSORED PREVIEW</button></div>}
          {product.nsfw && adultUnlocked && <button className="relock" onClick={()=>setAdultUnlocked(false)}><EyeOff size={14}/> CENSOR</button>}
        </div>
        <div className="product-info">
          <div className="eyebrow">{product.category} // ASSET ID {product.id.toUpperCase()}</div>
          <h1>{product.title}</h1>
          <p className="lead">{product.description}</p>
          <div className="spec-grid">
            <div><small>RIGGED</small><strong>{product.rigged ? 'YES' : 'NO'}</strong><Bone/></div>
            <div><small>ANIMATIONS</small><strong>{product.animations || '—'}</strong><Play/></div>
            <div><small>GEOMETRY</small><strong>{product.poly}</strong><Box/></div>
            <div><small>TEXTURES</small><strong>{product.textures}</strong><Cpu/></div>
          </div>
          <div className="format-line"><span>FORMATS</span>{product.formats.map(f=><b key={f}>{f}</b>)}</div>
          <div className="detail-columns">
            <div><h3>PACKAGE CONTENTS</h3>{product.includes.map(x=><p key={x}><Check size={14}/>{x}</p>)}</div>
            <div><h3>GOOD FOR</h3>{product.uses.map(x=><p key={x}><Check size={14}/>{x}</p>)}</div>
          </div>
          <div className="license-box">
            <div className="license-title"><Shield size={18}/><div><small>SELECT LICENSE</small><strong>Usage rights</strong></div></div>
            {Object.entries(licenses).map(([key, data]) => <label key={key} className={`license-option ${license===key?'selected':''}`}><input type="radio" name="license" value={key} checked={license===key} onChange={()=>setLicense(key)}/><div><b>{data.label}</b><span>{data.summary}</span></div><strong>${product.prices[key]}</strong></label>)}
            <Link to="/licenses" className="text-link">Read full license summary →</Link>
          </div>
          <button className="primary big-buy" onClick={()=>addToCart(product, license)}><ShoppingCart size={18}/> ADD TO CART // ${product.prices[license]}</button>
          <div className="delivery-note"><MonitorDown size={16}/><span><b>Digital product.</b> After verified payment, the secure backend generates time-limited download links.</span></div>
        </div>
      </div>
    </section>
  );
}
