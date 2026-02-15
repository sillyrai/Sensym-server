import { Router } from "express";
import os from "os";

import SensorSchema from "../Models/SensorSchema";

function getLocalIP() {
    const interfaces = os.networkInterfaces();

    for (const name of Object.keys(interfaces)) {
        const ifaces = interfaces[name];
        if (!ifaces) continue;
        for (const iface of ifaces) {
            // Skip internal (127.0.0.1) and non-IPv4
            if (iface.family === "IPv4" && !iface.internal) {
                return iface.address;
            }
        }
    }
    return "Unable to determine IP";
}

const router = Router();

router.get("/", (req, res) => {
    const ip = getLocalIP();
    res.send(`
        <h1>Server Local IP</h1>
        <p>${ip}</p>
    `);
});

export default router;
