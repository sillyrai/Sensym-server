import { Router } from "express";

// ------------------------- Routes -------------------------

import login_router from "./_login";
import register_router from "./_register";
import error_router from "./_error";

const router = Router();

router.use("/login", login_router);
router.use("/register", register_router);
router.use("/error", error_router);

export default router;
