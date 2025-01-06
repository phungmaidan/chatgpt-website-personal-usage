// validations/topicValidation.js
import Joi from 'joi';
import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/ApiError.js'

const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        title: Joi.string().required(), // Tên chủ đề
    })
    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.NOT_ACCEPTABLE, new Error(error).message))
    }
};

export const topicValidation = {
    createNew
}