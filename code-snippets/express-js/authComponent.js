const createFileWithContent = require('../../helperFunctions/createFileAndAddContent')
const shell = require('shelljs')
const getFileAndUpdateContent = require('./getFileAndUpdateContent')

module.exports.addAuthComponent = folderDirectory => {
    shell.exec('npm i jsonwebtoken bcryptjs', () => {

        const fileContent = `import bcrypt from 'bcryptjs'
import User from './models/User'

exports.authenticate = (email, password) => {
    return new Promise(async (resolve, reject) => {
    try {
        //Match Password
        const user = await User.findOne({ email });
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
    // Set the token
    req.token = jwtToken;
    // Next middleware
    next();
    } else {
    // Forbidden
    res.sendStatus(403);
    }
}`

        createFileWithContent.createFileWithContent(`${folderDirectory}/src/auth.js`, fileContent)

        const authFileContent = `import bcrypt from 'bcryptjs';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate, verifyToken } from '../auth.js';
import User from '../models/User';

const authProvider = Router();
authProvider.post('/register', async (req, res) => {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.sendStatus(403)
    } else {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                try {
                    const token = jwt.sign({ email, password }, 'abcdef', {
                        expiresIn: '15m'
                    });

                    const user = new User({ email, password: hash })
                    await user.save()

                    const { iat, exp } = jwt.decode(token);
                    // Respond with token
                    res.status(201).json({ iat, exp, token });
                } catch (err) {
                    console.log(err)
                    res.sendStatus(403)
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
        const token = jwt.sign({ user }, 'abcdef', {
            expiresIn: '15m'
        });

        const { iat, exp } = jwt.decode(token);
        // Respond with token
        res.send({ iat, exp, token });

    } catch (err) {
        res.sendStatus(403);
    }
});

authProvider.get('/meDetailed', verifyToken, (req, res) => {
    jwt.verify(req.headers.authorization, 'abcdef', (err, { user }) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                user
            });
        }
    });
})

module.exports = authProvider;
        
`
        getFileAndUpdateContent.updateRouteText(`${folderDirectory}/src/routes/index.js`, 'auth')
            .then(() => createFileWithContent.createFileWithContent(`${folderDirectory}/src/controller/authController.js`, authFileContent))
            .catch((err) => console.log(err));
    });
}