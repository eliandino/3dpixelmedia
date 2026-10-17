import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import Stripe from 'stripe';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { catalog } from './catalog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const app = express();
const PORT = process.env.PORT || 3001;
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const DOWNLOAD_SECRET = process.env.DOWNLOAD_SECRET || 'development-only-change-me';
const allowed = (process.env.ALLOWED_ORIGINS || CLIENT_URL).split(',').map(x=>x.trim()).filter(Boolean);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin(origin, cb){ if (!origin || allowed.includes(origin)) return cb(null,true); cb(new Error('Origin not allowed')); } }));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_, res) => res.json({ ok: true, stripe: Boolean(stripe) }));

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    if (!stripe) return res.status(503).json({ error: 'Stripe is not configured on the server.' });
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    if (!items.length || items.length > 25) return res.status(400).json({ error: 'Cart is empty or too large.' });

    const verified = items.map((item, index) => {
      const product = catalog[item.id];
      const license = item.license === 'commercial' ? 'commercial' : 'personal';
      const quantity = Math.min(Math.max(Number(item.quantity) || 1, 1), 10);
      if (!product) throw new Error(`Unknown product at item ${index + 1}`);
      return { id: item.id, product, license, quantity };
    });

    const metadata = {};
    verified.forEach((i, idx) => { metadata[`item_${idx}`] = `${i.id}|${i.license}|${i.quantity}`; });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: verified.map(i => ({
        quantity: i.quantity,
        price_data: {
          currency: 'usd',
          unit_amount: i.product.prices[i.license],
          product_data: { name: `${i.product.title} — ${i.license} license` }
        }
      })),
      customer_creation: 'always',
      allow_promotion_codes: true,
      metadata,
      success_url: `${CLIENT_URL}/#/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/#/`
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || 'Unable to create checkout session.' });
  }
});

function signDownload(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', DOWNLOAD_SECRET).update(body).digest('base64url');
  return `${body}.${sig}`;
}
function verifyDownload(token) {
  const [body, sig] = String(token).split('.');
  if (!body || !sig) return null;
  const expected = crypto.createHmac('sha256', DOWNLOAD_SECRET).update(body).digest('base64url');
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  if (!payload.exp || Date.now() > payload.exp) return null;
  return payload;
}

function parseSessionItems(metadata = {}) {
  return Object.entries(metadata).filter(([k]) => k.startsWith('item_')).sort(([a],[b]) => a.localeCompare(b, undefined, {numeric:true})).map(([,v]) => {
    const [id, license, qty] = String(v).split('|');
    return { id, license, quantity: Number(qty) || 1 };
  });
}

app.get('/api/order', async (req, res) => {
  try {
    if (!stripe) return res.status(503).json({ error: 'Stripe is not configured.' });
    const sessionId = req.query.session_id;
    if (!sessionId) return res.status(400).json({ error: 'Missing session_id.' });
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') return res.status(402).json({ error: 'Payment is not verified as paid.' });
    const items = parseSessionItems(session.metadata);
    const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const downloads = items.map(i => {
      const product = catalog[i.id];
      if (!product) return null;
      const token = signDownload({ productId:i.id, sessionId, exp });
      return { title: product.title, license: i.license, quantity: i.quantity, url: `/api/download/${encodeURIComponent(token)}` };
    }).filter(Boolean);
    res.json({ sessionId, customerEmail: session.customer_details?.email || null, downloads });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Unable to verify this order.' });
  }
});

app.get('/api/download/:token', (req, res) => {
  try {
    const payload = verifyDownload(req.params.token);
    if (!payload) return res.status(403).send('Download link is invalid or expired.');
    const product = catalog[payload.productId];
    if (!product) return res.status(404).send('Product not found.');
    const filePath = path.join(ROOT, 'digital-products', product.file);
    if (!fs.existsSync(filePath)) return res.status(404).send('Product file has not been uploaded to the server yet.');
    res.download(filePath, product.file);
  } catch {
    res.status(403).send('Invalid download token.');
  }
});

const dist = path.join(ROOT, 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (_, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.listen(PORT, () => console.log(`3DPIXEL//MEDIA server running on http://localhost:${PORT}`));
