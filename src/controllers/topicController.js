// controllers/topicController.js
import { StatusCodes } from 'http-status-codes'
import { topicService } from '../services/topicService.js';

const createNew = async (req, res) => {
    const reqBody = req.body;
    try {
        const createdTopic = await topicService.createNew(reqBody)

        // Trả kết quả về cho người dùng
        res.status(StatusCodes.CREATED).json({
            message: `Created Topic ${createdTopic.title} successfully!!!`,
        });
    } catch (err) {
        // Trả về lỗi với thông tin chi tiết hơn
        console.error('Error handling chat message:', err);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
};

export const topicController = {
    createNew
}
