import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from "cors";
import authRouter from './routes/auth.routes.js';
import expenseRouter from "./routes/expense.routes.js";
import adminRouter from "./routes/admin.routes.js";
import { notFoundHandler, errorHandler } from "./middleware/error.middleware.js";
const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
	cors({
		origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
		credentials: true
	})
);

app.use(express.static("public"));

app.use("/api/auth" , authRouter);
app.use("/api/expenses", expenseRouter);
app.use("/api/admin", adminRouter);

app.get("/", (req, res) => {
	res.sendFile("index.html", { root: "public" });
});

app.use(notFoundHandler);
app.use(errorHandler);


export default app;