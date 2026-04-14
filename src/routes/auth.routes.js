import { Router } from "express";
import * as authControllers from "../controllers/auth.controllers.js"
const authRouter = Router();


authRouter.post("/register" , authControllers.register);

//login ka route bhi bana do
authRouter.post("/login" , authControllers.login);
// POST /api/auth/get-me
authRouter.get("/get-me" , authControllers.getMe);

//get / /api/auth/refresh-token
authRouter.get("/refresh-token" , authControllers.refreshToken);

 //get logout ka route bhi bana do
authRouter.post("/logout" , authControllers.logout);

//get api/auth/logout-all
authRouter.post("/logout-all" , authControllers.logoutAll);
export default authRouter;