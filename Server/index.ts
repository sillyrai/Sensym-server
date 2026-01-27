import express from "express";
import dotenv from "dotenv";
import path from "path";

// ------------------------- Module import -------------------------

import connectDB from "./Modules/database";
import { dateLog, requestLog } from "./Modules/logging";

// ------------------------- Route import -------------------------

import sensor_route from "./Routes/sensor";

// ------------------------- App setup -------------------------

dotenv.config({path: ".env", quiet: true});

let app = express();

app.use(express.static("Public"))
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'Views'));
app.set('views', './Views')

// ------------------------- App middleware -------------------------

app.use((req, res, next) => { req.url = req.url.replace(/\/{2,}/g, '/'); next(); });

app.use((req, res, next) => { res.on('finish', () => requestLog(req, res)); next(); });

// ------------------------- App Routes -------------------------

app.get('/', (req, res) => {
    res.render('index', {});
})

app.use("/sensors", sensor_route );

// ------------------------- App start -------------------------

/*
app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
})
*/

const serverStart = async () => {
    try {
        const { NODE_ENV, PORT } = process.env;
        if (!NODE_ENV || !PORT) { throw new Error('Missing required environment variables'); }
        // if (NODE_ENV != "development") { console.log('\x1Bc'); } // Cleans terminal if not in development

        // await connectDB(); // Connect to database

        app.listen(PORT, () => {
            console.log(`\x1b[32m█ \x1b[37m[ ${dateLog()} ]\x1b[38;5;27m App starting in \x1b[38;5;99m${NODE_ENV}\x1b[38;5;27m mode on port \x1b[38;5;99m${PORT}\x1b[0m`);
        });

    } catch (err) {
        console.error(`\x1b[31m█ \x1b[37m[ ${dateLog()} ]\x1b[31m Startup failed: \x1b[0m${err}`);
        process.exit(1);
    }
}; serverStart();
