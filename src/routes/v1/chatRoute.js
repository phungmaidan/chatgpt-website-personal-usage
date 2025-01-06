// src/routes/v1/chatRoute.js
import express from 'express';
import { chatMessageController } from '../../controllers/chatMessageController.js';
import { chatMessageValidation } from '../../validations/chatMessageValidation.js';
const Router = express.Router();

// Render giao diện chat
// Router.get('/', (req, res) => {
//     res.render('chat', { messages: [] });  // Truyền dữ liệu rỗng cho messages khi mới truy cập
// });

Router.route('/')
    .post(chatMessageValidation.createNew, chatMessageController.createNew)


/**
 * Xử lý yêu cầu POST tạo topic.
 */
Router.post('/', chatMessageValidation.sendChatMessage, chatMessageController.sendChatMessage);


/**
 * Xử lý yêu cầu POST gửi tin nhắn đến ChatGPT.
 */
Router.post('/:topic, chatMessageValidation.sendChatMessage, chatMessageController.sendChatMessage);

export const chatRoute = Router;
