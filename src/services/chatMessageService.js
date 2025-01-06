// src/services/chatMessageService.js
import axios from 'axios';
import { addTopic, getTopicsByUser, getTopicById, updateTopicMessages } from '../models/topicModel.js';
import { addMessage, getMessagesByTopic } from '../models/Message.js';
import { env } from '../config/environment.js';
import { sendChatMessage } from '../models/chatMessageModel.js'; // Import model lưu lịch sử trò chuyện

const CHATGPT_API_KEY = env.CHATGPT_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Tạo một chủ đề mới cho user
 * @param {string} user_id - ID của user
 * @param {string} title - Tên chủ đề
 * @returns {Promise<string>} - ID của topic vừa tạo
 */
const createTopic = async (reqBody) => {
    return await addTopic({ user_id, title });
};

/**
 * Gửi tin nhắn đến OpenAI API và nhận phản hồi.
 * @param {Array} messages - Danh sách tin nhắn trong cuộc trò chuyện.
 * @param {string} model - Mô hình AI (ví dụ: gpt-4).
 * @returns {Promise<string>} - Câu trả lời từ ChatGPT.
 */
const sendChatMessage = async (messages, model = 'gpt-4') => {
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

        // Kiểm tra nếu có response data và message
        if (response.data && response.data.choices && response.data.choices.length > 0) {
            // Lưu lịch sử trò chuyện vào MongoDB
            const newMessageToAdd = {
                topic_id
            }
            await sendChatMessage(messages.content);
            return response.data.choices[0].message.content; // Trả về câu trả lời từ OpenAI
        } else {
            throw new Error('No response from OpenAI.');
        }
    } catch (error) {
        console.error('Error communicating with OpenAI:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch response from OpenAI');
    }
};


export const chatMessageService = {
    sendChatMessage
}