import mongoose from "mongoose";
import { dateLog } from "./Logging";

const { DB_USER, DB_PASS, DB_LINK, DB_NAME} = process.env;

export default async function connectDB() {
	try {
		//if (!DB_USER || !DB_PASS || !DB_LINK || !DB_NAME) {
		//	throw new Error('Missing required environment variables');
		//}

		//const user = encodeURIComponent(DB_USER);
		//const pass = encodeURIComponent(DB_PASS);
		//const url = `mongodb://${user}:${pass}@${DB_LINK}/${DB_NAME}?authSource=${DB_NAME}`;
		const url = "mongodb://127.0.0.1:27017/sensym?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.6.0";
		
		await mongoose.connect(url);
		console.log(`\x1b[32m█ \x1b[37m[ ${dateLog()} ]\x1b[38;5;48m MongoDB connected successfully\x1b[0m`);
        
	} catch (error) {
		console.log(`\x1b[34m█ \x1b[37m[ ${dateLog()} ]\x1b[38;5;48m MongoDB connection error:\x1b[0m`, error);
		process.exit(1);
	}
};