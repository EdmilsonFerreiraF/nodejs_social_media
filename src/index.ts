import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

import { bookmarkRouter } from './controller/routes/bookmarkRouter'
import { commentRouter } from './controller/routes/commentRouter'
import { friendRequestRouter } from './controller/routes/friendRequestRouter'
import { postRouter } from './controller/routes/postRouter'
import { userRouter } from './controller/routes/userRouter'

const app = express()

app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('common'))

app.use('/user', userRouter)
app.use('/post', postRouter)
app.use('/bookmark', bookmarkRouter)
app.use('/comment', commentRouter)
app.use('/friendrequest', friendRequestRouter)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})