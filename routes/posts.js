const Post = require('../models/Post')
const User = require('../models/User')

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

// Get a post
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params

        const post = await Post.findById({ "_id": id })

        res.status(200).json(post)
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

// Like/dislike a post
router.put('/:id/like', async (req, res) => {
    try {
        const { id } = req.params
        const { userId } = req.body

        const post = await Post.findById({ "_id": id })

        if (!post.likes.includes(userId)) {
            await post.updateOne({ $push: { likes: userId } })

            res.status(200).json("The post has been liked")
        } else {
            await post.updateOne({ $pull: { likes: userId } })

            res.status(200).json("The post has been disliked")
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

// Get timeline posts
router.get('/timeline/:userId', async (req, res) => {
    try {
        const { userId } = req.params

        const currentUser = await User.findById( userId )

        const userPosts = await Post.find({ userId: currentUser._id })
        const followingPosts = await Promise.all(
            currentUser.following.map(followingId => {
                return Post.find({ userId: followingId })
            })
        )

        console.log("currentUser", currentUser)

        console.log("userPosts", userPosts)
        console.log("followingPosts", followingPosts)

        res.status(200).json(userPosts.concat(...followingPosts))
    } catch (err) {
        res.status(500).json(err)
    }
})

// Get user posts
router.get('/profile/:username', async (req, res) => {
    try {
        const { username } = req.params

        const user = await User.findOne({ username })
        const posts = await Post.find({ userId: user._id })
        
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router