import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// ------------------------- Module import -------------------------

import connectDB from "./Lib/database";
import { dateLog } from "./Lib/logging";
import auth from "./Middleware/FrontEnd_Auth";
import RequestLogger from "./Middleware/RequestLogger";
import URLNormalize from "./Middleware/URLNormalize";

// ------------------------- Route import -------------------------

import public_route from "./Routes/public";

import sensor_route from "./Routes/sensors";
import data_route from "./Routes/data";
import analytics_route from "./Routes/analytics";
import profile_route from "./Routes/profile";

import api_route from "./Routes/api";

// ------------------------- App setup -------------------------

dotenv.config({quiet: true});

let app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("Public"));

app.set('view engine', 'ejs');
app.set('views', './Views');

// ------------------------- App middleware -------------------------

app.use(URLNormalize);
app.use(RequestLogger);

// ------------------------- App Routes-------------------------
// Other deeper ones are located (such as /api/auth) in their respective files (i.e /api/index.ts) ????????? ok whatever ghoost 
// https://imgur.com/a/L5rytts
// WTF is this ^^^^ ???? What? -Ghoost

app.use('/', public_route);

app.get('/', auth, (req, res) => {
    res.render('index', {
        styles: ["home_page.css"]
    });
});

app.use("/sensors", auth, sensor_route );
app.use("/data", auth, data_route );
app.use("/analytics", auth, analytics_route );
app.use("/profile", auth, profile_route );

app.use('/api', auth, api_route);

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

        // Start the server
        app.listen(PORT, () => {
            console.log(`\x1b[32m█ \x1b[37m[ ${dateLog()} ]\x1b[38;5;27m App starting in \x1b[38;5;99m${NODE_ENV}\x1b[38;5;27m mode on port \x1b[38;5;99m${PORT}\x1b[0m`);
        });

    } catch (err) {
        console.error(`\x1b[31m█ \x1b[37m[ ${dateLog()} ]\x1b[31m Startup failed: \x1b[0m${err}`);
        process.exit(1);
    }
}; serverStart();
