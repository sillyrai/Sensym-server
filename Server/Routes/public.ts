import { Router } from "express";
import jwt from 'jsonwebtoken';

import text from '../Lib/TextStuff';
import UserSchema from '../MongoDB models/User_Schema';
import AuthTokenSchema from '../MongoDB models/AuthenticationTokenSchema_Schema';

const router = Router();

// ------------------------- Error -------------------------

router.get("/error", (req, res) => { 
    res.render("error", { 
        styles:["error.css"],
        type: 101,
        message: "Alan, we are SO FUCKED"
    }); 
});

// ------------------------- Register -------------------------

router.get('/register', (req, res)=>{

    res.render('register', {
        styles: ["auth_pages.css"],
        url_registration_code: ""
    })
});

router.get('/register/:registration_code', (req, res) => {
    const reg_code = req.params.registration_code;

    res.render('register', {
        styles: ["auth_pages.css"],
        url_registration_code: reg_code
    })
});

router.post('/register', async (req, res) => {
    let body = req.body || {};

    let username = body.user
    let password = body.pass

    if(!username || !password) {
        return res.status(400).send({
            message: 'Username and/or password are required'
        });
    }

    let exists = await UserSchema.findOne({ username: username });
    if(exists) {
        return res.status(400).send({
            message: 'Username already exists'
        });
    }

    let saveResult = await UserSchema.insertOne({
        username: username,
        password: text.sha256(password)
    })

    if(!saveResult) {
        return res.status(500).send({
            message: 'Error saving user'
        });
    }

    return res.status(201).send({
        message: 'User registered successfully'
    });
});

// ------------------------- Login -------------------------

router.get('/login', (req, res)=>{
    // const { messageCode } = req.params;

    res.render('login', {
        styles: ["auth_pages.css"]
    })
});

router.post('/login', async (req, res) => {
    let body = req.body || {};

    // Parse 'user' and 'pass' and check if defined
    let username = body.user
    let password = body.pass

    if(!username || !password) {
        return res.status(400).render("login", {
            styles: ["auth_pages.css"],
            message: { 
                text: "Username and/or password are required",
                type: "info" 
            }
        });
    }

    // Validate credentials
    let user = await UserSchema.findOne({ username: username, password: text.sha256(password) });
    if(!user) {
        return res.status(401).render("login", {
            styles: ["auth_pages.css"],
            message: { 
                text: "Invalid username and/or password",
                type: "info" 
            }
        });
    }

    // Sign an JWT authentication token
    if (!process.env.JWT_SECRET) {
        // parseInt("123")
        return res.status(401).render("login", {
            styles: ["auth_pages.css"],
            message: { 
                text: "Server error",
                type: "error" 
            } 
        });
    }
    const token = jwt.sign(
        { 
            id: user._id,
            userType: user.userType,
            iat: Date.now()
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Put token with responses cookies
    res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000 // 1 hour
    });

    return res.redirect('/');
});

export default router;
