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
//let messages = [];
//let index = 0;

io.on('connection', socket => {
    //Inicio de sesion
    socket.on('start', showSignIn => {
      //Si ya esta logeado se emite loggedIn, pero sino, se transmite solo la informacion de los users
      if(!showSignIn){
        io.to(socket.id).emit('loggedIn',{
          users: users.map(s => s.username)
        });
      }
      else{
        io.to(socket.id).emit('userData',{
          users: users.map(s => s.username)
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
    //Mensaje a usuario especifico
    socket.on('msg', message => {   
      for(i=0;i<users.length;i++){
        if(users[i].username==message.usernameTo){
          io.to(users[i].id).emit('msg', message);
          break;
        }
      }
    })

    //Desconectado
    socket.on('disconnect', () => {
        console.log(`${socket.username} ha abandonado el chat.`);
        io.emit("userLeft", socket.username);
        users.splice(users.indexOf(socket), 1);
    });
})

server.listen(process.env.PORT || 3000, process.env.LISTEN_TO, () =>{
    console.log("Listening on port %s", process.env.PORT || 3000);
})