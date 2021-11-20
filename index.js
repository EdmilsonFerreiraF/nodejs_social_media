const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')

dotenv.config()

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true}, () => {
    console.log("Connected to MongoDB")
})

const app = express()

// Middleware
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))

app.listen(4000, () => {
    console.log("Backend server is running!")
})