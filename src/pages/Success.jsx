import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Download, Loader2, AlertTriangle } from 'lucide-react';
const API = import.meta.env.VITE_API_URL || '';

export default function Success({ clearCart }) {
  const [params] = useSearchParams();
  const [state, setState] = useState({ loading: true, order: null, error: '' });
  const sessionId = params.get('session_id');
  useEffect(() => {
    if (!sessionId) { setState({loading:false, order:null, error:'Missing checkout session.'}); return; }
    fetch(`${API}/api/order?session_id=${encodeURIComponent(sessionId)}`).then(async r => { const d=await r.json(); if(!r.ok) throw new Error(d.error||'Unable to verify order'); return d; }).then(order => { clearCart(); setState({loading:false, order, error:''}); }).catch(e=>setState({loading:false, order:null, error:e.message}));
  }, [sessionId]);
  if (state.loading) return <section className="success-page panel"><Loader2 className="spin"/><h1>VERIFYING PAYMENT...</h1></section>;
  if (state.error) return <section className="success-page panel"><AlertTriangle/><h1>ORDER CHECK FAILED</h1><p>{state.error}</p><Link to="/" className="ghost">RETURN TO MARKET</Link></section>;
  return <section className="success-page panel"><CheckCircle2 className="success-icon"/><small>PAYMENT VERIFIED</small><h1>DOWNLOAD NODE UNLOCKED</h1><p>Keep this page or save the files now. Starter download links expire after 7 days.</p><div className="download-list">{state.order.downloads.map((d,i)=><a className="download-row" key={i} href={`${API}${d.url}`}><span><b>{d.title}</b><small>{d.license.toUpperCase()} LICENSE</small></span><Download/></a>)}</div><Link to="/" className="ghost">CONTINUE SHOPPING</Link></section>;
}
