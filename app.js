import express from 'express'

const app = express()

app.get('/', (req, res) => {
    res.sendFile(new URL('./public/imgs/default.png', import.meta.url).pathname, {
        maxAge: 60 * 60 * 24 * 30
    })
})

app.listen(80, () => {
    console.log('Server running on port 80')
})
