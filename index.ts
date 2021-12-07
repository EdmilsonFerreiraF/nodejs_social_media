import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'

import { userRouter } from './src/controller/routes/userRouter'
import { postRouter } from './src/controller/routes/postRouter'

const app = express()

app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('common'))

app.use('/user', userRouter)
app.use('/post', postRouter)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})