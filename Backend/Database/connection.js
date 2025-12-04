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

flight_roster_db.connect()

// Get the main passenger by using ticket id
export const getMainPassengerByTicketId = async (ticketId) => {
    try {
        const query = `
            SELECT 
                p.first_name, 
                p.last_name, 
                p.passport_number, 
                p.nationality,
                ft.seat_number, 
                ft.class,
                ft.ticket_id
            FROM flight_ticket ft
            JOIN passenger p ON ft.passport_number = p.passport_number
            WHERE ft.ticket_id = $1
        `;
        const values = [ticketId];
        
        const result = await flight_roster_db.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error("Error fetching passenger by ticket:", err);
        throw err;
    }
};

// Get the other passengers on the flight by using ticket id
export const getCoPassengersByTicketId = async (ticketId) => {
    try {
        const query = `
            SELECT DISTINCT
                p.first_name, 
                p.last_name, 
                p.nationality,
                ft.seat_number,
                ft.class
            FROM passenger p
            JOIN flight_ticket ft ON p.passport_number = ft.passport_number
            JOIN connected_flight cf ON ft.ticket_id = cf.ticket_id
            WHERE cf.flight_id IN (
                -- Subquery: Get the flight_ids associated with the user's ticket
                SELECT flight_id 
                FROM connected_flight 
                WHERE ticket_id = $1
            )
            AND ft.ticket_id != $1; -- Exclude the passenger themselves
        `;
        const values = [ticketId];

        const result = await flight_roster_db.query(query, values);
        return result.rows; 
    } catch (err) {
        console.error("Error fetching copassengers by ticket:", err);
        throw err;
    }
};

// Get all of the staff on the flight by using ticket id
export const getStaffByTicketId = async (ticketId) => {
    try {
        const query = `
            SELECT 
                s.first_name, 
                s.last_name, 
                s.role, 
                s.rank,
                s.nationality,
                STRING_AGG(sp.language, ', ') as speaks
            FROM staff s
            JOIN operating_on op ON s.staff_id = op.staff_id
            LEFT JOIN speaks sp ON s.staff_id = sp.staff_id
            WHERE op.flight_id IN (
                SELECT flight_id 
                FROM connected_flight 
                WHERE ticket_id = $1
            )
            GROUP BY s.staff_id
        `;
        
        const values = [ticketId];

        const result = await flight_roster_db.query(query, values);
        return result.rows;
    } catch (err) {
        console.error("Error fetching flight staff by ticket:", err);
        throw err;
    }
};

// Get the flight data by using ticket id
export const getFlightInfoByTicketId = async (ticketId) => {
    try {
        const query = `
            SELECT 
                f.flight_number,
                f.dept_airport,
                f.arrival_airport,
                f.dept_time,
                f.arrival_time,
                f.date,
                f.status
            FROM flight f
            JOIN connected_flight cf ON f.flight_id = cf.flight_id
            WHERE cf.ticket_id = $1
        `;
        const values = [ticketId];

        const result = await flight_roster_db.query(query, values);
        return result.rows;
    } catch (err) {
        console.error("Error fetching flight info by ticket:", err);
        throw err;
    }
};

// Get all of the passengers on the flight by using flight number
export const getPassengersByFlightNumber = async (flightNumber) => {
    try {
        const query = `
            SELECT 
                p.first_name, 
                p.last_name, 
                p.passport_number, 
                p.nationality,
                ft.seat_number, 
                ft.class
            FROM passenger p
            JOIN flight_ticket ft ON p.passport_number = ft.passport_number
            JOIN connected_flight cf ON ft.ticket_id = cf.ticket_id
            JOIN flight f ON cf.flight_id = f.flight_id
            WHERE f.flight_number = $1
        `;
        const values = [flightNumber];
        
        const result = await flight_roster_db.query(query, values);
        return result.rows;
    } catch (err) {
        console.error("Error fetching passengers by flight number:", err);
        throw err;
    }
};

// Get all of the staff on the flight by using flight number
export const getStaffByFlightNumber = async (flightNumber) => {
    try {
        const query = `
            SELECT 
                s.first_name, 
                s.last_name, 
                s.role, 
                s.rank,
                s.nationality,
                STRING_AGG(sp.language, ', ') as speaks
            FROM staff s
            JOIN operating_on op ON s.staff_id = op.staff_id
            JOIN flight f ON op.flight_id = f.flight_id
            LEFT JOIN speaks sp ON s.staff_id = sp.staff_id
            WHERE f.flight_number = $1
            GROUP BY s.staff_id
        `;
        const values = [flightNumber];

        const result = await flight_roster_db.query(query, values);
        return result.rows;
    } catch (err) {
        console.error("Error fetching staff by flight number:", err);
        throw err;
    }
};

// Get the flight data by using flight number
export const getFlightInfoByFlightNumber = async (flightNumber) => {
    try {
        const query = `
            SELECT * FROM flight
            WHERE flight_number = $1
        `;
        const values = [flightNumber];

        const result = await flight_roster_db.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error("Error fetching flight info by flight number:", err);
        throw err;
    }
};

// Get all of the flights assigned to a staff using staff id
export const getFlightsByStaffId = async (staffId) => {
    try {
        const query = `
            SELECT 
                f.flight_id,
                f.flight_number,
                f.date,
                f.dept_time,
                f.dept_airport,
                f.arrival_time,
                f.arrival_airport,
                f.status,
                f.gate
            FROM flight f
            JOIN operating_on op ON f.flight_id = op.flight_id
            WHERE op.staff_id = $1
            ORDER BY f.date DESC, f.dept_time ASC
        `;
        const values = [staffId];

        const result = await flight_roster_db.query(query, values);
        return result.rows;
    } catch (err) {
        console.error("Error fetching flights for staff by staff id:", err);
        throw err;
    }
};

// 2. Get the staff's information by using staff id
export const getStaffInfoByStaffId = async (staffId) => {
    try {
        const query = `
            SELECT * FROM staff 
            WHERE staff_id = $1
        `;
        const values = [staffId];
        const result = await flight_roster_db.query(query, values);
        
        if (result.rows.length > 0) {
            return result.rows[0];
        } else {
            return null;
        }
    } catch (err) {
        console.error("Error fetching staff info by staff id:", err);
        throw err;
    }
};

export default flight_roster_db;