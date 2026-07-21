require("dotenv").config();
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Function to generate a secure random password
function generateSecurePassword(length = 12) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    password += charset[randomIndex];
  }
  return password;
}

const adminsToCreate = [
  { name: "Imesh", email: "imesh@riseupmora.lk" },
  { name: "Yashini", email: "yashini@riseupmora.lk" },
  { name: "Thamalu", email: "thamalu@riseupmora.lk" },
  { name: "Admin (Shared)", email: "admin@riseupmora.lk" }
];

async function createAdmins() {
  console.log("Starting admin account creation...\n");
  
  try {
    for (const admin of adminsToCreate) {
      // Check if user already exists
      const checkRes = await pool.query("SELECT id FROM users WHERE email = $1", [admin.email]);
      
      if (checkRes.rows.length > 0) {
        console.log(`⚠️ Admin account for ${admin.name} (${admin.email}) already exists. Skipping.\n`);
        continue;
      }

      const rawPassword = generateSecurePassword();
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(rawPassword, salt);

      await pool.query(
        `INSERT INTO users (name, email, password_hash, role, email_verified_at)
         VALUES ($1, LOWER($2), $3, 'admin', CURRENT_TIMESTAMP)`,
        [admin.name, admin.email, hashedPassword]
      );

      console.log(`✅ Created admin account for: ${admin.name}`);
      console.log(`   Email:    ${admin.email}`);
      console.log(`   Password: ${rawPassword}`);
      console.log(`   (Make sure to save this password, it is hashed in the database!)\n`);
    }
    
    console.log("🎉 Finished creating admin accounts.");
  } catch (err) {
    console.error("❌ Error creating admins:", err);
  } finally {
    await pool.end();
  }
}

createAdmins();
