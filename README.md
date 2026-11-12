# Ticketing
# Event Ticketing Platform

A MERN-stack web app where organizers publish events and sell tickets, and attendees browse, buy, receive QR tickets, and check in at the door.

**Stack:** MongoDB, Express, React, Node.js

---

## Scope (MVP)

- Register, login, roles (attendee, organizer, admin)
- Create and publish events with multiple ticket types
- Search and filter events
- Checkout with safe ticket reservation (no overselling)
- Payments in test mode
- QR tickets, ticket validation, and check-in
- Confirmation emails

**Out of scope for now:** promo codes, refunds, reserved seating, admin panel, analytics.

---

## Repository Structure

```
event-ticketing/
├── backend/
│   ├── src/
│   │   ├── config/        # env, database, payment and email setup
│   │   ├── models/        # User, Event, TicketType, Order, Payment, Ticket
│   │   ├── routes/        # one file per resource
│   │   ├── controllers/   # read request, call service, send response
│   │   ├── services/      # business rules
│   │   ├── middleware/    # auth, roles, validation, rate limit, errors
│   │   ├── jobs/          # expire unpaid reservations
│   │   ├── utils/         # ticket code, QR, email helpers
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   ├── seed/
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/           # backend calls, one file per resource
│   │   ├── components/    # shared UI (buttons, inputs, cards, modals)
│   │   ├── features/      # auth, events, checkout, tickets, organizer
│   │   ├── pages/         # Home, EventList, EventDetail, Checkout, MyTickets, Dashboard
│   │   ├── routes/        # route setup, protected and role routes
│   │   ├── context/       # auth/user state
│   │   ├── hooks/
│   │   ├── utils/         # date and money formatters
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   └── .env.example
└── README.md
```

---

## Getting Started

1. Clone the repo.
2. In `backend/` and `frontend/`, install dependencies and copy `.env.example` to `.env`.
3. Seed the database with sample data (backend).
4. Start the backend, then the frontend.

> Add the exact commands once the `package.json` scripts are defined.

### Environment Variables (names only, never commit values)

| Where | Variable | Purpose |
|---|---|---|
| Backend | `PORT` | Server port |
| Backend | `MONGODB_URI` | Database connection |
| Backend | `JWT_SECRET` | Signs auth tokens or sessions |
| Backend | `CLIENT_URL` | Frontend origin (CORS, email links) |
| Backend | `PAYMENT_SECRET_KEY`, `PAYMENT_WEBHOOK_SECRET` | Payment provider (test mode) |
| Backend | `EMAIL_API_KEY`, `EMAIL_FROM` | Email service |
| Frontend | `VITE_API_URL` (or equivalent) | Backend base URL |
| Frontend | Payment public key | Payment provider (public key only) |

---

## Team Split (4 people, 2 weeks)

| Person | Area | Main work |
|---|---|---|
| **Backend 1** | Orders, inventory, payments, tickets | Reservation without overselling, payment notifications, ticket and QR generation, check-in validation |
| **Backend 2** | Setup, auth, events, email | Project setup, auth and roles, events and ticket types, emails, organizer endpoints |
| **Frontend 1** | Auth, events, organizer | Sign up and login, event list and detail, organizer dashboard and event forms |
| **Frontend 2** | Checkout, tickets, check-in | Ticket selector, checkout and payment screens, my tickets, door scanner screen |

**Ownership rules**
- Backend 2 owns shared files (`app.js`, `config/`, `server.js`, `middleware/`). Backend 1 asks before editing them.
- Frontend 1 owns shared UI (`components/`, `routes/`, `context/`). Frontend 2 asks before editing them.

---

## Two-Week Plan

| Days | Backend 1 | Backend 2 | Frontend 1 | Frontend 2 |
|---|---|---|---|---|
| 1-2 | Order and payment design | Setup, models, seed data | Project setup, shared components, routing | Checkout flow design, ticket UI |
| 3-5 | Inventory and orders | Authentication | Auth screens, event list | Ticket selector (mock data) |
| 6-8 | Payments | Events and ticket types | Event detail, organizer forms | Checkout and payment screens |
| 9-10 | Tickets and check-in | Email, organizer endpoints | Organizer dashboard | My tickets, scanner screen |
| 11-14 | Testing and hardening | Security and API docs | Polish and responsiveness | Polish and end-to-end testing |

**Day 1, everyone together (about 2 hours):** agree on the endpoint list, response and error format, status values, and data models. Frontend works against mock data until real endpoints are ready (around Day 6).

---

## API Conventions

Decide on Day 1 and keep current in `docs/api.md`.

- Base path: `/api/v1`
- Success and error response formats: _to be decided_
- Auth method (cookie or token): _to be decided_
- Pagination, filtering, sorting: _to be decided_

| Resource | Capabilities |
|---|---|
| Auth | register, login, logout, verify email, reset password, current user |
| Events | list with filters, view, create, update, publish, cancel |
| Ticket types | add, update, remove, view availability |
| Orders | create, view mine, view one, cancel, expire |
| Payments | start payment, receive provider notifications, view status |
| Tickets | list mine, view one, resend, validate, check in |

---

## Key Rules

**Data**
- Money is stored as whole numbers in the smallest currency unit, plus a currency code. Never decimals.
- Dates are stored in universal time; the event time zone is stored separately.
- Statuses use fixed, documented lists.
- Prices are always calculated on the server.
- Ticket codes are unique and hard to guess.

**Frontend**
- Every screen handles loading, error, empty, and success states.
- Design mobile first.
- Protect pages by role, but remember the real access checks happen on the server.
- Prevent double submits on checkout.

**Backend**
- Flow: routes, middleware, controllers, services, models. Business logic stays in services, and only models touch the database.
- Payment is confirmed by the provider's notification, never by the browser.
- Handle duplicate notifications safely.

---

## Critical Checklist

- [ ] Two buyers cannot purchase the last ticket
- [ ] Unpaid reservations expire and release stock
- [ ] Order totals are calculated on the server
- [ ] Duplicate payment notifications never create duplicate tickets
- [ ] A ticket cannot be scanned twice
- [ ] Every order ends in a consistent state, even after failures
- [ ] Access checks enforced on every protected endpoint
- [ ] Works on phones and common browsers

---

## Git Workflow

- Never push directly to `main`.
- Use feature branches, for example `feature/backend-orders` or `feature/frontend-checkout`.
- Every pull request is reviewed by at least one teammate.
- Keep commits small with clear messages.
- Update `docs/api.md` whenever an endpoint changes.

---

## Testing and Security

- **Tests:** pricing, inventory, order states, API endpoints (including unauthorized requests), last-ticket concurrency, payment cases (success, failure, abandoned, duplicate, delayed), and one full purchase journey.
- **Security:** validate all input, hash passwords safely, rate limit login, restrict CORS to the frontend origin, keep secrets out of the repo and logs, verify payment notifications before processing.

---

## Open Decisions

1. Guest checkout or account required?
2. How long does a reservation hold last?
3. What does the QR code contain?
4. Who receives payments: the platform or organizers directly?
5. What can an organizer change after tickets are sold?
6. What happens to orders and tickets if an event is cancelled?

---

## License

_Add a license here._