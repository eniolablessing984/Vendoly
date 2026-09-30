# Marketplace domain model and API contract

Status: proposed baseline for review. This design is market-neutral. It does not select a launch country, payment provider, delivery provider, or final legal/policy rules.

## Design decisions

- Use a relational database as the durable source of truth.
- Keep one customer checkout as a parent `Order`. Split its items into seller-specific `SellerOrder` records so each seller can fulfill only their own items. This supports mixed-seller carts without giving sellers access to another seller's order lines.
- Use opaque IDs, ISO 4217 currency codes, and integer minor units for all stored money. Example: USD 12.34 is `currency: "USD", amountMinor: 1234`. Never calculate totals from client-submitted prices.
- Store timestamps in UTC. Keep the address and item/price snapshots on the order so later profile or catalog edits cannot rewrite history.
- Treat the browser cart as a convenience. The server re-reads prices and stock at checkout and creates the authoritative order.
- Model payment and shipment state separately from order state. A payment callback or delivery scan must not directly grant arbitrary state changes to a client.
- Use a modular monolith initially, with modules for identity, sellers, catalog, checkout/orders, payments, fulfillment, notifications, and reporting.

## Records

| Record | Key fields | Rules |
|---|---|---|
| `User` | `id`, `email`, `passwordHash`, `createdAt`, `updatedAt` | Email is normalized and unique. Password hashes only; never store passwords or tokens in client-readable storage. |
| `UserRole` | `userId`, `role` (`customer`, `seller`, `admin`) | A user may hold more than one role. Every protected operation checks role and resource ownership on the server. |
| `Seller` | `id`, `ownerUserId`, `storeName`, `bio`, `logoUrl`, `status`, timestamps | `status`: `pending`, `active`, `rejected`, `suspended`. Store name uniqueness policy remains to be selected. Seller registration and approval rules are market decisions. |
| `Product` | `id`, `sellerId`, `title`, `subtitle`, `description`, `categoryId`, `priceAmountMinor`, `currency`, `status`, timestamps | `status`: `draft`, `pendingReview`, `active`, `rejected`, `archived`. Seller owns it. Only active products from active sellers are public. |
| `Inventory` | `productId`, `sku`, `availableQuantity`, `reservedQuantity`, `updatedAt` | Non-negative integer quantities. Checkout reserves stock transactionally; cancellation/expiry releases it; fulfillment decrements it. |
| `ProductMedia` | `id`, `productId`, `url`, `position`, `altText` | Files live in media storage; database stores stable URLs and metadata, not base64 image data. |
| `CustomerAddress` | `id`, `userId`, recipient/contact fields, address lines, locality, region, postal code, country code | Only its owner and authorized platform operations can read it. Orders retain an immutable address snapshot. |
| `Cart` / `CartItem` | `id`, `customerId` or anonymous session, `productId`, `quantity`, `updatedAt` | Cart item has no trusted price. Server returns a current quote and reports unavailable/changed items. Guest cart merge behavior is a later UX decision. |
| `Order` | `id`, `customerId` nullable for guest checkout, `currency`, `subtotalMinor`, `shippingMinor`, `totalMinor`, `status`, address/contact snapshot, timestamps | Parent record for one checkout, one payment intent, and one or more seller orders. Customer can read only their own order. |
| `SellerOrder` | `id`, `orderId`, `sellerId`, `status`, `subtotalMinor`, `shippingMinor`, timestamps | Fulfillment scope for one seller within a customer order. Seller can read/update only its own seller orders. |
| `OrderItem` | `id`, `sellerOrderId`, `productId`, `productTitleSnapshot`, `skuSnapshot`, `unitAmountMinor`, `quantity`, `lineTotalMinor` | Immutable purchase snapshot. Product may later be archived or deleted without removing the order line. |
| `Payment` | `id`, `orderId`, `provider`, `providerReference`, `method`, `amountMinor`, `currency`, `status`, timestamps | `status`: `pending`, `authorized`, `paid`, `failed`, `cancelled`, `partiallyRefunded`, `refunded`. No raw card number, CVC, or expiry is stored. Provider events are verified and idempotent. |
| `Shipment` | `id`, `sellerOrderId`, `provider`, `trackingReference`, `status`, timestamps | `status`: `pending`, `ready`, `dispatched`, `inTransit`, `delivered`, `failed`, `returned`. Provider and tracking details depend on launch-market selection. |
| `OrderStatusEvent` | `id`, `orderId`, optional `sellerOrderId`, `actorUserId`, `fromStatus`, `toStatus`, `reason`, `createdAt` | Append-only audit trail; status changes are validated against allowed transitions. |
| `Notification` | `id`, `userId`, `orderId`, `channel`, `template`, `status`, `sentAt` | Enqueue after committed events; retry without duplicating user-visible messages. Never block order creation on email/SMS delivery. |

## State transitions

- Seller: `pending -> active | rejected`; `active -> suspended`; suspended sellers can be reinstated by admin.
- Product: `draft -> pendingReview -> active | rejected`; active products can be archived or returned to review. If launch does not require review, publishing can allow `draft -> active` for active sellers.
- Order: `pendingPayment -> confirmed -> completed`; `pendingPayment -> cancelled`; confirmed orders may be cancelled/refunded according to policy. A parent is completed when all seller orders are delivered; exceptions/refunds need explicit handling.
- Seller order: `pending -> accepted -> preparing -> readyForDispatch -> dispatched -> delivered`; cancellation/return branches require policy/provider rules.
- Payment: transitions come from server-side provider responses/webhooks or approved cash-on-delivery collection events, never a browser claim.
- Shipment: transitions come from authorized seller operations or verified delivery-provider updates.

All transitions must be enforced in backend code and represented in the event history. The exact cancellation, return, refund, and cash-on-delivery rules are open product decisions.

## API shape

Base path: `/api/v1`. JSON request/response bodies. Authenticated routes use a secure server-managed session or short-lived bearer credential selected during backend setup. List endpoints support `page` and `pageSize`; public catalog additionally supports category, search, sort, and price filters.

### Public catalog

- `GET /products` - active catalog only; filter/search/sort/page.
- `GET /products/:productId` - active product and public seller summary.
- `GET /categories` - active catalog categories.

### Account and seller

- `POST /auth/register` - create customer account.
- `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` - session lifecycle.
- `POST /seller-applications` - submit application; creates a pending seller application/profile.
- `GET /seller/profile`, `PATCH /seller/profile` - current seller profile.
- `GET /seller/products`, `POST /seller/products` - current seller catalog.
- `PATCH /seller/products/:productId`, `POST /seller/products/:productId/submit`, `POST /seller/products/:productId/archive` - seller-owned product changes.
- `PUT /seller/products/:productId/inventory` - set available quantity with validation and audit.
- `POST /media/upload-url` - request a constrained upload target; exact storage implementation is backend setup work.

### Cart and checkout

- `GET /cart`, `PUT /cart/items/:productId`, `DELETE /cart/items/:productId`, `DELETE /cart` - authenticated cart operations. Anonymous cart can remain client-side until guest behavior is decided.
- `POST /checkout/quote` - validate item IDs/quantities and return server-calculated current prices, availability, totals, and issues. A quote is not a stock guarantee unless explicitly reserved.
- `POST /orders` - create order from validated items and address/contact data; idempotency key required. Creates seller orders and reserves stock transactionally.
- `GET /orders` - customer's own order history.
- `GET /orders/:orderId` - customer-readable order, including seller fulfillment summaries but no private seller data.
- `POST /orders/:orderId/cancel` - request cancellation if current state/policy allows.

### Seller fulfillment

- `GET /seller/orders` - only seller orders belonging to current seller.
- `GET /seller/orders/:sellerOrderId` - seller order and its own items only.
- `POST /seller/orders/:sellerOrderId/accept`, `/prepare`, `/ready`, `/dispatch` - validated seller transitions.
- `POST /seller/orders/:sellerOrderId/shipments` - create shipment through selected fulfillment flow.

### Payment callbacks and tracking

- `POST /payments/:orderId/session` - create provider checkout session server-side; return provider handoff information, never expose secret credentials.
- `POST /webhooks/payments/:provider` - verify provider signature, deduplicate event ID, update payment/order state.
- `GET /orders/:orderId/tracking` - customer-visible fulfillment status and tracking details.
- `POST /webhooks/delivery/:provider` - verify and deduplicate delivery updates.

### Admin

- `GET /admin/seller-applications`, `POST /admin/sellers/:sellerId/approve`, `POST /admin/sellers/:sellerId/reject`, `POST /admin/sellers/:sellerId/suspend`.
- `GET /admin/products` and moderation actions for pending/reported products.
- `GET /admin/orders`, `GET /admin/orders/:orderId`, and policy-authorized refund/cancellation actions.
- `GET /admin/reports/summary` - platform-level reporting.
- `GET /seller/reports/summary` - seller-scoped reporting; backend derives seller scope from the authenticated identity.

## Authorization invariants

- Public users can see only active products and public seller fields.
- A seller can mutate a product only when `product.sellerId` matches their authenticated seller. Hiding UI controls is not authorization.
- A seller can see only their `SellerOrder` and associated `OrderItem` records; customer contact/address exposure is limited to fulfillment needs and policy.
- A customer can read only their own cart, addresses, and orders. Guest orders use an unguessable access mechanism if guest checkout is enabled.
- Admin operations require an explicit admin role and are audit logged.
- Prices, totals, discounts, stock, payment state, and role are never trusted from client request bodies.
- Payment and delivery webhooks require signature verification, replay protection, and idempotent handling.

## Error format

Use a stable shape: `{ "error": { "code": "OUT_OF_STOCK", "message": "One or more items are unavailable", "details": [...] } }`. Expected codes include `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `OUT_OF_STOCK`, `PRICE_CHANGED`, `INVALID_STATE_TRANSITION`, `CONFLICT`, and `RATE_LIMITED`. Do not return stack traces or secrets to clients.

## Frontend migration map

| Existing code | Target API/domain |
|---|---|
| `src/data/productService.js` | Public catalog endpoints and seller product endpoints; remove browser storage as the shared catalog. |
| `src/data/orderService.js` | Customer order and seller-order endpoints; remove browser storage as the order record. |
| `src/context/AuthContext.jsx` | `/auth/*` session lifecycle; no fake user/password in localStorage. |
| `src/context/CartContext.jsx` | Server cart for signed-in users; optionally merge local anonymous cart after login. |
| `src/services/paymentService.js` | Backend-created payment session plus provider handoff; remove simulated card processing. |
| `src/services/notificationService.js` | Backend event-driven notification jobs; frontend never claims to send mail. |
| `src/services/analyticsService.js` | Role-scoped report endpoints over durable order records. |
| `VendorRegistration.jsx`, `Checkout.jsx`, seller pages | Call API modules, represent loading/errors, and render server-returned records. |

## Decisions still needed before implementation choices

- Launch country, supported service areas, and currency.
- Seller approval and product moderation policy.
- Guest checkout and account requirements.
- Payment methods, including cash on delivery, refunds, and payment timing.
- Delivery ownership (platform-arranged, seller-arranged, or both), provider, pricing, and return handling.
- Whether one checkout may include multiple sellers. This proposal supports it through seller orders; confirm before committing the checkout experience.
- Preferred backend/runtime and hosting constraints.
