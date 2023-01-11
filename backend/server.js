const express = require("express")
const dotenv = require("dotenv")
const chats = require("./data/data")
const connectDb = require("./config/db")
dotenv.config()
connectDb()
const app = express()

app.get('/', (req, res) => {
    res.send("Api is running")
})
app.get('/api/chats', (req, res) => {
    res.send(chats)
})
app.get('/api/chats/:id', (req, res) => {
    const single_data = chats.find(c => c._id === req.params.id)
    res.send(single_data)
})
const PORT  =process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server listen on port ${PORT}`);
})