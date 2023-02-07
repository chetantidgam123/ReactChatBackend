const express = require("express")
const cors = require('cors')
const dotenv = require("dotenv")
const chats = require("./data/data")
const path = require('path')
const connectDb = require("./config/db")
dotenv.config()
const app = express()
const color = require('colors')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const { notFound, errorHandler } = require("./middleware/errorMiddlewre")
const { patch } = require("./routes/messageRoutes")
app.use(cors({ origin: true }))
connectDb()
app.use(express.json())

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

//  *************************Deployment**********************************
app.use(express.static(__dirname));

app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname1, '/build')))
} else {
    app.get('/', (req, res) => {
        res.send("Api is running")
    })
}
//  *************************Deployment********************************** 
app.use(notFound)
app.use(errorHandler)
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
    console.log(`Server listen on port ${PORT}`.yellow.bold);
})

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "https://cool-piroshki-3f4349.netlify.app",
    }
})
io.on("connection", (socket) => {
    console.log("connected to socket.io");
    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
    })
    socket.on('join chat', (room) => {
        socket.join(room);
        console.log('User join Romm' + room);
    })

    socket.on('new message', (newMessageRecived) => {
        var chat = newMessageRecived.chat;
        if (!chat.users) return console.log('chat.users not defined');
        chat.users.forEach(users => {
            if (users._id == newMessageRecived.sender._id) return;
            socket.in(users._id).emit("message received", newMessageRecived)
        })
    })

    socket.on('typing', (room) => socket.in(room).emit('typing'))
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))


    socket.off("setup", () => {
        console.log("USER Disconnected");
        socket.leave(userData._id)
    })
})