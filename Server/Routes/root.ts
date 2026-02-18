import { Router } from "express";
const router = Router();

router.get('/login', (req, res)=>{
    res.render('login', {
        styles: ["login_page.css"]
    })
})

router.get('/register', (req, res)=>{
    res.render('register', {
        styles: ["registration_page.css"]
    })
})

export default router;
