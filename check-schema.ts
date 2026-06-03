import { getPool } from './lib/db';
async function run() {
  const p = getPool();
  if (p) {
    const res = await p.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'");
    console.log(res.rows);
  }
}
run();
