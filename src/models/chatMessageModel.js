// src/models/chatMessageModel.js
import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

// Định nghĩa schema validation cho Message
const CHAT_MESSAGE_COLLECTION_NAME = 'message'
const CHAT_MESSAGE_COLLECTION_SCHEMA = Joi.object({
    topic_id: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE), // topic_id liên kết
    role: Joi.string().valid('user', 'bot').required(), // Vai trò user hoặc bot
    content: Joi.string().required(), // Nội dung tin nhắn
    created_at: Joi.date().timestamp('javascript').default(Date.now), // Thời gian tạo
    _destroy: Joi.boolean().default(false)
});

// Chỉ định field không cho phép cập nhật trong hàm update()
const INVALID_UPDATE_FIELDS = ['topic_id', 'role', 'createdAt']

const validateBeforeCreate = async (data) => {
    return await CHAT_MESSAGE_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

// Hàm thêm message vào database
export const sendChatMessage = async (message) => {
    try {
        const validMessage = await validateBeforeCreate(message)
        const newMessageToAdd = {
            ...validMessage,
            topic_id: new ObjectId(validMessage.topic_id)
        }
        const createdMessage = await GET_DB().collection(CHAT_MESSAGE_COLLECTION_NAME).insertOne(newMessageToAdd);
        return createdMessage
    } catch (error) { throw new Error(error) }
};

// Hàm lấy tất cả messages theo topic_id
export const getMessagesByTopic = async (topic_id) => {
    const db = GET_DB();
    const messagesCollection = db.collection(CHAT_MESSAGE_COLLECTION_NAME);

    // Tìm tất cả messages thuộc topic
    return await messagesCollection
        .find({ topic_id: topic_id })
        .sort({ created_at: 1 }) // Sắp xếp theo thời gian
        .toArray();
};

export const chatMessageModel = {
    sendChatMessage,
    getMessagesByTopic
};
