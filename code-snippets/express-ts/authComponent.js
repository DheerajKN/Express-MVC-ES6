const {createFileWithContent} = require('../../helperFunctions/createFileAndAddContent')
const {exec} = require('shelljs')
const {appendFileSync} = require('fs');
const getFileAndUpdateContent = require('../express-js/resourceFlag/getFileAndUpdateContent')

module.exports.addAuthComponent = (conditionalValue, folderDirectory) => {
    exec('npm i jsonwebtoken bcryptjs && npm i -D @types/jsonwebtoken @types/bcryptjs', () => {

    const fileContent = `import {Request, Response, NextFunction} from 'express';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import User, { IUser } from './models/User'

export const authenticate = (email: string, password: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            //Match Password
            const user: IUser = await User.findOne({ ${conditionalValue} });
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    resolve({ email });
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
export const verifyToken = (req: Request, res: Response, next:  NextFunction) => {
    // Get auth header value
    const jwtHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof jwtHeader !== 'undefined') {
        // Split at the space
        const jwtValue = jwtHeader.split(' ');
        // Get token from array
        const jwtToken = jwtValue[1];
        jwt.verify(jwtToken, process.env.JWT_PVTKEY, (err: Error, { email }:{email: string}) => {
            // Set the values
            res.locals.token = {err, email};
        });
        // res.locals.token = jwtToken;
        // Next middleware
        next();
    } else {
        // Forbidden
        return res.sendStatus(403);
    }
}`

    createFileWithContent(`${folderDirectory}/src/auth.ts`, fileContent)

        const authFileContent = `import bcrypt from 'bcryptjs';
import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {check, validationResult} from "express-validator";

import { authenticate, verifyToken } from '../auth';
import User, {IUser} from '../models/User';

const authProvider = Router();
authProvider.post('/register', [
        check("email", "Please include a valid email").isEmail(),
        check("password").exists().withMessage("Password should not be empty")
        .isLength({min:8}).withMessage("Password must have min. of 8 characters")
        .matches(/^(?=.*[\\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\\w!@#$%^&*]{8,}$/).withMessage("Password must be atleast one upper case, one number and special character")
    ], async (req: Request, res: Response) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const { email, password } = req.body;

    const userExists: IUser = await User.findOne({ ${conditionalValue} });
    if (userExists) {
        return res.sendStatus(403)
    } else {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                try {
                    const user: IUser = new User({ email, password: hash })
                    await user.save()

                    const token = jwt.sign({email}, process.env.JWT_PVTKEY, {
                        expiresIn: '15m'
                    });
                    const { iat, exp }: any = jwt.decode(token);
                    // Respond with token
                    return res.status(201).json({ iat, exp, token });
                } catch (err) {
                    return res.sendStatus(403)
                }
            });
        });
    }
});

// Auth User
authProvider.post('/', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Authenticate User
        const emailObj: any = await authenticate(email, password);

        // Create JWT
        const token = jwt.sign(emailObj, process.env.JWT_PVTKEY, {
            expiresIn: '15m'
        });

        const { iat, exp }: any = jwt.decode(token);
        // Respond with token
        return res.send({ iat, exp, token });

    } catch (err) {
        return res.sendStatus(403);
    }
});

authProvider.get('/meDetailed', verifyToken, (req: Request, res: Response) => {
    const {err, email}: {err: Error, email: any} = res.locals.token;
    if (err) {
        return res.sendStatus(403);
    } else {
        return res.status(200).json({email});
    }
})

export default authProvider;`

      getFileAndUpdateContent.updateRouteText(`${folderDirectory}/src/routes/index.ts`, 'auth')
        .then(() => createFileWithContent(`${folderDirectory}/src/controller/authController.ts`, authFileContent))
        .catch((err) => console.log(err));
      
      appendFileSync(folderDirectory + '/.env', `\nJWT_PVTKEY=abcdef`);
    });
}