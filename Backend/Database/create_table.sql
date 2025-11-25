CREATE TYPE gender_enum AS ENUM ('Male', 'Female', 'Other');
CREATE TYPE role_enum AS ENUM ('Pilot', 'Cabin Crew');
CREATE TYPE rank_enum AS ENUM ('Senior', 'Junior', 'Trainee');
CREATE TYPE flight_status AS ENUM ('Scheduled', 'enroute', 'Boarding','Departed','Delayed','Cancelled','Diverted','Landed','Deboarding');

CREATE TABLE aircraft_type(
    aircraft_type_id SERIAL PRIMARY KEY,
    aircraft_type TEXT NOT NULL UNIQUE,
    manufacturer TEXT NOT NULL,
    max_range INT  NOT NULL CHECK (max_range > 0)
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
    aircraft_type_id INT NOT NULL REFERENCES aircraft_type(aircraft_type_id) ON DELETE CASCADE,
    PRIMARY KEY (staff_id, aircraft_type_id)
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

CREATE FUNCTION is_cabin_crew(id_to_check INT)
RETURNS BOOLEAN AS $$
DECLARE
    staff_role role_enum;
BEGIN
    SELECT role INTO staff_role FROM staff WHERE staff_id = id_to_check;
    RETURN staff_role = 'Cabin Crew';
END;
$$ LANGUAGE plpgsql;

CREATE TABLE can_cook(
    staff_id INT NOT NULL REFERENCES staff(staff_id) ON DELETE CASCADE,
    dish_id INT NOT NULL REFERENCES dish(dish_id) ON DELETE CASCADE,
    PRIMARY KEY(staff_id, dish_id),
    CONSTRAINT staff_must_be_cabin_crew CHECK (is_cabin_crew(staff_id))
);
