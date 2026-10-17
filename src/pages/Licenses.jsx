import { ShieldCheck, Ban, CheckCircle2 } from 'lucide-react';

export default function Licenses(){
  return <section className="legal-page"><div className="section-head"><div><small>// RIGHTS MATRIX</small><h1>LICENSES</h1></div></div>
    <div className="license-cards">
      <article className="panel"><ShieldCheck/><h2>PERSONAL LICENSE</h2><p>For personal art, learning, portfolios, non-monetized prototypes and private projects.</p><ul><li><CheckCircle2/>Modify the asset for your project</li><li><CheckCircle2/>Use in portfolio renders and demos</li><li><Ban/>No resale or redistribution of source files</li><li><Ban/>No commercial/monetized release</li></ul></article>
      <article className="panel"><ShieldCheck/><h2>COMMERCIAL LICENSE</h2><p>For monetized games, films, apps, client work, marketing and commercial content.</p><ul><li><CheckCircle2/>Modify and include in commercial projects</li><li><CheckCircle2/>Use in games, films, apps and client deliverables</li><li><CheckCircle2/>Sell the final project containing the asset</li><li><Ban/>Do not resell or redistribute the source asset as a competing asset pack</li></ul></article>
    </div>
    <div className="panel legal-note"><h3>Before launch</h3><p>Replace this starter summary with your final lawyer-reviewed EULA, refund policy, privacy policy, 18+ content rules, DMCA/contact process, and any platform-specific restrictions. Licensing language is the boring force field protecting the business, which is why everyone ignores it until something catches fire.</p></div>
  </section>
}
