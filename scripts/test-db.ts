import pg from 'pg';
import "dotenv/config";

async function testConnection() {
  console.log("🔍 Port Test: Testing database connectivity...");
  console.log("Address:", process.env.DATABASE_URL?.split('@')[1]);

  const pool = new pg.Pool({ 
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 5000 
  });

  try {
    const client = await pool.connect();
    console.log("✅ SUCCESS: Successfully connected to Supabase!");
    const res = await client.query('SELECT NOW()');
    console.log("🕒 Database Time:", res.rows[0].now);
    client.release();
  } catch (err: any) {
    console.error("❌ ERROR: Connection failed.");
    console.error("Reason:", err.message);
  } finally {
    await pool.end();
  }
}

testConnection();
