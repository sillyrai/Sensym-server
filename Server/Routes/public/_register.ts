import { Router } from "express";
import bcrypt from "bcrypt";

import UserSchema from '../../Lib/mongoDB_models/User_Schema';

const router = Router();

// ------------------------- Register -------------------------

// Register page
router.get('/', (req, res) => {
    const auth_token = req.cookies.auth_token;

    if (auth_token) { return res.redirect('/profile'); }

    res.render('_auth/register', {
        styles: ["auth_pages.css"],
        url_registration_code: ""
    })
});

// Register page + code
router.get('/:registration_code', (req, res) => {
    const reg_code = req.params.registration_code;
    const auth_token = req.cookies.auth_token;

    if (auth_token) { return res.redirect('/profile'); }

    res.render('_auth/register', {
        styles: ["auth_pages.css"],
        url_registration_code: reg_code
    })
});

// Register POST endpoint
router.post('/', async (req, res) => {
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

    const password_salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(password, password_salt);

    let saveResult = await UserSchema.insertOne({
        username: username,
        password: hashed_password
    });

    if(!saveResult) {
        return res.status(500).send({
            message: 'Error saving user'
        });
    }

    return res.status(201).send({
        message: 'User registered successfully'
    });
});

export default router;
