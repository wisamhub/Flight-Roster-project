CREATE TYPE gender_enum AS ENUM ('Male', 'Female', 'Other');
CREATE TYPE role_enum AS ENUM ('Pilot', 'Cabin Crew', 'Chef');
CREATE TYPE rank_enum AS ENUM ('Senior', 'Junior', 'Trainee');

CREATE TABLE aircraft_type(
    id SERIAL PRIMARY KEY,
    aircraft_type TEXT,
    manufacturer TEXT,
    range INT
);

CREATE TABLE aircraft(
    id SERIAL PRIMARY KEY,
    aircraft_type_id INT REFERENCES aircraft_type(id),
    pilot_capacity INT CHECK (pilot_capacity >= 2),
    cabin_crew_capacity INT CHECK (cabin_crew_capacity >= 1),
    passenger_capacity INT CHECK (passenger_capacity >= 0)
);

CREATE TABLE staff(
    id SERIAL PRIMARY KEY,
    password TEXT NOT NULL CHECK (length(password) >= 8),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    year_of_birth INT,
    gender gender_enum, 
    nationality TEXT,
    role role_enum,
    rank rank_enum
);

CREATE TABLE speaks(
    staff_id INT REFERENCES staff(id),
    language TEXT NOT NULL,
    PRIMARY KEY (staff_id, language)
);

CREATE TABLE dish(
    id SERIAl PRIMARY KEY,
    dish_name TEXT NOT NULL
);

CREATE TABLE can_cook(
    staff_id INT REFERENCES staff(id) ON DELETE CASCADE,
    dish_id INT REFERENCES dish(id) ON DELETE CASCADE,
    PRIMARY KEY(staff_id, dish_id)
);
