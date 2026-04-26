import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";
import * as adminControllers from "../controllers/admin.controllers.js";

const adminRouter = Router();

adminRouter.use(requireAuth, requireAdmin);

adminRouter.get("/users", adminControllers.getUsers);
adminRouter.patch("/users/:id/block", adminControllers.setUserBlocked);
adminRouter.delete("/users/:id", adminControllers.deleteUser);

adminRouter.get("/expenses", adminControllers.getAllExpenses);
adminRouter.get("/analytics", adminControllers.getAnalytics);

export default adminRouter;
