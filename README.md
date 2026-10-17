# 3DPIXEL//MEDIA Store

A dark cyberpunk digital-asset storefront for 3D characters, vehicles, props, rigged/animated models, mature 18+ assets, and 2D talking rigs.

## What is included

- React + Vite storefront
- Search and category filters
- Rigged / animated / hide-18+ filters
- Product detail pages
- Personal vs commercial licensing
- Shopping cart saved in localStorage
- Mature-content preview gate + blur
- `<model-viewer>` support for GLB previews
- Stripe Checkout backend
- Server-side price validation
- Paid-session verification
- Signed time-limited download links
- GitHub Pages deployment workflow for the frontend
- Express production server option for deploying frontend + API together

## Important architecture note

GitHub Pages is static hosting. Never put a Stripe secret key, protected ZIP file, or purchase verification logic in the GitHub Pages frontend. This project keeps payment and download authorization in `/server`.

### Recommended setup for your existing WordPress domain

Keep WordPress at `3dpixelmedia.com` while you build. Use a subdomain such as `store.3dpixelmedia.com` for this storefront. Point the storefront frontend to GitHub Pages or a full-stack host. Host `/server` on Render, Railway, Fly.io, a VPS, or another Node-capable host.

A simpler production deployment is to deploy the entire repository to one Node host, run `npm run build`, then `npm start`. In that case the same server serves both the shop and payment API.

## Local setup

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`.

Add a Stripe test secret key to `.env` before testing checkout.

## Stripe setup

The backend creates Stripe Checkout Sessions dynamically. Product prices are defined again in `server/catalog.js` so browser users cannot change the amount by editing JavaScript.

Replace test mode with live mode only after your policies, products, licenses, taxes, and fulfillment have been tested.

## Add your real products

1. Edit `src/data/products.js` for storefront product data.
2. Mirror the trusted price in `server/catalog.js` in cents.
3. Put the purchased ZIP in `digital-products/` using the exact filename listed in `server/catalog.js`.
4. Replace the placeholder SVG image with your product render.
5. Optional: add a `.glb` preview URL/path to the product's `model` field.

For large paid files, do **not** keep all production assets in a public GitHub repository. Move them to private object storage such as S3/R2/Supabase Storage and generate signed URLs after payment.

## GitHub Pages frontend deployment

1. Push this repository to GitHub.
2. In repository Settings → Pages, choose **GitHub Actions** as the source.
3. Deploy your backend separately.
4. Add a repository Actions secret named `VITE_API_URL`, for example `https://api.3dpixelmedia.com`.
5. Run the workflow or push to `main`.

For a custom domain, configure it in GitHub Pages settings and your DNS provider. A subdomain such as `store.3dpixelmedia.com` is safer while your WordPress root domain stays live.

## Suggested production upgrades

- User accounts + purchase library
- Supabase/Postgres order database
- S3 / Cloudflare R2 private asset storage
- Stripe webhook fulfillment and email download delivery
- Watermarked preview renders
- Wishlist / favorites
- Reviews and ratings after verified purchase
- Creator dashboard / admin CMS
- Product bundles
- Discount codes
- Version history and free updates for previous buyers
- Asset dependencies and supported-engine versions
- Refund, privacy, EULA, DMCA and 18+ policies
- Tax/VAT configuration
- Malware scanning for downloadable archives
- Per-order download limits and audit logs

## Mature content

The demo includes an `nsfw` flag, blurred preview and 18+ confirmation on the product page. That is only a UI layer. Before selling adult assets, add jurisdiction-appropriate age/content policies, payment-processor compliance, content moderation, and legal review.

## Test digital products

The files in `digital-products/` are tiny placeholder ZIPs so you can verify the paid-download flow. Replace them before launch.

https://eliandino.github.io/3dpixelmedia/
