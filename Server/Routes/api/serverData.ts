import { Router } from "express";

import serverIP from "../../Lib/serverIP";

const router = Router();

router.get("/", (req, res) => {
    const ip = serverIP();

    res.json({
        ip
    });
});

export default router;