import { Pool } from "pg";

async function testConnection() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.log(
      JSON.stringify({ status: "error", message: "DATABASE_URL is not set" }),
    );
    return;
  }

  try {
    const pool = new Pool({
      connectionString,
      connectionTimeoutMillis: 5000,
    });

    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    client.release();
    await pool.end();

    console.log(
      JSON.stringify({
        status: "success",
        message: "Database connected successfully!",
        timestamp: result.rows[0].now,
      }),
    );
  } catch (error: any) {
    console.log(
      JSON.stringify({
        status: "error",
        message: "Failed to connect to database.",
        error: error.message,
      }),
    );
  }
}

testConnection();
