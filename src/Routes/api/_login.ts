import { Router } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

import UserSchema from '../../Lib/mongoDB_models/User_Schema';

const router = Router();

// ------------------------- Login -------------------------

// API Login POST endpoint
router.post('/', async (req, res) => {
    let body = req.body || {};

    // Parse 'user' and 'pass' and check if defined
    let username = body.username
    let password = body.password

    if(!username || !password) {
        return res.status(400).json({
            error: "credentials not provided"
        });
    }

    // Get user data
    let user = await UserSchema.findOne({ username: username });

    // Validate Username
    if (!user) {
        return res.status(401).json({
            error: "invalid credentials"
        });
    }

    // Compare password (bcrypt.compare returns a Promise)
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(401).json({
            error: "invalid credentials"
        });
    }

    // Sign an JWT authentication token
    if (!process.env.JWT_SECRET) {
        return res.status(401).json({
            error: "server error"
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
    return res.json({
        auth_token: token 
    });
});

export default router;
