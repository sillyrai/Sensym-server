import { Router } from "express";
const router = Router();

router.get('/login', (req, res)=>{
    res.render('login', {
        styles: ["auth_pages.css"]
    })
})

router.get('/register', (req, res)=>{


    res.render('register', {
        styles: ["auth_pages.css"],
        url_registration_code: ""
    })
})

router.get('/register/:registration_code', (req, res)=>{
    const reg_code = req.params.registration_code;

    res.render('register', {
        styles: ["auth_pages.css"],
        url_registration_code: reg_code
    })
})

export default router;
