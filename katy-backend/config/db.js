// config/db.js
// Postgres connection pool — Supabase with SQLite fallback for local development
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

let pool;

if (process.env.DATABASE_URL) {
  // Use Postgres pool
  const { Pool } = require('pg');
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
} else {
  // Local SQLite fallback using node:sqlite
  console.log('DATABASE_URL not set. Falling back to local SQLite database...');
  const { DatabaseSync } = require('node:sqlite');
  
  const dbPath = path.join(__dirname, '..', 'db', 'katy_local.db');
  const dbExists = fs.existsSync(dbPath);
  
  const db = new DatabaseSync(dbPath);
  
  // Register custom PostgreSQL compatible functions
  db.function('gen_random_uuid', () => crypto.randomUUID());
  db.function('now', () => new Date().toISOString());
  
  // Initialize schema and seed if db file is new
  if (!dbExists) {
    console.log('Initializing local SQLite database schema...');
    try {
      const schemaSql = fs.readFileSync(path.join(__dirname, '..', 'db', 'sqlite_schema.sql'), 'utf8');
      db.exec(schemaSql);
      
      console.log('Seeding local SQLite database...');
      const seedSql = fs.readFileSync(path.join(__dirname, '..', 'db', 'sqlite_seed.sql'), 'utf8');
      db.exec(seedSql);
      
      console.log('Local SQLite database initialized and seeded successfully.');
    } catch (err) {
      console.error('Error initializing SQLite database:', err);
    }
  }

  // Helper to parse JSON values in returned rows
  function autoParseJSON(val) {
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
        try {
          return JSON.parse(val);
        } catch (e) {
          return val;
        }
      }
    }
    return val;
  }

  function mapRow(row) {
    if (!row) return row;
    const mapped = {};
    for (const [key, val] of Object.entries(row)) {
      mapped[key] = autoParseJSON(val);
    }
    return mapped;
  }

  // SQL translation utility from PostgreSQL dialect to SQLite
  function translateSql(sql) {
    let translated = sql;
    
    // 1. replace to_char(created_at, 'YYYY-MM') = $1
    translated = translated.replace(/to_char\(([^,]+),\s*'YYYY-MM'\)/gi, "strftime('%Y-%m', $1)");

    // 2. replace CURRENT_DATE / CURRENT_DATE + interval
    // In remindersController:
    // p.due_date = (CURRENT_DATE + ($1 * INTERVAL '1 day'))::date
    translated = translated.replace(
      /\(CURRENT_DATE\s*\+\s*\(\s*\$([0-9]+)\s*\*\s*INTERVAL\s*'1 day'\s*\)\)::date/gi,
      "date('now', '+' || \$$1 || ' days')"
    );

    // 3. In tenantsController:
    // p.due_date + (COALESCE(t.grace_period_days, 0) * INTERVAL '1 day') < CURRENT_DATE
    translated = translated.replace(
      /p\.due_date\s*\+\s*\(\s*COALESCE\(\s*t\.grace_period_days,\s*0\)\s*\*\s*INTERVAL\s*'1 day'\s*\)\s*<\s*CURRENT_DATE/gi,
      "date(p.due_date, '+' || COALESCE(t.grace_period_days, 0) || ' days') < date('now')"
    );

    // 4. In remindersController:
    // $2 = ANY(t.reminder_schedule)
    translated = translated.replace(
      /\$([0-9]+)\s*=\s*ANY\(([^)]+)\)/gi,
      "exists (select 1 from json_each($2) where value = \$$1)"
    );

    // 5. Remove ::type casts (like ::date)
    translated = translated.replace(/::[a-zA-Z_]+/g, '');

    // 6. Replace $1, $2, etc with ?
    translated = translated.replace(/\$[0-9]+/g, '?');

    return translated;
  }

  pool = {
    query: async (sql, params = []) => {
      const translatedSql = translateSql(sql);
      try {
        const stmt = db.prepare(translatedSql);
        
        // In SQLite, if we are passing parameters, we spread them
        let rows;
        if (params && params.length > 0) {
          rows = stmt.all(...params);
        } else {
          rows = stmt.all();
        }
        
        const mappedRows = rows.map(mapRow);
        return { rows: mappedRows };
      } catch (err) {
        console.error(`SQLite Error executing query: ${sql}\nTranslated: ${translatedSql}\nParams:`, params, err);
        throw err;
      }
    },
    connect: async () => {
      return {
        query: async (sql, params = []) => {
          return pool.query(sql, params);
        },
        release: () => {}
      };
    }
  };
}

module.exports = pool;
