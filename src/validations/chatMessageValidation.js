// validations/chatMessageValidation.js
import Joi from 'joi';
import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/ApiError.js'

const sendChatMessage = async (req, res, next) => {
    const correctCondition = Joi.object({
        
        message: Joi.string().max(500).required().messages({
            'string.empty': 'Message is required',
            'string.max': 'Message must not exceed 500 characters',
        }),
    })
    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.NOT_ACCEPTABLE, new Error(error).message))
    }
};

export const chatMessageValidation = {
    sendChatMessage
}