const Post = require('../models/Post')

const router = require('express').Router()

// Create a post
router.post('/', async (req, res) => {
    try {
        const newPost = new Post(req.body)

        const savedPost = await newPost.save()

        res.status(200).json(savedPost)
    } catch (err) {
        res.status(500).json(err)
    }
})

// Update a post
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { userId } = req.body

        const post = await Post.findById({ "_id": id })

        if (post.userId !== userId) {
            res.status(403).json("You can only update your own posts")
        }

        await post.updateOne({ $set: req.body })

        res.status(200).json("The post has been updated")
    } catch (err) {
        res.status(500).json(err)
    }
})

// Delete a post
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { userId } = req.body

        const post = await Post.findById({ "_id": id })

        if (post.userId !== userId) {
            res.status(403).json("You can only delete your own posts")
        }

        await post.deleteOne({ $set: req.body })

        res.status(200).json("The post has been deleted")
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router