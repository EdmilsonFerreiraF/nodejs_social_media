const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const cors = require('cors')
const usersRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postsRoute = require('./routes/posts')

dotenv.config()

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true}, (err) => {
    console.log("Connected to MongoDB")

    if (err) {
        console.log(err)
    }
})

const app = express()

// Middlewares
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('common'))

app.get('/', (_, res) => {
    res.send("Welcome to homepage")
})

app.get('/users', (_, res) => {
    res.send("Welcome to user page")
})

app.use('/api/users', usersRoute)
app.use('/api/auth', authRoute)
app.use('/api/posts', postsRoute)

app.listen(4000, () => {
    console.log("Backend server is running!")
})