# Flight-Roster-project

# part 1: setting up the database
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
you will be asked to input your pgAdmin password (you might see nothing is being inputted but it is just press enter after writing your password)

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


# part 2: running the server

# step 1: getting nodeJS 

the following URL should get you to install nodeJS

`https://nodejs.org/en/download`

only get the following versions: v22.20.0 or any (newer LTS release) 
(LTS stands for long term support)

# for windows users:
    It is recommended to use Docker with npm for a smoother setup experience.   

# for other users:
    Docker and npm are also fully supported and recommended.

after you download NodeJS open your console and run the following commands
node -v
npm -v

if both are showing the version you installed then you are set up to run the software.

# Step 2: Running the Software

This project includes the `node_modules` directory. However, if it was removed, run the following command inside the `Backend` directory:

npm i

After the installation completes, open the `.env` file and update `DB_USER` and `DB_PASSWORD` with the credentials you created in pgAdmin.

Next, still inside the `Backend` directory, start the server by running:

node index.js

Once the server is running, open your web browser and navigate to:

http://localhost:3000

and enjoy :D