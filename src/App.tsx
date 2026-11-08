import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { HousingScheme } from './types/housing-scheme'

const pathways = [
  { number: '01', id: 'schemes', label: 'FIND A HOME', title: 'Explore housing schemes', description: 'Browse government housing programmes and see where to find official details.', icon: '⌂', href: '/schemes' },
  { number: '02', id: 'guides', label: 'TAKE THE NEXT STEP', title: 'Understand how to apply', description: 'Get familiar with application steps, common documents, and official links.', icon: '↗', href: '/guides' },
]

const announcements = [
  {
    title: 'RSP Permyjaya III key handover reported in Miri',
    date: '2026-10-31', dateLabel: '31 Oct 2026', category: 'Housing project',
    summary: 'UKAS reported that 80 recipients received keys for RSP Permyjaya III. The report describes a handover and does not confirm current unit availability.',
    publisher: 'Unit Komunikasi Awam Sarawak (UKAS)', sourceUrl: 'https://ukas.sarawak.gov.my/web/subpage/news_view/52152', relatedScheme: 'rumah-spektra-permata',
  },
  {
    title: 'PPRMS home repairs reported in Pujut',
    date: '2026-10-08', dateLabel: '8 Oct 2026', category: 'Housing assistance',
    summary: 'UKAS reported 370 homes repaired in the Pujut constituency, including work around Krokop and Piasau. Contact your local constituency service centre to confirm current support in your area.',
    publisher: 'Unit Komunikasi Awam Sarawak (UKAS)', sourceUrl: 'https://ukas.sarawak.gov.my/web/subpage/news_view/50299', relatedScheme: 'pprms-home-repair',
  },
  {
    title: 'Sarawak Rental Assistance Scheme expanded',
    date: '2026-05-18', dateLabel: '18 May 2026', category: 'Housing assistance',
    summary: 'The 2026 update reports that SRAS covers Miri, raises the household income limit to RM5,504, and extends assistance for up to 48 months. Check HDC for current eligibility details.',
    publisher: 'Unit Komunikasi Awam Sarawak (UKAS)', sourceUrl: 'https://ukas.sarawak.gov.my/web/subpage/news_view/40777', relatedScheme: 'sras-rental-assistance',
  },
]

const schemeUpdates: Record<string, { title: string; date: string; summary: string; url: string }> = Object.fromEntries(
  announcements.map((announcement) => [announcement.relatedScheme, {
    title: announcement.title,
    date: announcement.dateLabel,
    summary: announcement.summary,
    url: announcement.sourceUrl,
  }]),
)

function SearchIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="search-icon"><circle cx="10.8" cy="10.8" r="6.6" /><path d="m16 16 4.2 4.2" /></svg>
}

function SchemeCard({ scheme }: { scheme: HousingScheme }) {
  const availabilityLabel = scheme.availability === 'open'
    ? 'Applications open'
    : scheme.availability === 'closed'
      ? 'Applications closed'
      : 'Availability unconfirmed'

  return (
    <article className="scheme-card">
      <div className="scheme-card-top"><span className="scheme-category">{scheme.category}</span><span className="scheme-type">{scheme.type}</span></div>
      <span className={`scheme-availability scheme-availability-${scheme.availability}`}>{availabilityLabel}</span>
      <h3><a className="scheme-title-link" href={`/schemes/${scheme.slug}`}>{scheme.name}</a></h3>
      <p className="scheme-summary">{scheme.summary}</p>
      <div className="scheme-provenance">
        <span>Checked {scheme.checked}</span>
        <div className="scheme-card-actions">
          <IconLink href={scheme.sourceUrl} label={`${scheme.source} scheme information`} kind="source" external />
          <IconLink href={`/schemes/${scheme.slug}`} label="View scheme details" kind="details" />
        </div>
      </div>
    </article>
  )
}

function AnnouncementCard({ announcement, schemes }: { announcement: (typeof announcements)[number]; schemes: HousingScheme[] }) {
  const relatedScheme = schemes.find((scheme) => scheme.slug === announcement.relatedScheme)

  return (
    <article className="announcement-card">
      <div className="announcement-meta"><span className="announcement-category">{announcement.category}</span><time dateTime={announcement.date}>{announcement.dateLabel}</time></div>
      <h3>{announcement.title}</h3>
      <p>{announcement.summary}</p>
      <div className="announcement-links">
        <IconLink href={announcement.sourceUrl} label={`Read original from ${announcement.publisher}`} kind="source" external />
        {relatedScheme && <IconLink href={`/schemes/${relatedScheme.slug}`} label={`View ${relatedScheme.name}`} kind="details" />}
      </div>
    </article>
  )
}

function LinkIcon({ kind }: { kind: 'source' | 'external' | 'details' }) {
  if (kind === 'source') {
    return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 3.75h8l4 4v12.5H6z" /><path d="M14 3.75v4h4M9 12h6M9 16h6" /></svg>
  }
  if (kind === 'external') {
    return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M13 5h6v6M19 5l-9 9" /><path d="M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>
  }
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 19v-4a6 6 0 0 1 6-6h7" /><path d="m14 5 4 4-4 4" /></svg>
}

function IconLink({ href, label, kind, external = false }: { href: string; label: string; kind: 'source' | 'external' | 'details'; external?: boolean }) {
  return (
    <a className="icon-link" href={href} data-tooltip={label} aria-label={external ? `${label} (opens in a new tab)` : label} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
      <LinkIcon kind={kind} />
    </a>
  )
}

function ApplicationGuideCard({ scheme }: { scheme: HousingScheme }) {
  return (
    <article className="application-guide-card">
      <div className="guide-card-heading">
        <div><p className="section-kicker">{scheme.category}</p><h2>{scheme.name}</h2></div>
        <span className="scheme-availability scheme-availability-unconfirmed">Availability unconfirmed</span>
      </div>
      <div className="application-guide-content">
        <details className="guide-accordion">
          <summary>Suggested next steps</summary>
          <ol>{scheme.application.map((step) => <li key={step}>{step}</li>)}</ol>
        </details>
        <details className="guide-accordion">
          <summary>Documents</summary>
          {scheme.documents.length > 0
            ? <ul>{scheme.documents.map((document) => <li key={document}>{document}</li>)}</ul>
            : <p>The linked sources do not provide a complete document checklist. Confirm what you need with the responsible agency.</p>}
        </details>
      </div>
      <p className="guide-status-note">Application availability and requirements can change. Confirm the current process with the responsible agency before applying.</p>
      <div className="guide-card-footer">
        <p className="guide-checked">Information last checked {scheme.checked}</p>
        <div className="guide-links">
          <IconLink href={scheme.sourceUrl} label={`${scheme.source} scheme information`} kind="source" external />
          {scheme.links.map((link) => <IconLink href={link.url} label={link.label} kind="external" external key={link.url} />)}
          <IconLink href={`/schemes/${scheme.slug}`} label="View full scheme details" kind="details" />
        </div>
      </div>
    </article>
  )
}

type SchemeLoadStatus = 'loading' | 'loaded' | 'error'

function SchemeLoadNotice({ status, onRetry }: { status: SchemeLoadStatus; onRetry: () => void }) {
  if (status === 'loaded') return null
  if (status === 'loading') return <p className="empty-search" role="status">Loading housing information…</p>

  return (
    <div className="scheme-load-error" role="alert">
      <span>Housing information could not be loaded. Check the API and database setup, then try again.</span>
      <button type="button" onClick={onRetry}>Try again</button>
    </div>
  )
}

function App() {
  const currentPath = window.location.pathname.replace(/\/$/, '')
  const isSchemesPage = currentPath === '/schemes'
  const isAnnouncementsPage = currentPath === '/announcements'
  const isGuidesPage = currentPath === '/guides'
  const isSchemeDetailPage = currentPath.startsWith('/schemes/')
  const isSubPage = isSchemesPage || isAnnouncementsPage || isGuidesPage || isSchemeDetailPage
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [housingSchemes, setHousingSchemes] = useState<HousingScheme[]>([])
  const [schemeLoadStatus, setSchemeLoadStatus] = useState<SchemeLoadStatus>('loading')
  const [schemeLoadAttempt, setSchemeLoadAttempt] = useState(0)
  const [query, setQuery] = useState('')
  const [schemeCategory, setSchemeCategory] = useState('All categories')
  const [applicationAvailability, setApplicationAvailability] = useState('All application statuses')
  const [guideQuery, setGuideQuery] = useState('')
  const [guideCategory, setGuideCategory] = useState('All categories')
  const [guideAvailability, setGuideAvailability] = useState('All application statuses')
  const selectedScheme = housingSchemes.find((scheme) => scheme.slug === currentPath.slice('/schemes/'.length))

  useEffect(() => {
    const controller = new AbortController()
    const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

    async function loadSchemes() {
      setSchemeLoadStatus('loading')
      try {
        const response = await fetch(`${apiBaseUrl}/api/schemes`, { signal: controller.signal })
        if (!response.ok) throw new Error(`Scheme API responded with ${response.status}`)

        const payload = await response.json() as { schemes: HousingScheme[] }
        if (!Array.isArray(payload.schemes)) throw new Error('Scheme API returned an invalid response')

        setHousingSchemes(payload.schemes)
        setSchemeLoadStatus('loaded')
      } catch (error) {
        if (controller.signal.aborted) return
        console.error('Could not load housing schemes.', error)
        setSchemeLoadStatus('error')
      }
    }

    void loadSchemes()
    return () => controller.abort()
  }, [schemeLoadAttempt])

  function retrySchemeLoad() {
    setSchemeLoadAttempt((attempt) => attempt + 1)
  }

  const normalizedQuery = query.trim().toLowerCase()
  const visiblePathways = pathways.filter((pathway) => `${pathway.label} ${pathway.title} ${pathway.description}`.toLowerCase().includes(normalizedQuery))
  const visibleSchemes = housingSchemes.filter((scheme) => {
    const matchesQuery = `${scheme.name} ${scheme.category} ${scheme.type} ${scheme.summary}`.toLowerCase().includes(normalizedQuery)
    const matchesCategory = schemeCategory === 'All categories' || scheme.category === schemeCategory
    const matchesAvailability = applicationAvailability === 'All application statuses' || scheme.availability === applicationAvailability
    return matchesQuery && matchesCategory && matchesAvailability
  })
  const normalizedGuideQuery = guideQuery.trim().toLowerCase()
  const visibleGuides = housingSchemes.filter((scheme) => {
    const searchableGuide = `${scheme.name} ${scheme.category} ${scheme.type} ${scheme.summary} ${scheme.agency} ${scheme.application.join(' ')} ${scheme.documents.join(' ')}`.toLowerCase()
    const matchesQuery = searchableGuide.includes(normalizedGuideQuery)
    const matchesCategory = guideCategory === 'All categories' || scheme.category === guideCategory
    const matchesAvailability = guideAvailability === 'All application statuses' || scheme.availability === guideAvailability
    return matchesQuery && matchesCategory && matchesAvailability
  })

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    document.querySelector('#topics')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <div className="utility-bar">
        <div className="utility-inner">
          <span className="utility-location"><span className="location-dot" /> MIRI · SARAWAK</span>
          <span className="utility-message">An independent guide to housing information</span>
          <a href={isSubPage ? '/#about' : '#about'}>About this guide <span aria-hidden="true">↗</span></a>
        </div>
      </div>

      <header className="site-header">
        <a className="brand" href="/" aria-label="Miri Housing Guide home">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span className="brand-copy"><strong>Miri Housing Guide</strong><small>Find your way home</small></span>
        </a>
        <button
          className="mobile-menu-toggle"
          type="button"
          aria-expanded={mobileMenuOpen}
          aria-controls="site-navigation"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
        >
          <span /><span /><span />
        </button>
        <nav className={`site-nav${mobileMenuOpen ? ' is-open' : ''}`} id="site-navigation" aria-label="Main navigation">
          <a href="/announcements" onClick={() => setMobileMenuOpen(false)}>Announcements</a>
          <a href="/guides" onClick={() => setMobileMenuOpen(false)}>Application guides</a>
        </nav>
        <a className="header-cta" href="/schemes">Explore schemes <span aria-hidden="true">→</span></a>
      </header>

      {isSchemeDetailPage ? selectedScheme ? (
        <main>
          <article className="scheme-detail-page" aria-labelledby="scheme-detail-title">
            <a className="back-home" href="/schemes">← Back to housing schemes</a>
            <p className="section-kicker">{selectedScheme.category.toUpperCase()} · {selectedScheme.type.toUpperCase()}</p>
            <h1 className="directory-title" id="scheme-detail-title">{selectedScheme.name}</h1>
            <p className="scheme-detail-intro">{selectedScheme.summary}</p>
            <div className="scheme-detail-meta"><span><strong>Responsible agency</strong>{selectedScheme.agency}</span><span><strong>Information checked</strong>{selectedScheme.checked}</span></div>
            <div className="scheme-detail-grid">
              <section className="detail-panel"><h2>Eligibility information</h2><ul>{selectedScheme.eligibility.map((item) => <li key={item}>{item}</li>)}</ul></section>
              <section className="detail-panel"><h2>How to proceed</h2><ol>{selectedScheme.application.map((item) => <li key={item}>{item}</li>)}</ol></section>
              {selectedScheme.documents.length > 0 && <section className="detail-panel"><h2>Documents listed by Service Sarawak</h2><ul>{selectedScheme.documents.map((item) => <li key={item}>{item}</li>)}</ul></section>}
              <section className="detail-panel detail-sources"><h2>Official sources and links</h2>
                <ul>
                  <li><a href={selectedScheme.sourceUrl} target="_blank" rel="noreferrer">{selectedScheme.source} programme information<span className="sr-only"> (opens in a new tab)</span></a></li>
                  {selectedScheme.links.map((link) => <li key={link.url}><a href={link.url} target="_blank" rel="noreferrer">{link.label}<span className="sr-only"> (opens in a new tab)</span></a></li>)}
                </ul>
              </section>
            </div>
            {schemeUpdates[selectedScheme.slug] && <section className="scheme-updates" aria-labelledby="updates-heading">
              <div className="updates-heading"><p className="section-kicker">NEWS &amp; ANNOUNCEMENTS</p><h2 id="updates-heading">Latest updates</h2></div>
              <article className="news-update-card">
                <div className="news-update-meta"><span>Official update</span><time>{schemeUpdates[selectedScheme.slug].date}</time></div>
                <h3>{schemeUpdates[selectedScheme.slug].title}</h3>
                <p>{schemeUpdates[selectedScheme.slug].summary}</p>
                <div className="news-update-actions"><IconLink href={schemeUpdates[selectedScheme.slug].url} label="Read the UKAS report" kind="source" external /></div>
              </article>
            </section>}
            <p className="directory-note">This is an independent guide, not an application decision. Requirements and availability can change. Confirm details with the responsible agency before applying.</p>
          </article>
        </main>
      ) : schemeLoadStatus === 'loaded' ? (
        <main><section className="scheme-detail-page"><h1 className="directory-title">Scheme not found</h1><p className="scheme-detail-intro">That scheme could not be found in the directory.</p><a className="back-home" href="/schemes">Browse housing schemes</a></section></main>
      ) : (
        <main><section className="scheme-detail-page"><SchemeLoadNotice status={schemeLoadStatus} onRetry={retrySchemeLoad} /></section></main>
      ) : isAnnouncementsPage ? (
        <main>
          <section className="announcements-page" aria-labelledby="announcements-heading">
            <a className="back-home" href="/">← Back to home</a>
            <div className="section-heading">
              <div><p className="section-kicker">OFFICIAL UPDATES</p><h1 className="directory-title" id="announcements-heading">Housing announcements</h1></div>
              <p className="section-aside">Recent updates from official Sarawak sources. Open the original report for full details and check the responsible agency for current status.</p>
            </div>
            <div className="announcements-list">{announcements.map((announcement) => <AnnouncementCard announcement={announcement} schemes={housingSchemes} key={announcement.sourceUrl} />)}</div>
            <p className="directory-note">Announcements are selected and summarized for this guide. They are not fetched automatically yet.</p>
          </section>
        </main>
      ) : isGuidesPage ? (
        <main>
          <section className="guides-page" aria-labelledby="guides-heading">
            <a className="back-home" href="/">← Back to home</a>
            <div className="section-heading">
              <div><p className="section-kicker">TAKE THE NEXT STEP</p><h1 className="directory-title" id="guides-heading">Application guides</h1></div>
              <p className="section-aside">Use these source-based steps to get started. They are guidance from an independent portal, not official instructions or an application service.</p>
            </div>
            <div className="guide-notice"><strong>Before you apply</strong><p>Availability is currently unconfirmed for these schemes. Check the linked official source for current application windows, requirements, and document lists.</p></div>
            <div className="directory-controls">
              <label className="directory-search-label" htmlFor="guide-search">Search application guides</label>
              <div className="directory-search-wrap"><SearchIcon /><input id="guide-search" type="search" value={guideQuery} onChange={(event) => setGuideQuery(event.target.value)} placeholder="Try “PPR”, “rental”, or “documents”" /></div>
              <label className="sr-only" htmlFor="guide-category">Filter guides by category</label>
              <select id="guide-category" value={guideCategory} onChange={(event) => setGuideCategory(event.target.value)}>
                <option>All categories</option>{Array.from(new Set(housingSchemes.map((scheme) => scheme.category))).map((category) => <option key={category}>{category}</option>)}
              </select>
              <label className="sr-only" htmlFor="guide-availability">Filter guides by application availability</label>
              <select id="guide-availability" value={guideAvailability} onChange={(event) => setGuideAvailability(event.target.value)}>
                <option>All application statuses</option><option value="open">Applications open</option><option value="closed">Applications closed</option><option value="unconfirmed">Availability unconfirmed</option>
              </select>
              <span className="scheme-count">{visibleGuides.length} {visibleGuides.length === 1 ? 'guide' : 'guides'}</span>
            </div>
            {schemeLoadStatus !== 'loaded' ? <SchemeLoadNotice status={schemeLoadStatus} onRetry={retrySchemeLoad} /> : visibleGuides.length > 0
              ? <div className="application-guides-list">{visibleGuides.map((scheme) => <ApplicationGuideCard scheme={scheme} key={scheme.slug} />)}</div>
              : <p className="empty-search" role="status">No application guides match those filters. Try another search or choose all categories.</p>}
          </section>
        </main>
      ) : isSchemesPage ? (
        <main>
          <section className="scheme-directory scheme-directory-page" aria-labelledby="schemes-heading">
            <a className="back-home" href="/">← Back to home</a>
            <div className="section-heading">
              <div><p className="section-kicker">OFFICIAL PROGRAMMES</p><h1 className="directory-title" id="schemes-heading">Housing schemes &amp; support</h1></div>
              <p className="section-aside">Browse programmes listed by Sarawak’s Housing Development Corporation. Follow the source for current requirements and local availability.</p>
            </div>
            <div className="directory-controls">
              <label className="directory-search-label" htmlFor="scheme-search">Search this directory</label>
              <div className="directory-search-wrap"><SearchIcon /><input id="scheme-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “rental” or “deposit assistance”" /></div>
              <label className="sr-only" htmlFor="scheme-category">Filter by category</label>
              <select id="scheme-category" value={schemeCategory} onChange={(event) => setSchemeCategory(event.target.value)}>
                <option>All categories</option><option>Affordable housing</option><option>Financial assistance</option><option>Rental assistance</option><option>Home repair assistance</option>
              </select>
              <label className="sr-only" htmlFor="scheme-availability">Filter by application availability</label>
              <select id="scheme-availability" value={applicationAvailability} onChange={(event) => setApplicationAvailability(event.target.value)}>
                <option>All application statuses</option><option value="open">Applications open</option><option value="closed">Applications closed</option><option value="unconfirmed">Availability unconfirmed</option>
              </select>
              <span className="scheme-count">{visibleSchemes.length} {visibleSchemes.length === 1 ? 'programme' : 'programmes'}</span>
            </div>
            {schemeLoadStatus !== 'loaded' ? <SchemeLoadNotice status={schemeLoadStatus} onRetry={retrySchemeLoad} /> : visibleSchemes.length > 0 ? <div className="scheme-grid">{visibleSchemes.map((scheme) => <SchemeCard scheme={scheme} key={scheme.name} />)}</div> : <p className="empty-search" role="status">No programmes match those filters. Try another search or choose all categories.</p>}
            <p className="directory-note">This guide is independent. Programme details and availability can change; confirm requirements with the responsible agency before applying.</p>
          </section>
          <section className="trust-strip" id="about">
            <div className="trust-emblem" aria-hidden="true">i</div>
            <div><strong>Know where the information comes from.</strong><p>We point you to original sources and mark when information was last checked.</p></div>
          </section>
        </main>
      ) : (
        <main>
          <section className="hero" id="top">
            <div className="hero-image" aria-hidden="true" /><div className="hero-overlay" aria-hidden="true" />
            <div className="hero-content">
              <p className="hero-kicker"><span /> HOUSING INFORMATION, MADE CLEARER</p>
              <h1>Find the right<br />path to <em>your home.</em></h1>
              <p className="hero-description">A practical starting point for exploring government housing schemes and assistance in Miri.</p>
              <form className="search-form" onSubmit={handleSearch} role="search">
                <label className="sr-only" htmlFor="housing-search">Search housing information</label><SearchIcon />
                <input id="housing-search" name="q" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search schemes, assistance, or application guides" />
                <button type="submit">Search <span aria-hidden="true">→</span></button>
              </form>
              <div className="hero-note"><span className="note-check">✓</span><span>Clear guidance, with links back to official sources</span></div>
            </div>
            <div className="hero-caption"><span className="caption-line" /> MIRI, SARAWAK <span className="caption-divider">/</span> COMMUNITY GUIDE</div>
            <div className="hero-photo-credit">Photo: <a href="https://commons.wikimedia.org/wiki/File:Sunset_over_Marina_Bay_at_Miri,_Sarawak.jpg" target="_blank" rel="noreferrer">Achmed Azizie</a> · <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noreferrer">CC BY 2.0</a> (cropped)</div>
          </section>

          <section className="pathways" id="topics">
            <div className="section-heading"><div><p className="section-kicker">START WITH WHAT YOU NEED</p><h2>How can we help you today?</h2></div><p className="section-aside">Explore useful information and continue to the responsible agency for the latest details.</p></div>
            <div className="pathway-grid">
              {visiblePathways.map((pathway) => (
                <a className="pathway-card" href={pathway.href} id={pathway.id === 'schemes' ? undefined : pathway.id} key={pathway.number}>
                  <div className="pathway-top"><span className="pathway-number">{pathway.number}</span><span className="pathway-icon" aria-hidden="true">{pathway.icon}</span></div>
                  <p className="pathway-label">{pathway.label}</p><h3>{pathway.title}</h3><p className="pathway-description">{pathway.description}</p>
                  <span className="pathway-link">Explore information <span aria-hidden="true">→</span></span>
                </a>
              ))}
            </div>
            {visiblePathways.length === 0 && <p className="empty-search">No matching topics yet. Try “scheme”, “assistance”, or “apply”.</p>}
          </section>

          <section className="scheme-preview" id="schemes" aria-labelledby="schemes-heading">
            <div className="section-heading"><div><p className="section-kicker">OFFICIAL PROGRAMMES</p><h2 id="schemes-heading">A few places to start</h2></div><p className="section-aside">Explore a few programmes from official sources. Check the full directory for more details and filters.</p></div>
            {schemeLoadStatus !== 'loaded' ? <SchemeLoadNotice status={schemeLoadStatus} onRetry={retrySchemeLoad} /> : <div className="scheme-grid">{housingSchemes.slice(0, 2).map((scheme) => <SchemeCard scheme={scheme} key={scheme.name} />)}</div>}
            <div className="preview-action"><a className="directory-cta" href="/schemes">Browse all housing schemes <span aria-hidden="true">→</span></a></div>
            <p className="directory-note">Programme details and availability can change; confirm requirements with the responsible agency before applying.</p>
          </section>

          <section className="announcement-preview" aria-labelledby="announcement-preview-heading">
            <div className="section-heading"><div><p className="section-kicker">FROM OFFICIAL SOURCES</p><h2 id="announcement-preview-heading">Latest announcements</h2></div><a className="text-link" href="/announcements">View all announcements <span aria-hidden="true">→</span></a></div>
            <div className="announcements-list announcements-preview-list">{announcements.slice(0, 2).map((announcement) => <AnnouncementCard announcement={announcement} schemes={housingSchemes} key={announcement.sourceUrl} />)}</div>
          </section>

          <section className="trust-strip" id="about">
            <div className="trust-emblem" aria-hidden="true">i</div>
            <div><strong>Know where the information comes from.</strong><p>We point you to original sources and mark when information was last checked.</p></div>
            <a href="/guides">Application guides <span aria-hidden="true">→</span></a>
          </section>
        </main>
      )}

      <footer><a className="footer-brand" href="/">Miri Housing Guide</a><span>Independent public information guide for Miri, Sarawak.</span><span className="footer-disclaimer">Not an official government website.</span></footer>
    </>
  )
}

export default App
