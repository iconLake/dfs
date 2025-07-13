import express from 'express';
import cors from 'cors';
import config from './config.js';
import routes from './src/routes/index.js';
import { errorHandler, notFoundHandler } from './src/middlewares/index.js';

// 创建 Express 应用
const app = express();

// CORS 配置
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || config.cors.allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('不允许的跨域请求'));
    }
  },
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use('/src', express.static(config.uploadPath));
app.use(routes);

// 404 处理
app.use(notFoundHandler);

// 错误处理
app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`DFS 服务器运行在 http://127.0.0.1:${config.port}`);
});

export default app;