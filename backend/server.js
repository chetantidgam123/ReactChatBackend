const express = require("express")
const dotenv = require("dotenv")
const chats = require("./data/data")
const connectDb = require("./config/db")
dotenv.config()
const app = express()
const color = require('colors')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const { notFound, errorHandler } = require("./middleware/errorMiddlewre")
connectDb()
app.use(express.json())
app.get('/', (req, res) => {
    res.send("Api is running")
})
app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use(notFound)
app.use(errorHandler)
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server listen on port ${PORT}`.yellow.bold);
})