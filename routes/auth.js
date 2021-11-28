const router = require('express').Router()

const HashGenerator = require('../services/hashGenerator')
const IdGenerator = require('../services/idGenerator')
const TokenGenerator = require('../services/tokenGenerator')
const User = require('../models/User')

const hashGenerator = new HashGenerator()
const idGenerator = new IdGenerator()
const tokenGenerator = new TokenGenerator()

const inputToBoolean = (input) => {
    switch (input) {
        case false:
          return false
        case true:
          return true
        default:
          throw new Error("Invalid user isAdmin");
    }
}

// Sign up
router.post('/signup', async (req, res) => {
    try {
        // Get user data from request body
        const { username, email, password, isAdmin } = req.body

        if (
            !username ||
            !email ||
            !password ||
            !isAdmin
         ) {
            res.status(417).send("Missing input")
        }

        inputToBoolean(isAdmin)

        if (email.indexOf("@") === -1) {
            res.status(422).send("Invalid email address");
        };
         
        if (password.length < 6) {
            res.status(422).send("Password must be more or equal than 6 characters length");
        };

        const id = idGenerator.generate();

        // Encrypt password
        const cypherPassword = await hashGenerator.hash(password);

        // Create new user
        const newUser = new User({
            id,
            username,
            email,
            password: cypherPassword,
            isAdmin
        })
        
        console.log('isAdmin', isAdmin)
        // Save user
        await newUser.save()

        const token = tokenGenerator.generate({
            id,
            username,
            isAdmin
        });

        res.status(200).json(token)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

// Login
router.post('/login', async (req, res) => {
    try {
        // Get user data from request body
        const { email, password } = req.body

        if (!email || !password) {
            res.status(422).send("Missing input")
         };

        // Create new user
        const user = await User.findOne({ email })

        if (!user) {
            res.status(401).json("Invalid credentials")
        }

        // Check password
        const isPasswordCorrect = await hashGenerator.compareHash(
            password,
            user.password
         );

        if (!isPasswordCorrect) {
            res.status(401).json('Invalid email or password')
        }

        const token = tokenGenerator.generate({
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin
        });

        res.status(200).send(token)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

module.exports = router