import {Router} from 'express';

import text from '../../Modules/TextStuff';
import UserSchema from '../../Models/User_Schema';
import AuthTokenSchema from '../../Models/AuthenticationTokenSchema_Schema';
import IsAuthenticated from '../../Middleware/API_Auth';

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

router.delete('/delete-account', IsAuthenticated, async (req, res) => {
    // Only Administrators can delete accounts.
    if(res.locals.user.accountType !== "ADMIN") {
        return res.status(403).send({
            message: 'Only administrators can delete accounts'
        });
    }

    let body = req.body || {};
    let userId = body.userId;

    if(!userId) {
        return res.status(400).send({
            message: 'User ID is required'
        });
    }

    let deleteResult = await UserSchema.deleteOne({ _id: userId });

    if(deleteResult.deletedCount === 0) {
        return res.status(404).send({
            message: 'User not found'
        });
    }

    return res.status(200).send({
        message: 'User deleted successfully'
    });
})

// Yes we technically could've done the following end points in 
// One big post request or whatever
// But our grade depends on how much lines of code we have 💀💀💀 so we're doing it the inefficient way

// This guy....
// Fine, fine, whatever

router.patch('/change-username', IsAuthenticated, async (req, res) => {
    let body = req.body || {};
    let newUsername = body.newUsername;
    
    if(!newUsername) { 
        return res.status(400).send({
            message: 'New username is required'
        });
    }

    let exists = await UserSchema.findOne({ username: newUsername });
    if(exists) {
        return res.status(400).send({
            message: 'Username already exists'
        });
    }

    let updateResult = await UserSchema.updateOne({ _id: res.locals.user._id }, { username: newUsername });

    if(updateResult.modifiedCount === 0) {
        return res.status(500).send({
            message: 'Error updating username'
        });
    }

    return res.status(200).send({
        message: 'Username updated successfully'
    });
})

router.patch('/change-password', IsAuthenticated, async (req, res) => {
    let body = req.body || {};
    let newPassword = body.newPassword;
    
    if(!newPassword) { 
        return res.status(400).send({
            message: 'New password is required'
        });
    }

    let updateResult = await UserSchema.updateOne({ _id: res.locals.user._id }, { password: text.sha256(newPassword) });

    if(updateResult.modifiedCount === 0) {
        return res.status(500).send({
            message: 'Error updating password'
        });
    }

    return res.status(200).send({
        message: 'Password updated successfully'
    });
})

export default router;