require('dotenv').config();
const { Client } = require('pg');

async function checkConnection() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('❌ DATABASE_URL is not defined in the environment.');
    process.exit(1);
  }

  const client = new Client({
    connectionString,
  });

  try {
    console.log('Connecting to the database...');
    await client.connect();
    console.log('✅ Successfully connected to the database!');
    
    // Run a simple query to verify
    const res = await client.query('SELECT current_database(), current_user, NOW()');
    console.log('Database:', res.rows[0].current_database);
    console.log('User:', res.rows[0].current_user);
    console.log('Time:', res.rows[0].now);
  } catch (err) {
    console.error('❌ Failed to connect to the database:');
    console.error(err.message);
  } finally {
    await client.end();
    console.log('Connection closed.');
  }
}

checkConnection();
