import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import postgres from 'postgres'
import app from './index'

vi.mock('postgres', () => ({ default: vi.fn() }))

const query = vi.fn()
const end = vi.fn()
const sqlClient = Object.assign(query, { end })

const schemeRow = {
  slug: 'sample-scheme',
  name: 'Sample Housing Scheme',
  category: 'Affordable housing',
  scheme_type: 'Home ownership',
  availability: 'unconfirmed' as const,
  summary: 'A sample public housing programme.',
  source_name: 'Sample Agency',
  source_url: 'https://example.gov.my/housing',
  checked_on: '2026-11-06',
  agency: 'Sample Agency',
  eligibility: ['Applicants must meet the published criteria.'],
  application_steps: ['Check the official scheme page.'],
  documents: ['Identity card'],
  links: [{ label: 'Official information', url: 'https://example.gov.my/housing' }],
}

beforeEach(() => {
  vi.mocked(postgres).mockClear()
  query.mockReset()
  end.mockReset()
  query.mockResolvedValue([schemeRow])
  end.mockResolvedValue(undefined)

  vi.mocked(postgres).mockReturnValue(
    sqlClient as unknown as ReturnType<typeof postgres>,
  )
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('GET /api/health', () => {
  it('returns a successful health response', async () => {
    const response = await app.request('/api/health')

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ status: 'ok' })
  })
})

describe('GET /api/schemes', () => {
  it('returns schemes in the frontend data shape', async () => {
    const response = await app.request('/api/schemes', {}, {
      HYPERDRIVE: { connectionString: 'mock-connection-string' },
    })

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      schemes: [
        {
          slug: 'sample-scheme',
          name: 'Sample Housing Scheme',
          category: 'Affordable housing',
          type: 'Home ownership',
          availability: 'unconfirmed',
          summary: 'A sample public housing programme.',
          source: 'Sample Agency',
          sourceUrl: 'https://example.gov.my/housing',
          checked: '6 Nov 2026',
          agency: 'Sample Agency',
          eligibility: ['Applicants must meet the published criteria.'],
          application: ['Check the official scheme page.'],
          documents: ['Identity card'],
          links: [{ label: 'Official information', url: 'https://example.gov.my/housing' }],
        },
      ],
    })
    expect(postgres).toHaveBeenCalledWith('mock-connection-string', {
      max: 5,
      fetch_types: false,
      prepare: true,
    })
    expect(end).toHaveBeenCalledOnce()
  })

  it('returns a service-unavailable response when the database is not configured', async () => {
    const response = await app.request('/api/schemes', {}, {})

    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({
      error: 'The database connection is not configured.',
    })
    expect(postgres).not.toHaveBeenCalled()
  })

  it('returns a generic error and closes the database client when the query fails', async () => {
    const errorLog = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    query.mockRejectedValue(new Error('Sensitive database failure'))

    const response = await app.request('/api/schemes', {}, {
      HYPERDRIVE: { connectionString: 'mock-connection-string' },
    })

    expect(response.status).toBe(500)
    const body = await response.text()
    expect(body).toContain('Housing schemes could not be loaded.')
    expect(body).not.toContain('Sensitive database failure')
    expect(end).toHaveBeenCalledOnce()
    expect(errorLog).toHaveBeenCalledOnce()
  })

  it('allows browser preflight requests from other origins', async () => {
    const response = await app.request('/api/schemes', {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://guide.example',
        'Access-Control-Request-Method': 'GET',
      },
    })

    expect(response.status).toBe(204)
    expect(response.headers.get('access-control-allow-origin')).toBe('*')
    expect(response.headers.get('access-control-allow-methods')).toContain('GET')
  })
})
