import { Pool } from "pg";
/*
const isSsl = process.env.AUTH_DATABASE_SSL === 'true';

export const pool = new Pool ({
    host: process.env.AUTH_DATABASE_HOST,
    port: parseInt(process.env.AUTH_DATABASE_PORT!, 10), // 10 TO MAKE IT A BASE10
    database: process.env.AUTH_DATABASE_NAME,
    user: process.env.AUTH_DATABASE_USER,
    password: process.env.AUTH_DATABASE_PASSWORD,
    ssl: isSsl ? { rejectUnauthorized: false } : false
})*/

const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString
});