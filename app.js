import express from 'express'

const app = express()

app.get('*', (req, res) => {
    res.sendFile(new URL('./public/imgs/default.webp', import.meta.url).pathname, {
        maxAge: 60 * 60 * 24 * 30
    })
})

app.listen(7530, () => {
    console.log('Server running on port 7530')
})
