# Flight Roster Database Setup
follow the steps below to setup the database

# Step 1: Install PostgreSQL
You can install PostgreSql from the url below

[https://www.postgresql.org/download/]

# Step 2: Create the Database
Open pgAdmin Create a new database and call it `flight_roster`

# step 3: Configure System Path (Windows Only)
**If you already can run `psql` in your terminal skip this step!!**

In File Explorer navigate to its path by default you can find it in `C:\Program Files\PostgreSQL\<VERSION>\bin` or where you downloaded it then copy the path and in windows search, search for **Edit the system environment variables** then click **Environment Variables** then click on **path** then **edit** then **new** then paste your path then you need to restart your IDE


# Step 4:  In the terminal navigate to the Database directory
So in the terminal just type the  below assuming you are at the root directory: `\FLIGHT-ROSTER-PROJECT`
```
cd Backend
cd Database
```

# Step 5: In the terminal run the script below to create the tables 
`psql -U postgres -d flight_roster -f create_table.sql`

You should see multiple CREATE ....

To check if all the tables were created successfully we need to enter the PostgreSQL interactive shell by typing the below script in the terminal

`psql -U postgres -d flight_roster`

Then type

`\dt`

**NOTE: You can press enter to view more rows!**

Now you should be able to see all the tables if you dont something went wrong

# Step 6: While still in the `/Backend/Database` directory, run the script below to insert values into the tables we created

**If you are inside the PostgreSQL interactive shell run the below script**

`\i insert_data.sql`


**If you are outside the PostgreSQL interactive shell run the script below**

`psql -U postgres -d flight_roster -f insert_data.sql`

**Note: If you are inside the PostgreSQL interactive shell you can exit it by typing `\q`**

**Note: If you want to enter the PostgreSQL interactive shell you can by typing `psql -U postgres -d flight_roster`**

Now you should see a bunch of `INSERT 0 N` if you dont the script failed or an error occured.