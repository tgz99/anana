# anana Super Oksigen — Landing Page

Distributor resmi landing page for **anana Super Oksigen**, built with Next.js 14, Prisma, and PostgreSQL.

---

## Tech Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** + Framer Motion
- **Prisma 5** + **PostgreSQL** — lightweight analytics event store
- **Docker** — containerised deployment (recommended)

---

## Deploy with Docker (Recommended)

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/tgz99/anana.git
cd anana

# 2. Copy and configure environment (optional — defaults work out of the box)
#    Edit docker-compose.yml if you want a custom DB password

# 3. Build and start
docker compose up --build -d

# 4. Open the app
#    Landing page → http://localhost:3000
#    Analytics dashboard → http://localhost:3000/dashboard
```

The first startup runs `prisma db push` automatically to create the database schema.

### Stop / restart

```bash
docker compose down          # stop containers (data preserved)
docker compose down -v       # stop and DELETE all data
docker compose restart anana-landing   # reload app after code changes
```

### Environment variables (docker-compose.yml)

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://anana:anana@db:5432/anana_analytics` | PostgreSQL connection string |
| `POSTGRES_USER` | `anana` | DB username |
| `POSTGRES_PASSWORD` | `anana` | DB password |
| `POSTGRES_DB` | `anana_analytics` | DB name |

---

## Deploy without Docker (Manual)

### Prerequisites

- Node.js 20+
- PostgreSQL 14+ running locally (or a hosted instance, e.g. Supabase / Railway)

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/tgz99/anana.git
cd anana

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local and set your DATABASE_URL:
# DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"

# 4. Push database schema
npx prisma db push

# 5. Run development server
npm run dev
# → http://localhost:3000

# — OR — build and run production
npm run build
npm start
```

### Environment file (`.env.local`)

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/anana_analytics"
```

---

## Analytics Dashboard

Visit `/dashboard` to see:

- Conversion funnel (page view → scroll 75% → saw kemitraan section → WA / reseller click)
- Daily event chart (7-day)
- WhatsApp clicks by source
- Recent raw events

No authentication is required to access the dashboard (add middleware if deploying publicly).

---

## Project Structure

```
app/
  page.tsx              # Landing page
  dashboard/page.tsx    # Analytics dashboard
  api/events/route.ts   # Event ingestion endpoint
components/
  Hero.tsx
  Benefits.tsx
  Kemitraan.tsx
  ...
  ui/
    Analytics.tsx       # trackEvent() + page_view + scroll depth
    SectionTracker.tsx  # IntersectionObserver funnel tracking
lib/
  content.id.ts         # All copy / content strings
  config.ts             # WhatsApp numbers, links
  prisma.ts             # Prisma client singleton
  session.ts            # sessionStorage session ID
prisma/
  schema.prisma         # Event model
public/
  assets/bottle.png     # Product image
```
