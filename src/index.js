const express = require("express");
const http = require("http");
const path = require("path");
const hidden = require("bad-words");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const {messgenerated} = require("./utils/messages");
const {adduser,removeuser,getUser,getUserinRoom} = require("./utils/users");
const io = socketio(server);
const port = process.env.PORT || 3000;
const publicdir = path.join(__dirname,"../public");
app.use(express.static(publicdir));
//let count = 0;
io.on("connection",(socket) => {
    console.log("New Websocket Connection");
    /*socket.emit("countUpdated",count);
        
    socket.on("incr",() => {
        count++;
        //socket.emit("countUpdated",count);
        io.emit("countUpdated",count);
    })*/
    //socket.emit("message",messgenerated("Welcome!")/*{
        //text:"Welcome!",
        //createdAt:new Date().getTime()
    //}*/);
    //socket.broadcast.emit("message",messgenerated("New user has joined"));
    socket.on("join",({username,room},callback) => {
        const {error,user} = adduser({id:socket.id,username,room})
        if(error)
        {
            return callback(error);
        }
        socket.join(user.room);
        socket.emit("message",messgenerated(user.username,"Welcome!"));
        socket.broadcast.to(user.room).emit("message",messgenerated("Admin",`${user.username} has joined`));
        io.to(user.room).emit("roomdet",{
            room:user.room,
            users:getUserinRoom(user.room)
        })
        
        callback();
    })
    socket.on("mess",(mes,callback) => {
        const user = getUser(socket.id);
        const filter = new hidden();
        if(filter.isProfane(mes))
        {
            return callback("Foul messages not allowed");
        }
        io.to(user.room).emit("message",messgenerated(user.username,mes));
        callback();
    })
    socket.on("location",(coords,callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit("locationmessage",messgenerated(user.username,`https://google.com/maps?q=${coords.latitude}, ${coords.longitude}`));
        callback();
    })
    socket.on("disconnect",() => {
       const user = removeuser(socket.id);
     
       if(user)
       {
        io.to(user.room).emit("message",messgenerated("Admin",`${user.username} has left`));
        io.to(user.room).emit("roomdet",{
            room:user.room,
            users:getUserinRoom(user.room)
        })
       }
        //io.emit("message",messgenerated("User has left"));
    })
})

server.listen(port,() => {
    console.log("Server is on port " + port);
})