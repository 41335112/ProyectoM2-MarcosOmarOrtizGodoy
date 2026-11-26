const { Pool } = require('pg');
const { loadEnvFile } = require('node:process');
const { existsSync } = require('node:fs');

if (existsSync('.env')) {
    loadEnvFile('.env');
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.query('SELECT NOW()')
    .then(() => console.log('PostgreSQL conectado correctamente'))
    .catch(error => console.error('Error de conexión:', error.message));

module.exports = pool;