import express from "express";
import bodyParser from "body-parser";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { join } from "path";
import bcrypt from "bcrypt";
import {
  getMainPassengerByTicketId,
  getFlightInfoByTicketId,
  getChildrenByGuardianTicketId,
  getChefByFlightNumber,
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

// Stores the ticket pattern and flight pattern
const ticketPattern = /^\d{9}$/;        // 9 digits only
const flightPattern = /^AN\d{3}$/i;     // starts with AN, then 3 digits
// gets the flight info based on the input type
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
        const mainPassenger = await getMainPassengerByTicketId(input);
        data.flightInfo= await getFlightInfoByTicketId(input);

        if(!data.flightInfo){
            flight["flightNumber"] = "none";
            data.staff.pilot = [];
            data.staff.cabinCrew = [];
            data.staff.chef = [];
        }
        else{
            flight["flightNumber"] = data.flightInfo.flight_number;
        }

        const mainPassengerChildren = await getChildrenByGuardianTicketId(input);
        
        // puts the main passenger first then adds the other passengers
        if (mainPassenger) {
            if(mainPassengerChildren.length > 0){
                data.passengers = [mainPassenger, ...mainPassengerChildren];
            }
            else{
                data.passengers = [mainPassenger];
            }
        }
    } 

    else if (flightPattern.test(input)) {
        flight["flightNumber"]=input;
        passenger["ticketId"]=0;
        data.flightInfo = await getFlightInfoByFlightNumber(input);
        if(staff["Id"]==-1){
            data.passengers = [];
        } else {
            data.passengers = await getPassengersByFlightNumber(input);
        }
        if(!data.flightInfo){
            data.staff.pilot = [];
            data.staff.cabinCrew = [];
            data.staff.chef = [];
        }
        else{
            data.staff.pilot = await getPilotByFlightNumber(input);
            data.staff.cabinCrew = await getCabinCrewByFlightNumber(input);
            data.staff.chef = await getChefByFlightNumber(input);
        }
    }
    console.log(staff["Id"]);
    return data;
}

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

//--------------server requests and responds--------------------

// staff exclusive requests
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


app.post("/staff/tabular-view", async (req, res) => {
    const flight_number = req.body.flight_number;
    globalFlightData = await fetchFlightData(flight_number);
    res.render("tabular_view",{flightInfo: globalFlightData.flightInfo, staff: globalFlightData.staff, passengers: globalFlightData.passengers});
})

app.get("/staff/extended-view", async (req,res) => {
    res.render("extended_view",{flightInfo: globalFlightData.flightInfo, staff: globalFlightData.staff, passengers: globalFlightData.passengers})
})

app.get("/staff/tabular-view", async (req,res) => {
    res.render("tabular_view",{flightInfo: globalFlightData.flightInfo, staff: globalFlightData.staff, passengers: globalFlightData.passengers})
})

app.get("/staff/flight-view", async (req,res) => {
    res.render("flight_view",{flightInfo: globalFlightData.flightInfo, staff: globalFlightData.staff, passengers: globalFlightData.passengers})
})

//passenger exclusive requests
var guestError = false;

//this is what the passenger first sees they will be able to input their flight number or ticket ID
app.get("/guest", (req, res)=>{
    passenger = {
    "ticketId":-1,
    };

    flight = { flightNumber: "none" };
    globalFlightData = { flightInfo: null, passengers: [], staff: [] };

    res.render("flight_tracker", {guestError});
    guestError = false;
})

//after the passenger inputs one of the two inputs the guest-view page will be presented
app.post("/guest/guest-view", async (req, res)=>{
    const guestInput = req.body.flightInput.trim();
    console.log(guestInput);
    globalFlightData = await fetchFlightData(guestInput);

    if(!globalFlightData || !globalFlightData.flightInfo){
        guestError=true;
        res.redirect("/guest");
    }
    else{
        res.render("guest_view", globalFlightData);
        console.log(globalFlightData);
    }
});



// global user requests (staff and passengers can use)
app.get("/",(req, res)=>{
    res.render("home");
})

app.get("/about-us", (req, res)=>{
    res.render("about_us");
});

app.get("/test", (req, res)=>{
    res.render("tabular_view");
    //simple test URL will be removed later change file name to check certain pages too
}) 

//404 page
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

//server listener
app.listen(3000, async ()=>{
    console.log("server started at port:"+ port);
    const hash = await getHash(password); 
})