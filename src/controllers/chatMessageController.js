// controllers/chatMessageController.js
import { sendChatMessage } from '../services/chatMessageService.js';
import ChatHistory from '../models/ChatHistory.js'; // Import model để lưu lịch sử


const sendChatMessage = async (req, res) => {
    // Lấy tin nhắn từ body (giả sử tên trường trong body là 'message')
    const userMessage = req.body.message;

    try {
        // Gọi service để gửi tin nhắn đến ChatGPT và nhận phản hồi
        const response = await sendMessageToChatGPT([
            { role: 'user', content: userMessage }
        ]);
        
        // Lưu lịch sử trò chuyện vào cơ sở dữ liệu
        const chatHistory = new ChatHistory({
            userMessage: userMessage,
            botResponse: response,
        });

        await chatHistory.save(); // Lưu vào DB

        // Trả kết quả về cho người dùng
        res.status(200).json({
            message: 'Message processed successfully',
            chatGPTResponse: response,
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
