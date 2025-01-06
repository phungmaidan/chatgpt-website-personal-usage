import { env } from '../config/environment.js'
// Những domain được phép truy cập tới tài nguyên của Server
export const WHITELIST_DOMAINS = [
  // 'http://192.168.1.127:5173',
  // 'http://localhost:5173/',
  'http://localhost:5000/',
  'https://trello-clone-web-project.vercel.app'
]


export const WEBSITE_DOMAIN = (env.BUILD_MODE === 'production') ? env.WEBSITE_DOMAIN_PRODUCTION : env.WEBSITE_DOMAIN_DEVELOPMENT

