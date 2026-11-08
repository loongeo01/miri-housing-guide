import { Hono } from 'hono'
import { cors } from 'hono/cors'
import postgres from 'postgres'

type WorkerBindings = {
  HYPERDRIVE: {
    connectionString: string
  }
}

type SchemeRow = {
  slug: string
  name: string
  category: string
  scheme_type: string
  availability: 'open' | 'closed' | 'unconfirmed'
  summary: string
  source_name: string
  source_url: string
  checked_on: string
  agency: string
  eligibility: string[]
  application_steps: string[]
  documents: string[]
  links: { label: string; url: string }[]
}

const app = new Hono<{ Bindings: WorkerBindings }>()

app.use('/api/*', cors({ origin: '*', allowMethods: ['GET', 'OPTIONS'] }))

app.get('/api/health', (c) => c.json({ status: 'ok' as const }))

app.get('/api/schemes', async (c) => {
  const connectionString = c.env.HYPERDRIVE?.connectionString
  if (!connectionString) {
    return c.json({ error: 'The database connection is not configured.' }, 503)
  }

  const sql = postgres(connectionString, {
    max: 5,
    fetch_types: false,
    prepare: true,
  })

  try {
    const rows = await sql<SchemeRow[]>`
      SELECT
        slug,
        name,
        category,
        scheme_type,
        availability,
        summary,
        source_name,
        source_url,
        last_checked_on::text AS checked_on,
        agency,
        eligibility,
        application_steps,
        documents,
        links
      FROM housing_schemes
      ORDER BY display_order ASC
    `

    const schemes = rows.map((row) => ({
      slug: row.slug,
      name: row.name,
      category: row.category,
      type: row.scheme_type,
      availability: row.availability,
      summary: row.summary,
      source: row.source_name,
      sourceUrl: row.source_url,
      checked: formatCheckedDate(row.checked_on),
      agency: row.agency,
      eligibility: row.eligibility,
      application: row.application_steps,
      documents: row.documents,
      links: row.links,
    }))

    return c.json({ schemes })
  } catch (error) {
    console.error('Failed to retrieve housing schemes from the database.', error)
    return c.json({ error: 'Housing schemes could not be loaded.' }, 500)
  } finally {
    await sql.end({ timeout: 1 })
  }
})

function formatCheckedDate(isoDate: string) {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

export default app
