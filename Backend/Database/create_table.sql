CREATE TYPE gender_enum AS ENUM ('Male', 'Female', 'Other');
CREATE TYPE role_enum AS ENUM ('Pilot', 'Cabin Crew');
CREATE TYPE rank_enum AS ENUM ('Senior', 'Junior', 'Trainee');
CREATE TYPE flight_status_enum AS ENUM ('Scheduled', 'Enroute', 'Boarding','Departed','Delayed','Cancelled','Diverted','Landed','Deboarding');
CREATE TYPE class_enum AS ENUM ('economy', 'business');

CREATE TABLE type_rating(
    type_rating_id SERIAL PRIMARY KEY,
    rating_name TEXT NOT NULL UNIQUE
);

CREATE TABLE aircraft_family(
    family_id SERIAL PRIMARY KEY,
    manufacturer TEXT NOT NULL,
    family_name TEXT NOT NULL,
    UNIQUE(manufacturer, family_name)
);

CREATE TABLE aircraft_type(
    aircraft_type_id SERIAL PRIMARY KEY,
    family_id INT NOT NULL REFERENCES aircraft_family(family_id) ON DELETE RESTRICT,
    type_rating_id INT NOT NULL REFERENCES type_rating(type_rating_id) ON DELETE RESTRICT, 
    variant_name TEXT NOT NULL,       
    max_range_km INT NOT NULL CHECK (max_range_km > 0),
    UNIQUE(family_id, variant_name)
);

CREATE TABLE aircraft(
    aircraft_id SERIAL PRIMARY KEY,
    aircraft_type_id INT NOT NULL REFERENCES aircraft_type(aircraft_type_id) ON DELETE RESTRICT,
    pilot_capacity SMALLINT NOT NULL CHECK (pilot_capacity >= 2),
    cabin_crew_capacity SMALLINT NOT NULL CHECK (cabin_crew_capacity >= 1),
    passenger_capacity SMALLINT NOT NULL CHECK (passenger_capacity >= 0)
);

CREATE TABLE staff(
    staff_id SERIAL PRIMARY KEY,
    password_hash TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    birth_date DATE NOT NULL,
    gender gender_enum NOT NULL, 
    nationality TEXT NOT NULL,
    role role_enum NOT NULL,
    rank rank_enum NOT NULL
);

CREATE TABLE licensed_on(
    staff_id INT NOT NULL REFERENCES staff(staff_id) ON DELETE CASCADE,
    type_rating_id INT NOT NULL REFERENCES type_rating(type_rating_id) ON DELETE CASCADE, 
    PRIMARY KEY (staff_id, type_rating_id)
);

CREATE TABLE speaks(
    staff_id INT NOT NULL REFERENCES staff(staff_id) ON DELETE CASCADE,
    language TEXT NOT NULL,
    PRIMARY KEY (staff_id, language)
);

CREATE TABLE dish(
    dish_id SERIAL PRIMARY KEY,
    dish_name TEXT NOT NULL UNIQUE
);

CREATE TABLE can_cook(
    staff_id INT NOT NULL REFERENCES staff(staff_id) ON DELETE CASCADE,
    dish_id INT NOT NULL REFERENCES dish(dish_id) ON DELETE CASCADE,
    PRIMARY KEY(staff_id, dish_id)
);

CREATE FUNCTION check_staff_is_crew()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM staff 
        WHERE staff_id = NEW.staff_id 
        AND role = 'Cabin Crew'
    ) THEN
        RAISE EXCEPTION 'Only Cabin Crew can be assigned to can_cook';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_cabin_crew_cooking
BEFORE INSERT OR UPDATE ON can_cook
FOR EACH ROW
EXECUTE FUNCTION check_staff_is_crew();

CREATE TABLE flight (
    flight_id SERIAL PRIMARY KEY,
    aircraft_id INT NOT NULL REFERENCES aircraft (aircraft_id)
    date DATE,
    dept_time TIME,
    dept_airport TEXT NOT NULL,
    arrival_time TIME,
    arrival_airport TEXT NOT NULL,
    gate TEXT,
    status flight_status_enum NOT NULL,
    flight_number  TEXT NOT NULL UNIQUE,
    boarding_time TIME
);

CREATE TABLE operating_on(
staff_id INT REFERENCES staff (staff_id),
flight_id INT REFERENCES flight (flight_id),
PRIMARY KEY (staff_id, flight_id)
);


CREATE TABLE passenger (
    passport_number TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    birth_date DATE NOT NULL,
    gender gender_enum NOT NULL,
    nationality TEXT NOT NULL,
    has_allergy TEXT,
    disability_assistance TEXT
);



CREATE TABLE flight_ticket (
    ticket_id SERIAL PRIMARY KEY,
    passport_number TEXT NOT NULL REFERENCES passenger(passport_number),
    seat_number TEXT NOT NULL,
    class class_enum NOT NULL
);

CREATE TABLE connected_flights(
    ticket_id INT REFERENCES flight_ticket(ticket_id),
    flight_id INT REFERENCES flight(flight_id),
    PRIMARY KEY (ticket_id,flight_id)
);

CREATE TABLE guardian(
    guardian_passport TEXT REFERENCES passenger(passport_number),
    child_passport TEXT REFERENCES passenger(passport_number),
    PRIMARY KEY (guardian_passport,child_passport)
);

