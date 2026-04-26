import { Router } from "express";
import * as authControllers from "../controllers/auth.controllers.js"
import { requireAuth } from "../middleware/auth.middleware.js";
const authRouter = Router();


authRouter.post("/register" , authControllers.register);

authRouter.post("/login" , authControllers.login);
// GET /api/auth/me
authRouter.get("/me" , requireAuth, authControllers.getMe);
export default authRouter;