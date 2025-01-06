// validations/chatMessageValidation.js
import Joi from 'joi';
import { StatusCodes } from 'http-status-codes'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '../utils/validators.js'
import ApiError from '../utils/ApiError.js'

const sendChatMessage = async (req, res, next) => {
    const correctCondition = Joi.object({
        topic_id: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE), // topic_id liên kết
        content: Joi.string().required(), // Nội dung tin nhắn
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