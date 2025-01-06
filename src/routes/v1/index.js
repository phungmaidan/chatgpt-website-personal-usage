import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { chatRoute } from './chatRoute.js'
import { topicRoute } from './topicRoute.js'

const Router = express.Router()

/** Check APIs v1/status */
Router.get('/status', (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use.' })
})

/** Chat APIs */
Router.use('/chat', chatRoute)

/** Topic APIs */
Router.use('/topics', topicRoute)

export const APIs_V1 = Router