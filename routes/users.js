const router = require('express').Router()
const bcrypt = require('bcryptjs')

const User = require('../models/User')

// Update user
router.put('/:id', async(req, res) => {
    try {
        const { userId, password, isAdmin } = req.body
        const { id } = req.params

        if (userId !== id && !isAdmin) {
            res.status(403).json('You can only update one account!')
        } 

        if (password && !isAdmin) {
            const salt = await bcrypt.genSalt(10)

            req.body.password = await bcrypt.hash(password, salt)
        }

        await User.findByIdAndUpdate(id, {$set: req.body})

        res.status(200).json('Your account has been updated')
    } catch (err) {
        res.status(500).json(err)
    }
})

// Delete user
router.delete('/:id', async(req, res) => {
    try {
        const { id } = req.params
        const { userId } = req.body

        if (userId !== id) {
            res.status(403).json('You can delete only one account!')
        } 

        await User.deleteOne({ id })

        res.status(200).json('Your account has been deleted')
    } catch (err) {
        res.status(500).json(err)
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
        res.status(500).json(err)
    }
})

// Follow user
router.put('/:id/follow', async(req, res) => {
    try {
        const { id } = req.params
        const { userId } = req.body

        if (userId === id) {
            res.status(403).json("You can't follow yourself")
        }

        const user = await User.findById({ "_id": id })
        const currentUser = await User.findById({ "_id": userId })
        
        if (!user.followers.includes(userId)) {
            await user.updateOne({ $push: { followers: userId }})
            await currentUser.updateOne({ $push: { following: id }})

            res.status(200).json("You have been followed this user")
        } else {
            res.status(403).json("You have already followed this user")
        }
    } catch (err) {
        res.status(500).json(err)
    }
}) 

// Unfollow user
router.put('/:id/unfollow', async(req, res) => {
    try {
        const { userId } = req.body
        const { id } = req.params

        if (userId === id) {
            res.status(403).json("You can't unfollow yourself")
        }

        const user = await User.findById({ "_id": id })
        const currentUser = await User.findById({ "_id": userId })
        
        if (user.followers.includes(userId)) {
            await user.updateOne({ $pull: { followers: userId }})
            await currentUser.updateOne({ $pull: { following: id }})

            res.status(200).json("You have been followed this user")
        } else {
            res.status(403).json("You haven't followed this user")
        }
    } catch (err) {
        res.status(500).json(err)
    }
}) 

module.exports = router