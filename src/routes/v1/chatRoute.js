// src/routes/v1/chatRoute.js
import express from 'express';
import { chatMessageController } from '../../controllers/chatMessageController.js';
import { chatMessageValidation } from '../../validations/chatMessageValidation.js';
const Router = express.Router();

/**
 * Xử lý yêu cầu POST tạo message.
 */
Router.route('/')
    .post(chatMessageValidation.sendChatMessage, chatMessageController.sendChatMessage)

export const chatRoute = Router;
