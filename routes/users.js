const router = require('express').Router()
const bcrypt = require('bcryptjs')

const User = require('../models/User')

// Update user
router.put('/:id', async(req, res) => {
    try {
        const { userId, password, isAdmin } = req.body
        const { id } = req.params

        if (userId !== id && !isAdmin) {
            return res.status(403).json('You can update only one account!')
        } 

        if (password && !isAdmin) {
            const salt = await bcrypt.genSalt(10)

            req.body.password = await bcrypt.hash(password, salt)
        }

        await User.findByIdAndUpdate(id, {$set: req.body})

        res.status(200).json('Account has been updated')
    } catch (err) {
        return res.status(500).json(err)
    }
})

// Delete user
router.delete('/:id', async(req, res) => {
    try {
        const { id } = req.params
        const { userId } = req.body

        if (userId !== id) {
            return res.status(403).json('You can delete only one account!')
        } 

        await User.deleteOne({ id })

        res.status(200).json('Account has been deleted')
    } catch (err) {
        return res.status(500).json(err)
    }
})

// Get user
router.get('/:id', async(req, res) => {
    const { id } = req.params

    try {
        const user = await User.findOne({ id })

        const { password, updatedAt, ...otherData } = user._doc
        
        res.status(200).json(otherData)
    } catch (err) {
        return res.status(500).json(err)
    }
})

module.exports = router