// mongodb.js
import { MongoClient, ServerApiVersion } from 'mongodb';
import { env } from './environment.js'

let chatHistoryInstance = null;
let mongoClientInstance = null;

const createMongoClient = () => {
    return new MongoClient(env.MONGODB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true
        }
    });
};

// Kết nối tới Database
export const CONNECT_DB = async () => {
    if (chatHistoryInstance) return; // Nếu đã kết nối rồi, không cần kết nối lại

    try {
        if (!mongoClientInstance) {
            mongoClientInstance = createMongoClient();
        }

        await mongoClientInstance.connect();
        chatHistoryInstance = mongoClientInstance.db(env.DATABASE_NAME);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw new Error('Failed to connect to MongoDB');
    }
};

// Lấy ra Database Instance đã kết nối
export const GET_DB = () => {
    if (!chatHistoryInstance) throw new Error('Must connect to Database first');
    return chatHistoryInstance;
};

// Đóng kết nối tới MongoDB
export const CLOSE_DB = async () => {
    if (mongoClientInstance) {
        await mongoClientInstance.close();
        mongoClientInstance = null;
        chatHistoryInstance = null;
        console.log('MongoDB connection closed');
    }
};
