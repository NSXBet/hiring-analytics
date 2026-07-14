-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Jobs table: stores all requisitions from the recruitment tracker
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cod TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Interview', 'Offer', 'Kick off', 'Stand By', 'Hired', 'Canceled', 'Turnover', 'Withdrawn', 'TBD')),
  recruiter TEXT NOT NULL,
  hiring_manager TEXT NOT NULL,
  director TEXT NOT NULL,
  country TEXT NOT NULL,
  cost_center TEXT NOT NULL,
  squad TEXT,
  level TEXT,
  opening_date DATE,
  closing_date DATE,
  committed_date DATE,
  gender TEXT CHECK (gender IN ('Female', 'Male', 'Non-binary', 'Prefer not to say')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common filters and aggregations
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_director ON jobs(director);
CREATE INDEX IF NOT EXISTS idx_jobs_recruiter ON jobs(recruiter);
CREATE INDEX IF NOT EXISTS idx_jobs_hiring_manager ON jobs(hiring_manager);
CREATE INDEX IF NOT EXISTS idx_jobs_country ON jobs(country);
CREATE INDEX IF NOT EXISTS idx_jobs_cost_center ON jobs(cost_center);
CREATE INDEX IF NOT EXISTS idx_jobs_opening_date ON jobs(opening_date);
CREATE INDEX IF NOT EXISTS idx_jobs_closing_date ON jobs(closing_date);

-- Enable RLS (required by platform policy)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Public read access for dashboard data (internal analytics tool)
CREATE POLICY IF NOT EXISTS "Public read jobs"
  ON jobs FOR SELECT
  USING (true);

CREATE POLICY IF NOT EXISTS "Public insert jobs"
  ON jobs FOR INSERT
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Public update jobs"
  ON jobs FOR UPDATE
  USING (true);
