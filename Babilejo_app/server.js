//Servidor de la app con express

const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io') (server, {
    //Para que las pruebas locales funcionen en Firefox
    cors: {
      origin: '*',
    }
  });
let users = [];
let messages = [];
let index = 0;

io.on('connection', socket => {
    //Inicio de sesion
    socket.on('start', showSignIn => {
      if(!showSignIn){
        io.to(socket.id).emit('loggedIn',{
          users: users.map(s => s.username),
          messages: messages
        });
      }
    });

    //Nuevo usuario
    socket.on('newuser', username => {
        console.log(`${username} ha entrado al chat.`);
        socket.username = username;
        users.push(socket);

        io.emit('userOnline', socket.username);
    });

    socket.on('msg', msg => {
        let message = {
            index: index,
            username: socket.username,
            msg: msg
        }

        messages.push(message);

        io.emit('msg', message);

        index++;
    })

    //Desconectado
    socket.on('disconnect', () => {
        console.log(`${socket.username} ha abandonado el chat.`);
        io.emit("userLeft", socket.username);
        users.splice(users.indexOf(socket), 1);
    });
})

server.listen(process.env.PORT || 3000, () =>{
    console.log("Listening on port %s", process.env.PORT || 3000);
})