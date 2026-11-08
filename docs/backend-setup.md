# Backend setup

The React app loads schemes from `GET /api/schemes`. The Hono Worker reads them from PostgreSQL through Cloudflare Hyperdrive. The API is public and read-only.

## Prepare PostgreSQL

Create a PostgreSQL database in Neon. In the Neon SQL Editor, run these files in order:

1. `database/migrations/0001_create_housing_schemes.sql`
2. `database/seeds/0001_seed_housing_schemes.sql`

The seed is an initial snapshot of the five schemes currently shown in the site. It does not automatically refresh them.

## Configure Hyperdrive

Create a Hyperdrive configuration that points to the Neon database, using the connection string from Neon:

```powershell
npx wrangler hyperdrive create miri-housing-guide --connection-string="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
```

Copy the ID returned by Wrangler into `wrangler.jsonc`, replacing the all-zero placeholder under `hyperdrive`. Never commit the database connection string or place it in frontend configuration.

## Run locally

In PowerShell, set the local connection string for the `HYPERDRIVE` binding and start the API:

```powershell
$env:CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE = ""
npm run dev:api
```

In a second terminal, start the Vite frontend:

```powershell
npm run dev
```

Vite proxies `/api` requests to the local Worker at `http://localhost:8787`. You can check the API at `/api/health` and `/api/schemes`.

## Deploy

After configuring a real Hyperdrive ID and authenticating Wrangler with Cloudflare, deploy the API:

```powershell
npm run deploy:api
```

If the frontend is hosted on a different domain, set `VITE_API_BASE_URL` in the Cloudflare Pages build environment to the deployed Worker URL. The API allows cross-origin GET requests because the scheme information is public.
