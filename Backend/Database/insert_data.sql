INSERT INTO type_rating (type_rating_id, rating_name) VALUES 
(1, 'B757/767 Common'),
(2, 'A320 Family'),
(3, 'B777'),
(4, 'B777X');

INSERT INTO aircraft_family (family_id, family_name, manufacturer) VALUES 
(1, '757', 'Boeing'),
(2, '767', 'Boeing'),
(3,  '320', 'Airbus'),
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
(1, 'hash123', 'James', 'Bond', '1949-12-01', 'Male', 'Turkish', 'Pilot', 'Junior'),
(2, 'hash456', 'John', 'Doe', '1979-05-21', 'Female', 'Turkish', 'Cabin Crew', 'Senior'),
(3, 'hash789', 'Jackie', 'Chan', '1999-01-02', 'Male', 'Turkish', 'Pilot', 'Senior'),
(4, 'hash321', 'Johannes', 'Keplar', '2005-7-14', 'Male', 'Turkish', 'Cabin Crew', 'Trainee'),
(4, 'hash321', 'Isaac', 'Newton', '2006-7-14', 'Male', 'Turkish', 'Cabin Crew', 'Junior');