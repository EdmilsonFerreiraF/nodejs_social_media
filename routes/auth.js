const router = require('express').Router()
const bcrypt = require('bcryptjs')

const User = require('../models/User')

// Sign up
router.post('/signup', async (req, res) => {
    try {
        // Get user data from request body
        const { username, email, password } = req.body
    
        // Encrypt password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        
        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })
        
        // Save user and respond
        const user = await newUser.save()

        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err)
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

        // Check password
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