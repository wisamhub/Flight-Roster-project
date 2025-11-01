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
    res.send("<h1>poop</h1>");
})


//server listener
app.listen(3000, ()=>{
    console.log("server started at port:"+ port);
})