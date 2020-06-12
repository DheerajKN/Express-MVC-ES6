const {createFileWithContent} = require('../../helperFunctions/createFileAndAddContent')
const shell = require('shelljs')
const {appendFileSync} = require('fs');
const getFileAndUpdateContent = require('./resourceFlag/getFileAndUpdateContent')

module.exports.addAuthComponent = (conditionalValue, folderDirectory) => {
    shell.exec('npm i jsonwebtoken bcryptjs', () => {

        const fileContent = `import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import User from './models/User'

exports.authenticate = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            //Match Password
            const user = await User.findOne({ ${conditionalValue} });
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    resolve({ email, password });
                } else {
                    reject('Authentication Failed!!')
                }
            })
        } catch (error) {
            //Email not found
            reject('Authentication Failed');
        }
    })
}

//Get Details of the one whose jwt is it
exports.verifyToken = (req, res, next) => {
    // Get auth header value
    const jwtHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof jwtHeader !== 'undefined') {
        // Split at the space
        const jwtValue = jwtHeader.split(' ');
        // Get token from array
        const jwtToken = jwtValue[1];
        //Verify the token and extract info
        jwt.verify(jwtToken, process.env.JWT_PVTKEY, (err, { user }) => {
            // Set the values
            res.locals.token = {err, user};
        });
        // Next middleware
        next();
    } else {
        // Forbidden
        return res.sendStatus(403);
    }
}`

        createFileWithContent(`${folderDirectory}/src/auth.js`, fileContent)

        const authFileContent = `import bcrypt from 'bcryptjs';
import { Router } from 'express';
import {check, validationResult} from "express-validator";

import { authenticate, verifyToken } from '../auth.js';
import User from '../models/User';

const authProvider = Router();
authProvider.post('/register', [
        check("email", "Please include a valid email").isEmail(),
        check("password").exists().withMessage("Password should not be empty")
        .isLength({min:8}).withMessage("Password must have min. of 8 characters")
        .matches(/^(?=.*[\\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\\w!@#$%^&*]{8,}$/).withMessage("Password must be atleast one upper case, one number and special character")
    ], async (req, res) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const { email, password } = req.body;

    const userExists = await User.findOne({ ${conditionalValue} });
    if (userExists) {
        return res.sendStatus(403)
    } else {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                try {
                    const token = jwt.sign({ email, password }, process.env.JWT_PVTKEY, {
                        expiresIn: '15m'
                    });

                    const user = new User({ email, password: hash })
                    await user.save()

                    const { iat, exp } = jwt.decode(token);
                    // Respond with token
                    return res.status(201).json({ iat, exp, token });
                } catch (err) {
                    console.log(err)
                    return res.sendStatus(403)
                }
            });
        });
    }
});

// Auth User
authProvider.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Authenticate User
        const user = await authenticate(email, password);

        // Create JWT
        const token = jwt.sign({ user }, process.env.JWT_PVTKEY, {
            expiresIn: '15m'
        });

        const { iat, exp } = jwt.decode(token);
        // Respond with token
        return res.send({ iat, exp, token });

    } catch (err) {
        return res.sendStatus(403);
    }
});

authProvider.get('/meDetailed', verifyToken, (req, res) => {
    const {err, user} = res.locals.token;
    if (err) {
        return res.sendStatus(403);
    } else {
        return res.status(200).json({
            user
        });
    }
})

export default authProvider;
        
`
        getFileAndUpdateContent.updateRouteText(`${folderDirectory}/src/routes/index.js`, 'auth')
            .then(() => createFileWithContent(`${folderDirectory}/src/controller/authController.js`, authFileContent))
            .catch((err) => console.log(err));
        
        appendFileSync(folderDirectory + '/.env', `\nJWT_PVTKEY=abcdef`);
    });
}