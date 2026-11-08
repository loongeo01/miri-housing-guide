CREATE TABLE IF NOT EXISTS housing_schemes (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  scheme_type TEXT NOT NULL,
  availability TEXT NOT NULL CHECK (availability IN ('open', 'closed', 'unconfirmed')),
  summary TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  last_checked_on DATE NOT NULL,
  agency TEXT NOT NULL,
  eligibility JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(eligibility) = 'array'),
  application_steps JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(application_steps) = 'array'),
  documents JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(documents) = 'array'),
  links JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(links) = 'array'),
  display_order SMALLINT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
