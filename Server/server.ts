import express from "express";
import dotenv from "dotenv";

// ------------------------- Module import -------------------------

import connectDB from "./Modules/database";
import { dateLog } from "./Modules/logging";
import RequestLogger from "./Middleware/RequestLogger";
import URLNormalize from "./Middleware/URLNormalize";

// ------------------------- Route import -------------------------

import sensor_route from "./Routes/sensors";
import data_route from "./Routes/data";
import analytics_route from "./Routes/analytics";
import api_route from "./Routes/api";
import root_route from "./Routes/root";

// ------------------------- App setup -------------------------

dotenv.config({quiet: true});

let app = express();
app.use(express.json())
app.use(express.static("Public"))
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'Views'));
app.set('views', './Views')

// ------------------------- App middleware -------------------------

app.use(URLNormalize);
app.use(RequestLogger);

// ------------------------- App Routes-------------------------
// Other deeper ones are located (such as /api/auth) in their respective files (i.e /api/index.ts) ????????? ok whatever ghoost 
// https://imgur.com/a/L5rytts

app.get('/', (req, res) => {
    res.render('index', {
        styles: ["home.css"]
    });
})

app.use('/', root_route);
app.use("/sensors", sensor_route );
app.use("/data", data_route );
app.use("/analytics", analytics_route );
app.use('/api', api_route);

// ------------------------- App start -------------------------

const serverStart = async () => {
    try {
        const { NODE_ENV, PORT } = process.env;
        if (!NODE_ENV || !PORT) { throw new Error('Missing required environment variables'); }

        // Cleans terminal if not in development
        console.log('\x1Bc'); console.clear()

        // Connect to database
        await connectDB();

        app.listen(PORT, () => {
            console.log(`\x1b[32m█ \x1b[37m[ ${dateLog()} ]\x1b[38;5;27m App starting in \x1b[38;5;99m${NODE_ENV}\x1b[38;5;27m mode on port \x1b[38;5;99m${PORT}\x1b[0m`);
        });

    } catch (err) {
        console.error(`\x1b[31m█ \x1b[37m[ ${dateLog()} ]\x1b[31m Startup failed: \x1b[0m${err}`);
        process.exit(1);
    }
}; serverStart();
