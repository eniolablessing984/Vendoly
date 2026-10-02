# Marketplace build plan

This project will grow from the existing Vendorly React prototype into a multi-vendor marketplace. Jumia is a reference for the public marketplace, payments, and delivery flows; this plan does not assume access to Jumia's private implementation.

## First release assumptions

- Multiple independent sellers can register and manage their own catalog.
- Customers can browse, add products to a cart, and place orders.
- A platform administrator can review sellers and manage marketplace activity.
- Backend services become the source of truth for accounts, products, inventory, and orders.
- Payment and delivery providers will be selected for the launch country before live integrations.
- Start with a modular backend and a single database. Split services only when operational needs justify it.

## Current project baseline

- React 19, Vite, and React Router 7 frontend.
- Storefront, cart, checkout, vendor registration, vendor product/order pages, analytics, and sign-in screens exist.
- Products, orders, cart, seller applications, notifications, and the simulated signed-in user currently use browser `localStorage`.
- Product records include seller ownership and stock; seller catalog operations are scoped by the simulated seller ID.
- Checkout records customer/delivery details and splits mixed-seller purchases into seller orders with fulfillment status transitions. These are browser demo records, not backend-owned durable data.
- Authentication, payment, delivery estimates, and notifications are simulated in frontend code. No payment is charged and no email is delivered.

## Frontend-first task plan

### Current sequence: frontend first

Keep the app running against its existing local demo data while we finish and review the user-facing flows. Keep API boundaries easy to replace, but do not start server/database implementation or live provider integrations until the frontend milestone is complete.

### Frontend phase

#### F1. Audit and clean up current customer and seller flows - complete

- [x] Remove unsafe demo behavior such as storing/logging passwords.
- [x] Remove duplicate or unclear actions that compete with the main customer journey.
- [x] Identify inconsistent or broken UI states and record the order for fixes.

**Done when:** the current routes have one clear purpose each, demo data contains no credentials, and remaining UI work is prioritized below.

#### F2. Complete product discovery - implemented

- [x] Add useful product categories and category navigation.
- [x] Add product search, sorting, and empty/no-results states.
- [x] Improve the storefront hierarchy for campaigns/featured products while preserving Vendorly branding.

**Done when:** shoppers can find a product through category browsing or search on mobile and desktop.

#### F3. Complete the shopping journey - implemented

- [x] Refine product detail, quantity, availability, seller identity, and cart feedback.
- [x] Make cart and checkout one clear path with consistent totals and delivery information.
- [x] Keep payment clearly marked as demo until backend/provider integration exists.
- [x] Add useful confirmation and order summary states.

**Done when:** a shopper can browse, add/remove/update items, complete the demo checkout, and understand what happened. This phase uses local demo stock and browser storage; authoritative availability, delivery, and payment checks remain backend work.

#### F4. Complete seller-facing screens - implemented

- [x] Refine seller registration and sign-in feedback, validation, and errors; the application form does not request credentials before an account can actually be created.
- [x] Improve dashboard navigation and empty states.
- [x] Make product editing support category, price, and stock fields in the UI.
- [x] Let sellers remove an existing product image as well as replace it.
- [x] Make seller order rows understandable with customer, item, payment, and fulfillment status.

**Done when:** each seller task has a clear screen and responsive success, empty, and error states. Demo catalog and order views are scoped by seller ID in browser data; authentication and authorization are still simulated until backend integration.

#### F5. Visual and interaction pass

- [ ] Review responsive layout, keyboard access, labels, focus states, and contrast across every route.
- [x] Use the shared demo currency formatter across shopper and seller money displays; global focus-visible and reduced-motion styles are in place.
- [x] Increase the global keyboard focus outline contrast and enlarge carousel dot hit areas for touch and keyboard users.
- [x] Give seller product removal controls product-specific accessible names and minimum 44px touch targets.
- [x] Darken three brand text shades that fell below 4.5:1 against white or pale surfaces; the replacements exceed 4.5:1 on the checked backgrounds.
- [x] Announce updated product-search result counts to assistive technology.
- [x] Keep the header search input synchronized with URL changes and expose the cart preview as a labelled region that closes on Escape.
- [x] Reflow cart line items at narrow widths, prevent increasing quantities for removed products, and darken secondary text used for controls and image placeholders.
- [x] Make the homepage hero headline and calls to action wrap at a 390px viewport.
- [x] Verify the mobile header at a true 390×844 CSS viewport with DevTools emulation; cart and search controls are fully visible and document scroll width remains 390px.
- [x] Verify the homepage header and hero at a true 320px CSS viewport; cart and search controls remain visible and document scroll width remains 320px.
- [x] Verify the desktop header and hero at a 1365px CSS viewport; search and cart controls remain inside the header, with document scroll width matching the 1350px client area.
- [x] Render-check home, cart, checkout empty state, sign-in, vendor registration, product detail, and not-found routes at 390px; each has no horizontal overflow, unlabeled form fields, or unnamed buttons.
- [x] Render-check seller dashboard, empty catalog, new-product form, empty orders, and analytics at 390px under a local demo seller; each has no horizontal overflow, unlabeled form fields, or unnamed buttons.
- [x] Put mobile header controls in visible tab order (home, signed-in account action, cart, search, navigation) and verify each receives a 3px visible focus outline.
- [x] Track product/order browser-storage availability and warn on seller catalog, product form, orders, and analytics; simulate blocked storage and verify the notices at 390px.
- [x] Treat missing or invalid demo stock as unavailable so the UI does not imply inventory exists when its quantity is unknown.
- [x] Calculate demo revenue and top-product sales from delivered seller orders, and label the analytics so pending/cancelled orders are not presented as realized sales.
- [x] Ignore malformed local demo product and order records so invalid browser data falls back to empty/sample states instead of breaking marketplace screens.
- [x] Normalize malformed saved order lines and dates so seller views and reports show safe fallbacks instead of invalid values.
- [x] Ignore malformed local notification records and stop logging mock notification recipients and content to the browser console.
- [x] Keep catalog, orders, cart, seller applications, and demo sign-in usable in the current session when browser storage writes fail, and warn users when changes will not survive refresh.
- [x] Expose checkout submission progress to assistive technology while disabling repeat submissions.
- [x] Use one catalog image component with an accessible fallback when a product photo is missing or fails to load, across shopper and seller product views.
- [x] Add a useful not-found page so unknown routes do not render an empty app shell.
- [x] Add accessible-size carousel controls and pause/resume, pause autoplay during pointer or keyboard interaction, keep controls away from the product link, and honor reduced-motion preferences.
- [x] Stop assigning unrelated local photos to sample products, including older copies in browser storage; show the no-image fallback instead.
- [x] Add category-matched sample product photography for all sample catalog entries; keep source credits in `ASSET_ATTRIBUTIONS.md`.
- [x] At a 390×844 CSS viewport, manually tab through the homepage header, hero, carousel, category filters, sort, and product links; confirm named controls and visible 3px focus outlines, including the white separation ring over dark carousel controls.
- [x] Check loading, empty, and failure presentation across customer and seller routes for the current local-data flows; repeat the review for API requests when introduced.

**Done when:** the frontend is internally consistent and ready to connect to real APIs.

**Current progress:** Source review has covered the storefront, cart, cart preview, sign-in, registration, checkout, seller catalog/orders, analytics, and notification handling. DevTools renders at 320px, 390×844, and 1365px CSS widths verify the homepage header controls stay in bounds. At 390px, customer and seller routes—including checkout, empty cart/catalog/orders, product creation, analytics, sign-in, registration, and not-found—have no horizontal overflow, unnamed buttons, or unlabeled form fields. Header keyboard order follows the visible mobile layout and sampled controls show a 3px focus outline; the global focus treatment also has a white separation ring to remain visible over dark surfaces. Registration field errors now announce when inserted and stay associated with their inputs. Contrast spot checks found `text-slate-500` at 4.47:1 over the original page background, so the shared background was adjusted slightly and this pairing now measures 4.55:1; selected category counts and analytics rank markers use stronger text colors (6.68:1 and 6.92:1 on their pale surfaces). A simulated SecurityError from browser storage produces clear notices on seller catalog, product form/edit, orders, analytics, and cart; seller application submission reports when it only survives for the current session. Customer and seller local-data empty and failure states have been reviewed, including no-result catalog search, missing products/orders, empty cart/checkout, checkout failure, invalid seller product/status actions, and unavailable browser storage. Category-matched local sample images are assigned; sources and license reference are in `ASSET_ATTRIBUTIONS.md`. Fixed the homepage empty-catalog message so it no longer suggests search filters when there are no products. Remaining work includes route-wide keyboard/contrast review. Because the current prototype reads local data synchronously, add and review network loading and API failure states when API requests are introduced.

#### F6. Freeze frontend integration contract

- [ ] Confirm first-release policies and review the proposed domain/API model.
- [ ] Agree on launch country, currency, seller approval, guest checkout, payment, and delivery rules.

**Done when:** the frontend milestone is reviewed and backend implementation can proceed against agreed product rules.

### Backend and integrations phase - deferred until F1-F6 are complete

#### 1. Agree on first-release scope and operating rules - in progress

- [ ] Confirm launch country, currency, and delivery coverage.
- [ ] Decide whether registration is open or requires administrator approval.
- [ ] Define the first supported payment methods and whether cash on delivery is needed.
- [ ] Confirm seller order visibility and whether one customer order can contain products from multiple sellers. (Proposal: support mixed-seller carts, split into private seller orders.)
- [ ] Confirm remaining launch decisions in `MARKETPLACE_DOMAIN_AND_API.md` before provider and deployment choices.

**Done when:** the launch assumptions above are confirmed or replaced with explicit decisions.

#### 2. Define domain model and API contract - proposed baseline documented

- [x] Define Seller, Customer, Product, Inventory, Cart, Order, OrderItem, Payment, Shipment, and Admin records.
- [x] Include ownership, status transitions, timestamps, and money representation in minor currency units.
- [x] Define API routes and authorization rules for customer, seller, and admin actions.
- [x] Plan migration of the current frontend from local demo data to API responses.

**Done when:** schemas and endpoint behavior are documented, including who can read and change each record. The proposal is documented in `MARKETPLACE_DOMAIN_AND_API.md`; confirm product decisions before implementation.

#### 3. Set up backend, database, and configuration - deferred until frontend milestone

- [ ] Choose a backend framework and relational database appropriate to the project and launch environment.
- [ ] Add server entry point, environment configuration, database migrations, and health endpoint.
- [ ] Establish a safe local development setup; keep secrets out of source control.

**Done when:** the app can run the backend locally and apply its initial schema.

#### 4. Implement identity, seller onboarding, and authorization

- [ ] Persist customer, seller, and admin accounts securely.
- [ ] Replace simulated sign-in and vendor registration with backend flows.
- [ ] Add seller approval and role-based access checks.

**Done when:** users can authenticate and only access actions allowed for their role and seller account.

#### 5. Implement catalog and inventory APIs; connect the storefront and seller catalog

- [ ] Add seller-owned product create, edit, publish, and archive operations.
- [ ] Add public catalog, product detail, category/search, and stock availability reads.
- [ ] Connect homepage, product detail, and seller product pages to the API.
- [ ] Store uploaded images through a server-managed media storage path.

**Done when:** catalog changes persist in the database and seller A cannot change seller B's products.

#### 6. Implement cart, checkout, and order lifecycle

- [ ] Revalidate prices and stock on the backend at checkout.
- [ ] Persist customer contact and delivery address, order items, totals, and status history.
- [ ] Define handling for orders containing products from multiple sellers.
- [ ] Give sellers access only to their relevant order items and fulfillment updates.
- [ ] Connect cart, checkout, success, and seller order pages to backend APIs.

**Done when:** a customer order survives refresh and seller order actions update its recorded status.

#### 7. Integrate payment provider

- [ ] Select a provider for the confirmed launch country and supported methods.
- [ ] Create payment sessions server-side; never send raw card details to this app's backend.
- [ ] Verify provider callbacks/webhooks and make payment state changes idempotent.
- [ ] Support the selected non-card option, such as cash on delivery, if required.

**Done when:** provider-confirmed payment state is safely tied to an order and displayed correctly.

#### 8. Add delivery and fulfillment workflows

- [ ] Select delivery approach and provider(s) for launch coverage.
- [ ] Record shipping quotes, shipment references, tracking events, and delivery status.
- [ ] Add seller packing/dispatch and customer order tracking views.

**Done when:** each shippable order can be followed from seller fulfillment through delivery or exception.

#### 9. Add administration, notifications, and reporting

- [ ] Add admin review queues for sellers, products, orders, refunds, and disputes.
- [ ] Replace local mock notifications with backend-triggered email/SMS or provider notifications.
- [ ] Scope analytics by seller and platform role; derive reports from durable records.

**Done when:** admins can resolve routine marketplace operations and users receive relevant status updates.

#### 10. Prepare for launch

- [ ] Configure production hosting, database backups, logging, monitoring, and recovery procedures.
- [ ] Review access control, input validation, rate limits, privacy, and payment handling.
- [ ] Document deployment and support procedures; verify critical customer and seller journeys.

**Done when:** the production system can be deployed and operated with documented recovery and support steps.

## Working rule

Complete one task at a time. Update its checklist and record decisions here as they are made. Do not enable live payments or launch-country delivery until the relevant provider and operating decisions are confirmed.
