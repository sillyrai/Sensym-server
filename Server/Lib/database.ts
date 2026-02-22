import mongoose from "mongoose";
import { dateLog } from "./logging_utils";

import dotenv from "dotenv";

dotenv.config({quiet: true});

const DB_URL = process.env.DB_URL;

export default async function connectDB() {
	try {
		if (!DB_URL) {
			throw new Error('Missing required environment variables');
		}
		
		await mongoose.connect(DB_URL);
		console.log(`\x1b[32m█ \x1b[37m[ ${dateLog()} ]\x1b[38;5;48m MongoDB connected successfully\x1b[0m`);
        
	} catch (error) {
		console.log(`\x1b[34m█ \x1b[37m[ ${dateLog()} ]\x1b[38;5;48m MongoDB connection error:\x1b[0m`, error);
		process.exit(1);
	}
};
