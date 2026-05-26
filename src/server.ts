import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { createServer } from 'http';
import { Server } from 'socket.io';

// ------------------------- Module import -------------------------

import connectDB from "./Lib/database";
import { dateLog } from "./Lib/logging_utils";
import auth from "./Lib/frontend_auth";
import RequestLogger from "./Lib/request_logging";
import URLNormalize from "./Lib/URLNormalize";

// ------------------------- Route import -------------------------

import public_route from "./Routes/public";

import sensor_route from "./Routes/sensors";
import analytics_route from "./Routes/analytics";
import users_route from "./Routes/users";
import profile_route from "./Routes/profile";

import admin_route from "./Routes/admin";

import api_route from "./Routes/api";

// ------------------------- App setup -------------------------

dotenv.config({quiet: true});

let app = express();
const httpServer = createServer(app); // Create native HTTP server
const io = new Server(httpServer);    // Tie Socket.IO to the HTTP server

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("src/Public"));

app.set('view engine', 'ejs');
app.set('views', 'src/Views'); // pls pls just do it
app.set('socketio', io); // holy moly

// ------------------------- App middleware -------------------------

app.use(URLNormalize);
app.use(RequestLogger);

// ------------------------- WebSockets -------------------------

io.on('connection', (socket) => {
    // Client sends the unique sensor token to join a room
    socket.on('live_sensor_data_flow', (sensorToken: string) => {
        socket.join(sensorToken);
        // console.log(`User ${socket.id} joined room for sensor: ${sensorToken}`);
    });

    socket.on('disconnect', () => {
        // console.log(`User ${socket.id} disconnected`);
    });
});

// ------------------------- App Routes-------------------------

// Other deeper ones are located (such as /api/auth) in their respective files (i.e /api/index.ts) ????????? ok whatever ghoost 
// https://imgur.com/a/L5rytts
//
// WTF is this ^^^^ ???? What?
// - Ghoost

app.use('/', public_route);

app.get('/', auth, (req, res) => {
    res.render('index', {
        styles: ["home_page.css"]
    });
});

app.use("/sensors", auth, sensor_route );
app.use("/analytics", auth, analytics_route );
app.use("/users", auth, users_route );
app.use("/profile", auth, profile_route );

app.use('/api', api_route);

import User_Schema from "./Lib/mongoDB_models/User_Schema";
import OneTimeRegistration_Schema from "./Lib/mongoDB_models/OneTimeRegistration_Schema";

async function handleNoAccounts() { // Handle when there are no accounts in the database (first time running)
    // Check if there are any accounts in the database
    const userCount = await User_Schema.countDocuments();
    if(userCount>0) return;

    // Create a preset registration token for the first account (expires in 7 days)
    OneTimeRegistration_Schema.insertOne({
        token: "ADMIN_TOKEN",
        expiresAt: new Date(Date.now() + 7*24*60*60*1000), // 7 days from now
        accountType: "ADMIN"
    })
    console.log(`\x1b[33m█ \x1b[37m[ ${dateLog()} ]\x1b[33m No accounts found. Created one-time registration token: \x1b[38;5;99mADMIN_TOKEN\x1b[0m`);
}

// ------------------------- App start -------------------------
const serverStart = async () => {
    try {
        const { NODE_ENV, PORT, JWT_SECRET } = process.env;
        if (!NODE_ENV || !PORT) { throw new Error('Missing required environment variables'); }
        if (!JWT_SECRET) { throw new Error('Missing JWT_SECRET variable'); }

        // Cleans terminal
        console.log('\x1Bc'); console.clear();

        // Connect to database
        await connectDB();

        await handleNoAccounts();
        // Start the server
        httpServer.listen(PORT, () => {
            console.log(`\x1b[32m█ \x1b[37m[ ${dateLog()} ]\x1b[38;5;27m App starting in \x1b[38;5;99m${NODE_ENV}\x1b[38;5;27m mode on port \x1b[38;5;99m${PORT}\x1b[0m`);
        });

    } catch (err) {
        console.error(`\x1b[31m█ \x1b[37m[ ${dateLog()} ]\x1b[31m Startup failed: \x1b[0m${err}`);
        process.exit(1);
    }
}; serverStart();
