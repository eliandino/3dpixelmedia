import { Link } from 'react-router-dom';
import { Box, Bone, Play, LockKeyhole, ShoppingBag } from 'lucide-react';

export default function ProductCard({ product, addToCart }) {
  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="card-media">
        <img src={product.image} alt={product.title} className={product.nsfw ? 'nsfw-blur' : ''}/>
        <div className="card-overlay" />
        <div className="card-topline">
          <span>{product.category}</span>
          {product.nsfw && <span className="adult"><LockKeyhole size={12}/> 18+</span>}
        </div>
      </Link>
      <div className="card-body">
        <Link to={`/product/${product.id}`} className="card-title">{product.title}</Link>
        <p>{product.short}</p>
        <div className="badges">
          {product.rigged && <span><Bone size={12}/>RIGGED</span>}
          {product.animated && <span><Play size={12}/>ANIMATED</span>}
          <span><Box size={12}/>{product.formats[0]}</span>
        </div>
        <div className="card-bottom">
          <div><small>FROM</small><strong>${product.prices.personal}</strong></div>
          <button className="mini-buy" onClick={() => addToCart(product)} aria-label={`Add ${product.title} to cart`}><ShoppingBag size={17}/></button>
        </div>
      </div>
    </article>
  );
}
