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
  getStaffInfoByStaffId,
  getAircraftInfoByFlightNumber,
  flightExists,
  validateFlightData,
  createFlight,
  getAllFlights
} from "./Database/connection.js";

//variables, constants, functions
const app = express();
const port = 3000
const saltRounds = 10;
const __dirname = dirname(fileURLToPath(import.meta.url));
let loggedIn = false;

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
    aircraftInfo: null,
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
        aircraftInfo: null,
        passengers: [],
        staff: {
            chef: [],
            cabinCrew: [],
            pilot: [] 
        }
    };

    // if it is a ticket pattern in the passengers section it will only show the main passenger and his children even for staff
    if (ticketPattern.test(input)) {
        passenger["ticketId"]=input;
        data.flightInfo= await getFlightInfoByTicketId(input);

        if(!data.flightInfo){
            flight["flightNumber"] = "none";
            data.aircraftInfo = null;
            data.staff.pilot = [];
            data.staff.cabinCrew = [];
            data.staff.chef = [];
        }
        else{
            const mainPassenger = await getMainPassengerByTicketId(input);
            flight["flightNumber"] = data.flightInfo.flight_number;
            data.aircraftInfo = await getAircraftInfoByFlightNumber(data.flightInfo.flight_number);
            if(staff["Id"] == -1){
                data.staff.pilot = [];
                data.staff.cabinCrew = [];
                data.staff.chef = [];
            }
            else{
                data.staff.pilot = await getPilotByFlightNumber(data.flightInfo.flight_number);
                data.staff.cabinCrew = await getCabinCrewByFlightNumber(data.flightInfo.flight_number);
                data.staff.chef = await getChefByFlightNumber(data.flightInfo.flight_number);
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
    } 

    // if it is a flight number pattern all passengers and staff will be shown to the staff but no passengers and staff will be shown to guest
    else if (flightPattern.test(input)) {
        flight["flightNumber"]=input;
        passenger["ticketId"]=0;
        data.flightInfo = await getFlightInfoByFlightNumber(input);
        if(!data.flightInfo){
            data.aircraftInfo = null;
            data.staff.pilot = [];
            data.staff.cabinCrew = [];
            data.staff.chef = [];
        }
        else{
            data.aircraftInfo = await getAircraftInfoByFlightNumber(input);
            if(staff["Id"]==-1){
                data.passengers = [];
                data.staff.pilot = [];
                data.staff.cabinCrew = [];
                data.staff.chef = [];
            } 
            else {
                data.passengers = await getPassengersByFlightNumber(input);
                data.staff.pilot = await getPilotByFlightNumber(input);
                data.staff.cabinCrew = await getCabinCrewByFlightNumber(input);
                data.staff.chef = await getChefByFlightNumber(input);
            } 
        }
    }
    return data;
}

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
        return res.redirect("/login");
    }
    else{
        res.render("flight_list", {staff: staff.staffInfo, flights: staff.staffAssignedFlights, logIn: loggedIn});
    }
})

app.post("/login/flight-list", async (req, res) => {
    const staffId = req.body.staffId;
    const inputPassword = req.body.password;

    if (!/^\d+$/.test(staffId)) {
        loginError = true;
        return res.redirect("/login");
    }

    staff.staffInfo = await getStaffInfoByStaffId(staffId);

    if(!staff.staffInfo){
        loginError = true;
        return res.redirect("/login");
    }
    staff["Id"] = staffId;
    let passwordIsCorrect = await compare(inputPassword, staff.staffInfo.password_hash);
    if(passwordIsCorrect){
        loggedIn = true;
        if(staff.staffInfo["role"]=="Admin"){
            res.redirect("/admin")
        }
        else{
            staff.staffAssignedFlights = await getFlightsByStaffId(staffId);
            return res.render("flight_list", {staff: staff.staffInfo, flights: staff.staffAssignedFlights, logIn: loggedIn});
        }
    }
    else{
        loginError = true;
        loggedIn = false;
        res.redirect("/login");
    }
});

app.get("/admin",(req, res)=>{
    if(loggedIn && staff.staffInfo["role"]=="Admin"){
        res.render("selection", {staff: staff.staffInfo, flights: staff.staffAssignedFlights, logIn: loggedIn});
    } else {
        res.redirect("/login");
    }
});

app.get("/admin/create-flight", (req,res) => {
    if(loggedIn && staff.staffInfo["role"]=="Admin"){
        res.render("flight_creator", {staff: staff.staffInfo, flights: staff.staffAssignedFlights, logIn: loggedIn});
    } else {
        res.redirect("/login");
    }
});

app.post("/admin/create-flight", async (req, res)=>{
    const errors = validateFlightData(req.body);

    if (errors.length > 0) {
        console.log(errors);
        return res.render("flight_creator", {
            staff: staff.staffInfo,
            flights: staff.staffAssignedFlights,
            logIn: loggedIn,
            errors
        });
    }
    if(flightExists(flight_number)){
        res.render("flight_creator", {staff: staff.staffInfo, flights: staff.staffAssignedFlights, logIn: loggedIn, errors:["Flight number already exists"]});
    }
    await createFlight(req.body);
});

app.post("/staff/flight-list", async (req, res) => {
    if(staff["Id"] == -1){
        return res.redirect("/login");
    }
    const flight_number = req.body.flight_number;
    globalFlightData = await fetchFlightData(flight_number);
    if(!globalFlightData || !globalFlightData.flightInfo){
        return res.status(404).render("404");
    }
    if(staff.staffInfo["role"]=="Admin"){
        return res.redirect("/admin/flight-list/flight-dashboard");
    }
    else{
        res.redirect("/staff/tabular-view");
    }
});

app.get("/admin/flight-list", async (req, res) => {
    if(staff["Id"] == -1){
        return res.redirect("/login");
    }

    if(staff.staffInfo["role"]=="Admin"){
        staff.staffAssignedFlights = await getAllFlights();
        return res.render("flight_list", {staff :staff.staffInfo, flights: staff.staffAssignedFlights, logIn: loggedIn})
    }
    else{
        res.redirect("/login"); 
    }
});

app.get("/admin/flight-list/flight-dashboard", async (req, res) => {
    if(staff["Id"] == -1){
        return res.redirect("/login");
    }
    if(!globalFlightData || !globalFlightData.flightInfo){
        return res.status(404).render("404");
    }
    if(staff.staffInfo["role"]=="Admin"){
        return res.render("flight_dashboard", {flightInfo: globalFlightData.flightInfo, aircraft: globalFlightData.aircraftInfo, staffInfo: globalFlightData.staff, passengers: globalFlightData.passengers, logIn: loggedIn, staff: staff.staffInfo});
    }
    else{
        res.redirect("/login"); 
    }
});
//WORK IN PROGRESS
app.post("/admin/assign-staff", async (req, res) => {
   res.send("Work in Progress!!!!");
});
//WORK IN PROGRESS
app.post("/admin/delete-staff", async (req, res) => {
    const deleteStaffId = req.body.deleteStaffId;
    const flightNumber = req.body.flightNumber;
    res.send(`Delete Staff Id ${deleteStaffId} From Flight ${flightNumber}`);
});
//WORK IN PROGRESS
app.post("/admin/update-passenger-seat", async (req, res) => {
    const ticketId = req.body.ticketId;
    const flightNumber = req.body.flightNumber;
    const newSeat = req.body.newSeat;
    res.send(`Update Seat to: ${newSeat} of ticket ${ticketId} on Flight ${flightNumber}`);
});


app.get("/staff/extended-view", async (req,res) => {
    if(staff["Id"] == -1){
        return res.redirect("/login");
    }
    if(!globalFlightData || !globalFlightData.flightInfo){
        return res.status(404).render("404");
    }
    else{
        res.render("extended_view",{flightInfo: globalFlightData.flightInfo, staffInfo: globalFlightData.staff, passengers: globalFlightData.passengers, aircraft: globalFlightData.aircraftInfo, logIn: loggedIn, downloadJSON: true, staff: staff.staffInfo});
    }
})

app.get("/staff/tabular-view", async (req,res) => {
    if(staff["Id"] == -1){
        return res.redirect("/login");
    }
    if(!globalFlightData || !globalFlightData.flightInfo){
       return res.status(404).render("404");
    }
    else{
        res.render("tabular_view",{flightInfo: globalFlightData.flightInfo, staffInfo: globalFlightData.staff, passengers: globalFlightData.passengers, logIn: loggedIn, downloadJSON: true, staff: staff.staffInfo});
    }
})

app.get("/staff/flight-view", async (req,res) => {
    if(staff["Id"] == -1){
        return res.redirect("/login");
    }
    if(!globalFlightData || !globalFlightData.flightInfo){
        return res.status(404).render("404");
    }
    else{
        res.render("flight_view",{flightInfo: globalFlightData.flightInfo, aircraft: globalFlightData.aircraftInfo, staffInfo: globalFlightData.staff, passengers: globalFlightData.passengers, logIn: loggedIn, downloadJSON: true, staff: staff.staffInfo});
    }
})

app.get("/staff/flightJSON", (req, res)=>{
    res.setHeader('Content-disposition', 'attachment; filename=flight_data.json');
    res.setHeader('Content-type', 'application/json');
    res.send(globalFlightData);
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

    res.render("flight_tracker", {guestError, logIn: loggedIn, staff : staff.staffInfo});
    guestError = false;
})

//after the passenger inputs one of the two inputs the guest-view page will be presented
app.post("/guest", async (req, res)=>{
    const guestInput = req.body.flightInput.trim();
    globalFlightData = await fetchFlightData(guestInput);

    if(!globalFlightData || !globalFlightData.flightInfo){
        guestError=true;
        return res.redirect("/guest");
    }
    else if(staff["Id"] == -1){
        return res.redirect("/guest/guest-view");
    }
    else{
        res.redirect("/staff/tabular-view");
    }
});

app.get("/guest/guest-view",(req, res)=>{
    if(!globalFlightData || !globalFlightData.flightInfo){
        return res.redirect("/guest");
    }
    else{
        res.render("guest_view", {flightInfo: globalFlightData.flightInfo, aircraft: globalFlightData.aircraftInfo, passengers: globalFlightData.passengers, staff : staff.staffInfo});
    }   
})

// global user requests (staff and passengers can use)
app.get("/",(req, res)=>{
    if(loggedIn){
        //wipes out every saved data if user logs out
        loggedIn = false;
        staff = {
        "Id":-1,
        staffInfo: [],
        staffAssignedFlights: []
        };
        flight = {
            flightNumber: "none",
        };
        globalFlightData = {
        flightInfo: null,
        aircraftInfo: null,
        passengers: [],
        staff: {
            chef: [],
            cabinCrew: [],
            pilot: [] 
        }
};
    }
    res.render("home");
})

//about us pages
app.get("/about-us", (req, res)=>{
    res.render("about_us", {logIn: loggedIn, staff : staff.staffInfo});
});

app.get("/about-us/airplanes", (req, res)=>{
    res.render("airplanes", {logIn: loggedIn, staff : staff.staffInfo});
})

app.get("/about-us/destinations", (req, res)=>{
    res.render("destinations", {logIn: loggedIn, staff : staff.staffInfo});
})

app.get("/about-us/founders", (req, res)=>{
    res.render("founders", {logIn: loggedIn, staff : staff.staffInfo});
})

app.get("/about-us/crew", (req, res)=>{
    res.render("crew", {logIn: loggedIn, staff : staff.staffInfo});
})

app.get("/test", (req, res)=>{
    res.render("404", {logIn: loggedIn, staff : staff.staffInfo});
    //simple test URL will be removed later change file name to check certain pages too
});

//404 page
app.use((req, res) => {
  res.status(404).render("404", {logIn: loggedIn, staff : staff.staffInfo});
});

//server listener
app.listen(3000, async ()=>{
    console.log("server started at port:"+ port);
})