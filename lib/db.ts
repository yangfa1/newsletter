import { neon } from '@neondatabase/serverless'

export function getDb() {
  // Prefer direct non-pooling connection to avoid stale read replicas
  const url = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL!
  return neon(url)
}

export async function runMigrations() {
  const sql = getDb()

  await sql`
    CREATE TABLE IF NOT EXISTS newsletter_types (
      id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      friendly_name VARCHAR(255) NOT NULL,
      folder_name   VARCHAR(100) NOT NULL UNIQUE,
      description   TEXT,
      active        BOOLEAN DEFAULT true,
      created_at    TIMESTAMPTZ DEFAULT now()
    )
  `

  await sql`
    INSERT INTO newsletter_types (friendly_name, folder_name, description, active)
    VALUES
      ('Weekly Financial Report', 'weekly-financial-report', 'Comprehensive market analysis every Monday morning', true),
      ('Market Forecast',         'market-forecast',         'Data-driven predictions for the week ahead, every Friday', true)
    ON CONFLICT (folder_name) DO NOTHING
  `
}
