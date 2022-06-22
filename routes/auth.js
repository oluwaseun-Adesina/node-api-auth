const express = require('express');
const router = express.Router();
const User = require('../model/user');
const bcrypt = require('bcrypt');
const rounds = 10
const middleware = require('../middleware');
const dotenv = require('dotenv');
dotenv.config();

const jwt = require('jsonwebtoken');
const tokenSecret = process.env.TOKEN_SECRET;


router.get('/login', (req, res) => {
    User.findOne({email: req.query.email})
    .then(user => {
        if(!user) res.status(404).json({message: 'User not found'});
        else {
            bcrypt.compare(req.query.password, user.password, (err, result) => {
                if(err) res.status(500).json(err);
                else if(result) res.status(200).json({token: generateToken(user)});
                else res.status(403).json({message: 'Invalid password'});
            })
        }
    })
    .catch(err => {
        res.status(500).json(err);
    })
})
router.post('/signup', (req, res) => {
    bcrypt.hash(req.body.password, rounds, (err, hash) => {
        if (err) res.status(500).json(err);
        else {
            const newUser = User ({email: req.body.email, password: hash});
            newUser.save()
                .then(user => {
                    res.status(200).json({token: generateToken(user)});
                })
                .catch(err => {
                    res.status(500).json(err)
                })
        };
    })
});

router.get('/jwt-test', middleware.verify, (req, res) => {
    res.status(200).json(req.user)
})
function generateToken(user) {
    return jwt.sign({data: user}, tokenSecret, {expiresIn: "24h"})
}
module.exports = router;