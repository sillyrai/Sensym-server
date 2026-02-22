import { Router } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

import UserSchema from '../../Lib/mongoDB_models/User_Schema';

const router = Router();

// ------------------------- Login -------------------------

// Login page
router.get('/', (req, res)=>{
    const auth_token = req.cookies.auth_token;

    if (auth_token) { return res.redirect('/profile'); }

    res.render('_auth/login', {
        styles: ["auth_pages.css"]
    })
});

// Login POST endpoint
router.post('/', async (req, res) => {
    let body = req.body || {};

    // Parse 'user' and 'pass' and check if defined
    let username = body.user
    let password = body.pass

    if(!username || !password) {
        return res.status(400).render("_auth/login", {
            styles: ["auth_pages.css"],
            message: { 
                text: "Username and/or password are required",
                type: "info" 
            }
        });
    }

    // Get user data
    let user = await UserSchema.findOne({ username: username });
    
    // Validate Username
    if(!user || !bcrypt.compare(password, user.password)) {
        return res.status(401).render("_auth/login", {
            styles: ["auth_pages.css"],
            message: { 
                text: "Invalid username and/or password",
                type: "info" 
            }
        });
    }

    // Sign an JWT authentication token
    if (!process.env.JWT_SECRET) {
        return res.status(401).render("_auth/login", {
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
