import express from "express";
import bodyParser from "body-parser";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { join } from "path";
import bcrypt from "bcrypt";
import {
  getMainPassengerByTicketId,
  getFlightInfoByTicketId,
  getCoPassengersByTicketId,
  getChefByFlightNumber,
  getPilotByTicketId,
  getCabinCrewByTicketId,
  getFlightInfoByFlightNumber,
  getPassengersByFlightNumber,
  getPilotByFlightNumber,
  getCabinCrewByFlightNumber,
  getFlightsByStaffId,
  getStaffInfoByStaffId
} from "./Database/connection.js";

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
    "Id":-1,
    staffInfo: [],
    staffAssignedFlights: []
};

//other members in the selected flight
var flight = {
    flightNumber: "none",
};

// This variable stores data for all of the views
var globalFlightData = {
    flightInfo: null,
    passengers: [],
    staff: {
        chef: [],
        cabinCrew: [],
        pilot: [] 
    }
};

const password = "staff5";
//use this to get the hashing
async function getHash(password) {
  const hash = await bcrypt.hash(password , saltRounds);
  console.log("Staff 5 Hashed password:", hash);
  return hash;
}

async function compare(password, hash){
 const match = await bcrypt.compare(password, hash);
 return match;
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

let loginError = false;
app.get("/login", (req, res)=>{
    staff = {
        "Id": -1,
        staffInfo: [],
        staffAssignedFlights: []
    };
    res.render("staff_login", {loginError});
    loginError = false;
})

app.get("/login/flight-list", (req, res)=>{
    if(staff["Id"] == -1){
        res.redirect("/login");
    }
    else{
        res.render("flight-list", {employee: staff.staffInfo, flights: staff.staffAssignedFlights});
    }
})

app.post("/login/flight-list", async (req, res) => {
    const staffId = req.body.staffId;
    const inputPassword = req.body.password;
    staff.staffInfo = await getStaffInfoByStaffId(staffId);
    
    if(!staff.staffInfo){
        loginError = true;
        res.redirect("/login");
    }
    staff["Id"] = staffId;
    let passwordIsCorrect = await compare(inputPassword, staff.staffInfo.password_hash);
    if(passwordIsCorrect){
        staff.staffAssignedFlights = await getFlightsByStaffId(staffId);
        res.render("flight_list", {employee: staff.staffInfo, flights: staff.staffAssignedFlights});
    }
    
    else{
        loginError = true;
        res.redirect("/login");
    }
});

//start of passenger requests
var guestError = false;

app.get("/guest", (req, res)=>{
    passenger = {
    "ticketId":-1,
    };

    flight = { flightNumber: "none" };
    globalFlightData = { flightInfo: null, passengers: [], staff: [] };

    res.render("flight_tracker", {guestError});
    guestError = false;
})

// Stores the ticket pattern and flight pattern
const ticketPattern = /^\d{9}$/;        // 9 digits only
const flightPattern = /^AN\d{3}$/i;     // starts with AN, then 3 digits

async function fetchFlightData(input) {
    let data = {
        flightInfo: null,
        passengers: [],
        staff: {
            chef: [],
            cabinCrew: [],
            pilot: [] 
    }
    };

    if (ticketPattern.test(input)) {
        passenger["ticketId"]=input;
        flight["flightNumber"] = "none";
        const mainPassenger = await getMainPassengerByTicketId(input);
        const flightInfoArr = await getFlightInfoByTicketId(input);

        data.flightInfo = flightInfoArr[0];
        const coPassengers = await getCoPassengersByTicketId(input);
        
        console.log(flightInfoArr)

        // puts the main passenger first then adds the other passengers
        if (mainPassenger) {
            data.passengers = [mainPassenger, ...coPassengers];
        } else {
            data.passengers = coPassengers;
        }

        data.staff.pilot = await getPilotByFlightNumber(flightInfoArr[0]);
        data.staff.cabinCrew = await getCabinCrewByFlightNumber(flightInfoArr[0]);
        data.staff.chef = await getChefByFlightNumber(flightInfoArr[0]);
    } 

    else if (flightPattern.test(input)) {
        flight["flightNumber"]=input;
        passenger["ticketId"]=0;
        data.flightInfo = await getFlightInfoByFlightNumber(input);
        if(staff["Id"]==-1){
            data.passengers = null;
        } else {
        data.passengers = await getPassengersByFlightNumber(input);
        }
        data.staff.pilot = await getPilotByFlightNumber(input);
        data.staff.cabinCrew = await getCabinCrewByFlightNumber(input);
        data.staff.chef = await getChefByFlightNumber(input);
    }
    return data;
}

app.post("/guest/tabular-view", async (req, res)=>{
    const guestInput = req.body.flightInput.trim();
    globalFlightData = await fetchFlightData(guestInput);

    if(!globalFlightData || !globalFlightData.flightInfo){
        guestError=true;
        res.redirect("/guest");
    }
    else{
        res.render("tabular_view", globalFlightData);
    }
});

app.get("/guest/flight-view", (req, res)=>{
    if(passenger["ticketId"]==-1||flight["flightNumber"]==="none"){
        res.redirect('/guest');
    } else {
    res.render("flight_view", globalFlightData);
    }
});

app.get("/guest/tabular-view", (req, res)=>{
     if(passenger["ticketId"]==-1||flight["flightNumber"]==="none"){
        res.redirect('/guest');
    } else {
    res.render("tabular_view", globalFlightData);
    }
});

app.get("/guest/extended-view", (req, res)=>{
    if(passenger["ticketId"]==-1||flight["flightNumber"]==="none"){
        res.redirect('/guest');
    } else {
    res.render("extended_view", globalFlightData);
    console.log(globalFlightData);
    }
});
//end of passenger requests

app.get("/about-us", (req, res)=>{
    res.render("about_us");
});

app.get("/test", (req, res)=>{
    res.render("about_us");
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