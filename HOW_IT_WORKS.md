# HOW IT WORKS — The Halla (Hala Jewels) Clone

This is a functional local clone of [halajewels.in](https://halajewels.in/), rebuilt as a MERN application
(MongoDB, Express, React, Node) with Tailwind CSS, React Router, and a full CMS-style admin panel.

The original site is a server-rendered PHP-style app (query-string routing, session-based cart, no JSON API).
This clone reimplements the same **visual design, layout, and user experience** as a modern single-page app
with a real REST API and database behind it, plus an admin panel the original site didn't expose to us.

---

## Architecture

```
jewels/
├── Server/                Express + Mongoose API
│   ├── src/
│   │   ├── config/db.js       Mongo connection (falls back to in-memory Mongo in dev)
│   │   ├── models/            Mongoose schemas
│   │   ├── controllers/       Route handlers (public + admin)
│   │   ├── routes/            publicRoutes.js, adminRoutes.js
│   │   ├── middleware/        auth (JWT), upload (multer), asyncHandler, errorHandler
│   │   ├── seed/seed.js       Seeds categories/products/content from real scraped assets
│   │   └── server.js          App entry point
│   └── uploads/                Static file storage (real downloaded images + admin uploads)
│
└── Client/                React 18 + Vite + Tailwind + React Router
    └── src/
        ├── api/client.js       Thin fetch wrapper (public + admin API)
        ├── context/            Cart, Wishlist, Toast, AdminAuth, SiteData (React Context)
        ├── components/site/    Header, Footer, ProductCard, MobileMenu, etc.
        ├── components/admin/   AdminLayout, Modal, ImageUploader, ProtectedRoute
        ├── pages/site/         Public storefront pages
        └── pages/admin/        Admin CMS pages
```

**Backend (Server)**
- **Express** serves a REST API under `/api/*` (public, no auth) and `/api/admin/*` (JWT-protected).
- **MongoDB via Mongoose** stores products, categories, tags, banners, testimonials, reels, static pages,
  site settings, orders, inquiries, and admin users.
- **No local MongoDB was pre-installed in this environment during initial testing**, so `config/db.js` first
  tries `MONGODB_URI` (default `mongodb://127.0.0.1:27017/hala-jewels`) and — only if that's unreachable —
  falls back to an in-memory MongoDB instance (`mongodb-memory-server`) so `npm run dev` always works out of
  the box. In this session a real local MongoDB turned out to be available, so all testing ran against real,
  persistent MongoDB — the in-memory path exists purely as a zero-config fallback for other machines.
- On every server start, `seed/seed.js` seeds the database **only if it's empty** (checked via product count),
  so a real MongoDB keeps your edits across restarts, while the in-memory fallback reseeds fresh each time.
- Images are served statically from `/uploads`. `Server/uploads/raw/admin/uploads/...` holds 358 real
  product/category/banner/testimonial photos and the site's logo/favicon downloaded directly from
  halajewels.in (see **Assets** below). Anything uploaded via the admin panel lands in `Server/uploads/media/`.

**Frontend (Client)**
- **React Router** handles all navigation client-side (no full page reloads) — mirrors the original's
  query-string routes (`category?cat=43`) as clean paths (`/category/anklets`).
- **Tailwind CSS** reimplements the original's hand-rolled CSS design system: the same color variables
  (`#1a1a1a` primary, `#efede9` secondary, `#142e25` accent, `#d9cfbd` border), the same Google Fonts
  (Inter for UI, Literata for headings), the same spacing/radius/shadow language.
- **Swiper (swiper/react)** powers the same three homepage carousels the original uses (Viral products,
  testimonials, and — on the product page — the image gallery + thumbnail strip), replacing the original's
  vanilla `swiper-bundle.js` CDN usage with the React bindings.
- **No client-side accounts.** Per the original site (which 404s on `/login`), cart and wishlist are
  **anonymous and stored in `localStorage`** via `CartContext`/`WishlistContext` — no login required, exactly
  like the real site's session-based (but here, device-based) cart.
- **Admin auth** is separate: a JWT issued on `/admin/login`, stored in `localStorage`, sent as
  `Authorization: Bearer <token>` on every `/api/admin/*` call. `ProtectedRoute` redirects to `/admin/login`
  if there's no valid session.

**Styling**: Tailwind utility classes throughout, with a handful of `@layer components` classes
(`.btn-primary`, `.btn-outline`, `.pill-button`, `.icon-btn`, `.section-title`) in `styles/index.css` for
patterns repeated across many components — mirrors the original's few reusable CSS classes without
hardcoding the same long className strings dozens of times.

**Assets**: All product photos, category tiles, the hero image, promo banners, and testimonial screenshots
are the **real images from halajewels.in**, downloaded once during development and stored locally in
`Server/uploads/raw/`. This was an explicit choice (confirmed with the project owner) since this is a
rebuild of an existing business's own site, not a public demo — reusing their real photography gives an
accurate result instead of placeholder stock photos. The one exception is the header logo: the live site's
own logo `<img>` tag was already broken in production (404s to a literal `hala-logoN.webp` placeholder
filename, with a fallback `onerror` to a text-placeholder image) — so the clone renders a clean **"The
Halla" text wordmark** in the header instead, which is effectively what real visitors already see.

---

## User Flow

**Browsing → product page → cart → checkout**
1. User action: opens `/` → **Component**: `Home.jsx` fetches `GET /api/homepage` → **Logic**:
   `publicController.getHomepage` aggregates categories, banners, viral products, testimonials, reels,
   settings in one call → **Result**: hero image, 13-category grid, viral carousel, promo banners, "For
   Minimal Girlies" grid, testimonials carousel, story grid, and embedded reels render.
2. User action: clicks a category tile or "Category" nav → **Component**: `CategoryPage.jsx` → **Logic**:
   `GET /api/products?category=<slug>` filters by category, no pagination UI (matches the original, which
   also renders the full result set on one page) → **Result**: product grid for that category.
2b. User action: uses the search bar, or clicks a promo tag ("Luxe in Hala", "Under 199", etc.) →
   **Component**: `SearchPage.jsx` → **Logic**: `GET /api/products?search=&tag=&price_range=&discount=&sort=`
   → **Result**: filtered/sorted grid, with live price-bucket counts, matching the original's filter sidebar
   + mobile "Filters & Sort" overlay behavior.
3. User action: clicks a product card → **Component**: `ProductDetail.jsx` → **Logic**:
   `GET /api/products/:slug` returns the product + related products → **Result**: image gallery with
   thumbnail strip and full-screen zoom, variant selector, live stock badge, quantity stepper, Add to
   Cart / Buy Now / Add to Wishlist.
4. User action: clicks "Add to Cart" → **Component**: `CartContext.addItem` → **Logic**: item (with a
   composite `productId_variantId` key) is pushed into React state and persisted to
   `localStorage['hala_cart_v1']` → **Result**: header cart badge updates instantly, a toast confirms.
5. User action: goes to `/cart`, adjusts quantity, clicks "Proceed to Checkout" → fills delivery form on
   `/checkout` → **Logic**: `POST /api/orders` creates an `Order` document (subtotal/total computed
   server-side from the submitted cart lines) → **Result**: a WhatsApp chat (`wa.me/<admin-configured
   number>`) opens in a new tab, pre-filled with the order number, customer details, and itemized order —
   this **is** the checkout/payment step, standing in for a payment gateway per the project's requirements
   (no Razorpay/Stripe integration; the admin-configured WhatsApp number is a placeholder until the real
   business number is entered in Settings). The cart clears and the user lands on an order confirmation page.
6. User action: later, visits `/track` with the order number + phone → **Logic**:
   `GET /api/orders/track?orderNumber=&phone=` looks the order up → **Result**: a status timeline
   (pending → confirmed → shipped → delivered) and itemized order summary.

**Admin CMS**
1. User action: visits `/admin/login`, signs in → **Component**: `AdminAuthContext.login` →
   **Logic**: `POST /api/admin/auth/login` verifies bcrypt-hashed password, returns a JWT → **Result**:
   token stored in `localStorage`, redirected into `/admin` (protected by `ProtectedRoute`).
2. Every admin page (`ProductsList`, `CategoriesAdmin`, `BannersAdmin`, `PagesAdmin`, `OrdersAdmin`,
   `InquiriesAdmin`, `SettingsAdmin`, `UsersAdmin`) follows the same pattern: fetch from
   `/api/admin/<resource>` with the JWT, render a table/grid, open a `Modal` with a form for create/edit,
   `PUT`/`POST`/`DELETE` back to the same resource, then re-fetch. `ProductForm` is the one dedicated
   full-page form (not a modal) because products have nested variants/images/specs/tags.
3. Editing **Homepage CMS** (`BannersAdmin.jsx`, tabbed: Banners / Testimonials / Reels / Tags) changes
   exactly the content blocks `Home.jsx` renders — e.g. editing the "hero" banner's image changes what
   shows at the top of the live site immediately (no rebuild needed, it's read from the database on every
   page load).
4. **Orders**: admin changes an order's status via a dropdown → `PUT /api/admin/orders/:id/status` →
   this is what the customer sees when they check `/track`.
5. **Settings**: the WhatsApp number, contact info, social links, offer bar text, and logo/favicon are all
   editable here and immediately affect the storefront (`SiteDataContext` fetches `/api/settings` on load).
6. **Admin Users**: a `superadmin` can create/delete other admin accounts and assign the `staff` role;
   `staff` accounts can manage content but cannot create/delete other admins (enforced both in the UI and
   server-side in `requireRole("superadmin")`).

---

## Component Map

```
App
├── SiteLayout                       (public site chrome)
│   ├── OfferBar
│   ├── Header
│   │   ├── (logo, desktop search)
│   │   ├── MobileMenu                (slide-in overlay, category accordion)
│   │   └── SearchPanel               (slide-down search overlay)
│   ├── <page content, see below>
│   ├── Footer
│   ├── WhatsAppFloat                 (desktop only)
│   └── MobileBottomNav               (mobile only)
│
├── Home                              hero, collections grid, viral swiper, promo banners,
│                                      "For Minimal Girlies" grid, mid-promo, testimonials swiper,
│                                      story grid, embedded reels
├── CategoryPage                      breadcrumb + ProductGrid (no filters, matches original)
├── SearchPage                        tag chips + filter sidebar/mobile overlay + sort + ProductGrid
├── ProductDetail                     gallery+thumbs swiper, zoom lightbox, variant/qty/price,
│                                      add-to-cart/wishlist, related ProductGrid
├── CartPage / WishlistPage           localStorage-backed, empty states match original copy
├── CheckoutPage                      delivery form → creates Order → opens WhatsApp
├── OrderConfirmation / TrackOrder
├── ContactUs                         info cards, WhatsApp-powered contact form, FAQ accordion
├── AboutUs / StaticPage (terms/shipping/privacy)   CMS-editable rich text
│
└── AdminLayout                       (admin chrome, JWT-protected via ProtectedRoute)
    ├── Dashboard                     stat cards, orders-by-status, recent orders
    ├── ProductsList / ProductForm    full catalog CRUD incl. variants/images/tags
    ├── CategoriesAdmin               grid + modal CRUD
    ├── BannersAdmin                  tabbed: Banners / Testimonials / Reels / Tags
    ├── PagesAdmin                    About/Terms/Shipping/Privacy rich-text editor + live preview
    ├── OrdersAdmin                   status management, order detail modal
    ├── InquiriesAdmin                contact-form submissions inbox
    ├── SettingsAdmin                 branding, offer bar, WhatsApp/contact, social links
    └── UsersAdmin                    admin account management (role-gated)
```

---

## Important Logic

- **`Server/src/seed/seed.js`** — reads every `img_*.webp` file downloaded from the live site's
  `admin/uploads/` folder, distributes ~10 per category across the 13 real categories (using real category
  cover photos + generated names in the site's actual naming style — coined names like "Aflah Anklet" mixed
  with descriptive ones like "Snake Chain Anklet", matching what we observed on the live site), and inserts
  the 3 real "Viral" products with their actual scraped names and photos. It only runs when the `Product`
  collection is empty, so admin edits survive server restarts against a real MongoDB.
- **`Server/src/middleware/asyncHandler.js`** — Express 4 doesn't catch promise rejections from `async`
  route handlers, and Node 20 crashes the whole process on an unhandled rejection by default. Every route
  handler is wrapped so thrown errors (bad ObjectIds, validation failures, etc.) become clean JSON 500
  responses instead of taking the server down.
- **`Server/src/controllers/crudFactory.js`** — Categories, Tags, Banners, Testimonials, and Reels all
  need identical list/get/create/update/delete behavior, so it's implemented once and reused, instead of
  five near-identical copy-pasted controllers.
- **`Client/src/context/CartContext.jsx` / `WishlistContext.jsx`** — cart/wishlist state lives in React
  Context, persisted to `localStorage` on every change, keyed so the same product with two different
  variants (e.g. two ring sizes) is tracked as two separate line items.
- **Stock-aware add-to-cart**: `CartContext.addItem` clamps quantity to the variant's live stock and shows
  exactly one toast reflecting what actually happened (either "added" or "only N available") — an early
  version of this fired a false "added" toast even when the item was stock-limited and nothing changed;
  caught during review and fixed.

---

## Data Flow

1. **Static reference data** (categories, tags, site settings) is fetched once in `SiteDataContext` when
   the app mounts and shared via React Context — `Header`, `Footer`, and every page that needs the nav or
   contact info read from this instead of re-fetching.
2. **Page-specific data** (homepage aggregate, product lists, a single product) is fetched per-page with
   `useEffect` + `fetch` (wrapped by `api.get`/`api.post` in `api/client.js`), re-fetching whenever the
   relevant route param or query string changes.
3. **Cart/Wishlist** never touch the server — they're pure client state in `localStorage`, only sent to the
   server once, at checkout, as a snapshot inside the `POST /api/orders` payload.
4. **Admin writes** go through `adminApi` (same fetch wrapper, JWT attached) and always re-fetch the list
   after a successful write rather than optimistically patching local state — simpler and correct for an
   admin tool where consistency matters more than perceived speed.

---

## Interaction Flow — the specifics

- **Click a nav link / product card** → React Router client-side navigation, no full reload; `SiteLayout`
  scrolls to top on every route change.
- **Open the mobile menu** → slide-in panel from the right with a backdrop; the "Category" row expands an
  accordion of all 13 categories inline (matches the original's mobile dropdown behavior).
- **Submit search** (desktop bar, mobile search-icon panel, or Enter key) → navigates to
  `/search?search=<query>`.
- **Toggle a filter** (price range / discount radio, tag chip, sort dropdown) → updates the URL's query
  string via `useSearchParams`, which re-triggers the product fetch — filters are shareable/bookmarkable
  URLs, same as the original's GET-form-based filtering.
- **Submit the contact form** → logs the inquiry to the database (visible in admin under "Inquiries") *and*
  opens a pre-filled WhatsApp chat, exactly reproducing the original's `sendWhatsAppMessage()` behavior.
- **Open a modal** (any admin CRUD form) → `Modal.jsx` renders on top of a click-to-dismiss backdrop;
  submitting calls the relevant `POST`/`PUT`, closes the modal, and reloads the list.
- **Product image zoom** → clicking any gallery image opens a full-screen lightbox (`ProductDetail.jsx`),
  closes on backdrop click or the × button; resets whenever the product itself changes (e.g. via
  back/forward navigation) so it can't get stuck showing a stale image.

---

## Running the Clone

Requires Node.js 18+. A local MongoDB is optional — if one isn't reachable at `MONGODB_URI`, the server
automatically falls back to a temporary in-memory database so it still runs.

```bash
# 1. Install dependencies (once)
cd Server && npm install
cd ../Client && npm install

# 2. Start the API server (from Server/)
npm run dev          # http://localhost:5000  — seeds the database on first run

# 3. In a second terminal, start the frontend (from Client/)
npm run dev           # http://localhost:5173  — proxies /api and /uploads to :5000
```

Then open **http://localhost:5173** for the storefront and **http://localhost:5173/admin/login** for the
admin CMS.

**Default admin login** (seeded automatically, change `ADMIN_EMAIL`/`ADMIN_PASSWORD` in `Server/.env` before
any real deployment):
- Email: `admin@halajewels.in`
- Password: `Admin@123`

**Before going live**, update in the admin **Settings** page: the WhatsApp number (currently a placeholder,
`910000000000`), contact phone/email/address, and social links.

---

## Known Differences From the Original

- **Routing**: clean paths (`/category/anklets`, `/product/snake-chain-anklet`) instead of the original's
  query strings (`category?cat=43`, `product?prop=930`) — a deliberate modernization, not a limitation.
- **Cart/wishlist persistence**: `localStorage` (per-browser) instead of the original's server-side PHP
  session — functionally equivalent for a single device, but won't sync across devices/browsers (the
  original wouldn't either, in practice, since it's also tied to one browser's session cookie).
- **Checkout/payment**: no payment gateway, by design (confirmed with the project owner) — orders are
  placed via a WhatsApp handoff instead, with the admin-configurable number defaulting to a placeholder.
- **"For Minimal Girlies" homepage section**: empty on the live site at scrape time (no products were
  tagged); the clone seeds it with recent products so the section isn't blank — reassign products to that
  tag (or leave as-is) from the admin Products screen.
- **Pagination**: the original renders full result sets with no pagination; this clone matches that for
  category/search pages (24-per-page limit exists server-side but the UI doesn't yet expose page controls,
  since the seeded catalog per view rarely exceeds it) — worth adding real pagination UI before scaling the
  catalog well beyond what's seeded here.
- **Visual/UI testing**: no browser automation tool was available in this environment. Every page, API
  contract, and interaction was verified through code review, `eslint`/`vite build` checks, an independent
  logic-bug review pass, and direct `curl` testing of every API endpoint the frontend calls (categories,
  products with filters, product detail, order create/track, admin auth, admin CRUD, image serving,
  malformed-input error handling). Visual layout/spacing/responsive breakpoints were implemented to match
  the original's CSS precisely but have **not** been visually confirmed in an actual browser — please click
  through it yourself after starting the dev servers, especially on real mobile devices/viewports.
