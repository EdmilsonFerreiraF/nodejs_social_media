const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')

const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')

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
app.use(helmet())
app.use(morgan('common'))

app.get('/', (_, res) => {
    res.send("Welcome to homepage")
})

app.get('/users', (_, res) => {
    res.send("Welcome to user page")
})

app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)

app.listen(4000, () => {
    console.log("Backend server is running!")
})