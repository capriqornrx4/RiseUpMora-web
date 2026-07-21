require("dotenv").config();
const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query("SELECT u.id as user_id, u.name, u.email, u.created_at FROM users u WHERE u.role = 'candidate' LIMIT 1")
  .then(res => console.log("Success:", res.rows))
  .catch(err => console.error("Error:", err.message))
  .finally(() => pool.end());
