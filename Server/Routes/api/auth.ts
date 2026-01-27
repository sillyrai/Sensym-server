import {Router} from 'express';
import text from '../../Modules/TextStuff';
import UserSchema from '../../Models/UserSchema';
import AuthTokenSchema from '../../Models/AuthenticationTokenSchema';
import IsAuthenticated from '../../Middleware/IsAuthenticated';
const router = Router();

router.post('/register', async (req, res) => {
    let body = req.body || {};

    let username = body.username
    let password = body.password

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
})

router.post('/login', async (req, res) => {
    let body = req.body || {};

    let username = body.username
    let password = body.password

    if(!username || !password) {
        return res.status(400).send({
            message: 'Username and/or password are required'
        });
    }

    // Check if correct credentials
    let user = await UserSchema.findOne({ username: username, password: text.sha256(password) });
    if(!user) {
        return res.status(401).send({
            message: 'Invalid username and/or password'
        });
    }

    // User is valid, we give them an authentication token
    let token = text.rndStr(64);
    res.header("Authorization", `${token}`);

    await AuthTokenSchema.insertOne({
        token: token,
        userId: user._id,
    });

    return res.status(200).send({
        message: 'Login successful',
        token: token
    });
});

router.get('/', IsAuthenticated ,async (req, res) => {
    return res.status(200).send({
        message: 'User retrieved successfully',
        user: res.locals.user
    });
})

export default router;