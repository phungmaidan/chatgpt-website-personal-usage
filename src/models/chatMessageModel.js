// src/models/chatMessageModel.js
import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '../utils/validators.js'
import { GET_DB } from '../config/mongodb.js'
import { ObjectId } from 'mongodb'

// Định nghĩa schema validation cho Message
const CHAT_MESSAGE_COLLECTION_NAME = 'message'
const CHAT_MESSAGE_COLLECTION_SCHEMA = Joi.object({
    topic_id: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE), // topic_id liên kết
    role: Joi.string().valid('user', 'assistant').required(), // Vai trò user hoặc assistant
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
const sendChatMessage = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        const newMessageToAdd = {
            ...validData,
            topic_id: new ObjectId(validData.topic_id)
        }
        const createdMessage = await GET_DB().collection(CHAT_MESSAGE_COLLECTION_NAME).insertOne(newMessageToAdd);

        return createdMessage
    } catch (error) { throw new Error(error) }
};

// Hàm lấy tất cả messages theo topic_id
const getMessagesByTopic = async (topic_id) => {
    const db = GET_DB();
    const messagesCollection = db.collection(CHAT_MESSAGE_COLLECTION_NAME);
    // Truy vấn tất cả tin nhắn có topic_id tương ứng và không bị đánh dấu xóa (_destroy: false)
    const messages = await messagesCollection.find({ topic_id: new ObjectId(topic_id), _destroy: { $ne: true } })
    .sort({ created_at: 1 })  // Sắp xếp theo thời gian tạo tin nhắn
    .toArray(); // Chuyển kết quả sang mảng
    return messages
};

const findOneById = async (id) => {
    try {
      const result = await GET_DB().collection(CHAT_MESSAGE_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
      return result
    } catch (error) { throw new Error(error) }
  }

export const chatMessageModel = {
    sendChatMessage,
    findOneById,
    getMessagesByTopic
};
