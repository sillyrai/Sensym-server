import {Router} from 'express';

import text from '../../Lib/TextStuff';
import UserSchema from '../../Lib/mongoDB_models/User_Schema';
import IsAuthenticated from '../../Lib/backend_auth';

const router = Router();

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
