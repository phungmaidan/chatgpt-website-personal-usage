// src/models/topicModel.js
import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '../utils/validators.js'
import { GET_DB } from '../config/mongodb.js'
import { ObjectId } from 'mongodb'

// Định nghĩa schema validation cho Message
const TOPIC_COLLECTION_NAME = 'topic'
const TOPIC_COLLECTION_SCHEMA = Joi.object({
    user_id: Joi.string().required().trim().strict(), // ID của user liên kết
    slug: Joi.string().required().min(3).trim().strict(),
    title: Joi.string().required(), // Tên chủ đề
    message_ids: Joi.array().items(Joi.string()).default([]), // Mảng chứa ID các tin nhắn
    created_at: Joi.date().timestamp('javascript').default(Date.now), // Thời gian tạo
    _destroy: Joi.boolean().default(false)
});

// Chỉ định field không cho phép cập nhật trong hàm update()
const INVALID_UPDATE_FIELDS = ['user_id', 'createdAt']

const validateBeforeCreate = async (data) => {
    return await TOPIC_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

// Hàm thêm topic vào database
const createNew = async (data) => {
    try {
        const validTopic = await validateBeforeCreate(data)
        const createdTopic = await GET_DB().collection(TOPIC_COLLECTION_NAME).insertOne(validTopic);
        return createdTopic
    } catch (error) { throw new Error(error) }
};

const update = async (topic_id, updateData) => {
    try {
        Object.keys(updateData).forEach(fieldName => {
            if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
                delete updateData[fieldName]
            }
        })

        const result = await GET_DB().collection(TOPIC_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(topic_id) },
            { $push: { message_ids: message_id } }
        )

        return result
    } catch (error) { throw new Error(error) }
}

// Hàm lấy tất cả topics theo user_id
const findManyByUserId = async (user_id) => {
    const db = GET_DB();
    const topicsCollection = db.collection(TOPIC_COLLECTION_NAME);

    return await topicsCollection
        .find({ user_id: user_id })
        .sort({ created_at: -1 })
        .toArray();
};

// Hàm lấy topic theo ID
const findOneById = async (topic_id) => {
    const db = GET_DB();
    const topicsCollection = db.collection(TOPIC_COLLECTION_NAME);
    return await topicsCollection.findOne({ _id: new ObjectId(topic_id) });
};

// Hàm thêm message dựa vào ID
// Push cardId vào cuối mảng cardOrderIds
const pushMessage = async (message) => {
    try {
      const result = await GET_DB().collection(TOPIC_COLLECTION_NAME).findOneAndUpdate(
        { _id: new ObjectId(message.topic_id) },
        { $push: { message_ids: new ObjectId(message._id) } },
        { returnDocument: 'after' }
      )
  
      return result
    } catch (error) { throw new Error(error) }
  }

export const topicModel = {
    createNew,
    update,
    findManyByUserId,
    pushMessage,
    findOneById
};
