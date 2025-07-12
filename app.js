import express from 'express'

const app = express()

// 添加错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('服务器内部错误')
})

// 使用 async/await 语法处理请求
app.get('*', async (req, res) => {
    try {
        res.sendFile(new URL('./public/imgs/default.webp', import.meta.url).pathname, {
            maxAge: 60 * 60 * 24 * 30
        })
    } catch (error) {
        console.error('发送文件时出错:', error)
        res.status(500).send('发送文件时出错')
    }
})

app.listen(7530, () => {
    console.log('DFS 服务器运行在端口 7530')
})
