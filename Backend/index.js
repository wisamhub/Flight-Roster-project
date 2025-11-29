import express from "express";
import bodyParser from "body-parser";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { join } from "path";
import bcrypt from "bcrypt";
import flight_roster_db from "./Database/connection.js";

//variables, constants, functions
const app = express();
const port = 3000
const saltRounds = 10;
const __dirname = dirname(fileURLToPath(import.meta.url));

//object of the passenger currently using the software
var passenger = {
    "ticketId":-1
};

//object of the staff currently using the software
var staff = {
    "Id":-1
};

//other members in the selected flight
var flight = {
    flightNumber: "none",
};


const password = "hello";
//use this to get the hashing
async function getHash(password) {
  const hash = await bcrypt.hash(password , saltRounds);
  console.log("Hashed password:", hash);
  return hash;
}

async function compare(password, hash){
 const match = await bcrypt.compare(password, hash);
 if(match){
    console.log("yes");
 } else {
    console.log("no");
 }
};


//Middlewares
app.use(express.static(join(__dirname, "..", "Frontend", "public")));
app.use(bodyParser.urlencoded({ extended: true }));

//views files
app.set('views', join(__dirname, '../Frontend/views'));
app.set('view engine', 'ejs');

//server requests and responds
app.get("/",(req, res)=>{
    res.render("home");
})

app.get("/login", (req, res)=>{
    res.render("staff_login");
})

//start of passenger requests
var error = false;

app.get("/guest", (req, res)=>{
    passenger = {
    "ticketId":-1,
    };

    flight = {
    flightNumber: "none",
    otherPassengers: [],
    otherStaff: []
    };

    res.render("flight_tracker", {error});
    error = false;
})

app.post("/guest/tabular-view", (req, res)=>{
    const guestInput = req.body.flightInput.trim();
    const ticketPattern = /^\d{9}$/;        // 9 digits only
    const flightPattern = /^AN\d{3}$/i;     // starts with AN, then 3 digits
    if(ticketPattern.test(guestInput)){
        passenger["ticketId"]=guestInput;
        //DB queries will be done here
        res.render("tabular_view");
    } else if(flightPattern.test(guestInput)){
        flight["flightNumber"]=guestInput;
        passenger["ticketId"]=0;
        //also here
        res.render("tabular_view");
    } else{
        error=true;
        res.redirect("/guest");
    }
});

app.get("/guest/flight-view", (req, res)=>{
    if(passenger["ticketId"]==-1||flight["flightNumber"]==="none"){
        res.redirect('/guest');
    } else {
    res.render("flight_view");
    }
});

app.get("/guest/tabular-view", (req, res)=>{
     if(passenger["ticketId"]==-1||flight["flightNumber"]==="none"){
        res.redirect('/guest');
    } else {
    res.render("tabular_view");
    }
});

app.get("/guest/extended-view", (req, res)=>{
    if(passenger["ticketId"]==-1||flight["flightNumber"]==="none"){
        res.redirect('/guest');
    } else {
    res.render("extended_view");
    }
});
//end of passenger requests

app.get("/test", (req, res)=>{
    res.render("flight_list");
    //simple test URL will be removed later change file name to check certain pages too
}) 

//404 pages
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

//server listener
app.listen(3000, async ()=>{
    console.log("server started at port:"+ port);
    const hash = await getHash(password); 
})