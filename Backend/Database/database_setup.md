# Flight Roster Database Setup
follow the steps below to setup the database

# Step 1: Install PostgreSQL
You can install PostgreSql from the url below
[https://www.postgresql.org/download/]

# Step 2: Create the Database
Create a new database and call it `flight_roster`

# step 3: Run  this script in the root directory which is \Flight-Roster-project note that you might have to add PostgreSQL to your system variable by default you can find it in C:\Program Files\PostgreSQL\15\bin or where you downloaded it then copy this path and go to edit the system environment variables then go to Environment Variables then go to path then edit then new then paste your path then you need to restart your IDE

psql -U postgres -d flight_roster -f Backend\Database\create_table.sql

# To check if the tables were created successfully type this in the terminal
psql -U postgres -d flight_roster

# Then type 
\dt

# Now you should be able to see all the tables if you dont something went wrong