<template>
  <div v-if="!showSignIn" class="main-interface">
    <div class="chat-sidebar">
      <ChatList v-bind:users="users" v-bind:username="username"  @selectChat="setChatId" />
    </div>
    <div class="chat-room">
      <ChatRoom v-bind:messages="messages" v-bind:currentChatUser="currentChatUser" v-bind:username="username"
       @sendMessage="this.sendMessage"/>
    </div>
  </div>
  <div v-if="showSignIn">
    <SignIn v-bind:users="users" @signedin="setNickname" />
  </div>
</template>

<script>
import io from 'socket.io-client';
import SignIn from './components/SignIn.vue';
import ChatRoom from './components/ChatRoom.vue';
import ChatList from './components/ChatList.vue';

export default {
  name: 'App',
  components: { SignIn, ChatRoom, ChatList },
  data: function (){
    return {
      username: "",
      socket: io("http://localhost:3000"),
      messages: [],
      users: [],
      showSignIn: true,
      currentChatId: "",
      currentChatUser: ""
    }
  },
  methods: {
    joinServer: function () {
      this.socket.emit('start', this.showSignIn);

      this.listen();
    },
    listen: function () {
      this.socket.on('loggedIn', data => {
        this.users = data.users;
        this.socket.emit('newuser', this.username);
      });
      this.socket.on('msg', message => {
        this.messages.push(message);
      })
    },
    setNickname: function(value){
      this.showSignIn=false;
      this.username = value;
      if(!this.username) {
        this.username = "Anonymous";
      }

      this.joinServer();
    },
    sendMessage: function (msg) {
      let message = {
          usernameFrom: this.username,
          usernameTo: this.users[this.currentChatId],
          msg: msg
      }
      this.messages.push(message);
      this.socket.emit('msg', message);
    },
    setChatId: function (value){
      this.currentChatId = value;
      this.currentChatUser = this.users[this.currentChatId];
    }
  },
  created: function() {
    //Pedir los nombres de usuario para comprobar la disponibilidad del nickname
    this.socket.emit('start', this.showSignIn);
    this.socket.on('userData', data => {
        this.users = data.users;
    });
    this.socket.on('userOnline', user => {
        this.users.push(user);
    });
    this.socket.on('userLeft', user => {
        this.users.splice(this.users.indexOf(user), 1);
    });
  }
}
</script>

<style>
html, body { height: 100%; min-height: 30rem; }
body {
  color: #2c3e50;
  margin: 0;
  padding: 0;
}
#app {
  height: 100%;
  width: 100%;
  margin: 0 auto; 
}
.main-interface {
  display: flex;
  flex-direction: row;
  height: 100%;
}
.chat-sidebar{
  z-index: 2;
  display: flex;
  flex-direction: column;
  width: calc(100% / 3.5);
}
.chat-room{
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
