require("dotenv").config();
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

function generateSecurePassword(length = 12) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    password += charset[randomIndex];
  }
  return password;
}

const adminEmail = "admin@riseupmora.lk";
const adminName = "Admin (Shared)";

async function recreateAdmin() {
  console.log(`Starting process to recreate admin account for ${adminEmail}...\n`);
  
  try {
    // Delete existing admin account
    const deleteRes = await pool.query("DELETE FROM users WHERE email = $1 RETURNING id", [adminEmail]);
    if (deleteRes.rowCount > 0) {
      console.log(`🗑️  Successfully removed old admin account (ID: ${deleteRes.rows[0].id}).`);
    } else {
      console.log(`ℹ️  No existing admin account found with email ${adminEmail}.`);
    }

    // Generate new secure password
    const rawPassword = generateSecurePassword();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    // Create new admin account
    await pool.query(
      `INSERT INTO users (name, email, password_hash, role, email_verified_at)
       VALUES ($1, LOWER($2), $3, 'admin', CURRENT_TIMESTAMP)`,
      [adminName, adminEmail, hashedPassword]
    );

    console.log(`\n✅ Created NEW admin account for: ${adminName}`);
    console.log(`   Email:    ${adminEmail}`);
    console.log(`   Password: ${rawPassword}`);
    console.log(`   (Make sure to save this password, it is hashed in the database!)\n`);
    
  } catch (err) {
    console.error("❌ Error recreating admin:", err);
  } finally {
    await pool.end();
  }
}

recreateAdmin();
