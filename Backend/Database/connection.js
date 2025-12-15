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
                p.gender,
                p.passport_number,
                p.birth_date, 
                p.nationality,
                p.has_allergy,
                p.disability_assistance,
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
export const getChildrenByGuardianTicketId = async (ticketId) => {
    try {
        const query = `
            SELECT DISTINCT
                p.first_name, 
                p.last_name,
                p.gender,
                p.passport_number,
                p.birth_date,
                p.gender, 
                p.nationality,
                p.has_allergy,
                p.disability_assistance,
                child_ft.seat_number,
                child_ft.class
            FROM passenger p
            JOIN guardian g ON p.passport_number = g.child_passport
            JOIN flight_ticket guardian_ft ON g.guardian_passport = guardian_ft.passport_number
            JOIN flight_ticket child_ft ON p.passport_number = child_ft.passport_number
            JOIN connected_flight cf_guardian ON guardian_ft.ticket_id = cf_guardian.ticket_id
            JOIN connected_flight cf_child ON child_ft.ticket_id = cf_child.ticket_id
            WHERE guardian_ft.ticket_id = $1
            AND cf_guardian.flight_id = cf_child.flight_id;
        `;
        const values = [ticketId];

        const result = await flight_roster_db.query(query, values);
        return result.rows; 
    } catch (err) {
        console.error("Error fetching copassengers by ticket:", err);
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
                f.status,
                f.gate
            FROM flight f
            JOIN connected_flight cf ON f.flight_id = cf.flight_id
            WHERE cf.ticket_id = $1
        `;
        const values = [ticketId];

        const result = await flight_roster_db.query(query, values);
        return result.rows[0];
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
                p.birth_date,
                p.gender, 
                p.nationality,
                p.has_allergy,
                p.disability_assistance,
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

// Get all of the pilots on the flight by using flight number
export const getPilotByFlightNumber = async (flightNumber) => {
    try {
        const query = `
            SELECT 
                s.first_name, 
                s.last_name, 
                s.gender,
                s.birth_date,
                s.role, 
                s.rank,
                s.nationality,
                STRING_AGG(sp.language, ', ') as speaks
            FROM staff s
            JOIN operating_on op ON s.staff_id = op.staff_id
            JOIN flight f ON op.flight_id = f.flight_id
            LEFT JOIN speaks sp ON s.staff_id = sp.staff_id
            WHERE f.flight_number = $1 AND s.role = 'Pilot'
            GROUP BY s.staff_id
        `;
        const values = [flightNumber];

        const result = await flight_roster_db.query(query, values);
        return result.rows;
    } catch (err) {
        console.error("Error fetching pilots by flight number:", err);
        throw err;
    }
};

// Get all of the cabin crew on the flight by using flight number
export const getCabinCrewByFlightNumber = async (flightNumber) => {
    try {
        const query = `
            SELECT 
                s.first_name, 
                s.last_name, 
                s.gender,
                s.birth_date,
                s.role, 
                s.rank,
                s.nationality,
                STRING_AGG(sp.language, ', ') as speaks
            FROM staff s 
            JOIN operating_on op ON s.staff_id = op.staff_id
            JOIN flight f ON op.flight_id = f.flight_id
            LEFT JOIN speaks sp ON s.staff_id = sp.staff_id
            WHERE f.flight_number = $1 AND s.role = 'Cabin Crew'
            GROUP BY s.staff_id
        `;
        const values = [flightNumber];

        const result = await flight_roster_db.query(query, values);
        return result.rows;
    } catch (err) {
        console.error("Error fetching cabin crew by flight number:", err);
        throw err;
    }
};

// Get all of the chefs on a flight using flight number
export const getChefByFlightNumber = async (flightNumber) => {
        try {
        const query = `
                    SELECT 
            s.first_name, 
            s.last_name, 
            STRING_AGG(DISTINCT d.dish_name, ', ') AS dishes
        FROM staff s 
        JOIN operating_on op ON s.staff_id = op.staff_id
        JOIN flight f ON op.flight_id = f.flight_id
        LEFT JOIN can_cook cc ON s.staff_id = cc.staff_id
        LEFT JOIN dish d ON cc.dish_id = d.dish_id
        WHERE f.flight_number = $1 
          AND s.role = 'Cabin Crew' 
          AND EXISTS (
          SELECT 1
          FROM can_cook
          WHERE cc.staff_id = s.staff_id
          )
        GROUP BY s.staff_id;

        `;
        const values = [flightNumber];

        const result = await flight_roster_db.query(query, values);
        return result.rows;
    } catch (err) {
        console.error("Error fetching cabin crew by flight number:", err);
        throw err;
    }
}
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

// Get the main passenger by using flight number
export const getAircraftInfoByFlightNumber = async (ticketId) => {
    try {
        const query = `
            SELECT 
                af.manufacturer,
                af.family_name,
                at.variant_name,
                tr.rating_name,
                a.pilot_capacity, 
                a.cabin_crew_capacity, 
                a.economy_passenger_capacity,
                a.business_passenger_capacity,
                a.economy_passenger_layout,
                a.business_passenger_layout
            FROM flight f
            JOIN aircraft a ON f.aircraft_id = a.aircraft_id
            JOIN aircraft_type at ON a.aircraft_type_id = at.aircraft_type_id
            JOIN aircraft_family af ON at.family_id = af.family_id
            JOIN type_rating tr ON at.type_rating_id = tr.type_rating_id 
            WHERE f.flight_number = $1
        `;
        const values = [ticketId];
        
        const result = await flight_roster_db.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error("Error fetching aircraft info by flight number:", err);
        throw err;
    }
};

export default flight_roster_db;