const router = require('express').Router()

const Post = require('../models/Post')
const User = require('../models/User')

const TokenGenerator = require('../services/tokenGenerator')
const IdGenerator = require('../services/idGenerator')

const tokenGenerator = new TokenGenerator()
const idGenerator = new IdGenerator()

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

// Create a post
router.post('/', async (req, res) => {
    try {
        const { description, image } = req.body
        const token = req.headers.authorization
        
 
        
        if (!token) {
            res.status(417).send("Missing token");
        };

        const isTokenValid = tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token);
      
        if (!isTokenValid) {
            res.status(409).send("Invalid token");
        }

        inputToBoolean(isTokenValid.isAdmin)

        if (isTokenValid.isAdmin !== true) {
            res.status(403).send("Only admins can access this feature")
        }

        const id = idGenerator.generate();

        const newPost = new Post({ id, userId: isTokenValid.id, description, image })

        const savedPost = await newPost.save()

        res.status(200).json(savedPost)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

// Get a post
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const token = req.headers.authorization

        if (!token) {
            res.status(417).send("Missing token");
        };

        const isTokenValid = tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token);
      
        if (!isTokenValid) {
            res.status(409).send("Invalid token");
        }

        const post = await Post.findOne({ id })

        res.status(200).json(post)
    } catch (err) {
        res.status(500).json(err)
    }
})

// Update a post
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const token = req.headers.authorization
        
        



        if (!token) {
            res.status(417).send("Missing token");
        };

        const isTokenValid = tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token);
      
        if (!isTokenValid) {
            res.status(409).send("Invalid token");
        }

        inputToBoolean(isTokenValid.isAdmin)

        if (isTokenValid.isAdmin !== true) {
            res.status(403).send("Only admins can access this feature")
        }

        const post = await Post.findOne({ id })

        if (post.userId !== isTokenValid.id) {
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
        const token = req.headers.authorization
        
        inputToBoolean(token.isAdmin)

        if (token.isAdmin !== true) {
            res.status(403).send("Only admins can access this feature")
        }

        if (!token) {
            res.status(417).send("Missing token");
        };

        const isTokenValid = tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token);
      
        if (!isTokenValid) {
            res.status(409).send("Invalid token");
        }

        inputToBoolean(isTokenValid.isAdmin)

        if (isTokenValid.isAdmin !== true) {
            res.status(403).send("Only admins can access this feature")
        }

        const post = await Post.findOne({ id })

        if (post.userId !== isTokenValid.id) {
            res.status(403).json("You can only delete your own posts")
        }

        await post.deleteOne({ id: isTokenValid.id }, err => console.log(err)) 

        res.status(200).json("The post has been deleted")
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

// Like/dislike a post
router.put('/:id/like', async (req, res) => {
    try {
        const { id } = req.params
        const token = req.headers.authorization

        if (!token) {
            res.status(417).send("Missing token");
        };

        const isTokenValid = tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token);
      
        if (!isTokenValid) {
            res.status(409).send("Invalid token");
        }

        inputToBoolean(isTokenValid.isAdmin)

        if (isTokenValid.isAdmin !== true) {
            res.status(403).send("Only admins can access this feature")
        }

        const post = await Post.findOne({ id })

        if (!post.likes.includes(isTokenValid.id)) {
            await post.updateOne({ $push: { likes: isTokenValid.id } })

            res.status(200).json("The post has been liked")
        } else {
            await post.updateOne({ $pull: { likes: isTokenValid.id } })

            res.status(200).json("The post has been disliked")
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

// Get timeline posts
router.get('/timeline/:userId', async (req, res) => {
    try {
        const { userId } = req.params
        const token = req.headers.authorization
        
        if (!token) {
            res.status(417).send("Missing token");
        };

        const isTokenValid = tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token);
      
        if (!isTokenValid) {
            res.status(409).send("Invalid token");
        }

        const currentUser = await User.findOne({ id: userId })
        const userPosts = await Post.find({ userId: currentUser.id })

        const followingPosts = await Promise.all(
            currentUser.following.map(followingId => {
                return Post.find({ userId: followingId })
            })
        )

        res.status(200).json(userPosts.concat(...followingPosts))
    } catch (err) {
        res.status(500).json(err)
    }
})

// Get user posts
router.get('/profile/:username', async (req, res) => {
    try {
        const { username } = req.params
        const token = req.headers.authorization
        
        if (!token) {
            res.status(417).send("Missing token");
        };

        const isTokenValid = tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token);
      
        if (!isTokenValid) {
            res.status(409).send("Invalid token");
        }
        const user = await User.findOne({ username })
        const posts = await Post.find({ userId: user.id })
        
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router