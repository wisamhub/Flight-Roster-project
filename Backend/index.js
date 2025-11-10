import express from "express";
import bodyParser from "body-parser";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { join } from "path";
import flight_roster_db from "./Database/connection.js";

//variables and constants
const app = express();
const port = 3000
const __dirname = dirname(fileURLToPath(import.meta.url));

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

app.get("/guest", (req, res)=>{
    res.render("flight_tracker");
})


app.post("/guest/view", (req, res)=>{
    const guestInput = req.body.flightInput.trim();
    const ticketPattern = /^\d{9}$/;        // 9 digits only
    const flightPattern = /^AN\d{3}$/i;     // starts with AN, then 3 digits
    if(ticketPattern.test(guestInput)){
        //DB queries will be done here
        res.render("tabular_view");
    } else if(flightPattern.test(guestInput)){
        //also here
        res.render("tabular_view");
    } else{
        res.render("flight_tracker", {error:true});
    }
})

app.get("/test", (req, res)=>{
    res.render("flight_view");
    //simple test URL will be removed later change file name to check certain pages too
}) 
app.get("/test2", (req, res)=>{
    res.render("tabular_view");
    //simple test URL will be removed later change file name to check certain pages too
})
app.get("/test3", (req, res)=>{
    res.render("extended_view");
    //simple test URL will be removed later change file name to check certain pages too
})



//404 pages
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

//server listener
app.listen(3000, ()=>{
    console.log("server started at port:"+ port);
})