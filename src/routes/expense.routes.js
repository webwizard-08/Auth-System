import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import * as expenseControllers from "../controllers/expense.controllers.js";

const expenseRouter = Router();

expenseRouter.use(requireAuth);

expenseRouter.post("/", expenseControllers.createExpense);
expenseRouter.get("/", expenseControllers.getExpenses);
expenseRouter.get("/summary", expenseControllers.getSummary);
expenseRouter.patch("/:id", expenseControllers.updateExpense);
expenseRouter.delete("/:id", expenseControllers.deleteExpense);

export default expenseRouter;
