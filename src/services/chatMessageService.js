// src/services/chatMessageService.js
import axios from 'axios';
import { env } from '../config/environment.js';
import { chatMessageModel } from '../models/chatMessageModel.js'; // Import model lưu lịch sử trò chuyện
import { topicModel } from '../models/topicModel.js';

const CHATGPT_API_KEY = env.CHATGPT_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

// const CHAT_MESSAGE_COLLECTION_SCHEMA = Joi.object({
//     topic_id: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE), // topic_id liên kết
//     role: Joi.string().valid('user', 'bot').required(), // Vai trò user hoặc bot
//     content: Joi.string().required(), // Nội dung tin nhắn
//     created_at: Joi.date().timestamp('javascript').default(Date.now), // Thời gian tạo
//     _destroy: Joi.boolean().default(false)
// });

const sendChatMessage = async (reqBody) => {
    try {
        // Đặt role là user cho tin nhắn của người dùng
        reqBody.role = 'user'

        // Xử lý logic lưu tin nhắn từ user vào cơ sở dữ liệu
        const createdMessage = await chatMessageModel.sendChatMessage(reqBody)
        // Cập nhật message trong topic
        const getNewMessage = await chatMessageModel.findOneById(createdMessage.insertedId)

        if (getNewMessage) {
          // Cập nhật lại mảng message trong collection topic
          await topicModel.pushMessage(getNewMessage)
        }

        // Lấy tất cả tin nhắn của user và bot theo topic_id
         const allMessages = await chatMessageModel.getMessagesByTopic(reqBody.topic_id);
        // Chuẩn bị dữ liệu messages cho ChatGPT từ tất cả tin nhắn
        const messages = allMessages.map(msg => ({
            role: msg.role,  // Vai trò của người gửi ('user' hoặc 'bot')
            content: msg.content // Nội dung tin nhắn
        }));
        // Gửi yêu cầu đến API ChatGPT với tất cả tin nhắn
        const response = await sendMessageToChatGPT(messages);

        // Tạo dữ liệu botMessage để lưu vào cơ sở dữ liệu
        const botMessage = {
            topic_id: reqBody.topic_id, // ID chủ đề từ yêu cầu
            content: response, // Nội dung phản hồi từ ChatGPT
            role: 'assistant' // Vai trò là bot
        };

        // Lưu tin nhắn của bot vào cơ sở dữ liệu
        const createdBotMessage = await chatMessageModel.sendChatMessage(botMessage)
        // Cập nhật message trong topic
        const getNewBotMessage = await chatMessageModel.findOneById(createdBotMessage.insertedId)

        if (getNewBotMessage) {
          // Cập nhật lại mảng message trong collection topic
          await topicModel.pushMessage(getNewBotMessage)
        }
        // Luôn phải trả kết quả về cho Service
        return response

      } catch (error) { throw error }
}

/**
 * Gửi tin nhắn đến OpenAI API và nhận phản hồi.
 * @param {Array} messages - Danh sách tin nhắn trong cuộc trò chuyện.
 * @param {string} model - Mô hình AI (ví dụ: gpt-4).
 * @returns {Promise<string>} - Câu trả lời từ ChatGPT.
 */
const sendMessageToChatGPT = async (messages, model = 'gpt-4') => {
    try {
        const response = await axios.post(API_URL, {
            model: model,
            messages: messages, // Truyền đúng mảng messages vào
        }, {
            headers: {
                'Authorization': `Bearer ${CHATGPT_API_KEY}`,
                'Content-Type': 'application/json',
            }
        });
        return response.data.choices[0].message.content; // Trả về câu trả lời từ OpenAI
    } catch (error) {
        console.error('Error communicating with OpenAI:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch response from OpenAI');
    }
};

export const chatMessageService = {
    sendChatMessage
}