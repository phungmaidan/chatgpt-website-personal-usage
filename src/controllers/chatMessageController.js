// controllers/chatMessageController.js
import { chatMessageService } from '../services/chatMessageService.js';

const sendChatMessage = async (req, res) => {
    try {
        const sentMessage = await chatMessageService.sendChatMessage(req.body)
        // Trả kết quả về cho người dùng
        res.status(200).json({
            message: sentMessage
        });
    } catch (err) {
        // Trả về lỗi với thông tin chi tiết hơn
        console.error('Error handling chat message:', err);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
};

export const chatMessageController = {
    sendChatMessage
}
