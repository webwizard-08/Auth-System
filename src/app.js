import express from 'express';
import morgan from 'morgan';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth" , authRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, "..", "client", "dist");

if (fs.existsSync(clientDistPath)) {
	app.use(express.static(clientDistPath));

	app.get("*", (req, res, next) => {
		if (req.path.startsWith("/api/")) {
			return next();
		}
		res.sendFile(path.join(clientDistPath, "index.html"));
	});
} else {
	app.get("/", (req, res) => {
		res.status(200).json({
			message: "Auth API is running"
		});
	});
}


export default app;