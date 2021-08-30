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

//Lectura de Eventos.json, con los detalles de cada evento
const fs = require("fs")
var filePath = "./Eventos.json";
var eventsFile = ""
//En el servidor solo contiene la lista de usuarios, en el cliente la de usuarios y eventos
let users = [];

app.use(express.static("public"));

function constructUsers(){
  var aux = users.map(s => s.username);
  var eventsData= JSON.parse(eventsFile)['events'];
  for(var i=0;i<eventsData.length;i++){
    aux.push(eventsData[i].title);
  }
  return aux;
}

io.on('connection', socket => {
    //Leer los eventos e introducirlos como un usuario especial 
    if(eventsFile == ""){
      eventsFile = fs.readFileSync(filePath, {encoding: "utf8"});
    }
    //Inicio de sesion
    socket.on('start', showSignIn => {
      //Si ya esta logeado se emite loggedIn, pero sino, se transmite solo la informacion de los users
      if(!showSignIn){
        io.to(socket.id).emit('loggedIn',{
          users: constructUsers()
        });
      }
      else{
        io.to(socket.id).emit('userData',{
          users: constructUsers()
        });
      }
      io.emit('eventList', eventsFile);
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
      if(!message.isEvent){   
        for(i=0;i<users.length;i++){
          if(users[i].username==message.usernameTo){
            io.to(users[i].id).emit('msg', message);
            break;
          }
        }
      }
      else{ //Es un mensaje de un evento, emitir para todos los usuarios
        socket.broadcast.emit('msg', message)
      }
    })

    //Desconectado
    socket.on('disconnect', () => {
        console.log(`${socket.username} ha abandonado el chat.`);
        io.emit("userLeft", socket.username);
        users.splice(users.indexOf(socket), 1);
    });
})

//Detectar cambios en la lista de eventos actuales
fs.watch(filePath, function(event) {
    if (event === "change") {
        fs.readFile(filePath, {encoding: "utf8"}, function (err, data) {
          if (err) throw err;
          eventsFile = data
          if(eventsFile!=null && eventsFile!=undefined && eventsFile!=""){
            //Emitir de nuevo la lista completa y los detalles de eventos
            io.emit('userData',{
              users: constructUsers()
            });
            io.emit('eventList', data);
          }
        });
        console.log("Cambio detectado en la tabla de eventos. Actualizando...");
    }
});

server.listen(process.env.PORT || 3000, process.env.LISTEN_TO, () =>{
    console.log("Listening on port %s", process.env.PORT || 3000);
})