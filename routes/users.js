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

// Follow user
router.put('/:id/follow', async(req, res) => {
    try {
        const { id } = req.params
        const { userId } = req.body

        if (userId === id) {
            return res.status(403).json("You can't follow yourself")
        }

        const user = await User.findById({ "_id": id })
        const currentUser = await User.findById({ "_id": userId })
        
        if (!user.followers.includes(userId)) {
            await user.updateOne({ $push: { followers: userId }})
            await currentUser.updateOne({ $push: { following: id }})

            return res.status(200).json("User has been followed")
        } else {
            return res.status(403).json("You have already followed this user")
        }
    } catch (err) {
        return res.status(500).json(err)
    }
}) 

// Unfollow user
router.put('/:id/unfollow', async(req, res) => {
    try {
        const { userId } = req.body
        const { id } = req.params

        if (userId === id) {
            return res.status(403).json("You can't unfollow yourself")
        }

        const user = await User.findById({ "_id": id })
        const currentUser = await User.findById({ "_id": userId })
        
        if (user.followers.includes(userId)) {
            await user.updateOne({ $pull: { followers: userId }})
            await currentUser.updateOne({ $pull: { following: id }})

            return res.status(200).json("User has been unfollowed")
        } else {
            return res.status(403).json("You haven't followed this user")
        }
    } catch (err) {
        return res.status(500).json(err)
    }
}) 

module.exports = router