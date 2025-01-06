import express from 'express';
import exitHook from 'async-exit-hook';
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware.js';
import { APIs_V1 } from './routes/v1/index.js';
import { env } from "./config/environment.js";
import path, { dirname } from "path";
import cors from 'cors';
import { corsOptions } from './config/cors.js';
import { fileURLToPath } from 'url';
import { CONNECT_DB, CLOSE_DB } from './config/mongodb.js'

// Định nghĩa __dirname cho ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const START_SERVER = () => {
    const app = express();

    // Fix cái vụ Cache from disk của ExpressJS
    // https://stackoverflow.com/a/53240717/8324172
    app.use((req, res, next) => {
        res.set('Cache-Control', 'no-store')
        next()
    })

    // Cấu hình EJS để render các trang HTML
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    // Middleware để phân tích dữ liệu POST
    app.use(express.urlencoded({ extended: true }));

    // // Cấu hình Cookie Parser
    // app.use(cookieParser())

    // Xử lý CORS
    app.use(cors(corsOptions))

    // Enable req.body json data
    app.use(express.json())

    // Use APIs V1
    app.use('/v1', APIs_V1)

    // Middleware xử lý lỗi tập trung
    app.use(errorHandlingMiddleware)

    if (env.BUILD_MODE === 'production') {
        console.log('Running in production mode');
        // Môi trường Production
        app.listen(process.env.PORT, () => {
            console.log(`3. Server is running at Port: ${process.env.PORT}/`)
        })
    } else {
        console.log('Running in development mode');
        // Môi trường Local Dev
        app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
            console.log(`3. Server is running at http://${env.LOCAL_DEV_APP_HOST}:${env.LOCAL_DEV_APP_PORT}/`)
        })
    }

    // Thực hiện cleanup trước khi dừng server
    exitHook(async () => {
        console.log('4. Server is shutting down...')
        CLOSE_DB()
        console.log('5. Disconnected from MongoDB Cloud Atlas')
    })
}

// Chỉ khi kết nối tới Database thành công thì mới Start Server Back-end lên
// Immediately-invoked / Anonymous Async Functions (IIFE)
(async () => {
    try {
        console.log('1. Connecting to MongoDB Cloud Atlas...')
        await CONNECT_DB()
        console.log('2. Connected to MongoDB Cloud Atlas!')

        START_SERVER()
    } catch (error) {
        console.error(error)
        process.exit(0)
    }
})()
