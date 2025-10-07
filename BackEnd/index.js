import express from "express";
import bodyParser from "body-parser";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { join } from "path";

//variables and constants
const app = express();
const port = 3000
const __dirname = dirname(fileURLToPath(import.meta.url));

//Middlewares
app.use("/", express.static(join(__dirname, "..", "FrontEnd", "public")));
app.use(bodyParser.urlencoded({ extended: true }));

//server requests and responds
app.get("/",(req, res)=>{
    res.sendFile(join(__dirname,"..","FrontEnd","home.html"));
})

//server listener
app.listen(3000, ()=>{
    console.log("server started at port:"+ port);
})