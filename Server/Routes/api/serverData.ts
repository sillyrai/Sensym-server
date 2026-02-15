import { Router } from "express";

import serverIP from "../../Modules/serverIP";

const router = Router();

router.get("/", (req, res) => {
    const ip = serverIP();

    res.json({
        ip
    });
});

export default router;