INSERT INTO type_rating (type_rating_id, rating_name) VALUES 
(1, 'B757/767 Common'),
(2, 'A320 Family'),
(3, 'B777'),
(4, 'B777X');

INSERT INTO aircraft_family (family_id, family_name, manufacturer) VALUES 
(1, '757', 'Boeing'),
(2, '767', 'Boeing'),
(3,  'A320', 'Airbus'),
(4,  '777', 'Boeing');

INSERT INTO aircraft_type (aircraft_type_id, variant_name, family_id, type_rating_id, max_range_km) VALUES 
(1, '-200', 1, 1, 5500),
(2, '-300', 1, 1, 6300),
(3, '-400',  2, 1, 11070),
(4, ' neo',  3, 2, 6500),
(5, '-300ER',  4, 3, 13650),
(6, '-8',  4, 4, 16190);

INSERT INTO aircraft (aircraft_id, aircraft_type_id, pilot_capacity, cabin_crew_capacity, passenger_capacity) VALUES 
(1, 1, 4, 6, 239), 
(2, 1, 4, 6, 215), 
(3, 2, 4, 7, 295), 
(4, 3, 4, 8, 290), 
(5, 4, 3, 5, 195), 
(6, 5, 4, 16, 550),
(7, 6, 4, 14, 384);

INSERT INTO staff (staff_id, password_hash, first_name, last_name, birth_date, gender, nationality, role, rank) VALUES 
(1, '$2b$10$9CvqUv.vOEhEYCiWJ3GfDe4A.NNMMhQDUwjxWs26ZkLZicZbs5d8i', 'James', 'Bond', '1949-12-01', 'Male', 'Turkish', 'Pilot', 'Junior'),
(2, '$2b$10$XW9L.j4YgrBRkAoe.DKoUOBlhf3O4PyIpBiLpKq9JeDtShanPl8Cm', 'John', 'Doe', '1979-05-21', 'Female', 'Turkish', 'Cabin Crew', 'Senior'),
(3, '$2b$10$FSUaBqZwmY0n17NLoJSJluoT2.g0ud7z3gey3I8N/Kw2EEIwP8daK', 'Jackie', 'Chan', '1999-01-02', 'Male', 'Turkish', 'Pilot', 'Senior'),
(4, '$2b$10$LvgeT0To1I7cAj/Jum3SDeD9XG4cKdGl/h1p6s4w.MLbYqdR3fCZu', 'Johannes', 'Keplar', '2005-07-14', 'Male', 'Turkish', 'Cabin Crew', 'Trainee'),
(5, '$2b$10$yyucEh47HATd4mKFukVwtOe4iEY9RDcLcoDC2AQ027OBt1sFXo166', 'Isaac', 'Newton', '2006-07-14', 'Male', 'Turkish', 'Cabin Crew', 'Junior');

INSERT INTO licensed_on(staff_id, type_rating_id) VALUES
(1,1),
(1,2),
(2,1),
(2,2);

INSERT INTO speaks (staff_id,language) VALUES
(1,'English'),
(1,'Turkish'),
(2,'English'),
(2,'Japanese');

INSERT INTO dish(dish_id, dish_name) VALUES
(1, 'Pizza'),
(2, 'Beef burger');

INSERT INTO can_cook(staff_id,dish_id) VALUES
(2,1),
(2,2),
(4,1),
(4,2);
 

INSERT INTO flight (flight_id, aircraft_id, date, dept_time, dept_airport,arrival_time,arrival_airport, gate, status,flight_number,boarding_time) VALUES
(1,1,'2026-12-15','03:30','IST','05:30','LHR','12A','Enroute','AN251','03:10'),
(2,1,'2026-12-15','15:45','LHR','17:45','IST','5P','Boarding','AN111','15:25'),
(3,2,'2026-12-15','03:30','LHR','05:30','IST','5B','Landed','AN878','03:10'),
(4,4,'2026-12-15','12:30','SAW','02:30','LHR','7C','Scheduled','AN123','12:10'),
(5,5,'2026-12-15','11:00','SAW','01:00','LHR','9A','Deboarding','AN456','10:30');

INSERT INTO operating_on(staff_id,flight_id) VALUES
(1,1),
(1,2),
(2,1),
(2,2);

INSERT INTO passenger(passport_number, first_name, last_name, birth_date, gender, has_allergy, disability_assistance, nationality) VALUES
('N1289','John','smith', '1949-12-01', 'Male', 'Yes peanut allergy', 'Yes wheelchair','Turkish'),
('N5678','Joe','biden', '1979-05-21', 'Female', 'No', 'Yes blind','American'),
('N7826','Ben','ten', '2000-11-24', 'Male', 'Yes dairy', 'No','Turkish'),
('N9611','Tom','cruise', '1967-02-16', 'Male', 'No', 'No','Turkish'),
('N8177','Jack','willer', '1915-05-09', 'Male', 'No', 'Yes deaf ','Turkish');

INSERT INTO flight_ticket(ticket_id, passport_number, seat_number, class) VALUES
(1,'N1289','12A', 'Economy'),
(2,'N5678', '24B', 'Economy'),
(3,'N7826', '32A', 'Economy'),
(4,'N9611', '01C', 'Business');


INSERT INTO connected_flight(flight_id, ticket_id) VALUES
(1,1),
(2,1),
(1,2),
(2,2);

INSERT INTO guardian(guardian_passport, child_passport) VALUES
('N1289','N5678'),
('N1289','N7826'),
('N9611','N8177');




