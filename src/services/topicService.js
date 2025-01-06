import { slugify } from '../utils/formatters.js'
import ApiError from '../utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'
import { topicModel } from '../models/topicModel.js'
import lodash from 'lodash';
const { cloneDeep } = lodash;
const createNew = async (reqBody) => {
    try {
        const newTopic = {
            ...reqBody,
            user_id: 'INV0001',
            slug: slugify(reqBody.title)
        }
        const createdTopic = await topicModel.createNew(newTopic)
        const getNewTopic = await topicModel.findOneById(createdTopic.insertedId)
        console.log('🚀 ~ createNew ~ getNewTopic:', getNewTopic)
        
        return getNewTopic
    } catch (error) { throw error }
}

export const topicService = {
    createNew
}