const User = require('../models/User')
const router = require('express').Router()
const bcrypt = require('bcryptjs')

// Sign up
router.post('/signup', async (req, res) => {
    try {
        // Get user data from request body
        const { username, email, password } = req.body
    
        // Create new user
        const newUser = await new User({
            username,
            email,
            password
        })

        // Encrypt password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        
        // Save user and respond
        const user = await newUser.save()
        res.status(200).json(user)
    } catch (err) {
        console.log(err)
    }

})

// Login
router.post('/login', async (req, res) => {
    try {
        // Get user data from request body
        const { email, password } = req.body
    
        // Create new user
        const user = await User.findOne({ email })

        if (!user) {
            res.status(404).json("User not found")
        }

        const validPassword = await bcrypt.compare(password, user.password)

        if (!validPassword) {
            res.status(400).json('Invalid email or password')
        }

        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err)
    }

})

module.exports = router