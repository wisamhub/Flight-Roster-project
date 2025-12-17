INSERT INTO type_rating (rating_name) VALUES 
('A220 Family'),
('A320 Family');

INSERT INTO aircraft_family (family_name, manufacturer) VALUES 
('A220', 'Airbus'),
('A320', 'Airbus');

INSERT INTO aircraft_type (variant_name, family_id, type_rating_id, max_range_km) VALUES 
('-100', 1, 1, 6390),
('-300', 1, 1, 6200),
('A319', 2, 2, 6900),
('A320', 2, 2, 6300);

--Every aircraft even if its the same family and variant can have different amount of seats based on its seating configuration
INSERT INTO aircraft (aircraft_type_id, pilot_capacity, cabin_crew_capacity, economy_passenger_capacity, economy_passenger_layout, business_passenger_capacity, business_passenger_layout) VALUES 
(1, 2, 4, 80, '{2,3}', 20, '{2,2}'), 
(1, 2, 4, 100, '{2,3}', 10, '{2,2}'), 
(2, 2, 6, 100, '{2,3}', 20, '{2,2}'), 
(2, 2, 6, 120, '{2,3}', 10, '{2,2}'),
(3, 2, 4, 80, '{3,3}', 20, '{2,2}'),
(4, 2, 5, 150, '{3,3}', 30, '{2,2}');

INSERT INTO staff (staff_id, password_hash, first_name, last_name, birth_date, gender, nationality, role, rank) VALUES 
(1, '$2b$10$9CvqUv.vOEhEYCiWJ3GfDe4A.NNMMhQDUwjxWs26ZkLZicZbs5d8i', 'James', 'Bond', '1949-12-01', 'Male', 'Turkish', 'Pilot', 'Junior'),
(2, '$2b$10$XW9L.j4YgrBRkAoe.DKoUOBlhf3O4PyIpBiLpKq9JeDtShanPl8Cm', 'Akane', 'Tsunemori', '1979-05-21', 'Female', 'Japanese', 'Pilot', 'Senior'),
(3, '$2b$10$Rs4z9FZRTdLlyHbcyZ6uEO9nFkcRlzenAwMLgZk/M3EkWJMhLpxxO', 'Anya', 'Forger', '1950-06-01', 'Female', 'Ostania', 'Cabin Crew', 'Senior'),
(4, '$2b$10$UbMSAB5U3CrVWJBTAvRu4exZiXGFyK8fqmoj48sZNhWJ0U5iJ2K8u', 'Jackie', 'Chan', '1999-01-02', 'Male', 'Turkish', 'Cabin Crew', 'Senior'),
(5, '$2b$10$CEsw4TeevAD6P3XqdCEEQeY0GflzNdG4vFyBUscLw1rv8c/AT/A/C', 'Johannes', 'Keplar', '2005-07-14', 'Male', 'Turkish', 'Cabin Crew', 'Trainee'),
(6, '$2b$10$FD/TU/9GmXOfRSoxfcxfc.YKzmVd4VrfZSu1H4eRG4fzg/w/tqYnK', 'Isaac', 'Newton', '2006-07-14', 'Male', 'Turkish', 'Pilot', 'Junior');

INSERT INTO licensed_on(staff_id, type_rating_id) VALUES
(1,1),
(1,2),
(2,1),
(2,2),
(3,1),
(4,1);
INSERT INTO speaks (staff_id,language) VALUES
(1,'English'),
(1,'Turkish'),
(2,'English'),
(2,'Japanese');

INSERT INTO dish(dish_name) VALUES
('Pizza'),
('Beef burger');

INSERT INTO can_cook(staff_id,dish_id) VALUES
(3,1),
(3,2),
(4,1),
(4,2);
 
INSERT INTO flight (aircraft_id, date, dept_time, dept_airport,arrival_time,arrival_airport, gate, status,flight_number,boarding_time) VALUES
(1,'2026-12-15','03:30','IST','05:30','LHR','12A','Enroute','AN251','03:10'),
(1,'2026-12-15','15:45','LHR','17:45','IST','5P','Boarding','AN111','15:25'),
(2,'2026-12-15','03:30','LHR','05:30','IST','5B','Landed','AN878','03:10'),
(4,'2026-12-15','12:30','SAW','02:30','LHR','7C','Scheduled','AN123','12:10'),
(5,'2026-12-15','11:00','SAW','01:00','LHR','9A','Deboarding','AN456','10:30');

INSERT INTO operating_on(staff_id,flight_id) VALUES
(1,1),
(1,2),
(2,1),
(2,2),
(3,1),
(4,2);

INSERT INTO passenger(passport_number, first_name, last_name, birth_date, gender, has_allergy, disability_assistance, nationality) VALUES
('N1289','John','smith', '1949-12-01', 'Male', 'Peanuts', 'Wheelchair','Turkish'),
('N5678','Joe','biden', '1979-05-21', 'Female', 'None', 'Blind, deaf','American'),
('N7826','Ben','ten', '2000-11-24', 'Male', 'Dairy', 'None','Turkish'),
('N9611','Tom','cruise', '1967-02-16', 'Male', 'None', 'None','Turkish'),
('N8177','Jack','willer', '1915-05-09', 'Male', 'None', 'Deaf ','Turkish');

INSERT INTO flight_ticket(ticket_id, passport_number, seat_number, class) VALUES
(111111111,'N1289','10A', 'Economy'),
(222222222,'N5678', '20B', 'Economy'),
(333333333,'N7826', '15A', 'Economy'),
(444444444,'N9611', '1C', 'Business'),
(555555555, 'N9611', '20A', 'Economy');
/* flight ticket IDs must be exactly 9 digits*/

INSERT INTO connected_flight(flight_id, ticket_id) VALUES
(1,111111111),
(1,222222222),
(1,555555555),
(2,333333333),
(2,444444444);


INSERT INTO guardian(guardian_passport, child_passport) VALUES
('N1289','N5678'),
('N1289','N7826'),
('N9611','N8177');




