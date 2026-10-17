import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const categories = ['All', 'Characters', 'Vehicles', 'Objects', '2D Rigs'];

export default function Home({ products, addToCart }) {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(params.get('category') || 'All');
  const [riggedOnly, setRiggedOnly] = useState(false);
  const [animatedOnly, setAnimatedOnly] = useState(false);
  const [hideAdult, setHideAdult] = useState(false);

  useEffect(() => {
    const c = params.get('category');
    if (c && categories.includes(c)) setCategory(c);
  }, [params]);

  const filtered = useMemo(() => products.filter(p => {
    const text = `${p.title} ${p.short} ${p.formats.join(' ')} ${p.category}`.toLowerCase();
    return (category === 'All' || p.category === category) &&
      text.includes(query.toLowerCase()) &&
      (!riggedOnly || p.rigged) &&
      (!animatedOnly || p.animated) &&
      (!hideAdult || !p.nsfw);
  }), [products, category, query, riggedOnly, animatedOnly, hideAdult]);

  function chooseCategory(c) {
    setCategory(c);
    if (c === 'All') setParams({}); else setParams({ category: c });
  }

  return (
    <>
      <section className="hero">
        <div className="hero-grid"/>
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse-dot"/> DIGITAL ASSET MARKET // NODE 03</div>
          <h1>BUILD WORLDS.<br/><span>BREAK REALITY.</span></h1>
          <p>Premium 3D characters, vehicles, objects, rigged assets, animation packs and 2D talking rigs for games, films, AR/VR and impossible little ideas humans insist on making real.</p>
          <div className="hero-actions">
            <a href="#market" className="primary">ENTER MARKET</a>
            <a href="#featured" className="ghost">VIEW FEATURED</a>
          </div>
        </div>
        <div className="hero-terminal">
          <div className="terminal-head"><span/><span/><span/><b>MARKET_STATUS.log</b></div>
          <pre>{`> catalog.mount()\n[OK] CHARACTER ASSETS\n[OK] VEHICLE SYSTEMS\n[OK] RIGGED / ANIMATED\n[OK] 2D TALKING RIGS\n[WARN] 18+ SECTOR GATED\n\nSTATUS: MARKET ONLINE_`}</pre>
        </div>
      </section>

      <section className="trust-strip">
        <span><Sparkles size={17}/> ORIGINAL ASSETS</span><span><ShieldCheck size={17}/> CLEAR LICENSING</span><span><Zap size={17}/> INSTANT DIGITAL DELIVERY</span>
      </section>

      <section id="market" className="market-section">
        <div className="section-head"><div><small>// ASSET INDEX</small><h2>MARKETPLACE</h2></div><span>{filtered.length.toString().padStart(2, '0')} RESULTS</span></div>
        <div className="market-tools">
          <label className="search-box"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search characters, GLB, cars..."/></label>
          <div className="category-tabs">{categories.map(c => <button key={c} className={category===c?'active':''} onClick={()=>chooseCategory(c)}>{c}</button>)}</div>
        </div>
        <div className="filter-row"><span><SlidersHorizontal size={15}/> FILTERS</span><label><input type="checkbox" checked={riggedOnly} onChange={e=>setRiggedOnly(e.target.checked)}/> Rigged</label><label><input type="checkbox" checked={animatedOnly} onChange={e=>setAnimatedOnly(e.target.checked)}/> Animated</label><label><input type="checkbox" checked={hideAdult} onChange={e=>setHideAdult(e.target.checked)}/> Hide 18+</label></div>
        <div id="featured" className="product-grid">{filtered.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart}/>)}</div>
        {!filtered.length && <div className="no-results">NO MATCHING ASSETS // ADJUST SEARCH PARAMETERS</div>}
      </section>

      <section className="creator-banner">
        <div><small>FOR DEVELOPERS // FILMMAKERS // DESIGNERS</small><h2>LICENSE IT. MODIFY IT. SHIP YOUR WORLD.</h2><p>Each asset lists formats, rigging, animation data, intended uses and licensing before purchase.</p></div>
        <div className="binary">01001101 01000101 01000100 01001001 01000001</div>
      </section>
    </>
  );
}
