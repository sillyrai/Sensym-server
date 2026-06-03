import { Router } from "express";
import bcrypt from "bcrypt";

import UserSchema from '../../Lib/mongoDB_models/User_Schema';
import AuthTokenSchema from '../../Lib/mongoDB_models/OneTimeRegistration_Schema';
import { validateShortText, validateStrongPassword } from '../../Lib/validation';

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
        title: "Sensym | Register",

        url_registration_code: reg_code
    })
});

// Register POST endpoint
router.post('/', async (req, res) => {
    try {
        let body = req.body || {};

        const authTokenCheck = await AuthTokenSchema
            .findOne({token: body.registration_code})
            .lean()

        if (!authTokenCheck) {
            return res.status(400).send({
                message: 'Invalid auth token'
            });
        }

        let username = body.user
        let password = body.pass

        if(!username || !password) {
            return res.status(400).send({
                message: 'Username and/or password are required'
            });
        }

        if (validateShortText(username)) {
            return res.status(400).send({
                message: 'Username must be 20 characters or less and can only contain letters, numbers, and underscores'
            });
        }

        if (validateShortText(body.registration_code)) {
            return res.status(400).send({
                message: 'Registration code must be 20 characters or less and can only contain letters, numbers, and underscores'
            });
        }

        if (validateStrongPassword(password)) {
            return res.status(400).send({
                message: 'Password must be at least 8 characters long, with at least 1 symbol, 1 uppercase character, 2 numbers, and 1 lowercase character'
            });
        }

        const exists = await UserSchema.findOne({ username: username });
        if(exists) {
            return res.status(400).send({
                message: 'Username already exists'
            });
        }

        const password_salt = await bcrypt.genSalt(10);
        const hashed_password = await bcrypt.hash(password, password_salt);

        const saveResult = await UserSchema.insertOne({
            username: username,
            password: hashed_password
        });

        if(!saveResult) {
            return res.status(500).send({
                message: 'Error saving user'
            });
        }

        await AuthTokenSchema.findOneAndDelete({token: body.registration_code});

        return res.redirect('/login');
    } catch (err) {
        console.error('Registration request failed:', err);
        return res.status(500).send({
            message: 'An unexpected error occurred while registering user'
        });
    }
});

export default router;
