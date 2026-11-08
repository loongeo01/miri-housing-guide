export type ApplicationAvailability = 'open' | 'closed' | 'unconfirmed'

export type HousingSchemeLink = {
  label: string
  url: string
}

export type HousingScheme = {
  slug: string
  name: string
  category: string
  type: string
  availability: ApplicationAvailability
  summary: string
  source: string
  sourceUrl: string
  checked: string
  agency: string
  eligibility: string[]
  application: string[]
  documents: string[]
  links: HousingSchemeLink[]
}
