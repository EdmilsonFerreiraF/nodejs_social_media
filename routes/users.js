const router = require('express').Router()

const User = require('../models/User')

const TokenGenerator = require('../services/tokenGenerator')
const HashGenerator = require('../services/hashGenerator')

const tokenGenerator = new TokenGenerator()
const hashGenerator = new HashGenerator()

const inputToBoolean = (input) => {
    switch (input) {
        case true:
          return true
        case false:
          return false
        default:
          throw new Error("Invalid user isAdmin");
    }
}

// Update user
router.put('/', async(req, res) => {
    try {
        const { password } = req.body
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

        let cypherPassword

        if (password) {
            // Encrypt password
            cypherPassword = await hashGenerator.hash(password)
        }

        await User.updateOne({ id: isTokenValid.id }, { $set: { password: cypherPassword } })

        res.status(200).json('Your account has been updated')
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

// Delete user
router.delete('/', async(req, res) => {
    try {
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

        await User.deleteOne({ id: isTokenValid.id })

        res.status(200).json('Your account has been deleted')
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

// Get user
router.get('/', async(req, res) => {
    try {
        const { id } = req.query
        const token = req.headers.authorization
        
        if (!token) {
            res.status(417).send("Missing token");
        };

        const isTokenValid = tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token);
    
        if (!isTokenValid) {
            res.status(409).send("Invalid token");
        }

        const user = isTokenValid.id 
        ? await User.findOne({ id }) 
        : await User.findOne({ id: isTokenValid.id })

        const { password, updatedAt, ...otherData } = user._doc
        
        res.status(200).json(otherData)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

// Get friends
router.get('/friends', async(req, res) => {
    try {
        const token = req.headers.authorization

        if (!token) {
            res.status(417).send("Missing token");
        };

        const isTokenValid = tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token);
    
        if (!isTokenValid) {
            res.status(409).send("Invalid token");
        }

        const user = await User.findOne({ id: isTokenValid.id })

        const friends = await Promise.all(
            user.following.map(friendId => {
                return User.findOne({ id: friendId })
            })
        )

        let friendList = []

        friends.map(friend => {
            const { id, username, profilePicture } = friend

            friendList.push({ id, username, profilePicture })
        })

        res.status(200).json(friendList)
    } catch (err) {
        res.status(500).json(err)
    }
})

// Follow user
router.put('/:id/follow', async(req, res) => {
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

        if (isTokenValid.id === id) {
            res.status(403).json("You can't follow yourself")
        }
        
        const user = await User.findOne({ id })
        
        if (!user) {
            res.status(403).json("User not found")
        }
        
        const currentUser = await User.findOne({ id: isTokenValid.id })
        
        if (!user.followers.includes(isTokenValid.id)) {
            await user.updateOne({ $push: { followers: isTokenValid.id }})
            await currentUser.updateOne({ $push: { following: id }})

            res.status(200).json("You have been followed this user")
        } else {
            res.status(403).json("You have already followed this user")
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}) 

// Unfollow user
router.put('/:id/unfollow', async(req, res) => {
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

        if (isTokenValid.id === id) {
            res.status(403).json("You can't unfollow yourself")
        }

        const user = await User.findOne({ id })
        const currentUser = await User.findOne({ id: isTokenValid.id })
        
        if (user.followers.includes(isTokenValid.id)) {
            await user.updateOne({ $pull: { followers: isTokenValid.id }})
            await currentUser.updateOne({ $pull: { following: id }})

            res.status(200).json("You have been followed this user")
        } else {
            res.status(403).json("You haven't followed this user")
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}) 

module.exports = router