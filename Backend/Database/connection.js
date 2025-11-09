import dotenv from "dotenv";
import pg from "pg";
dotenv.config();

const flight_roster_db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

flight_roster_db.connect();
export default flight_roster_db;