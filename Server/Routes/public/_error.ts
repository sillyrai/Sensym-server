import { Router } from "express";

const router = Router();

// ------------------------- Error -------------------------

router.get("/", (req, res) => { 
    res.render("error", { 
        styles:["error.css"],
        type: 101,
        message: "Alan, we are SO FUCKED"
    }); 
});

export default router;
